#!/usr/bin/env node

const {main} = require('../src/client');

main(process.argv.slice(2).join(' '));
