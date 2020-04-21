"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../utils/string");
var fileIO_1 = require("../helpers/fileIO");
var path = __importStar(require("path"));
exports.getTestSurroundingDescribeLineNr = function (testInfo) { return function (fileContent) {
    return string_1.findLine(fileContent)(new RegExp("describe\\('" + testInfo.functionName + "'"));
}; };
exports.surroundTestWithDescribe = function (testInfo) { return function (testString) {
    return "\ndescribe('" + testInfo.functionName + "', () => {\n   " + testString + "\n});\n";
}; };
var dependencyCheck = function (config) { return function (dependency) { return function (fileContent) {
    if (config.dependencyType === 'commonjs') {
        var testRegex = new RegExp("^const .*" + dependency + ".*=", 'gm');
        return fileContent.match(testRegex);
    }
    else {
        var testRegex = new RegExp("^import .*" + dependency + ".*from", 'gm');
        return fileContent.match(testRegex);
    }
}; }; };
exports.sutDependencyCheck = function (config) { return function (testInfo) {
    return dependencyCheck(config)(testInfo.functionName);
}; };
exports.getPathToSut = function (config) { return function (testInfo) {
    if (config.testPlacement === 'adjacent') {
        return "./" + testInfo.sutFileNameWithoutExt;
    }
    else {
        var relativeTestLocation = config.testPlacement + '/' + testInfo.sutPathRelativeToProjectRoot;
        return relativeTestLocation
            .substr(0, relativeTestLocation.lastIndexOf('/') + 1)
            .replace(/\w*\//g, '../') + testInfo.sutPathRelativeToProjectRoot;
    }
}; };
exports.getSutDependencyString = function (config) { return function (testInfo) {
    if (config.dependencyType === 'commonjs') {
        return "const {" + testInfo.functionName + "} = require('" + exports.getPathToSut(config)(testInfo) + "');\n";
    }
    else {
        return "import {" + testInfo.functionName + "} from '" + exports.getPathToSut(config)(testInfo) + "';\n";
    }
}; };
exports.getTestLocation = function (config) { return function (testInfo) {
    var testLocation;
    if (config.testPlacement === 'adjacent') {
        testLocation = string_1.insertBeforeExtension(config.testPostFix)(testInfo.sutPath);
    }
    else {
        testLocation = path.resolve(fileIO_1.getProjectRoot(testInfo.sutPath), config.testPlacement, string_1.insertBeforeExtension(config.testPostFix)(testInfo.sutPathRelativeToProjectRoot));
    }
    return testLocation;
}; };
