const {exec, spawn} = require("child_process");
const path = require("path");
const {TEST_PORT} = require("./constants");

function startProcess(program, args = []) {
    try {

        const process = spawn(program, args);

        const cleanExit = function () {
            process.exit()
        };
        process.on('SIGINT', cleanExit); // catch ctrl-c
        process.on('SIGTERM', cleanExit); // catch kill

        return new Promise(resolve => {
            process.stdout.on('data', (data) => {
                resolve(`${data}`);
            });
        })
    } catch (e) {
        console.error(e);
        throw e;
    }
}

function execute(command) {
    return new Promise(((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    }))
}

async function replos(args) {
    return (await execute(`replos ${args} -p ${TEST_PORT}`)).trim();
}

function replosOnRes(command, res, line = '', col = '') {
    process.chdir(path.resolve(__dirname, './res'));
    return replos(`${command} ${path.resolve(__dirname, `./res/${res}`)} ${line} ${col}`);
}

module.exports = {
    execute, startProcess, replosOnRes, replos
};
