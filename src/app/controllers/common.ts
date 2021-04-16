import { APP, Get, Post, Put } from "$helpers/decorator";
import { Request } from "express";
import axios from "axios";
import s3Upload from "$middlewares/s3Upload";
import { awsGetThumb } from "$helpers/utils";

@APP("")
export default class AuthController {
  @Post("/upload", [s3Upload.upload.array("files", 3)])
  async upload(req: Request) {
    let files = [];
    if (req["files"] && req["files"].length > 0) {
      req["files"].forEach((f: any) => {
        files.push(f.key);
        // TODO: Generate thumbnail if needed
        // try {
        //   if (/\.(gif|jpe?g|tiff|png|webp|bmp|svg|heic)$/gi.test(f.key)) {
        //     axios.get(awsGetThumb(f.key, "50x50"));
        //   }
        // } catch (e) {}
      });
    }
    return files;
  }
}
