const {replosOnRes} = require('../helpers');
const {replos} = require("../helpers");

const testFileJS = 'testFile01.js';
const testFileTs = 'testFile02.ts';

describe('find', () => {
    beforeEach(() => {
        return replos('repl .clear');
    });

    describe('ts', () => {
        test('variable declaration TS', async () => {
            await replosOnRes('find VariableDeclaration', testFileTs, 12, 15);

            expect(await replos('repl "inc(6)"'))
                .toBe("7");
        });
    });

    describe('js', () => {
        test('simple function call', async () => {
            await replosOnRes('find Function', testFileJS, 8, 2);

            expect(await replos('repl "getHelloMessage()"'))
                .toBe("'Hello'");
        });


        test('simple variable declaration', async () => {
            await replosOnRes('find VariableDeclaration', testFileJS, 4, 8);

            expect(await replos('repl abc'))
                .toBe("'abc'");
        });

        test('export simple variable declaration', async () => {
            await replosOnRes('find VariableDeclaration', testFileJS, 13, 16);

            expect(await replos('repl def'))
                .toBe("'def'");
        });
    });
});
