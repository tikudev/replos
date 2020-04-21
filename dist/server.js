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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(require("net"));
var repl_1 = __importDefault(require("repl"));
var replIO_1 = require("./helpers/replIO");
var constants_1 = require("./constants");
var serverListen = function (server) {
    return new Promise(function (resolve) {
        server.listen(0, function () { return resolve(server.address().port); });
    });
};
var startReplosServers = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var server, proxyServer, currentConnections, state, replPort, customPortArgs, customPort;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server = net.createServer();
                proxyServer = net.createServer();
                currentConnections = [];
                state = [];
                server.maxConnections = 1;
                server.on('connection', function (client) {
                    var replServer = repl_1.default.start({
                        prompt: constants_1.PROMPT,
                        input: client,
                        output: client,
                        useGlobal: false,
                    });
                    replServer.on('exit', function () {
                        console.info('repl received .exit command');
                        proxyServer.close();
                        server.close();
                        client.destroy();
                        for (var _i = 0, currentConnections_1 = currentConnections; _i < currentConnections_1.length; _i++) {
                            var connection = currentConnections_1[_i];
                            connection.destroy();
                        }
                    });
                });
                return [4 /*yield*/, serverListen(server)];
            case 1:
                replPort = _a.sent();
                customPortArgs = args.match(/-p (\d*)/);
                customPort = customPortArgs ? customPortArgs[1] : undefined;
                proxyServer.listen({ port: customPort || constants_1.DEFAULT_PORT }, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var replSocket, lastReplOutput;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.info("listening on " + (customPort || constants_1.DEFAULT_PORT));
                                return [4 /*yield*/, replIO_1.getPromptingConnection(replPort)];
                            case 1:
                                replSocket = _a.sent();
                                currentConnections.push(replSocket);
                                lastReplOutput = undefined;
                                proxyServer.on('connection', function (client) {
                                    currentConnections.push(client);
                                    client.write(constants_1.PROMPT);
                                    var toReplSocket = function (data) {
                                        // check for state output requext start
                                        var stringData = "" + data;
                                        if (stringData === '**\n') {
                                            client.write(JSON.stringify(state, undefined, 4));
                                            client.write('\n' + constants_1.PROMPT);
                                            return;
                                        }
                                        var regexOut = stringData.match(/^(?:\*(\d+))/);
                                        if (regexOut) {
                                            var selectedState = state[parseInt(regexOut[1])];
                                            if (selectedState) {
                                                client.write(selectedState.output);
                                            }
                                            else {
                                                client.write('State does not exist');
                                            }
                                            client.write('\n' + constants_1.PROMPT);
                                            return;
                                        }
                                        // end
                                        if (lastReplOutput === constants_1.REQUEST_MORE) {
                                            // remove injected code, code was already injected before
                                            data = ("" + data).replace(constants_1.INJECT_MARKER_REGEX, "");
                                        }
                                        state.unshift({ input: ("" + data).replace(constants_1.INJECT_MARKER_REGEX, "").trim() });
                                        replSocket.write(data);
                                    };
                                    client.on("data", toReplSocket);
                                    var toClient = function (data) {
                                        lastReplOutput = "" + data;
                                        state[0].output = lastReplOutput.replace("\n" + constants_1.PROMPT, '');
                                        client.write(data);
                                    };
                                    replSocket.on("data", toClient);
                                    var endClient = function () {
                                        currentConnections.splice(currentConnections.indexOf(client), 1);
                                        currentConnections.splice(currentConnections.indexOf(replSocket), 1);
                                        client.off('data', toReplSocket);
                                        replSocket.off('data', toClient);
                                        client.off('end', endClient);
                                    };
                                    client.on('end', endClient);
                                    client.on('error', function (e) {
                                        console.error(e);
                                    });
                                });
                                proxyServer.on('error', function (e) {
                                    console.error(e);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
module.exports = {
    startReplosServers: startReplosServers
};
