import socketIoJwt from "socketio-jwt";
import config from "$config";
import log from "$helpers/log";
import { Server } from "http";
import SocketIO, { Socket } from "socket.io";
import { EventSocket } from "$enums";
const logger = log("Socket utils");

type RoleType = "app" | string;
interface DecodedToken {
  id?: number;
}

enum MemberType {
  APP = 1,
}

enum MessageType {
  TEXT = 1,
  IMAGE = 2,
  OFFER = 3,
}

enum IsReadMessage {
  READ = 1,
  UNREAD = 2,
}

interface MembersParams {
  memberId: number;
  isRead?: number;
  memberType: number;
  [key: string]: any;
}

interface InterfaceSocket extends Socket {
  decoded_token: DecodedToken;
  role: MemberType;
}

interface OnlineParams {
  id: number;
  role: MemberType;
  sockets: string[];
  conversations: {
    socketId: string;
    room: string;
  }[];
}

interface IConversationObj {
  id: number;
  lastMessage: string;
  lastMessageType: MessageType;
  lastTimeSent: string;
  lastReadTime: number;
  lastSentMemberId: number;
  isRead?: IsReadMessage;
}

interface IMessageObj {
  content: string;
  image: string;
  metadata: string;
  memberId: number;
  messageType: number;
  conversationId: number;
  createdAt: number;
  memberType: number;
}

let io: SocketIO.Server;

const online: OnlineParams[] = [];

export default async function initSocket(http: Server) {
  try {
    if (!io) {
      io = SocketIO(http, { pingInterval: 2000, pingTimeout: 1000 });
      logger.info("Socket server is running...");
    }

    io.on("connection", socketAuthorize).on(
      "authenticated",
      async (client: InterfaceSocket) => {
        client.removeAllListeners();

        const dataDecode = client.decoded_token;
        const role: MemberType = client.role;
        let id: number = dataDecode.id;

        switch (role) {
          case MemberType.APP:
            handleAppSocket(client);
            break;
          default:
            break;
        }

        handleOnline(id, role, client.id);

        joinRoomConversation(client, id);
        startTyping(client, id);
        endTyping(client, id);
        leaveSocketRoom(client, id);
        client.on("disconnect", () => {
          handleOffline(client, id, role);
          console.log(`Client id: ${client.id} disconnected`);
        });
      }
    );
  } catch (error) {
    logger.error(error);
  }
}

// Xử lí authentication của socket theo từng role
const socketAuthorize = (socket: InterfaceSocket) => {
  const timeout: number = 86400000; // 1 day to send the authentication message
  let secret: string;
  const role: RoleType = socket.handshake.query.role;

  // socket connect http://localhost:3000?role=app
  if (role === "app") {
    socket.role = MemberType.APP;
    secret = config.auth.AccessTokenSecret;
  }

  const middle = socketIoJwt.authorize({ secret, timeout }) as any;
  return middle(socket);
};

async function handleAppSocket(client: InterfaceSocket) {
  console.log(`[App] client connected. Socket id: ${client.id}`);
}

/**
 * Xử lí online của member kết nối đến socket.
 * Tồn tại trong mảng này rồi thì thêm id vào mảng sokets
 * Chưa tồn tại thì thêm vào mảng.
 * @param id Id của client Cms hoặc app
 * @param role Vai trò là admin, app
 * @param socketId id socket của client
 */
function handleOnline(id: number, role: MemberType, socketId: string) {
  const client: OnlineParams = online.find(
    (item) => item.id === id && item.role === role
  );

  if (client) {
    const isExist = client.sockets.includes(socketId);
    if (!isExist) client.sockets.push(socketId);
  } else online.push({ id, role, sockets: [socketId], conversations: [] });
}

/**
 * Xử lí offline của member kết nối đến socket.
 * Mảng sockets dài hơn 1 thì bỏ bớt đi, bằng một thì bỏ luôn clien này khỏi mảng
 * @param id Id của client Cms hoặc app
 * @param role Vai trò là admin, app
 * @param socketId id socket của client
 */
function handleOffline(client: InterfaceSocket, id: number, role: MemberType) {
  let position: number;

  const member: OnlineParams = online.find((item, index) => {
    if (item.id === id && item.role === role) position = index;
    return item.id === id && item.role === role;
  });

  if (member && member.sockets.length <= 1) online.splice(position, 1);
  if (member && member.sockets.length > 1) {
    member.sockets = member.sockets.filter((item) => item !== client.id);
    // loại socket này ra khỏi list conversation(nếu có)
    member.conversations = member.conversations.filter(
      (item) => item.socketId !== client.id
    );
  }
}

/**
 * Kiểm tra trạng thái online của một client.
 * @param id salon_id, member_id hoặc user_id
 * @param role vai trò của client socket.
 */
export function isOnline(id: number, role: number): boolean {
  return online.some((item) => item.id === id && item.role === role);
}

/**
 * Lấy một client đang online từ danh sách online
 * @param id salon_id, member_id hoặc user_id
 * @param role vai trò của client socket.
 */
function getSpecificClientOnline(id: number, role: MemberType): OnlineParams {
  return online.find((item) => item.id === id && item.role === role);
}

/**
 * Bắn socket đến một id & role cụ thể nào đó.
 * @param event sự kiện client lắng nghe.
 * @param data dữ liệu muốn gửi đi.
 */
export async function emitToSpecificClient(
  id: number,
  role: number,
  event: string,
  data: any
): Promise<void> {
  const client = getSpecificClientOnline(id, role);
  if (!client) return;
  if (client.sockets.length === 0) return;

  for (let item of client.sockets) {
    io.to(item).emit(event, data);
  }
}

/**
 * Xử lí cho một client join vào room conversation.
 * @param client client
 */
export async function joinRoomConversation(
  client: InterfaceSocket,
  memberId: number
) {
  client.on(EventSocket.JOIN_ROOM, async ({ conversationId }) => {
    conversationId = Number(conversationId);
    if (!conversationId) return;

    leaveAllConversations(client);

    client.join(`conversation_${conversationId}`);
    // handleSocketReadMessage(conversationId, memberId);

    // Thêm conversation và id tương ứng vào.
    const member = online.find(
      (member) => member.id === memberId && member.role === client.role
    );
    if (member) {
      member.conversations = member.conversations.filter(
        (item) => item.socketId !== client.id
      );
      member.conversations.push({
        socketId: client.id,
        room: `conversation_${conversationId}`,
      });
    }

    console.log(
      `${
        MemberType[client.role]
      } ${memberId} joined conversation ${conversationId}`
    );
  });

  client.on("joinAdminConversation", () => {
    client.join(`conversation_admin_${memberId}`);

    const member = online.find(
      (member) => member.id === memberId && member.role === client.role
    );
    if (member) {
      member.conversations = member.conversations.filter(
        (item) => item.socketId !== client.id
      );
      member.conversations.push({
        socketId: client.id,
        room: `conversation_admin_${memberId}`,
      });
      console.log(
        `${
          MemberType[client.role]
        } ${memberId} joined conversation admin ${memberId}`
      );
    }
  });
}

/**
 * Xử lí rời ra khỏi conversation.
 * @param client socket client
 * @param memberId id của member tùy vào role: admin, salon hoặc app
 */
export async function leaveSocketRoom(
  client: InterfaceSocket,
  memberId: number
) {
  client.on(EventSocket.LEAVE_ROOM, async ({ conversationId }) => {
    conversationId = Number(conversationId);
    if (!conversationId) return;

    client.leave(`conversation_${conversationId}`);

    // Remove room
    const member = online.find(
      (member) => member.id === memberId && member.role === client.role
    );
    if (member)
      member.conversations = member.conversations.filter(
        (item) => item.socketId !== client.id
      );

    console.log(
      `[${
        MemberType[client.role]
      }] ${memberId} leaved conversation ${conversationId}`
    );
  });
}

/**
 * Push message to clients by socket
 */
export async function pushSocketMessage(
  members: MembersParams[],
  conversationObj: IConversationObj,
  messageObj: IMessageObj
) {
  for (let member of members) {
    const role = member.memberType;
    Object.assign(conversationObj, { isRead: member.isRead });
    emitToSpecificClient(
      member.memberId,
      role,
      EventSocket.CONVERSATIONS,
      conversationObj
    );
  }

  io.in(`conversation_${messageObj.conversationId}`).emit(
    EventSocket.MESSAGES,
    messageObj
  );
  if ([MessageType.IMAGE, MessageType.TEXT].includes(messageObj.messageType)) {
    setTimeout(() => {
      const data = members.filter((item) => item.isRead === IsReadMessage.READ);
      io.in(`conversation_${messageObj.conversationId}`).emit(
        EventSocket.READ_MESSAGE,
        data
      );
    }, 500);
  }
}

/**
 * Hàm này dùng để kiểm tra xem đối phương có đang nằm trong conversation này không.
 * => Mục đích để xử lí logic đọc tin nhắn.
 * @param memberId Id của member
 * @param memberType Member thuộc loại nào
 * @param conversationId cuộc trò chuyện muốn kiểm tra
 */
export function memberOnlineInConversation(
  conversationId: number,
  memberId: number,
  memberType: MemberType
): boolean {
  const member = online.find(
    (member) => member.id === memberId && member.role === memberType
  );
  if (!member) return;

  const isIn = member.conversations.some(
    (item) => item.room === `conversation_${conversationId}`
  );
  return isIn;
}

/**
 * Lấy ra những member đang online trong cuộc trò chuyện(đang join trong room)
 * Đẩy vào mảng, hàm này dùng nhằm mục đích update trạng thái đã đọc hay chưa đọc của conversation.
 * @param conversationId
 */
export function getMembersOnlineInConversation(
  conversationId: number
): { memberId: number; memberType: number; conversationId: number }[] {
  return online.reduce((acc, cur) => {
    const isInCVS = cur.conversations.some(
      (item) => item.room === `conversation_${conversationId}`
    );
    if (isInCVS)
      acc.push({ memberId: cur.id, memberType: cur.role, conversationId });
    return acc;
  }, []);
}

export function leaveAllConversations(client: InterfaceSocket) {
  let rooms = Object.keys(client.adapter.rooms);
  for (let item of rooms) {
    if (item.startsWith("conversation_")) {
      client.leave(item);
    }
  }
  const member = online.find(
    (member) =>
      member.id === client.decoded_token.id && member.role === client.role
  );
  if (member)
    member.conversations = member.conversations.filter(
      (item) => item.socketId !== client.id
    );
}

export function emitReadMessage(memberId, memberType, conversationId) {
  io.in(`conversation_${conversationId}`).emit(EventSocket.READ_MESSAGE, [
    {
      memberId,
      memberType,
      conversationId,
      isRead: IsReadMessage.READ,
      lastReadTime: new Date().toISOString(),
    },
  ]);
}

export function kickMemberOutSocketRoom(
  memberId: number,
  conversationId: number
) {
  const member = online.find((member) => member.id === memberId);
  for (let el of member.conversations) {
    try {
      io.sockets.connected[el.socketId].leave(`conversation_${conversationId}`);
      const member = online.find(
        (member) => member.id === memberId && member.role === MemberType.APP
      );
      if (member)
        member.conversations = member.conversations.filter(
          (item) => item.socketId !== el.socketId
        );
    } catch (error) {}
  }
}

export async function startTyping(client: InterfaceSocket, memberId: number) {
  client.on(EventSocket.START_TYPING, async ({ conversationId }) => {
    conversationId = Number(conversationId);
    if (!conversationId) return;

    io.in(`conversation_${conversationId}`).emit(EventSocket.TYPING, [
      { memberId, memberType: client.role },
    ]);
  });
}

export async function endTyping(client: InterfaceSocket, memberId: number) {
  client.on(EventSocket.END_TYPING, async ({ conversationId }) => {
    conversationId = Number(conversationId);
    if (!conversationId) return;

    io.in(`conversation_${conversationId}`).emit(EventSocket.OFF_TYPING, [
      { memberId, memberType: client.role },
    ]);
  });
}
