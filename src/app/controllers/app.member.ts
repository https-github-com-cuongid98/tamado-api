import { APP, Get, Post, Put } from "$helpers/decorator";
import * as service from "$services/app.member";
import { Request } from "express";

@APP("/members")
export default class MemberController {
  @Get("/my-profile")
  async requestVerifiedCode(req: Request) {
    const { memberId } = req;
    return await service.getMyProfile(memberId);
  }
}
