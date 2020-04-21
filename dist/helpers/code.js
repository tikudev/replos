"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pluginTransformTypescript = __importStar(require("@babel/plugin-transform-typescript"));
var transformModulesCommonJsBabelSimplePlugin = __importStar(require("babel-plugin-transform-es2015-modules-commonjs-simple"));
var core_1 = require("@babel/core");
var sourceMap = __importStar(require("source-map"));
var control_1 = require("../utils/control");
var string_1 = require("../utils/string");
var parser_1 = require("@babel/parser");
var traverse_1 = __importDefault(require("@babel/traverse"));
var generator_1 = __importDefault(require("@babel/generator"));
var file_1 = require("../utils/file");
var constants_1 = require("../constants");
var fs = __importStar(require("fs"));
var fs_1 = require("fs");
var ast_1 = require("./ast");
var path = __importStar(require("path"));
var fileIO_1 = require("./fileIO");
var typescriptTransform = function (code) { return core_1.transformSync(code, {
    plugins: [[pluginTransformTypescript]],
    sourceMaps: true
}); };
exports.transformWhenTypescript = control_1.cond({
    if: function (_a) {
        var location = _a.location;
        return string_1.hasExtName('.ts')(location.file);
    },
    then: function (_a) {
        var code = _a.code, location = _a.location;
        return __awaiter(void 0, void 0, void 0, function () {
            var babelResult, consumer, _b, line, column;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        babelResult = typescriptTransform(code);
                        return [4 /*yield*/, new sourceMap.SourceMapConsumer(babelResult.map)];
                    case 1:
                        consumer = _c.sent();
                        _b = consumer.generatedPositionFor({
                            source: 'unknown',
                            line: location.line,
                            column: location.column
                        }), line = _b.line, column = _b.column;
                        consumer.destroy();
                        return [2 /*return*/, {
                                code: babelResult.code,
                                location: __assign(__assign({}, location), { line: line,
                                    column: column })
                            }];
                }
            });
        });
    },
    else: control_1.identityPromise
});
var codeToAst = function (code) {
    return parser_1.parse(code, { allowImportExportEverywhere: true });
};
exports.astToCode = function (ast) { return generator_1.default(ast, { comments: false }).code; };
var modulesToCommonJs = function (code) { return core_1.transformSync(code, {
    plugins: [[transformModulesCommonJsBabelSimplePlugin, {
                noMangle: true,
                strictMode: false
            }]], comments: false
}).code; };
exports.findNearestNode = function (type) { return function (location) { return function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, transformedCode, transformedLocation, ast, node;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, exports.transformWhenTypescript({ location: location, code: code })];
            case 1:
                _a = _b.sent(), transformedCode = _a.code, transformedLocation = _a.location;
                ast = codeToAst(transformedCode);
                node = ast_1.findNodeAtAstLocation(type)(ast)(transformedLocation);
                if (node) {
                    return [2 /*return*/, node];
                }
                else {
                    throw new Error("No " + type.toString().replace(/[^\w]/gi, '') + " at line " + location.line + " col " + location.column);
                }
                return [2 /*return*/];
        }
    });
}); }; }; };
exports.findNearestNodeWithCondition = function (type) { return function (predicate) { return function (location) { return function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, transformedCode, transformedLocation, ast, nodePaths, foundNode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, exports.transformWhenTypescript({ location: location, code: code })];
            case 1:
                _a = _b.sent(), transformedCode = _a.code, transformedLocation = _a.location;
                ast = codeToAst(transformedCode);
                nodePaths = ast_1.findPathToAstLocation(type)(ast)(transformedLocation);
                foundNode = nodePaths.find(function (node) { return node.type === type && predicate(node); });
                if (foundNode) {
                    return [2 /*return*/, foundNode];
                }
                else {
                    throw new Error("No " + type.replace(/[^\w]/gi, '') + " at line " + location.line + " col " + location.column);
                }
                return [2 /*return*/];
        }
    });
}); }; }; }; };
exports.injectReplosCode = function (code) { return constants_1.INJECT_MARKER_START + "process.chdir('" + process.cwd() + "');try{exports}catch(e){exports = {};};" + constants_1.INJECT_MARKER_END + code; };
exports.removeAllLineBreaks = function (code) { return code.replace(/(\r\n|\n|\r)/gm, ""); };
exports.transformLetConstClass = function (code) { return code.replace(/let/g, 'var')
    .replace(/const/g, 'var')
    .replace(/^class (\w+)/gm, 'var $1 = class $1'); };
exports.applyStandardCodeTransformations = control_1.p(exports.injectReplosCode, exports.removeAllLineBreaks, exports.transformLetConstClass);
var searchReplaceLocalImportLocations = function (newImportLocationValueFn) { return function (code) {
    var typescriptRemovedCode = typescriptTransform(code).code;
    if (!string_1.empty(typescriptRemovedCode)) {
        code = typescriptRemovedCode;
    }
    var ast = codeToAst(code);
    var locationChanges = [];
    traverse_1.default(ast, {
        ImportDeclaration: function (path) {
            var node = path.node;
            var oldLocation = node.source.value;
            if (oldLocation.startsWith('.')) { // is local
                var newLocation = newImportLocationValueFn(oldLocation);
                locationChanges.push({ oldLocation: oldLocation, newLocation: newLocation });
                node.source.value = newLocation;
            }
        }
    });
    return { code: exports.astToCode(ast), locationChanges: locationChanges };
}; };
var getTempName = string_1.insertBeforeExtension('.replostemp');
var writeTransformedFileRecursively = function (source) { return function (target) { return function (cwd) {
    source = path.resolve(cwd, source);
    target = path.resolve(cwd, target);
    var code = fs.readFileSync(file_1.ensureExtension(source), 'utf8');
    var _a = searchReplaceLocalImportLocations(getTempName)(code), locationChanges = _a.locationChanges, transformedCode = _a.code;
    code = modulesToCommonJs(transformedCode);
    fs_1.writeFileSync(target, code);
    try {
        return writeTransformedFileForAllSubfileLocationChanges(locationChanges, string_1.removeAfterLast('/')(source));
    }
    catch (e) {
        fileIO_1.deleteFile(target);
        throw e;
    }
}; }; };
function writeTransformedFileForAllSubfileLocationChanges(locationChanges, cwd) {
    var subFilesLocationChanges = [];
    for (var _i = 0, locationChanges_1 = locationChanges; _i < locationChanges_1.length; _i++) {
        var locationChange = locationChanges_1[_i];
        subFilesLocationChanges = __spreadArrays(subFilesLocationChanges, writeTransformedFileRecursively(locationChange.oldLocation)(locationChange.newLocation)(cwd));
    }
    return __spreadArrays(locationChanges, subFilesLocationChanges);
}
var createFilesForLocationChanges = function (locationChanges) {
    var allLocationChanges = writeTransformedFileForAllSubfileLocationChanges(locationChanges, '');
    return allLocationChanges.map(function (locationChange) { return locationChange.newLocation; });
};
exports.transformImportStatements = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, locationChanges, transformedCode, codeWithCommonJs, tempFiles;
    return __generator(this, function (_b) {
        _a = searchReplaceLocalImportLocations(getTempName)(code), locationChanges = _a.locationChanges, transformedCode = _a.code;
        codeWithCommonJs = modulesToCommonJs(transformedCode);
        tempFiles = createFilesForLocationChanges(locationChanges);
        return [2 /*return*/, { code: codeWithCommonJs, tempFiles: tempFiles }];
    });
}); };
