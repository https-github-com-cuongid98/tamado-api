import Conversation from "$entities/Conversation";
import ConversationMember from "$entities/ConversationMember";
import Member from "$entities/Member";
import MemberBlock from "$entities/MemberBlock";
import Message from "$entities/Message";
import {
  CommonStatus,
  ConversationType,
  ErrorCode,
  EventSocket,
  IsRead,
  MemberStatus,
  MemberType,
  MessagesType,
  VideoCallStatus,
} from "$enums";
import {
  emitToSpecificClient,
  getMembersOnlineInConversation,
  pushSocketMessage,
} from "$helpers/socket";
import { assignThumbUrl, returnPaging } from "$helpers/utils";
import { unionWith, uniq } from "lodash";
import {
  EntityManager,
  getConnection,
  getManager,
  getRepository,
  In,
  Repository,
} from "typeorm";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import config from "$config";
import VideoCall from "$entities/VideoCall";
import { v4 as uuidv4 } from "uuid";

export async function getListMassageInConversation(
  memberId: number,
  conversationId: number,
  params
) {
  const conversationRepo = getRepository(Conversation);
  const memberBlockRepo = getRepository(MemberBlock);
  const conversationMemberRepo = getRepository(ConversationMember);

  if (!conversationId) throw ErrorCode.Invalid_Input;

  const conversation = await conversationRepo
    .createQueryBuilder("conversation")
    .where("conversation.id = :conversationId", {
      conversationId,
    })
    .innerJoin("conversation.conversationMembers", "conversationMember")
    .addSelect(["conversationMember.memberId"])
    .getOne();

  if (!conversation) throw ErrorCode.Conversation_Not_Exist;

  const conversationMember = conversation.conversationMembers.find(
    (member) => member.memberId == memberId
  );
  if (!conversationMember) throw ErrorCode.You_Not_Member_In_This_Conversation;

  const target = conversation.conversationMembers.find(
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
    const member = await conversationMemberRepo.findOne({
      memberId,
      conversationId: params.conversationId,
    });
    query.where("createdAt").gt(member.lastReadTime);
  }

  query
    .select(
      "_id memberId content conversationId body metadata image status messageType createdAt memberType"
    )
    .limit(params.take)
    .sort("-createdAt");

  const data = await query.lean();

  await conversationMemberRepo.update(
    {
      conversationId: params.conversationId,
      memberId,
      memberType: MemberType.APP,
    },
    { isRead: IsRead.SEEN, lastReadTime: new Date().getTime() }
  );

  assignThumbUrl(data, "image");

  return returnPaging(data, null, params);
}

export async function getOrCreateConversation(
  memberId: number,
  params: { targetIds: number[] }
) {
  const { targetIds } = params;

  targetIds.forEach((targetId) => {
    if (memberId == targetId) throw ErrorCode.Invalid_Input;
  });

  return getConnection().transaction(async (transaction) => {
    const conversationRepo = transaction.getRepository(Conversation);
    const memberRepo = transaction.getRepository(Member);
    const conversationMemberRepo =
      transaction.getRepository(ConversationMember);
    const memberBlockRepo = transaction.getRepository(MemberBlock);

    const countTarget = await memberRepo.count({ id: In(targetIds) });
    if (countTarget != targetIds.length) throw ErrorCode.Member_Not_Exist;

    const listBlocks = await getListMemberBlockIds(memberId, transaction);
    targetIds.forEach((targetId) => {
      if (listBlocks.includes(targetId)) throw ErrorCode.Member_Blocked;
    });

    const checkConversationMember = await conversationMemberRepo
      .createQueryBuilder("conversationMember")
      .select("conversationMember.conversationId conversationId")
      .where(
        "conversationMember.memberId = :memberId OR conversationMember.memberId IN (:targetIds)",
        { memberId, targetIds }
      )
      .having(`count(conversationMember.conversationId) >${targetIds.length}`)
      .limit(1)
      .groupBy(`conversationMember.conversationId`)
      .getRawOne();

    if (checkConversationMember) {
      return { conversationId: checkConversationMember.conversationId };
    }

    let conversationType = ConversationType.PERSON;

    if (targetIds.length > 1) {
      conversationType = ConversationType.GROUP;
    }
    const conversation = await conversationRepo.save({ conversationType });

    const members = targetIds.map((targetId) => {
      return {
        memberId: targetId,
        conversationId: conversation.id,
      };
    });
    members.push({ memberId, conversationId: conversation.id });

    await conversationMemberRepo.insert(members);

    return { conversationId: conversation.id };
  });
}

export async function sendMassage(memberId: number, params) {
  return await getConnection().transaction(async (transaction) => {
    const conversationRepository = transaction.getRepository(Conversation);
    const conversationMemberRepository =
      transaction.getRepository(ConversationMember);

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
      content: params?.content,
      image: params?.image,
      metadata: params.metadata,
      memberId,
      messageType: params.messageType,
      memberType: MemberType.APP,
      conversationId: params.conversationId,
      createdAt: new Date().getTime(),
    };

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

  const conversationMembers = await conversationMemberRepo.find({
    where: { memberId },
  });

  const conversationIds = conversationMembers.map(
    (conversationMember) => conversationMember.conversationId
  );

  if (conversationIds.length < 1) return;

  const queryBuilder = conversationRepo
    .createQueryBuilder("conversation")
    .select([
      "conversation.id id",
      "conversation.lastMessage lastMessage",
      "conversation.lastMessageType lastMessageType",
      "conversation.lastSentMemberId lastSentMemberId",
      "conversation.lastTimeSent lastTimeSent",
      "conversationMember.memberId memberId",
      "memberDetail.name memberName",
      "member.avatar avatar",
    ])
    .leftJoin("conversation.conversationMembers", "conversationMember")
    .leftJoin("Member", "member", "conversationMember.memberId = member.id")
    .leftJoin("member.memberDetail", "memberDetail")
    .where(`(conversationMember.conversationId IN (${conversationIds}))`)
    .andWhere("(conversationMember.memberId != :memberId)", { memberId })
    .andWhere("(conversation.lastMessage IS NOT NULL)");

  const totalItems = await queryBuilder.getCount();
  const data = await queryBuilder
    .limit(params.take)
    .offset(params.skip)
    .getRawMany();

  data?.forEach((item) => {
    assignThumbUrl(item, "avatar");
  });

  return returnPaging(data, totalItems, params);
}

export async function startVideoCall(
  memberId: number,
  params: { targetIds: number[] }
) {
  const { targetIds } = params;

  const conversation = await getOrCreateConversation(memberId, params);

  //   const videoCallRepo = transaction.getRepository(VideoCall);

  //   //   const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
  //   //   if (!conversation) {
  //   //     conversation = await conversationRepo.save({
  //   //       conversationType: ConversationType.PERSON,
  //   //     });
  //   //   }
  //   //   let videoCall = await videoCallRepo.save({
  //   //     conversationId: conversation.id,
  //   //     creatorId: memberId,
  //   //     channelName: uuidv4(),
  //   //     startAt: new Date().toISOString(),
  //   //   });
  //   //   let conversationMembers = await conversationMemberRepo.find({
  //   //     conversationId: conversation.id,
  //   //   });
  //   //   if (!conversationMembers) {
  //   //     conversationMembers = await conversationMemberRepo.save([
  //   //       { memberId, conversationId: conversation.id },
  //   //       { memberId: targetId, conversationId: conversation.id },
  //   //     ]);
  //   //   }
  //   //   for (let conversationMember of conversationMembers) {
  //   //     const checkMemberCalling = await conversationMemberRepo
  //   //       .createQueryBuilder("conversationMember")
  //   //       .innerJoin("conversationMember.conversation", "conversation")
  //   //       .addSelect(["conversation.id"])
  //   //       .innerJoin(
  //   //         "conversation.videoCalls",
  //   //         "videoCall",
  //   //         `(videoCall.status IN (${VideoCallStatus.WAITING},${VideoCallStatus.CALLING}))`
  //   //       )
  //   //       .getOne();
  //   //     if (checkMemberCalling) {
  //   //       videoCall.status = VideoCallStatus.MISSED;
  //   //       videoCall.endAt = new Date().toISOString();
  //   //       videoCall = await videoCallRepo.save(videoCall);
  //   //       const messageObj = {
  //   //         metadata: videoCall,
  //   //         memberId,
  //   //         messageType: MessagesType.VIDEO_CALL,
  //   //         memberType: MemberType.APP,
  //   //         conversationId: conversation.id,
  //   //         createdAt: new Date().getTime(),
  //   //       };
  //   //       const message = await saveMessage(messageObj);
  //   //       Object.assign(messageObj, {
  //   //         _id: message["_id"],
  //   //         status: message["status"],
  //   //       });
  //   //       return;
  //   //     }
  //   //     conversationMember.agoraToken = RtcTokenBuilder.buildTokenWithUid(
  //   //       config.agora.appId,
  //   //       config.agora.appCertificate,
  //   //       videoCall.channelName,
  //   //       conversationMember.memberId,
  //   //       RtcRole.PUBLISHER,
  //   //       privilegeExpiredTs
  //   //     );
  //   //   }
  //   //   conversationMembers = await conversationMemberRepo.save(
  //   //     conversationMembers
  //   //   );
  //   //   conversationMembers.forEach((conversationMember) => {
  //   //     emitToSpecificClient(
  //   //       memberId,
  //   //       conversationMember.memberType,
  //   //       EventSocket.VIDEO_CALL,
  //   //       {
  //   //         channelName: videoCall.channelName,
  //   //         agoraToken: conversationMember.agoraToken,
  //   //         memberId,
  //   //       }
  //   //     );
  //   //   });
  // });
}

export async function closeVideoCall(
  memberId: number,
  params: { videoCallId: number }
) {}

export async function getListMemberBlockIds(
  memberId: number,
  transaction?: EntityManager
) {
  const manager = transaction ? transaction.connection.manager : getManager();

  const result = await manager.query(
    `SELECT memberId as memberId FROM member_block WHERE memberId != ? AND targetId = ? UNION ALL SELECT targetId as memberId FROM member_block WHERE memberId = ? AND targetId != ?`,
    [memberId, memberId, memberId, memberId]
  );

  const data = result.map((item) => item.memberId);
  data.push(-1);
  return uniq(data);
}
