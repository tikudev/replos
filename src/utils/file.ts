import {equals} from "./boolean";
import {cond} from "./control";
import * as path from "path";
import * as fs from "fs";
import {lines} from "./string";
import {inc} from "./number";

export const beforeOrAtInFile = cond<IInnerFileLocation[], boolean>({
    if: locations => equals(locations[0].line)(locations[1].line),
    then: locations => locations[0].column <= locations[1].column,
    else: locations => locations[0].line <= locations[1].line,
});

export const readRange = (from: IInnerFileLocation) => (to: IInnerFileLocation) => (input: string): string => {
    const linesOfInput = lines(input);

    if (from.line === to.line) {
        return linesOfInput[from.line].substr(from.column, to.column);
    }

    let output = linesOfInput[from.line].substr(from.column) + '\n';

    for (let i = inc(from.line); i < to.line; i++) {
        output += linesOfInput[i] + '\n';
    }
    output += linesOfInput[to.line].substr(0, to.column);
    return output;
};

export const ensureExtension = (fileName) => {
    if (!path.extname(fileName)) {

        if (fs.existsSync(`${fileName}.ts`)) {
            return `${fileName}.ts`;
        }

        return `${fileName}.js`;
    }
    return fileName;
};
