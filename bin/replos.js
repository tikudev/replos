#!/usr/bin/env node

const {main} = require('../dist/client');

main(process.argv.slice(2).join(' '));
