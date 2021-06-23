import { Client } from "onesignal-node";
import config from "$config";
import _ from "lodash";
import log from "./log";
import { CreateNotificationBody } from "onesignal-node/lib/types";

const logger = log("Push Notification");

const notificationClient = new Client(
  config.oneSignal.appId,
  config.oneSignal.apiKey
);
interface notificationObj {
  memberId: number;
  content: string;
  redirectType: number;
  redirectId?: number;
  metaData?: any;
  notificationId?: number;
}
/**
 *
 * @param listMemberIds Array id of admin members
 * @param content Notification
 * @param data More info for App, Salon
 */
export async function pushNotificationToMember({
  memberId,
  content,
  redirectType,
  redirectId,
  metaData,
  notificationId,
}: notificationObj) {
  // https://documentation.onesignal.com/reference#create-notification
  if (!memberId) return false;
  /* Format data send to OneSignal */
  const notification: CreateNotificationBody = {
    contents: {
      en: content.replace(/<.*?>/g, ""),
    },
    data: {
      notificationId,
      redirectType,
      redirectId,
      metaData,
    },
    filters: [],
  };
  /* Conditions */
  notification.filters.push({
    field: "tag",
    key: "memberId",
    relation: "=",
    value: memberId,
  });

  await notificationClient.createNotification(notification);
  return true;
}
