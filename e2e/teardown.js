const {TEST_PORT} = require("./constants");
const {execute} = require("./helpers");

module.exports = () => {
    return execute(`replos repl -p ${TEST_PORT} .exit`);
};
