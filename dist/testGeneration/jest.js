"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var control_1 = require("../utils/control");
var getTestString = function (testInfo) { return function (indentLevel) {
    var indent = control_1.repeat(control_1.add('\t'))('')(indentLevel);
    return "\n" + indent + "test('works as expected', " + (testInfo.async ? 'async' : '') + " () => {\n" + indent + "    " + testInfo.parameterDeclarations.join('\n\t' + indent) + "\n\n" + indent + "    const actualResult = " + testInfo.functionCall + ";\n" + indent + "    const expectedResult = " + testInfo.actualOutput + ";\n\n" + indent + "    expect(actualResult).toEqual(expectedResult);\n" + indent + "});";
}; };
var getDependencyString = function (config) { return function (testInfo) { return function (fileContent) {
    if (!shared_1.sutDependencyCheck(config)(testInfo)(fileContent)) {
        return shared_1.getSutDependencyString(config)(testInfo);
    }
    return '';
}; }; };
exports.jestGenerator = function (config) { return function (testInfo) { return ({
    getTestString: getTestString(testInfo),
    getTestSurroundingLineNr: shared_1.getTestSurroundingDescribeLineNr(testInfo),
    surroundTest: shared_1.surroundTestWithDescribe(testInfo),
    getDependencyString: getDependencyString(config)(testInfo)
}); }; };
