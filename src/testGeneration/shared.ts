import {findLine, insertBeforeExtension} from "../utils/string";
import {getProjectRoot} from "../helpers/fileIO";
import * as path from "path";

export const getTestSurroundingDescribeLineNr = testInfo => fileContent => {
    return findLine(fileContent)(new RegExp(`describe\\('${testInfo.functionName}'`));
};

export const surroundTestWithDescribe = testInfo => testString => {
    return `\ndescribe('${testInfo.functionName}', () => {
   ${testString}
});\n`;
};

const dependencyCheck = config => dependency => fileContent => {
    if (config.dependencyType === 'commonjs') {
        const testRegex = new RegExp(`^const .*${dependency}.*=`, 'gm');
        return fileContent.match(testRegex);
    } else {
        const testRegex = new RegExp(`^import .*${dependency}.*from`, 'gm');
        return fileContent.match(testRegex);
    }
};

export const sutDependencyCheck = config => testInfo => {
    return dependencyCheck(config)(testInfo.functionName);
};

export const getPathToSut = config => testInfo => {
    if (config.testPlacement === 'adjacent') {
        return `./${testInfo.sutFileNameWithoutExt}`;
    } else {
        const relativeTestLocation = config.testPlacement + '/' + testInfo.sutPathRelativeToProjectRoot;
        return relativeTestLocation
            .substr(0, relativeTestLocation.lastIndexOf('/') + 1)
            .replace(/\w*\//g, '../') + testInfo.sutPathRelativeToProjectRoot;
    }
};

export const getSutDependencyString = config => testInfo => {
    if (config.dependencyType === 'commonjs') {
        return `const {${testInfo.functionName}} = require('${getPathToSut(config)(testInfo)}');\n`;
    } else {
        return `import {${testInfo.functionName}} from '${getPathToSut(config)(testInfo)}';\n`
    }
};

export const getTestLocation = config => testInfo => {
    let testLocation;
    if (config.testPlacement === 'adjacent') {
        testLocation = insertBeforeExtension(config.testPostFix)(testInfo.sutPath);
    } else {
        testLocation = path.resolve(getProjectRoot(testInfo.sutPath), config.testPlacement, insertBeforeExtension(config.testPostFix)(testInfo.sutPathRelativeToProjectRoot));
    }
    return testLocation;
};
