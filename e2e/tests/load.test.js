const {replos} = require("../helpers");
const {replosOnRes} = require("../helpers");

const testFileJs = 'testFile01.js';
const testFileTs = 'testFile02.ts';

describe('load', () => {
    beforeEach(() => {
        return replos('repl .clear');
    });

    test('load js file with exports', async () => {
        await replosOnRes('load', testFileJs);
        expect(await replos('repl "inc(2)"')).toBe("3");
    });

    test('load ts file with exports and nested imports', async () => {
        await replosOnRes('load', testFileTs);
        expect(await replos('repl "inc(2)"')).toBe("3");
    });
});
