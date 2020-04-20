import {getLineAt, words} from "../utils/string";
import {parseFileLocation, readWordAtLocation} from "../helpers/parse";
import * as fs from "fs";
import {dec} from "../utils/number";
import {sendToPort} from "../helpers/replIO";
import {applyStandardCodeTransformations, transformImportStatements} from "../helpers/code";
import {deleteFile} from "../helpers/fileIO";
import {readRange} from "../utils/file";

const executeCodeBlock = config => async (fileContent: string): Promise<string> => {
    return new Promise(async resolve => {
        const {code, tempFiles} = await transformImportStatements(fileContent);
        const output = await sendToPort(config)(applyStandardCodeTransformations(code));
        resolve(output);
        tempFiles.forEach(deleteFile);
    })
};

const loadWord = config => (location: IInnerFileLocation) => async (code: string) =>
    console.log(await sendToPort(config)(readWordAtLocation(location)(code)));

const loadLine = config => (location: IFileDescription) => async (fileContent: string) => {
    console.log(await executeCodeBlock(config)(getLineAt(dec(location.line))(fileContent)));
};

const loadFile = config => (location: IFileDescription) => async (fileContent: string) => {
    console.log(`read in ${location.file}\n${await executeCodeBlock(config)(fileContent)}`);
};

const loadRange = config => (location: IFileDescription) => async (fileContent: string) => {
    const codeBlock = readRange({line: dec(location.line), column: dec(location.column)})({line: dec(location.toLine), column: dec(location.toColumn)})(fileContent);
    console.log(await executeCodeBlock(config)(codeBlock));
};

const argLengthToFn = {
    3: loadFile,
    4: loadLine,
    5: loadWord,
    7: loadRange
};

export const load = config => async (argString: string) => {
    const args = words(argString);

    const fileLocation = parseFileLocation(args)(1);

    const code = fs.readFileSync(fileLocation.file).toString();

    const executingFunction = argLengthToFn[args.length];

    if (!executingFunction) {
        throw new Error(`You provided ${args.length - 2} arguments for load\nPlease provide\n1: load file\n2: load line\n3: load word\n5: load range`);
    }

    await executingFunction(config)(fileLocation)(code);
};
