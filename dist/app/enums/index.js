"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowLocation = exports.IsRead = exports.MessagesType = exports.ConversationType = exports.ConversationMemberType = exports.KeyCacheRedis = exports.ConfigKeys = exports.VerifiedCodeStatus = exports.CommonStatus = exports.Permissions = exports.MemberStatus = exports.UserStatus = exports.ErrorMessage = exports.ErrorCode = void 0;
var _config_1 = __importDefault(require("$config"));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Unknown_Error"] = 0] = "Unknown_Error";
    ErrorCode[ErrorCode["Invalid_Input"] = 1] = "Invalid_Input";
    ErrorCode[ErrorCode["Member_Blocked"] = 2] = "Member_Blocked";
    ErrorCode[ErrorCode["Username_Or_Password_Invalid"] = 3] = "Username_Or_Password_Invalid";
    ErrorCode[ErrorCode["Token_Not_Exist"] = 4] = "Token_Not_Exist";
    ErrorCode[ErrorCode["User_Blocked"] = 5] = "User_Blocked";
    ErrorCode[ErrorCode["Token_Expired"] = 6] = "Token_Expired";
    /**The client not send the required token in header */
    ErrorCode[ErrorCode["Refresh_Token_Not_Exist"] = 7] = "Refresh_Token_Not_Exist";
    /**The client send the expire token or invalid token*/
    ErrorCode[ErrorCode["Refresh_Token_Expire"] = 8] = "Refresh_Token_Expire";
    /**The client do not have permission for this action. */
    ErrorCode[ErrorCode["Permission_Denied"] = 9] = "Permission_Denied";
    ErrorCode[ErrorCode["Member_Not_Exist"] = 10] = "Member_Not_Exist";
    ErrorCode[ErrorCode["User_Not_Exist"] = 11] = "User_Not_Exist";
    ErrorCode[ErrorCode["Not_Found"] = 12] = "Not_Found";
    ErrorCode[ErrorCode["Cannot_Update_Default_Language"] = 13] = "Cannot_Update_Default_Language";
    ErrorCode[ErrorCode["Cannot_Delete_Default_Language"] = 14] = "Cannot_Delete_Default_Language";
    ErrorCode[ErrorCode["Verified_Code_Invalid"] = 15] = "Verified_Code_Invalid";
    ErrorCode[ErrorCode["Email_Existed"] = 16] = "Email_Existed";
    ErrorCode[ErrorCode["Email_Not_Exist"] = 17] = "Email_Not_Exist";
    ErrorCode[ErrorCode["Email_Or_Password_Invalid"] = 18] = "Email_Or_Password_Invalid";
    ErrorCode[ErrorCode["Password_Invalid"] = 19] = "Password_Invalid";
    ErrorCode[ErrorCode["Verified_Code_Max_Try"] = 20] = "Verified_Code_Max_Try";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["Unknown_Error"] = "Unknown_Error";
    ErrorMessage["Invalid_Input"] = "Invalid_Input";
    ErrorMessage[ErrorMessage["Member_Blocked"] = 2] = "Member_Blocked";
    ErrorMessage[ErrorMessage["Username_Or_Password_Invalid"] = 3] = "Username_Or_Password_Invalid";
    ErrorMessage[ErrorMessage["Token_Not_Exist"] = 4] = "Token_Not_Exist";
    ErrorMessage[ErrorMessage["User_Blocked"] = 5] = "User_Blocked";
    ErrorMessage[ErrorMessage["Token_Expired"] = 6] = "Token_Expired";
    /**The client not send the required token in header */
    ErrorMessage[ErrorMessage["Refresh_Token_Not_Exist"] = 7] = "Refresh_Token_Not_Exist";
    /**The client send the expire token or invalid token*/
    ErrorMessage[ErrorMessage["Refresh_Token_Expire"] = 8] = "Refresh_Token_Expire";
    /**The client do not have permission for this action. */
    ErrorMessage[ErrorMessage["Permission_Denied"] = 9] = "Permission_Denied";
    ErrorMessage[ErrorMessage["Member_Not_Exist"] = 10] = "Member_Not_Exist";
    ErrorMessage[ErrorMessage["User_Not_Exist"] = 11] = "User_Not_Exist";
    ErrorMessage[ErrorMessage["Not_Found"] = 12] = "Not_Found";
    ErrorMessage[ErrorMessage["Cannot_Update_Default_Language"] = 13] = "Cannot_Update_Default_Language";
    ErrorMessage[ErrorMessage["Cannot_Delete_Default_Language"] = 14] = "Cannot_Delete_Default_Language";
    ErrorMessage[ErrorMessage["Verified_Code_Invalid"] = 15] = "Verified_Code_Invalid";
    ErrorMessage[ErrorMessage["Email_Existed"] = 16] = "Email_Existed";
    ErrorMessage[ErrorMessage["Email_Not_Exist"] = 17] = "Email_Not_Exist";
    ErrorMessage[ErrorMessage["Email_Or_Password_Invalid"] = 18] = "Email_Or_Password_Invalid";
    ErrorMessage[ErrorMessage["Password_Invalid"] = 19] = "Password_Invalid";
})(ErrorMessage = exports.ErrorMessage || (exports.ErrorMessage = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["ACTIVE"] = 1] = "ACTIVE";
    UserStatus[UserStatus["INACTIVE"] = 0] = "INACTIVE";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var MemberStatus;
(function (MemberStatus) {
    MemberStatus[MemberStatus["ACTIVE"] = 1] = "ACTIVE";
    MemberStatus[MemberStatus["INACTIVE"] = 0] = "INACTIVE";
})(MemberStatus = exports.MemberStatus || (exports.MemberStatus = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["RESOURCE_MANAGEMENT"] = 1] = "RESOURCE_MANAGEMENT";
    Permissions[Permissions["LANGUAGE_MANAGEMENT"] = 2] = "LANGUAGE_MANAGEMENT";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
var CommonStatus;
(function (CommonStatus) {
    CommonStatus[CommonStatus["ACTIVE"] = 1] = "ACTIVE";
    CommonStatus[CommonStatus["INACTIVE"] = 0] = "INACTIVE";
})(CommonStatus = exports.CommonStatus || (exports.CommonStatus = {}));
var VerifiedCodeStatus;
(function (VerifiedCodeStatus) {
    VerifiedCodeStatus[VerifiedCodeStatus["UN_USED"] = 1] = "UN_USED";
    VerifiedCodeStatus[VerifiedCodeStatus["USED"] = 2] = "USED";
})(VerifiedCodeStatus = exports.VerifiedCodeStatus || (exports.VerifiedCodeStatus = {}));
var ConfigKeys;
(function (ConfigKeys) {
    ConfigKeys["RESOURCE_VERSION"] = "RESOURCE_VERSION";
    ConfigKeys["LANGUAGE_VERSION"] = "LANGUAGE_VERSION";
    ConfigKeys["APP_LOGO"] = "APP_LOGO";
})(ConfigKeys = exports.ConfigKeys || (exports.ConfigKeys = {}));
exports.KeyCacheRedis = {
    RESOURCE: _config_1.default.appName + ":" + _config_1.default.environment + ":resource",
    CONFIG: _config_1.default.appName + ":" + _config_1.default.environment + ":config",
    LANGUAGE: _config_1.default.appName + ":" + _config_1.default.environment + ":language",
};
var ConversationMemberType;
(function (ConversationMemberType) {
    ConversationMemberType[ConversationMemberType["MEMBER"] = 1] = "MEMBER";
    ConversationMemberType[ConversationMemberType["ADMIN"] = 2] = "ADMIN";
})(ConversationMemberType = exports.ConversationMemberType || (exports.ConversationMemberType = {}));
var ConversationType;
(function (ConversationType) {
    ConversationType[ConversationType["PERSON"] = 1] = "PERSON";
    ConversationType[ConversationType["GROUP"] = 2] = "GROUP";
})(ConversationType = exports.ConversationType || (exports.ConversationType = {}));
var MessagesType;
(function (MessagesType) {
    MessagesType[MessagesType["TEXT"] = 1] = "TEXT";
    MessagesType[MessagesType["IMAGE"] = 2] = "IMAGE";
})(MessagesType = exports.MessagesType || (exports.MessagesType = {}));
var IsRead;
(function (IsRead) {
    IsRead[IsRead["UN_SEEN"] = 1] = "UN_SEEN";
    IsRead[IsRead["SEEN"] = 2] = "SEEN";
})(IsRead = exports.IsRead || (exports.IsRead = {}));
var ShowLocation;
(function (ShowLocation) {
    ShowLocation[ShowLocation["YES"] = 1] = "YES";
    ShowLocation[ShowLocation["NO"] = 2] = "NO";
})(ShowLocation = exports.ShowLocation || (exports.ShowLocation = {}));
//# sourceMappingURL=index.js.map