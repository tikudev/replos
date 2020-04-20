const {replos} = require("../helpers");

describe('repl', () => {
    test('repl "1 + 2" equals 3', async () => {
        expect(await replos('repl "1 + 2"')).toBe("3");
    });
});
