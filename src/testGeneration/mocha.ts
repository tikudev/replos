import {
    getSutDependencyString,
    getTestSurroundingDescribeLineNr,
    surroundTestWithDescribe,
    sutDependencyCheck
} from "./shared";
import {add, repeat} from "../utils/control";

const getDependencyString = config => testInfo => fileContent => {
    let output = '';
    if (!sutDependencyCheck(config)(testInfo)(fileContent)) {
        output += getSutDependencyString(config)(testInfo);
    }
    // assert requirement
    if (config.dependencyType === 'commonjs') {
        if (!fileContent.match(/const assert = require\(.+assert.+\)/)) {
            output += `const assert = require('assert');\n`;
        }
    } else {
        if (!fileContent.match(/import assert from .+assert.+/)) {
            output += `import assert from 'assert';\n`;
        }
    }

    return output;
};


const getTestString = (testInfo) => (indentLevel) => {
    const indent = repeat(add('\t'))('')(indentLevel);

    return `\n${indent}it('works as expected', ${testInfo.async ? 'async' : ''} () => {
${indent}    ${testInfo.parameterDeclarations.join('\n\t' + indent)}

${indent}    const actualResult = ${testInfo.functionCall};
${indent}    const expectedResult = ${testInfo.actualOutput};

${indent}    assert.equal(actualResult, expectedResult);
${indent}});`;
};


export const mochaGenerator = config => testInfo => ({
    getTestString: getTestString(testInfo),

    getTestSurroundingLineNr: getTestSurroundingDescribeLineNr(testInfo),

    surroundTest: surroundTestWithDescribe(testInfo),

    getDependencyString: getDependencyString(config)(testInfo)
});
