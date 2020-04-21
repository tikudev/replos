"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var code_1 = require("../helpers/code");
var fs_1 = __importDefault(require("fs"));
var fileIO_1 = require("../helpers/fileIO");
var replIO_1 = require("../helpers/replIO");
var path = __importStar(require("path"));
var getParametersFromVariableAst = function (ast) {
    var parameterNames = [];
    var currentNode = ast.declarations[0].init;
    while (currentNode.type === "ArrowFunctionExpression") {
        var parameterGroup = [];
        for (var _i = 0, _a = currentNode.params; _i < _a.length; _i++) {
            var parameter = _a[_i];
            parameterGroup.push(parameter.name);
        }
        parameterNames.push(parameterGroup);
        currentNode = currentNode.body;
    }
    return parameterNames;
};
exports.getFunctionInfo = function (codeString) { return function (fileDescription) { return __awaiter(void 0, void 0, void 0, function () {
    var functionAst, checkForVariableContainingArrowFn, e_1, declarationContainsArrowFunction, variableAst;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                checkForVariableContainingArrowFn = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, code_1.findNearestNode('Function')(fileDescription)(codeString)];
            case 2:
                functionAst = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                checkForVariableContainingArrowFn = true;
                return [3 /*break*/, 4];
            case 4:
                checkForVariableContainingArrowFn = checkForVariableContainingArrowFn || functionAst.type === 'ArrowFunctionExpression';
                if (!checkForVariableContainingArrowFn) return [3 /*break*/, 6];
                declarationContainsArrowFunction = function (node) { return (node.declarations[0].init.type === 'ArrowFunctionExpression'); };
                return [4 /*yield*/, code_1.findNearestNodeWithCondition('VariableDeclaration')(declarationContainsArrowFunction)(fileDescription)(codeString)];
            case 5:
                variableAst = _a.sent();
                return [2 /*return*/, {
                        functionName: variableAst.declarations[0].id.name,
                        functionParameterGroups: getParametersFromVariableAst(variableAst),
                        ast: variableAst
                    }];
            case 6: return [2 /*return*/, {
                    functionName: functionAst.id.name,
                    functionParameterGroups: [functionAst.params.map(function (param) { return param.name; })],
                    ast: functionAst
                }];
        }
    });
}); }; };
exports.getTestInfo = function (repl) { return function (fileOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, functionName, functionParameterGroups, ast, functionCall, sutPathRelativeToProjectRoot, parameterDeclarations, _i, functionParameterGroups_1, functionParameterGroup, _b, functionParameterGroup_1, functionParameter, output, actualOutput;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, exports.getFunctionInfo(fs_1.default.readFileSync(fileOptions.file).toString())(fileOptions)];
            case 1:
                _a = _c.sent(), functionName = _a.functionName, functionParameterGroups = _a.functionParameterGroups, ast = _a.ast;
                functionCall = "" + (ast.async ? 'await ' : '') + functionName + functionParameterGroups.map(function (group) { return "(" + group.join(', ') + ")"; }).join('');
                sutPathRelativeToProjectRoot = fileOptions.file.replace(fileIO_1.getProjectRoot(fileOptions.file) + '/', '');
                // register function
                return [4 /*yield*/, replIO_1.sendCodeToRepl(repl)(code_1.applyStandardCodeTransformations(code_1.astToCode(ast)))];
            case 2:
                // register function
                _c.sent();
                parameterDeclarations = [];
                _i = 0, functionParameterGroups_1 = functionParameterGroups;
                _c.label = 3;
            case 3:
                if (!(_i < functionParameterGroups_1.length)) return [3 /*break*/, 10];
                functionParameterGroup = functionParameterGroups_1[_i];
                _b = 0, functionParameterGroup_1 = functionParameterGroup;
                _c.label = 4;
            case 4:
                if (!(_b < functionParameterGroup_1.length)) return [3 /*break*/, 9];
                functionParameter = functionParameterGroup_1[_b];
                return [4 /*yield*/, replIO_1.sendStringifyEvalToRepl(repl)(functionParameter)];
            case 5:
                output = _c.sent();
                if (!output.startsWith('Uncaught ReferenceError')) return [3 /*break*/, 7];
                // send undefined declaration to avoid exception during function call
                return [4 /*yield*/, replIO_1.sendCodeToRepl(repl)("var " + functionParameter + " = undefined;")];
            case 6:
                // send undefined declaration to avoid exception during function call
                _c.sent();
                parameterDeclarations.push("const " + functionParameter + " = undefined;");
                return [3 /*break*/, 8];
            case 7:
                parameterDeclarations.push("const " + functionParameter + " = " + output + ";");
                _c.label = 8;
            case 8:
                _b++;
                return [3 /*break*/, 4];
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10: return [4 /*yield*/, replIO_1.sendStringifyEvalToRepl(repl)(functionCall)];
            case 11:
                actualOutput = _c.sent();
                return [2 /*return*/, {
                        sutPath: fileOptions.file,
                        sutPathRelativeToProjectRoot: sutPathRelativeToProjectRoot,
                        sutFileNameWithExt: path.basename(fileOptions.file),
                        sutFileNameWithoutExt: path.basename(fileOptions.file, path.extname(fileOptions.file)),
                        functionName: functionName,
                        parameterDeclarations: parameterDeclarations,
                        functionCall: functionCall,
                        actualOutput: actualOutput,
                        async: ast.async
                    }];
        }
    });
}); }; };
