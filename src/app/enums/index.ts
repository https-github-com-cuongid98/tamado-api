import config from "$config";

export enum ErrorCode {
  Unknown_Error = 0,
  Invalid_Input = 1,
  Member_Blocked = 2,
  Username_Or_Password_Invalid = 3,
  Token_Not_Exist = 4,
  User_Blocked = 5,
  Token_Expired = 6,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = 7,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = 8,
  /**The client do not have permission for this action. */
  Permission_Denied = 9,
  Member_Not_Exist = 10,
  User_Not_Exist = 11,
  Not_Found = 12,
  Cannot_Update_Default_Language = 13,
  Cannot_Delete_Default_Language = 14,
  Verified_Code_Invalid = 15,
  Phone_Existed = 16,
  Phone_Not_Exist = 17,
  Phone_Or_Password_Invalid = 18,
  Password_Invalid = 19,
  Verified_Code_Max_Try = 20,
}

export enum ErrorMessage {
  Unknown_Error = "Unknown_Error",
  Invalid_Input = "Invalid_Input",
  Member_Blocked = 2,
  Username_Or_Password_Invalid = 3,
  Token_Not_Exist = 4,
  User_Blocked = 5,
  Token_Expired = 6,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = 7,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = 8,
  /**The client do not have permission for this action. */
  Permission_Denied = 9,
  Member_Not_Exist = 10,
  User_Not_Exist = 11,
  Not_Found = 12,
  Cannot_Update_Default_Language = 13,
  Cannot_Delete_Default_Language = 14,
  Verified_Code_Invalid = 15,
  Email_Existed = 16,
  Email_Not_Exist = 17,
  Email_Or_Password_Invalid = 18,
  Password_Invalid = 19,
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
  CONFIG: `${config.appName}:${config.environment}:config`,
  LANGUAGE: `${config.appName}:${config.environment}:language`,
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
