"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var fs_1 = require("fs");
var path = __importStar(require("path"));
exports.writeFile = function (path) { return function (content) { return fs_1.writeFileSync(path, content); }; };
exports.deleteFile = function (path) {
    fs.unlink(path, function () {
        // fire and forget
    });
};
exports.getProjectRoot = function (filePath) {
    var currentFilePath = filePath;
    while (currentFilePath !== '') {
        if (fs.existsSync(path.resolve(currentFilePath, './package.json'))) {
            return currentFilePath;
        }
        currentFilePath = currentFilePath.substr(0, currentFilePath.lastIndexOf('/'));
    }
    return undefined;
};
