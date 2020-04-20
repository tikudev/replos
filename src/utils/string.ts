import * as path from "path";
import {equals} from "./boolean";
import {at, c} from "./control";
import {insertAt} from "./list";

export const words = (str: string) => str.split(' ');

export const empty = (str: string) => str === '';

export const lines = (str: string) => str.split('\n');

export const hasExtName = (extName: string) => (file: string) => c(equals(extName))(path.extname(file));

export const getLineAt = (index: number) => (str: string) => at(lines(str))(index);

export const removeAfterLast = (removeAfter: string) => (str: string) => str.substr(0, str.lastIndexOf(removeAfter));

export const insertBeforeExtension = (insertionString) => (file) => {
    const fileExtension = path.extname(file);
    if (fileExtension) {
        file = file.substr(0, file.length - fileExtension.length);
    }
    // assume js if no extension provided
    return `${file}${insertionString}${fileExtension || '.js'}`
};

export const insertAfterLine = input => insertionString => lineNr => {
    return insertAt(input.split('\n'))(insertionString)(lineNr + 1).join('\n');
};

export const readWordAtCharPosition = (str: string) => (delimiter: string) => (position: number) => {
    let currentWord = "";

    for (let i = 0; i < str.length; i++) {
        const currentChar = str[i];
        if (delimiter.includes(currentChar)) {
            if (position <= i) {
                return currentWord;
            }
            currentWord = ""
        } else {
            currentWord = currentWord + currentChar;
        }
    }
    return currentWord;
};

export const findLine = (input: string) => (searchRegex: RegExp) => {
    const lines = input.split('\n');
    let lineNr = 0;

    for (let line of lines) {
        if (line.match(searchRegex)) {
            return {line: line, lineNr}
        }
        lineNr++;
    }
    return undefined;
};




