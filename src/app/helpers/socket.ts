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

// X??? l?? authentication c???a socket theo t???ng role
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
 * X??? l?? online c???a member k???t n???i ?????n socket.
 * T???n t???i trong m???ng n??y r???i th?? th??m id v??o m???ng sokets
 * Ch??a t???n t???i th?? th??m v??o m???ng.
 * @param id Id c???a client Cms ho???c app
 * @param role Vai tr?? l?? admin, app
 * @param socketId id socket c???a client
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
 * X??? l?? offline c???a member k???t n???i ?????n socket.
 * M???ng sockets d??i h??n 1 th?? b??? b???t ??i, b???ng m???t th?? b??? lu??n clien n??y kh???i m???ng
 * @param id Id c???a client Cms ho???c app
 * @param role Vai tr?? l?? admin, app
 * @param socketId id socket c???a client
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
    // lo???i socket n??y ra kh???i list conversation(n???u c??)
    member.conversations = member.conversations.filter(
      (item) => item.socketId !== client.id
    );
  }
}

/**
 * Ki???m tra tr???ng th??i online c???a m???t client.
 * @param id salon_id, member_id ho???c user_id
 * @param role vai tr?? c???a client socket.
 */
export function isOnline(id: number, role: number): boolean {
  return online.some((item) => item.id === id && item.role === role);
}

/**
 * L???y m???t client ??ang online t??? danh s??ch online
 * @param id salon_id, member_id ho???c user_id
 * @param role vai tr?? c???a client socket.
 */
function getSpecificClientOnline(id: number, role: MemberType): OnlineParams {
  return online.find((item) => item.id === id && item.role === role);
}

/**
 * B???n socket ?????n m???t id & role c??? th??? n??o ????.
 * @param event s??? ki???n client l???ng nghe.
 * @param data d??? li???u mu???n g???i ??i.
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
 * X??? l?? cho m???t client join v??o room conversation.
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

    // Th??m conversation v?? id t????ng ???ng v??o.
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
 * X??? l?? r???i ra kh???i conversation.
 * @param client socket client
 * @param memberId id c???a member t??y v??o role: admin, salon ho???c app
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
 * H??m n??y d??ng ????? ki???m tra xem ?????i ph????ng c?? ??ang n???m trong conversation n??y kh??ng.
 * => M???c ????ch ????? x??? l?? logic ?????c tin nh???n.
 * @param memberId Id c???a member
 * @param memberType Member thu???c lo???i n??o
 * @param conversationId cu???c tr?? chuy???n mu???n ki???m tra
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
 * L???y ra nh???ng member ??ang online trong cu???c tr?? chuy???n(??ang join trong room)
 * ?????y v??o m???ng, h??m n??y d??ng nh???m m???c ????ch update tr???ng th??i ???? ?????c hay ch??a ?????c c???a conversation.
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
