import { APP, Get, Post, Put } from "$helpers/decorator";
import { Permissions } from "$enums";
import { checkRefreshTokenApp } from "$middlewares/app";
import { validate } from "$helpers/ajv";
import {
  loginSchema,
  changePasswordSchema,
  requestVerifiedCodeSchema,
  registerSchema,
  checkVerifiedCodeSchema,
  resetPasswordSchema,
} from "$validators/app.auth";
import * as service from "$services/app.auth";
import { Request } from "express";

@APP("/auth")
export default class AuthController {
  @Post("/request-verified-code", [])
  async requestVerifiedCode(req: Request) {
    const { body } = req;
    validate(requestVerifiedCodeSchema, body);
    return await service.createVerifiedCode(body);
  }

  @Post("/check-verified-code", [])
  async checkVerifiedCode(req: Request) {
    const { body } = req;
    validate(checkVerifiedCodeSchema, body);
    return await service.checkVerifiedCode(body);
  }

  @Post("/register", [])
  async register(req: Request) {
    const { body } = req;
    validate(registerSchema, body);
    return await service.register(body);
  }

  @Post("/login", [])
  async login(req: Request) {
    const body = req.body;
    validate(loginSchema, body);
    return await service.login(body);
  }

  @Post("/request-access-token", [checkRefreshTokenApp])
  async requestAccessToken(req: Request) {
    const memberId = req.memberId;
    const accessToken = await service.createAccessToken(memberId);
    return { accessToken };
  }

  @Put("/change-password")
  async changePassword(req: Request) {
    const { memberId, body } = req;
    validate(changePasswordSchema, body);
    await service.changePassword(memberId, body);
    return;
  }

  @Put("/reset-password", [])
  async resetPassword(req: Request) {
    const { body } = req;
    validate(resetPasswordSchema, body);
    await service.resetPassword(body);
    return;
  }
}
