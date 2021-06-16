import config from "$config";

export enum ErrorCode {
  Unknown_Error = 0,
  Invalid_Input = 1,
  Member_Blocked = 2,
  Token_Not_Exist = 4,
  Token_Expired = 6,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = 7,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = 8,
  /**The client do not have permission for this action. */
  Permission_Denied = 9,
  Member_Not_Exist = 10,
  Not_Found = 12,
  Verified_Code_Invalid = 15,
  Phone_Existed = 16,
  Password_Invalid = 19,
  Verified_Code_Max_Try = 20,
  You_Can_Not_Follow_Yourself = 21,
  Blocked = 22,
  Conversation_Not_Exist = 23,
  You_Not_Member_In_This_Conversation = 24,
  File_Format_Invalid = 25,
}

export enum ErrorMessage {
  Unknown_Error = "Lỗi không xác định.",
  Invalid_Input = "Nhập không hợp lệ.",
  Member_Blocked = "Người dùng đã bị khóa.",
  Token_Not_Exist = "Token không tồn tại.",
  Token_Expired = "Token hết hạn",
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = "Refresh Token không tồn tại.",
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = "Refresh Token hết hạn",
  /**The client do not have permission for this action. */
  Permission_Denied = "Từ chối truy cập.",
  Member_Not_Exist = "Người dùng không tồn tại.",
  Not_Found = "Không tìm thấy.",
  Verified_Code_Invalid = "Mã xác thực không chính xác.",
  Phone_Existed = "Số điện thoại không tồn tại.",
  Password_Invalid = "Mật khẩu không chính xác.",
  Verified_Code_Max_Try = "Mã xác thực đã thử nhiều lần không thành công. Vui lòng thử lại sau 24h.",
  You_Can_Not_Follow_Yourself = "Bạn không thể tự theo dõi bản thân.",
  Blocked = "Bạn đã bị chặn.",
  Conversation_Not_Exist = "Cuộc trò chuyện không tồn tại.",
  You_Not_Member_In_This_Conversation = "Bạn không phải thành viên cuộc trò chuyện này.",
  File_Format_Invalid = "File không đúng định dạng.",
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum MemberStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum Permissions {
  RESOURCE_MANAGEMENT = 1,
  LANGUAGE_MANAGEMENT = 2,
}

export enum CommonStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum VerifiedCodeStatus {
  UN_USED = 1,
  USED = 2,
}

export enum ConfigKeys {
  RESOURCE_VERSION = "RESOURCE_VERSION",
  LANGUAGE_VERSION = "LANGUAGE_VERSION",
  APP_LOGO = "APP_LOGO",
}

export const KeyCacheRedis = {
  RESOURCE: `${config.appName}:${config.environment}:resource`,
  HOBBY: `${config.appName}:${config.environment}:hobby`,
  JOB: `${config.appName}:${config.environment}:job`,
};

export enum ConversationMemberType {
  MEMBER = 1,
  ADMIN = 2,
}

export enum ConversationType {
  PERSON = 1,
  GROUP = 2,
}

export enum MessagesType {
  TEXT = 1,
  IMAGE = 2,
  VIDEO_CALL = 3,
}

export enum IsRead {
  UN_SEEN = 1,
  SEEN = 2,
}

export enum ShowLocation {
  YES = 1,
  NO = 2,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
}

export enum VerifiedCodeType {
  REGISTER = 1,
  RESET_PASSWORD = 2,
}

export enum Following {
  YES = 1,
  NO = 0,
}

export enum EventSocket {
  CONVERSATIONS = "conversations",
  MESSAGES = "messages",
  READ_MESSAGE = "read_message",
  CREATE_ROOM = "create_room",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
  VIDEO_CALL = "video_call",
  START_TYPING = "start_typing",
  END_TYPING = "end_typing",
  TYPING = "typing",
  OFF_TYPING = "off_typing",
}

export enum MemberType {
  APP = 1,
  CMS = 2,
}

export enum RedirectType {
  HOME = 1,
  MEMBER = 2,
}

export enum VideoCallStatus {
  WAITING = 1,
  MISSED = 2,
  CALLING = 3,
  ENDED = 4,
}
