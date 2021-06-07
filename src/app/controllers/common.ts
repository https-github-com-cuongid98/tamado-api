import { APP, Get, Post } from "$helpers/decorator";
import { Request } from "express";
import * as service from "$services/common";
import upload from "$middlewares/upload";
import imgur from "imgur";
import fs from "fs";
import path from "path";
import { ErrorCode } from "$enums";

@APP("")
export default class CommonController {
  @Post("/upload", [upload.array("files", 3)])
  async upload(req: Request) {
    const url = [];
    if (req["files"] && req["files"].length) {
      for (const f of req["files"]) {
        const ext = path.extname(f.originalname);
        if (!/\.(png|jpe?g)/i.test(ext)) {
          req["files"].forEach((f) => {
            fs.promises.unlink(f.path);
          });
          throw ErrorCode.File_Format_Invalid;
        }
        const uploadFile = await imgur.uploadFile(`${f.path}`);
        url.push(uploadFile.link);
      }
      req["files"].forEach((f) => {
        fs.promises.unlink(f.path);
      });
    }
    return url;
  }

  @Get("/resources", [])
  async getListResource(req: Request) {
    return await service.getListResource();
  }

  @Get("/clear-cache", [])
  async clearCache(req: Request) {
    return await service.clearCache();
  }
}
