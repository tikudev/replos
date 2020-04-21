"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var boolean_1 = require("./boolean");
var control_1 = require("./control");
var list_1 = require("./list");
exports.words = function (str) { return str.split(' '); };
exports.empty = function (str) { return str === ''; };
exports.lines = function (str) { return str.split('\n'); };
exports.hasExtName = function (extName) { return function (file) { return control_1.c(boolean_1.equals(extName))(path.extname(file)); }; };
exports.getLineAt = function (index) { return function (str) { return control_1.at(exports.lines(str))(index); }; };
exports.removeAfterLast = function (removeAfter) { return function (str) { return str.substr(0, str.lastIndexOf(removeAfter)); }; };
exports.insertBeforeExtension = function (insertionString) { return function (file) {
    var fileExtension = path.extname(file);
    if (fileExtension) {
        file = file.substr(0, file.length - fileExtension.length);
    }
    // assume js if no extension provided
    return "" + file + insertionString + (fileExtension || '.js');
}; };
exports.insertAfterLine = function (input) { return function (insertionString) { return function (lineNr) {
    return list_1.insertAt(input.split('\n'))(insertionString)(lineNr + 1).join('\n');
}; }; };
exports.readWordAtCharPosition = function (str) { return function (delimiter) { return function (position) {
    var currentWord = "";
    for (var i = 0; i < str.length; i++) {
        var currentChar = str[i];
        if (delimiter.includes(currentChar)) {
            if (position <= i) {
                return currentWord;
            }
            currentWord = "";
        }
        else {
            currentWord = currentWord + currentChar;
        }
    }
    return currentWord;
}; }; };
exports.findLine = function (input) { return function (searchRegex) {
    var lines = input.split('\n');
    var lineNr = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.match(searchRegex)) {
            return { line: line, lineNr: lineNr };
        }
        lineNr++;
    }
    return undefined;
}; };
