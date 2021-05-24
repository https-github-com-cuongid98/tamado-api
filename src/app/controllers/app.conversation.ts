import { APP, Get, Post, Put } from "$helpers/decorator";
import { validate } from "$helpers/ajv";
import {
  getOrCreateConversationSchema,
  sendMessageSchema,
  closeVideoCallSchema,
  startVideoCallSchema,
} from "$validators/app.conversation";
import * as service from "$services/app.conversation";
import { Request } from "express";
import { assignPaging } from "$helpers/utils";

@APP("/conversations")
export default class ConversationController {
  @Get("/")
  async getListConversationByMemberId(req: Request) {
    const { memberId } = req;
    const query = assignPaging(req.query);
    return await service.getListConversationByMemberId(memberId, query);
  }

  @Post("/:conversationId/get-list-massage-in-conversation")
  async getListMassageInConversation(req: Request) {
    const { memberId } = req;
    const conversationId = Number(req.params.conversationId);
    const body = assignPaging(req.body);
    return await service.getListMassageInConversation(
      memberId,
      conversationId,
      body
    );
  }

  @Post("/get-or-create-conversation")
  async getOrCreateConversation(req: Request) {
    const { memberId, body } = req;
    validate(getOrCreateConversationSchema, body);
    return await service.getOrCreateConversation(memberId, body);
  }

  @Post("/send-massages")
  async sendMassage(req: Request) {
    const { memberId, body } = req;
    validate(sendMessageSchema, body);
    return await service.sendMassage(memberId, body);
  }

  // @Put("/close-video-call")
  // async closeVideoCall(req: Request) {
  //   const { memberId, body } = req;
  //   validate(closeVideoCallSchema, body);
  //   return await service.closeVideoCall(memberId, body);
  // }

  // @Put("/start-video-call")
  // async startVideoCall(req: Request) {
  //   const { memberId, body } = req;
  //   validate(startVideoCallSchema, body);
  //   return await service.startVideoCall(memberId, body);
  // }
}
