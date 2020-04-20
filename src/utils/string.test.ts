import {hasExtName, words} from './string';

describe('words', () => {

    test('works as expected', () => {
        const str = 'aha okay yeah';

        const actualResult = words(str);
        const expectedResult = ['aha', 'okay', 'yeah'];

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('hasExtName', () => {

    test('works as expected', () => {
        const extName = '.js';
        const file = 'filename.ts';

        const actualResult = hasExtName(extName)(file);
        const expectedResult = false;

        expect(actualResult).toEqual(expectedResult);
    });

    test('works as expected', () => {
        const extName = '.ts';
        const file = 'filename.ts';

        const actualResult = hasExtName(extName)(file);
        const expectedResult = true;

        expect(actualResult).toEqual(expectedResult);
    });
});
