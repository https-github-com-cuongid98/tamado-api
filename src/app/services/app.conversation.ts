import Conversation from "$entities/Conversation";
import ConversationMember from "$entities/ConversationMember";
import MemberBlock from "$entities/MemberBlock";
import Message from "$entities/Message";
import {
  CommonStatus,
  ConversationType,
  ErrorCode,
  IsRead,
  MemberType,
} from "$enums";
import {
  getMembersOnlineInConversation,
  pushSocketMessage,
} from "$helpers/socket";
import { assignThumbUrl, returnPaging } from "$helpers/utils";
import { differenceBy, unionWith } from "lodash";
import { getConnection, getRepository, Repository } from "typeorm";

export async function getListMassageInConversation(
  memberId: number,
  conversationId: number,
  params
) {
  const conversationRepo = getRepository(Conversation);
  const memberBlockRepo = getRepository(MemberBlock);
  const conversationMemberRepository = getRepository(ConversationMember);

  if (!conversationId) throw ErrorCode.Invalid_Input;

  const conversation = await conversationRepo
    .createQueryBuilder("conversation")
    .where("conversation.id = :conversationId", {
      conversationId,
    })
    .innerJoin("conversation.conversationMember", "conversationMember")
    .addSelect(["conversationMember.memberId"])
    .getOne();

  if (!conversation) throw ErrorCode.Conversation_Not_Exist;

  const conversationMember = conversation.conversationMember.find(
    (member) => member.memberId == memberId
  );
  if (!conversationMember) throw ErrorCode.You_Not_Member_In_This_Conversation;

  const target = conversation.conversationMember.find(
    (member) => member.memberId != memberId
  );

  const checkBlock = await memberBlockRepo.findOne({
    where: [
      { memberId, targetId: target.memberId },
      { memberId: target.memberId, targetId: memberId },
    ],
  });
  if (checkBlock) throw ErrorCode.Blocked;

  const query = Message.find();
  query
    .where("conversationId")
    .equals(conversationId)
    .where("status")
    .equals(CommonStatus.ACTIVE);

  if (params.takeAfter) {
    query.where("createdAt").lt(params.takeAfter);
    delete params.isRead;
  }

  if (params.isRead === IsRead.UN_SEEN) {
    const member = await conversationMemberRepository.findOne({
      memberId,
      conversationId: params.conversationId,
    });
    query.where("createdAt").gt(member.lastReadTime);
  }

  query
    .select(
      "_id memberId conversationId body metadata image status messageType createdAt memberType"
    )
    .limit(params.take)
    .sort("-createdAt");

  const data = await query.lean();

  await conversationMemberRepository.update(
    {
      conversationId: params.conversationId,
      memberId,
      memberType: MemberType.APP,
    },
    { isRead: IsRead.SEEN, lastReadTime: new Date().getTime() }
  );

  return returnPaging(data, null, params);
}

export async function getOrCreateConversation(
  memberId: number,
  params: { targetId: number }
) {
  if (memberId == params.targetId) throw ErrorCode.Invalid_Input;

  return getConnection().transaction(async (transaction) => {
    const conversationRepo = transaction.getRepository(Conversation);
    const conversationMemberRepo = transaction.getRepository(
      ConversationMember
    );
    const memberBlockRepo = transaction.getRepository(MemberBlock);

    const checkBlock = await memberBlockRepo.findOne({
      where: [
        { memberId, targetId: params.targetId },
        { memberId: params.targetId, targetId: memberId },
      ],
    });
    if (checkBlock) throw ErrorCode.Blocked;

    const conversationMember = [{ memberId }, { memberId: params.targetId }];

    const checkConversationMember = await conversationMemberRepo.find({
      where: conversationMember,
    });

    if (checkConversationMember.length == 2) {
      return { conversationId: checkConversationMember[0].conversationId };
    }

    const conversation = await conversationRepo.save({
      conversationType: ConversationType.PERSON,
    });

    const members = [
      { memberId, memberType: MemberType.APP, conversationId: conversation.id },
      {
        memberId: params.targetId,
        memberType: MemberType.APP,
        conversationId: conversation.id,
      },
    ];

    await conversationMemberRepo.insert(members);

    return { conversationId: conversation.id };
  });
}

export async function sendMassage(memberId: number, params) {
  return await getConnection().transaction(async (transaction) => {
    const conversationRepository = transaction.getRepository(Conversation);
    const conversationMemberRepository = transaction.getRepository(
      ConversationMember
    );

    const conversation = await conversationRepository.findOne({
      where: { id: params.conversationId },
    });
    if (!conversation) throw ErrorCode.Not_Found;

    const membersInConversation = await conversationMemberRepository.find({
      conversationId: params.conversationId,
    });

    const isMember = membersInConversation.find(
      (member) => member.memberId == memberId
    );
    if (!isMember) ErrorCode.You_Not_Member_In_This_Conversation;

    await conversationRepository.update(
      { id: params.conversationId },
      {
        lastMessage: params.content,
        lastMessageType: params.messageType,
        lastSentMemberId: memberId,
        lastTimeSent: new Date().toISOString(),
      }
    );

    let memberOnlineInConversation = getMembersOnlineInConversation(
      params.conversationId
    );

    memberOnlineInConversation = unionWith(memberOnlineInConversation, [
      {
        memberId,
        memberType: MemberType.APP,
        conversationId: params.conversationId,
      },
    ]);

    const membersUpdated = await updateReadMessageState(
      conversationMemberRepository,
      membersInConversation,
      memberOnlineInConversation,
      new Date().getTime()
    );

    const messageObj = {
      content: params.content,
      image: params?.image,
      metadata: params.metadata,
      memberId,
      messageType: params.messageType,
      memberType: MemberType.APP,
      conversationId: params.conversationId,
      createdAt: new Date().getTime(),
    };
    assignThumbUrl(messageObj, "image");

    const message = await saveMessage(messageObj);
    Object.assign(messageObj, {
      _id: message["_id"],
      status: message["status"],
    });

    // const memberNotFocusConversation = differenceBy(members, membersOnline, 'memberId');

    // const target = members.find(
    //   (item) => (item.memberId !== memberId && item.memberType === MemberType.APP) || item.memberType !== MemberType.APP
    // );

    // const isNotFocusTab = memberNotFocusConversation.some(
    //   (item) =>
    //     (item.memberId === target.memberId && item.memberType !== MemberType.ADMIN) ||
    //     item.memberType === MemberType.ADMIN
    // );

    // const notificationObj: INotificationObj = {
    //   type: NotificationType.MESSAGE,
    //   memberId: target.memberId,
    //   memberType: target.memberType,
    //   creatorId: memberId,
    //   imageURL: image,
    //   name: member.name,
    //   icon: member.avatarURL,
    //   title: member.name,
    //   objectId: conversationId,
    //   objectName: null,
    //   content: lastMessage,
    //   redirectId: conversationId,
    //   redirectType: RedirectType.CONVERSATION,
    //   messageId: String(message['_id']),
    //   currentUnix,
    // };

    // if (isNotFocusTab && target.memberType === MemberType.APP) {
    //   await PushMessageNotificationQueue.add(
    //     KeyQueue.PUSH_NOTIFICATION_MESSAGE,
    //     { notificationObj, memberIds: [target.memberId] },
    //     { delay: config.delayNotification }
    //   );
    // }

    pushSocketMessage(
      membersUpdated,
      {
        id: params.conversationId,
        lastMessage: params.lastMessage || params.content,
        lastTimeSent: new Date().toISOString(),
        lastReadTime: new Date().getTime(),
        lastSentMemberId: memberId,
        lastMessageType: params.messageType,
      },
      messageObj
    );
  });
}

export async function updateReadMessageState(
  conversationMemberRepository: Repository<ConversationMember>,
  members,
  membersOnlineInConversation,
  lastReadTime: number
) {
  members = members.map((item) => {
    item.isRead = Number(
      membersOnlineInConversation.some(
        (el) =>
          el.memberId === item.memberId && item.memberType === el.memberType
      )
    );
    item.lastReadTime = item.isRead ? lastReadTime : item.lastReadTime;
    return item;
  });

  const updateReadState = members.map(({ isRead, lastReadTime, ...item }) => {
    return conversationMemberRepository.update(item, { lastReadTime, isRead });
  });

  await Promise.all(updateReadState);
  return members;
}

export async function saveMessage(params) {
  const saveMessage = new Message();
  Object.assign(saveMessage, params);
  const result = await saveMessage.save();
  return result.toObject();
}

export async function getListConversationByMemberId(memberId: number, params) {
  const conversationRepo = getRepository(Conversation);
  const conversationMemberRepo = getRepository(ConversationMember);

  const conversationMembers = await conversationMemberRepo.find({ memberId });

  const conversationIds = conversationMembers.map(
    (conversationMember) => conversationMember.conversationId
  );

  const queryBuilder = conversationRepo
    .createQueryBuilder("conversation")
    .leftJoin(
      "conversation.conversationMember",
      "conversationMember",
      "conversationMember.memberId != :memberId",
      { memberId }
    )
    .select([
      "conversation.id conversationId",
      "conversationMember.memberId memberId",
      "conversationMember.memberType memberType",
      "conversationMember.isRead isRead",
      "conversationMember.lastReadTime lastReadTime",
      "memberDetail.name memberName",
      "member.avatar memberAvatar",
      "conversation.lastMessage lastMessage",
      "conversation.lastMessageType lastMessageType",
      "conversation.lastSentMemberId lastSentMemberId",
      "conversation.lastTimeSent lastTimeSent",
    ])
    .leftJoin("Member", "member", "conversationMember.memberId = member.id")
    .leftJoin("member.memberDetail", "memberDetail");
  const totalItems = await queryBuilder.getCount();
  const conversations = await queryBuilder
    .limit(params.take)
    .offset(params.skip)
    .getRawMany();

  return returnPaging(conversations, totalItems, params);
}
