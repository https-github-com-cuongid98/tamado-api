"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
/**
 * Require all module in folder controller.
 * Deep: Infinity
 */
requireJsModule('controllers');
function requireJsModule(directoryName) {
    fs_1.default.readdirSync(__dirname + ("/" + directoryName), { withFileTypes: true })
        .filter(function (dirent) { return dirent.isDirectory() || dirent.name.endsWith('.js'); })
        .forEach(function (dirent) {
        if (dirent.isDirectory()) {
            requireJsModule("/" + directoryName + "/" + dirent.name);
        }
        if (!dirent.isDirectory()) {
            module.exports = require("./" + directoryName + "/" + dirent.name);
        }
    });
}
//# sourceMappingURL=require.js.map