"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var boolean_1 = require("./boolean");
var control_1 = require("./control");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var string_1 = require("./string");
var number_1 = require("./number");
exports.beforeOrAtInFile = control_1.cond({
    if: function (locations) { return boolean_1.equals(locations[0].line)(locations[1].line); },
    then: function (locations) { return locations[0].column <= locations[1].column; },
    else: function (locations) { return locations[0].line <= locations[1].line; },
});
exports.readRange = function (from) { return function (to) { return function (input) {
    var linesOfInput = string_1.lines(input);
    if (from.line === to.line) {
        return linesOfInput[from.line].substr(from.column, to.column);
    }
    var output = linesOfInput[from.line].substr(from.column) + '\n';
    for (var i = number_1.inc(from.line); i < to.line; i++) {
        output += linesOfInput[i] + '\n';
    }
    output += linesOfInput[to.line].substr(0, to.column);
    return output;
}; }; };
exports.ensureExtension = function (fileName) {
    if (!path.extname(fileName)) {
        if (fs.existsSync(fileName + ".ts")) {
            return fileName + ".ts";
        }
        return fileName + ".js";
    }
    return fileName;
};
