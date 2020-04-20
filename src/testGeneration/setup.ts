import {
    applyStandardCodeTransformations,
    astToCode,
    findNearestNode,
    findNearestNodeWithCondition,
} from "../helpers/code";
import fs from 'fs';
import {getProjectRoot} from "../helpers/fileIO";
import {sendCodeToRepl, sendStringifyEvalToRepl} from "../helpers/replIO";
import * as path from "path";
import * as net from "net";
import {ArrowFunctionExpression, VariableDeclaration} from "@babel/types";

const getParametersFromVariableAst = ast => {
    const parameterNames = [];
    let currentNode = ast.declarations[0].init;

    while (currentNode.type === "ArrowFunctionExpression") {
        const parameterGroup = [];
        for (let parameter of currentNode.params) {
            parameterGroup.push(parameter.name);
        }
        parameterNames.push(parameterGroup);
        currentNode = currentNode.body;
    }
    return parameterNames;
};

export const getFunctionInfo = (codeString: string) => async (fileDescription: IFileDescription) => {
    let functionAst;
    let checkForVariableContainingArrowFn = false;
    try {
        functionAst = <any>await findNearestNode('Function')(fileDescription)(codeString);
    } catch (e) {
        checkForVariableContainingArrowFn = true;
    }
    checkForVariableContainingArrowFn = checkForVariableContainingArrowFn || functionAst.type === 'ArrowFunctionExpression';

    if (checkForVariableContainingArrowFn) {
        const declarationContainsArrowFunction = node => (node.declarations[0].init.type === 'ArrowFunctionExpression');
        const variableAst = <any>await findNearestNodeWithCondition('VariableDeclaration')(declarationContainsArrowFunction)(fileDescription)(codeString);
        return {
            functionName: variableAst.declarations[0].id.name,
            functionParameterGroups: getParametersFromVariableAst(variableAst),
            ast: variableAst
        }
    } else {
        return {
            functionName: functionAst.id.name,
            functionParameterGroups: [functionAst.params.map(param => param.name)],
            ast: functionAst
        }
    }
};

export const getTestInfo = (repl: net.Socket) => async (fileOptions: IFileDescription) => {
    const {functionName, functionParameterGroups, ast} = await getFunctionInfo(fs.readFileSync(fileOptions.file).toString())(fileOptions);
    const functionCall = `${ast.async ? 'await ' : ''}${functionName}${functionParameterGroups.map(group => `(${group.join(', ')})`).join('')}`;
    const sutPathRelativeToProjectRoot = fileOptions.file.replace(getProjectRoot(fileOptions.file) + '/', '');

    // register function
    await sendCodeToRepl(repl)(applyStandardCodeTransformations(astToCode(ast)));

    // register parameter variables
    const parameterDeclarations = [];

    for (let functionParameterGroup of functionParameterGroups) {
        for (let functionParameter of functionParameterGroup) {
            const output = await sendStringifyEvalToRepl(repl)(functionParameter)

            if (output.startsWith('Uncaught ReferenceError')) {
                // send undefined declaration to avoid exception during function call
                await sendCodeToRepl(repl)(`var ${functionParameter} = undefined;`);
                parameterDeclarations.push(`const ${functionParameter} = undefined;`);
            } else {
                parameterDeclarations.push(`const ${functionParameter} = ${output};`);
            }
        }
    }

    const actualOutput = await sendStringifyEvalToRepl(repl)(functionCall);

    return {
        sutPath: fileOptions.file,
        sutPathRelativeToProjectRoot,
        sutFileNameWithExt: path.basename(fileOptions.file),
        sutFileNameWithoutExt: path.basename(fileOptions.file, path.extname(fileOptions.file)),
        functionName,
        parameterDeclarations,
        functionCall,
        actualOutput,
        async: ast.async
    };
};
