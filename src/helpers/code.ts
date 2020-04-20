import * as pluginTransformTypescript from '@babel/plugin-transform-typescript';
import * as transformModulesCommonJsBabelSimplePlugin from "babel-plugin-transform-es2015-modules-commonjs-simple";
import {transformSync} from "@babel/core";
import * as sourceMap from "source-map";
import {cond, identityPromise, p} from "../utils/control";
import {empty, hasExtName, insertBeforeExtension, removeAfterLast} from "../utils/string";
import {parse} from "@babel/parser";
import traverse, {Node} from "@babel/traverse";
import generate from "@babel/generator";
import {ensureExtension} from "../utils/file";
import {INJECT_MARKER_END, INJECT_MARKER_START} from "../constants";
import * as fs from "fs";
import {writeFileSync} from "fs";
import {findNodeAtAstLocation, findPathToAstLocation} from "./ast";
import * as path from "path";
import {deleteFile} from "./fileIO";

const typescriptTransform = (code: string) => transformSync(code, {
    plugins: [[pluginTransformTypescript]],
    sourceMaps: true
});

export const transformWhenTypescript = cond<ICodeLocation, Promise<ICodeLocation>>({
    if: ({location}) => hasExtName('.ts')(location.file),
    then: async ({code, location}) => {
        const babelResult = typescriptTransform(code);
        const consumer = await new sourceMap.SourceMapConsumer(babelResult.map);

        const {line, column} = consumer.generatedPositionFor({
            source: 'unknown',
            line: location.line,
            column: location.column
        });

        consumer.destroy();

        return {
            code: babelResult.code,
            location: {
                ...location,
                line,
                column
            }
        };
    },
    else: identityPromise
});

const codeToAst = (code: string) => {
    return parse(code, {allowImportExportEverywhere: true});
};

export const astToCode = (ast: Node) => generate(ast, {comments: false}).code;

const modulesToCommonJs = (code: string) => transformSync(code, {
    plugins: [[transformModulesCommonJsBabelSimplePlugin, {
        noMangle: true,
        strictMode: false
    }]], comments: false
}).code;


export const findNearestNode = (type: string) => (location: IFileDescription) => async (code: string) => {
    const {code: transformedCode, location: transformedLocation} = await transformWhenTypescript({location, code});
    const ast = codeToAst(transformedCode);
    const node = findNodeAtAstLocation(type)(ast)(transformedLocation);

    if (node) {
        return node;
    } else {
        throw new Error(`No ${type.toString().replace(/[^\w]/gi, '')} at line ${location.line} col ${location.column}`)
    }
};

export const findNearestNodeWithCondition = (type: string) => (predicate: (Node) => boolean) => (location: IFileDescription) => async (code: string) => {
    const {code: transformedCode, location: transformedLocation} = await transformWhenTypescript({location, code});
    const ast = codeToAst(transformedCode);
    const nodePaths = findPathToAstLocation(type)(ast)(transformedLocation);
    let foundNode = nodePaths.find(node => node.type === type && predicate(node));

    if (foundNode) {
        return foundNode;
    } else {
        throw new Error(`No ${type.replace(/[^\w]/gi, '')} at line ${location.line} col ${location.column}`)
    }
};


export const injectReplosCode = (code: string) => `${INJECT_MARKER_START}process.chdir('${process.cwd()}');try{exports}catch(e){exports = {};};${INJECT_MARKER_END}${code}`;

export const removeAllLineBreaks = (code: string) => code.replace(/(\r\n|\n|\r)/gm, "");

export const transformLetConstClass = (code: string) => code.replace(/let/g, 'var')
    .replace(/const/g, 'var')
    .replace(/^class (\w+)/gm, 'var $1 = class $1');

export const applyStandardCodeTransformations = p(injectReplosCode, removeAllLineBreaks, transformLetConstClass);

const searchReplaceLocalImportLocations = newImportLocationValueFn => code => {
    const typescriptRemovedCode = typescriptTransform(code).code;
    if (!empty(typescriptRemovedCode)) {
        code = typescriptRemovedCode
    }

    const ast = codeToAst(code);
    const locationChanges = [];
    traverse(ast, {
        ImportDeclaration(path) {
            const node = path.node;

            const oldLocation = node.source.value;
            if (oldLocation.startsWith('.')) { // is local
                const newLocation = newImportLocationValueFn(oldLocation);

                locationChanges.push({oldLocation, newLocation});
                node.source.value = newLocation;
            }
        }
    });

    return {code: astToCode(ast), locationChanges};
};

const getTempName = insertBeforeExtension('.replostemp');

const writeTransformedFileRecursively = (source: string) => (target) => (cwd) => {
    source = path.resolve(cwd, source);
    target = path.resolve(cwd, target);

    let code = fs.readFileSync(ensureExtension(source), 'utf8');
    const {locationChanges, code: transformedCode} = searchReplaceLocalImportLocations(getTempName)(code);
    code = modulesToCommonJs(transformedCode);
    writeFileSync(target, code);

    try {
        return writeTransformedFileForAllSubfileLocationChanges(locationChanges, removeAfterLast('/')(source));
    } catch (e) {
        deleteFile(target);
        throw e;
    }
};

function writeTransformedFileForAllSubfileLocationChanges(locationChanges, cwd) {
    let subFilesLocationChanges = [];

    for (let locationChange of locationChanges) {

        subFilesLocationChanges = [...subFilesLocationChanges, ...writeTransformedFileRecursively(locationChange.oldLocation)(locationChange.newLocation)(cwd)]
    }
    return [...locationChanges, ...subFilesLocationChanges];
}

const createFilesForLocationChanges = locationChanges => {
    const allLocationChanges = writeTransformedFileForAllSubfileLocationChanges(locationChanges, '');
    return allLocationChanges.map(locationChange => locationChange.newLocation);
};

export const transformImportStatements = async (code: string) => {

    const {locationChanges, code: transformedCode} = searchReplaceLocalImportLocations(getTempName)(code);

    const codeWithCommonJs = modulesToCommonJs(transformedCode);
    const tempFiles = createFilesForLocationChanges(locationChanges);

    return {code: codeWithCommonJs, tempFiles: tempFiles};
};
