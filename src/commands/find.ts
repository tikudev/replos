import * as fs from "fs";
import {Node} from "@babel/traverse";
import {FunctionExpression} from "@babel/types";
import {words} from "../utils/string";
import {parseFileLocation} from "../helpers/parse";
import {applyStandardCodeTransformations, astToCode, findNearestNode} from "../helpers/code";
import {pA} from "../utils/control";
import {getPromptingConnection, sendCodeToRepl} from "../helpers/replIO";
import {DEFAULT_PORT} from "../constants";

const parseNodeType = (args: string[]): INodeType => {
    return {
        nodeType: args[1]
    };
};

const getDeclaredVariablesMessage = node => (replResponse: string) => {
    if (replResponse !== 'undefined') {
        return replResponse;
    }

    const variableNames = node.declarations.reduce((acc, dec) => {
        let declarationIdentifier = dec.id;
        let variableName = declarationIdentifier.name;

        if (variableName) {
            return [...acc, variableName]
        }
        if (declarationIdentifier.type === 'ObjectPattern') {
            return [...acc, declarationIdentifier.properties.map(prop => prop.value.name)];
        }
        return acc;
    }, []);

    return `declared: ${variableNames}`;
};

const prettifyResponse = (node: Node) => (replResponse: string) => {
    if (node.type.match(/Function/)) {
        return `read in function: ${(<FunctionExpression>node).id ? (<FunctionExpression>node).id.name : 'anonymous'}`
    } else if (node.type.match(/VariableDeclaration/)) {
        return getDeclaredVariablesMessage(node)(replResponse);
    } else {
        return replResponse;
    }
};

export const find = config => async (argString: string) => {
    const args = words(argString);
    const nearbyCommandArgs = {...parseNodeType(args), ...parseFileLocation(args)(2)};
    const {file, nodeType} = nearbyCommandArgs;

    const code = fs.readFileSync(file).toString();

    const node = await findNearestNode(nodeType)(nearbyCommandArgs)(code);
    const repl = await getPromptingConnection(config.port || DEFAULT_PORT);
    const replResponse = await pA(
        astToCode,
        applyStandardCodeTransformations,
        sendCodeToRepl(repl)
    )(node);
    repl.end();

    console.log(prettifyResponse(node)(replResponse));
};
