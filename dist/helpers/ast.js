"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var traverse_1 = __importDefault(require("@babel/traverse"));
var file_1 = require("../utils/file");
exports.findNodeAtAstLocation = function (type) { return function (ast) { return function (location) {
    var foundNode = undefined;
    traverse_1.default(ast, {
        enter: function (path) {
            var node = path.node;
            if (node.type.match(new RegExp(type))) {
                if (file_1.beforeOrAtInFile([node.loc.start, location]) && file_1.beforeOrAtInFile([location, node.loc.end])) {
                    foundNode = node;
                }
            }
        }
    });
    return foundNode;
}; }; };
exports.findPathToAstLocation = function (type) { return function (ast) { return function (location) {
    var foundNodes = [];
    var foundNodesBuffer = [];
    traverse_1.default(ast, {
        enter: function (path) {
            var node = path.node;
            if (file_1.beforeOrAtInFile([node.loc.start, location]) && file_1.beforeOrAtInFile([location, node.loc.end])) {
                foundNodesBuffer.unshift(node);
                if (node.type.match(new RegExp(type))) {
                    foundNodes = __spreadArrays(foundNodesBuffer);
                }
            }
        }
    });
    return foundNodes;
}; }; };
/* Rich
// */
