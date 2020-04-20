import {parseFileLocation, readWordAtLocation} from "../helpers/parse";
import * as fs from "fs";
import {words} from "../utils/string";
import {ask} from "../helpers/stdIO";
import {getPromptingConnection, sendCodeToRepl} from "../helpers/replIO";
import {DEFAULT_PORT, REQUEST_MORE} from "../constants";

export const declare = config => async (argString: string) => {
    const fileLocation = parseFileLocation(words(argString))(1);
    const code = fs.readFileSync(fileLocation.file).toString();
    const word = readWordAtLocation(fileLocation)(code);
    let userInput = await ask(`Value for ${word}:\n`);

    const repl = await getPromptingConnection(config.port || DEFAULT_PORT);
    let replOut = (await sendCodeToRepl(repl)(`var ${word} = ${userInput}`));

    while (replOut === REQUEST_MORE) {
        userInput = await ask(`${REQUEST_MORE}\n`);
        replOut = await sendCodeToRepl(repl)(`${userInput}`);
    }

    repl.end();

    console.log(`declared: ${word}`);

    process.exit(0); // readline leaves the process open in some environments
};
