import { APP, Get, Post, Put } from "$helpers/decorator";
import * as service from "$services/app.member";
import { Request } from "express";

@APP("/members")
export default class MemberController {
  @Get("/search-map")
  async searchMember(req: Request) {
    const query = Object(req.query);
    const { memberId } = req;
    return await service.searchMember({ memberId, ...query });
  }

  @Get("/my-profile")
  async getMyProfile(req: Request) {
    const { memberId } = req;
    return await service.getMyProfile(memberId);
  }

  @Get("/:memberId")
  async getMemberDetailById(req: Request) {
    const { memberId } = req;
    const targetId = Number(req.params.memberId);
    return await service.getMemberDetailById(memberId, targetId);
  }

  @Put("/:memberId/follow")
  async followMember(req: Request) {
    const targetId = Number(req.params.memberId);
    const { memberId } = req;
    return await service.followMember(memberId, targetId);
  }
}
