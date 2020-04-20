import {
    getSutDependencyString,
    getTestSurroundingDescribeLineNr,
    surroundTestWithDescribe,
    sutDependencyCheck
} from "./shared";
import {add, repeat} from "../utils/control";

const getTestString = (testInfo) => (indentLevel) => {
    const indent = repeat(add('\t'))('')(indentLevel);

    return `\n${indent}test('works as expected', ${testInfo.async ? 'async' : ''} () => {
${indent}    ${testInfo.parameterDeclarations.join('\n\t' + indent)}

${indent}    const actualResult = ${testInfo.functionCall};
${indent}    const expectedResult = ${testInfo.actualOutput};

${indent}    expect(actualResult).toEqual(expectedResult);
${indent}});`;
};

const getDependencyString = config => testInfo => fileContent => {
    if (!sutDependencyCheck(config)(testInfo)(fileContent)) {
        return getSutDependencyString(config)(testInfo);
    }

    return '';
};

export const jestGenerator = config => testInfo => ({
    getTestString: getTestString(testInfo),

    getTestSurroundingLineNr: getTestSurroundingDescribeLineNr(testInfo),

    surroundTest: surroundTestWithDescribe(testInfo),

    getDependencyString: getDependencyString(config)(testInfo)
});
