import {File} from "@babel/types";
import traverse, {Node} from "@babel/traverse";
import {beforeOrAtInFile} from "../utils/file";

export const findNodeAtAstLocation = (type: string) => (ast: File) => (location: IInnerFileLocation) => {
    let foundNode: Node = undefined;
    traverse(ast, {
        enter(path) {
            const node = path.node;
            if (node.type.match(new RegExp(type))) {
                if (beforeOrAtInFile([node.loc.start, location]) && beforeOrAtInFile([location, node.loc.end])) {
                    foundNode = node;
                }
            }
        }
    });
    return foundNode;
};

export const findPathToAstLocation = (type: string) => (ast: File) => (location: IInnerFileLocation) => {
    let foundNodes: Node[] = [];
    let foundNodesBuffer: Node[] = [];
    traverse(ast, {
        enter(path) {
            const node = path.node;
            if (beforeOrAtInFile([node.loc.start, location]) && beforeOrAtInFile([location, node.loc.end])) {
                foundNodesBuffer.unshift(node);
                if (node.type.match(new RegExp(type))) {
                    foundNodes = [...foundNodesBuffer];
                }
            }
        }
    });
    return foundNodes;
};

/* Rich
// */
