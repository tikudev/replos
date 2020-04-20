const {TEST_PORT} = require("./constants");
const {startProcess} = require('./helpers');

/*
replos-server -p 8465
 */
module.exports = () => {
    return startProcess('replos-server', ['-p', TEST_PORT]);
};
