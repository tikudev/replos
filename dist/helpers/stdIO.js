"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
exports.ask = function (question) {
    return new Promise(function (resolve, reject) {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, function (answer) {
            rl.close();
            rl.removeAllListeners();
            return resolve(answer);
        });
        rl.on('SIGINT', function () {
            rl.close();
            rl.removeAllListeners();
            return reject('User interrupted input');
        });
    });
};
