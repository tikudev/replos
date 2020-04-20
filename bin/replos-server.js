#!/usr/bin/env node

//Hack to activate --experimental-repl-await
if (process.env.replosChild) {
    const {startReplosServers} = require('../src/server');
    startReplosServers(process.env.replosArgs);
} else {
    const {spawn} = require('child_process');
    const replServer = spawn('node', ['--experimental-repl-await', __filename], {env: {...process.env, replosChild: 1, replosArgs: process.argv.slice(2).join(' ')}});

    const cleanExit = function () {
        replServer.exit()
    };
    replServer.on('SIGINT', cleanExit); // catch ctrl-c
    replServer.on('SIGTERM', cleanExit); // catch kill

    replServer.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
}
