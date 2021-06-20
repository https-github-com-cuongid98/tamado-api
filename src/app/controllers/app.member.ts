import { validate } from "$helpers/ajv";
import { APP, Get, Post, Put } from "$helpers/decorator";
import * as service from "$services/app.member";
import { Request } from "express";
import {
  editMyProfileSchema,
  receiveNotificationMemberSchema,
  showLocationSchema,
  updateGPSSchema,
  updateImageToAvatarSchema,
} from "$validators/app.member";
import { assignPaging } from "$helpers/utils";

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

  @Get("/member-online")
  async getMemberOnline(req: Request) {
    const { memberId } = req;
    return await service.getMemberOnline(memberId);
  }

  @Get("/follower")
  async getFollower(req: Request) {
    const { memberId } = req;
    const query = assignPaging(req.query);
    return await service.getFollower(memberId, query);
  }

  @Get("/followed")
  async getFollowed(req: Request) {
    const { memberId } = req;
    const query = assignPaging(req.query);
    return await service.getFollowed(memberId, query);
  }

  @Get("/blocked")
  async getListBlock(req: Request) {
    const { memberId } = req;
    const query = assignPaging(req.query);
    return await service.getListBlock(memberId, query);
  }

  @Get("/:memberId")
  async getMemberDetailById(req: Request) {
    const { memberId } = req;
    const targetId = Number(req.params.memberId);
    return await service.getMemberDetailById(memberId, targetId);
  }

  @Put("/")
  async editMyProfile(req: Request) {
    const { memberId, body } = req;
    validate(editMyProfileSchema, body);
    return await service.editMyProfile(memberId, body);
  }

  @Put("/update-GPS")
  async updateGPS(req: Request) {
    const { memberId, body } = req;
    validate(updateGPSSchema, body);
    return await service.editMyProfile(memberId, body);
  }

  @Put("/show-location")
  async showLocationMember(req: Request) {
    const { memberId, body } = req;
    validate(showLocationSchema, body);
    return await service.editMyProfile(memberId, body);
  }

  @Put("/receive-notification")
  async receiveNotificationMember(req: Request) {
    const { memberId, body } = req;
    validate(receiveNotificationMemberSchema, body);
    return await service.editMyProfile(memberId, body);
  }

  @Put("/update-image-to-avatar")
  async updateImageToAvatar(req: Request) {
    const { memberId, body } = req;
    validate(updateImageToAvatarSchema, body);
    return await service.editMyProfile(memberId, body);
  }

  @Put("/:memberId/follow")
  async followMember(req: Request) {
    const targetId = Number(req.params.memberId);
    const { memberId } = req;
    return await service.followMember(memberId, targetId);
  }

  @Put("/:memberId/block")
  async blockMember(req: Request) {
    const targetId = Number(req.params.memberId);
    const { memberId } = req;
    return await service.blockMember(memberId, targetId);
  }
}
