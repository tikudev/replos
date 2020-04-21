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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../utils/string");
var parse_1 = require("../helpers/parse");
var fileIO_1 = require("../helpers/fileIO");
var jest_1 = require("../testGeneration/jest");
var mocha_1 = require("../testGeneration/mocha");
var shared_1 = require("../testGeneration/shared");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var setup_1 = require("../testGeneration/setup");
var replIO_1 = require("../helpers/replIO");
var constants_1 = require("../constants");
var generators = {
    jest: jest_1.jestGenerator,
    mocha: mocha_1.mochaGenerator,
};
var getGenerator = function (config) { return function (testInfo) {
    return generators[config.testFramework](config)(testInfo);
}; };
var writeToFile = function (config) { return function (generator) { return function (testInfo) {
    var testLocation = shared_1.getTestLocation(config)(testInfo);
    var testFileContent = fs.readFileSync(testLocation).toString();
    testFileContent = generator.getDependencyString(testFileContent) + testFileContent;
    var testSurroundingLineNr = generator.getTestSurroundingLineNr(testFileContent);
    if (!testSurroundingLineNr) {
        //append surrounding to the end
        testFileContent = testFileContent + generator.surroundTest(generator.getTestString(1));
    }
    else {
        testFileContent = string_1.insertAfterLine(testFileContent)(generator.getTestString(1))(testSurroundingLineNr.lineNr);
    }
    fileIO_1.writeFile(testLocation)(testFileContent);
}; }; };
var writeTest = function (config) { return function (testInfo) {
    var testLocation = shared_1.getTestLocation(config)(testInfo);
    var generator = getGenerator(config)(testInfo);
    if (!fs.existsSync(testLocation)) {
        fs.mkdirSync(path.dirname(testLocation), { recursive: true });
        fs.closeSync(fs.openSync(testLocation, 'w'));
        console.info("created " + testLocation);
    }
    writeToFile(config)(generator)(testInfo);
    console.info("modified " + testLocation);
}; };
exports.test = function (config) { return function (argString) { return __awaiter(void 0, void 0, void 0, function () {
    var fileLocation, repl, testInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileLocation = parse_1.parseFileLocation(string_1.words(argString))(1);
                return [4 /*yield*/, replIO_1.getPromptingConnection(config.port || constants_1.DEFAULT_PORT)];
            case 1:
                repl = _a.sent();
                return [4 /*yield*/, setup_1.getTestInfo(repl)(fileLocation)];
            case 2:
                testInfo = _a.sent();
                repl.end();
                writeTest(config)(testInfo);
                return [2 /*return*/];
        }
    });
}); }; };
