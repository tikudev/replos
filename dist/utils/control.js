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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cond = function (options) { return function (props) { return options.if(props) ? options.then(props) : options.else(props); }; };
exports.c = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (start) { return fns.reduceRight(function (state, fn) { return fn(state); }, start); };
};
exports.p = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (start) { return fns.reduce(function (state, fn) { return fn(state); }, start); };
};
exports.pA = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (input) { return __awaiter(void 0, void 0, void 0, function () {
        var output, _i, fns_1, fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = input;
                    _i = 0, fns_1 = fns;
                    _a.label = 1;
                case 1:
                    if (!(_i < fns_1.length)) return [3 /*break*/, 4];
                    fn = fns_1[_i];
                    if (typeof fn == 'function') {
                        output = fn(output);
                    }
                    if (!(output && output.then && typeof output.then == 'function')) return [3 /*break*/, 3];
                    return [4 /*yield*/, output];
                case 2:
                    output = _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, output];
            }
        });
    }); };
};
exports.identityPromise = function (a) { return Promise.resolve(a); };
exports.at = function (object) { return function (key) { return object[key]; }; };
exports.withRecoveryAsync = function (fn) { return function (recoveryFn) { return function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var output, _1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 4]);
                return [4 /*yield*/, fn(input)];
            case 1:
                output = _a.sent();
                return [3 /*break*/, 4];
            case 2:
                _1 = _a.sent();
                return [4 /*yield*/, recoveryFn(input)];
            case 3:
                output = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, output];
        }
    });
}); }; }; };
exports.add = function (a) { return function (b) { return a + b; }; };
exports.repeat = function (fn) { return function (input) { return function (n) {
    var output = input;
    for (var i = 0; i < n; i++) {
        output = fn(output);
    }
    return output;
}; }; };
