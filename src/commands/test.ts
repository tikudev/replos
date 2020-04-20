import {insertAfterLine, words} from "../utils/string";
import {parseFileLocation} from "../helpers/parse";
import {writeFile} from "../helpers/fileIO";
import {jestGenerator} from "../testGeneration/jest";
import {mochaGenerator} from "../testGeneration/mocha";
import {getTestLocation} from "../testGeneration/shared";
import * as fs from "fs";
import * as path from "path";
import {getTestInfo} from "../testGeneration/setup";
import {getPromptingConnection} from "../helpers/replIO";
import {DEFAULT_PORT} from "../constants";

const generators = {
    jest: jestGenerator,
    mocha: mochaGenerator,
};

const getGenerator = config => testInfo => {
    return generators[config.testFramework](config)(testInfo);
};

const writeToFile = config => generator => testInfo => {
    const testLocation = getTestLocation(config)(testInfo);
    let testFileContent = fs.readFileSync(testLocation).toString();

    testFileContent = generator.getDependencyString(testFileContent) + testFileContent;

    const testSurroundingLineNr = generator.getTestSurroundingLineNr(testFileContent);
    if (!testSurroundingLineNr) {
        //append surrounding to the end
        testFileContent = testFileContent + generator.surroundTest(generator.getTestString(1));
    } else {
        testFileContent = insertAfterLine(testFileContent)(generator.getTestString(1))(testSurroundingLineNr.lineNr);
    }
    writeFile(testLocation)(testFileContent);
};

const writeTest = config => testInfo => {
    const testLocation = getTestLocation(config)(testInfo);
    const generator = getGenerator(config)(testInfo);

    if (!fs.existsSync(testLocation)) {
        fs.mkdirSync(path.dirname(testLocation), {recursive: true});
        fs.closeSync(fs.openSync(testLocation, 'w'));
        console.info(`created ${testLocation}`);
    }

    writeToFile(config)(generator)(testInfo);
    console.info(`modified ${testLocation}`);
};


export const test = config => async (argString: string) => {
    const fileLocation = parseFileLocation(words(argString))(1);
    const repl = await getPromptingConnection(config.port || DEFAULT_PORT);
    const testInfo = await getTestInfo(repl)(fileLocation);
    repl.end();

    writeTest(config)(testInfo);
};

