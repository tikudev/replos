"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var control_1 = require("../utils/control");
var getDependencyString = function (config) { return function (testInfo) { return function (fileContent) {
    var output = '';
    if (!shared_1.sutDependencyCheck(config)(testInfo)(fileContent)) {
        output += shared_1.getSutDependencyString(config)(testInfo);
    }
    // assert requirement
    if (config.dependencyType === 'commonjs') {
        if (!fileContent.match(/const assert = require\(.+assert.+\)/)) {
            output += "const assert = require('assert');\n";
        }
    }
    else {
        if (!fileContent.match(/import assert from .+assert.+/)) {
            output += "import assert from 'assert';\n";
        }
    }
    return output;
}; }; };
var getTestString = function (testInfo) { return function (indentLevel) {
    var indent = control_1.repeat(control_1.add('\t'))('')(indentLevel);
    return "\n" + indent + "it('works as expected', " + (testInfo.async ? 'async' : '') + " () => {\n" + indent + "    " + testInfo.parameterDeclarations.join('\n\t' + indent) + "\n\n" + indent + "    const actualResult = " + testInfo.functionCall + ";\n" + indent + "    const expectedResult = " + testInfo.actualOutput + ";\n\n" + indent + "    assert.equal(actualResult, expectedResult);\n" + indent + "});";
}; };
exports.mochaGenerator = function (config) { return function (testInfo) { return ({
    getTestString: getTestString(testInfo),
    getTestSurroundingLineNr: shared_1.getTestSurroundingDescribeLineNr(testInfo),
    surroundTest: shared_1.surroundTestWithDescribe(testInfo),
    getDependencyString: getDependencyString(config)(testInfo)
}); }; };
