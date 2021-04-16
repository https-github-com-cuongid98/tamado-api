"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignThumbUrl = exports.awsThumbFormat = exports.awsGetThumb = exports.reformatFileLanguage = exports.getKeyCacheLanguage = exports.convertToObject = exports.randomOTP = exports.assignPaging = exports.returnPaging = void 0;
var _config_1 = __importDefault(require("$config"));
var _enums_1 = require("$enums");
var flat_1 = __importDefault(require("flat"));
var string_format_1 = __importDefault(require("string-format"));
var lodash_1 = __importDefault(require("lodash"));
function returnPaging(data, totalItems, params, metadata) {
    if (metadata === void 0) { metadata = {}; }
    return {
        data: data,
        totalItems: totalItems,
        paging: true,
        pageIndex: params.pageIndex,
        totalPages: Math.ceil(totalItems / params.take),
        metadata: metadata,
    };
}
exports.returnPaging = returnPaging;
function assignPaging(params) {
    params.pageIndex = Number(params.pageIndex) || 1;
    params.take = Number(params.take) || 10;
    params.skip = (params.pageIndex - 1) * params.take;
    return params;
}
exports.assignPaging = assignPaging;
/**
 * @param length(option) length of result.
 */
function randomOTP(length) {
    if (length === void 0) { length = 6; }
    var digits = "0123456789";
    var digitsLength = digits.length;
    var result = "";
    for (var i = 0; i < length; i++) {
        var index = Math.floor(Math.random() * digitsLength);
        result += digits[index];
    }
    return result;
}
exports.randomOTP = randomOTP;
function convertToObject(data, key) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var element = data[i];
        var keyEl = element[key];
        if (!result[keyEl]) {
            result[keyEl] = [];
        }
        delete element[key];
        result[keyEl].push(element);
    }
    return result;
}
exports.convertToObject = convertToObject;
function getKeyCacheLanguage(environment) {
    return _enums_1.KeyCacheRedis.LANGUAGE + ":" + environment;
}
exports.getKeyCacheLanguage = getKeyCacheLanguage;
//! "When i wrote this code, only me and God knew how it works. Now only God knows..."
function reformatFileLanguage(data, params) {
    var groupByLanguageCode = convertToObject(data, "code");
    var languageObject = Object.keys(groupByLanguageCode).reduce(function (acc, cur) {
        acc[cur] = groupByLanguageCode[cur].reduce(function (ac, cu) {
            ac[cu.key] = cu.value;
            return ac;
        }, {});
        return acc;
    }, {});
    var result = flat_1.default.unflatten(languageObject);
    if (params.code) {
        return result[params.code];
    }
    return result;
}
exports.reformatFileLanguage = reformatFileLanguage;
function awsGetThumb(img, size) {
    if (img && img != "" && !img.startsWith("http") && !img.startsWith("https"))
        return size === ""
            ? string_format_1.default("{0}/{1}", _config_1.default.awsUpload.downloadUrlThumb, img)
            : string_format_1.default("{0}/{1}/{2}", _config_1.default.awsUpload.downloadUrlThumb, size, img);
    return img;
}
exports.awsGetThumb = awsGetThumb;
function awsThumbFormat(img, w, h) {
    if (img)
        return img;
    if (!img) {
        if (w && h)
            return string_format_1.default("{0}/{1}x{2}/{3}", _config_1.default.awsUpload.downloadUrl, w, h
            // config.avatar.default
            );
        else
            return string_format_1.default("{0}/{1}", _config_1.default.awsUpload.downloadUrl
            // config.avatar.default
            );
    }
    if (!img.startsWith("http")) {
        if (w && h && !img.includes("graph.facebook.com"))
            return string_format_1.default("{0}/{1}x{2}/{3}", _config_1.default.awsUpload.downloadUrl, w, h, img);
        else
            return string_format_1.default("{0}/{1}", _config_1.default.awsUpload.downloadUrl, img);
    }
    else {
        if (w && h && !img.includes("graph.facebook.com")) {
            img = img.replace(/%2F/g, "/");
            var arr_split = img.split("/");
            arr_split[arr_split.length - 1] = w + "x" + h + "/" + arr_split[arr_split.length - 1];
            return arr_split.join("/");
        }
        else {
            return img;
        }
    }
}
exports.awsThumbFormat = awsThumbFormat;
/**
 *
 * @param obj object need to add thumb
 * @param path path to image field in object
 * @description assign thumb url for image property of object
 */
function assignThumbUrl(obj, path) {
    lodash_1.default.flatten([obj]).forEach(function (item) {
        var img = lodash_1.default.get(item, path);
        var url = awsThumbFormat(img);
        lodash_1.default.set(item, path, url);
        [50].forEach(function (size) {
            var url = awsThumbFormat(img, size, size);
            lodash_1.default.set(item, path + "_" + size, url);
        });
    });
    return obj;
}
exports.assignThumbUrl = assignThumbUrl;
//# sourceMappingURL=utils.js.map