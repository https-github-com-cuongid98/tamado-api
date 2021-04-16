"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _config_1 = __importDefault(require("$config"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var multer_1 = __importDefault(require("multer"));
var s3 = new aws_sdk_1.default.S3({
    secretAccessKey: _config_1.default.awsUpload.secretAccessKey,
    accessKeyId: _config_1.default.awsUpload.accessKeyId,
    region: _config_1.default.awsUpload.region,
});
// https://www.npmjs.com/package/multer-s3
var s3Upload = {
    upload: multer_1.default({
    // storage: multerS3({
    //   s3: s3,
    //   bucket: config.awsUpload.bucket,
    //   acl: "public-read",
    //   contentType: multerS3.AUTO_CONTENT_TYPE,
    //   metadata: (req, file, callback) => {
    //     callback(null, { fieldName: file.fieldname });
    //   },
    //   key: (req, file, callback) => {
    //     let arr_ext = (file.originalname || "").split(".");
    //     let md5FileName =
    //       arr_ext.length > 0
    //         ? `${md5(file.originalname)}.${arr_ext[arr_ext.length - 1]}`
    //         : md5(file.originalname);
    //     callback(null, `${Date.now().toString()}-${md5FileName}`);
    //   },
    // }),
    }),
};
exports.default = s3Upload;
//# sourceMappingURL=s3Upload.js.map