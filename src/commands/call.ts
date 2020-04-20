import {parseFileLocation} from "../helpers/parse";
import {words} from "../utils/string";
import {getFunctionInfo} from "../testGeneration/setup";
import fs from "fs";
import {getPromptingConnection, sendCodeToRepl, sendStringifyEvalToRepl} from "../helpers/replIO";
import {applyStandardCodeTransformations, astToCode} from "../helpers/code";
import {DEFAULT_PORT} from "../constants";

export const call = config => async (argString: string) => {
    const fileLocation = parseFileLocation(words(argString))(1);
    const {functionName, functionParameterGroups, ast} = await getFunctionInfo(fs.readFileSync(fileLocation.file).toString())(fileLocation);
    const functionCall = `${ast.async ? 'await ' : ''}${functionName}${functionParameterGroups.map(group => `(${group.join(', ')})`).join('')}`;
    const repl = await getPromptingConnection(config.port || DEFAULT_PORT);

    // register function
    await sendCodeToRepl(repl)(applyStandardCodeTransformations(astToCode(ast)));

    console.log(await sendStringifyEvalToRepl(repl)(functionCall));

    repl.end();
};
