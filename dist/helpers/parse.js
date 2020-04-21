"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../utils/string");
var number_1 = require("../utils/number");
exports.parseFileLocation = function (args) { return function (offset) {
    return {
        file: args[offset],
        line: parseInt(args[offset + 1]),
        column: parseInt(args[offset + 2]),
        toLine: parseInt(args[offset + 3]),
        toColumn: parseInt(args[offset + 4]),
    };
}; };
exports.readWordAtLocation = function (_a) {
    var line = _a.line, column = _a.column;
    return function (code) {
        return string_1.readWordAtCharPosition(string_1.getLineAt(number_1.dec(line))(code))("|().:;'\"` {}")(column);
    };
};
