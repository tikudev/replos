import * as fs from "fs";
import {writeFileSync} from "fs";
import * as path from "path";

export const writeFile = (path: string) => (content: string) => writeFileSync(path, content);

export const deleteFile = (path: string) => {
    fs.unlink(path, () => {
        // fire and forget
    });
};

export const getProjectRoot = (filePath: string) => {
    let currentFilePath = filePath;
    while (currentFilePath !== '') {
        if (fs.existsSync(path.resolve(currentFilePath, './package.json'))) {
            return currentFilePath;
        }
        currentFilePath = currentFilePath.substr(0, currentFilePath.lastIndexOf('/'));
    }
    return undefined;
};
