import { validate } from "$helpers/ajv";
import { APP, Get, Put } from "$helpers/decorator";
import { assignPaging } from "$helpers/utils";
import * as service from "$services/app.notification";
import { Request } from "express";

@APP("/notifications")
export default class NotificationController {
  @Get("/")
  async getListNotification(req: Request) {
    const { memberId } = req;
    const query = assignPaging(req.query);
    return await service.getListNotification(memberId, query);
  }

  @Put("/:notificationId")
  async updateReadNotification(req: Request) {
    const notificationId = Number(req.params.notificationId);
    const { memberId } = req;
    return await service.updateReadNotification(memberId, notificationId);
  }
}
