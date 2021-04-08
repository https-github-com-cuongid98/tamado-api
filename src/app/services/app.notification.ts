import Notification from "$entities/Notification";
import { CommonStatus, ErrorCode, IsRead } from "$enums";
import { returnPaging } from "$helpers/utils";
import { getRepository } from "typeorm";

export async function getListNotification(memberId: number, params) {
  const notificationRepo = getRepository(Notification);

  const [notifications, data] = await notificationRepo.findAndCount({
    where: { memberId },
    skip: params.skip,
    take: params.take,
    order: { createdDate: "DESC" },
  });

  return returnPaging(notifications, data, params);
}

export async function updateReadNotification(
  memberId: number,
  notificationId: number
) {
  const notificationRepo = getRepository(Notification);

  const notification = await notificationRepo.findOne({
    where: { memberId, id: notificationId, status: CommonStatus.ACTIVE },
  });

  if (!notification) throw ErrorCode.Permission_Denied;

  await notificationRepo.update(
    { id: notificationId },
    { isRead: IsRead.SEEN }
  );
}
