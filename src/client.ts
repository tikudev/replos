import {words} from "./utils/string";
import {find} from "./commands/find";
import {load} from "./commands/load";
import {repl} from "./commands/repl";
import {declare} from "./commands/declare";
import {test} from "./commands/test";
import {call} from "./commands/call";

const configParameters = {
    '-p': 'port',
    '-c': 'config'
};

const defaultConfig = {
    testFramework: 'jest', // jest, mocha
    dependencyType: 'module', // module, commonjs
    testPlacement: 'adjacent', // adjacent, <filepath>
    testPostFix: '.test'
};

const extractConfigFromArgs = (args: string) => configParameters =>
    words(args).reduce((acc, word, index, argWords) =>
        configParameters[word] ?
            {
                argsWithoutConfig: acc.argsWithoutConfig,
                isParameterValue: true,
                config: {...acc.config, [configParameters[word]]: argWords[index + 1]}
            } :
            {
                argsWithoutConfig: acc.argsWithoutConfig + (acc.isParameterValue ? '' : word + ' '),
                isParameterValue: false,
                config: acc.config
            }, {
        argsWithoutConfig: '',
        config: {},
        isParameterValue: false,
    });

const commandFns = {
    find,
    load,
    repl,
    declare,
    test,
    call
};

export const main = async (args: string) => {
    const {config: withoutDefaults, argsWithoutConfig} = extractConfigFromArgs(args)(configParameters);
    const config = {...withoutDefaults, ...defaultConfig};
    const command = commandFns[words(args)[0]];
    if (!command) {
        throw new Error(`unknown command: ${command}`)
    }
    await command(config)(argsWithoutConfig);
};

/* Rich comment
 var args = 'replos -p 9999 declare /Users/tim/projects/replos/src/client.ts 10 33';
 */
