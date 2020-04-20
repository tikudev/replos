import {readRange} from './file';

describe('readRange', () => {

	test('works as expected',  () => {
	    const from = {"line":0,"column":5};
		const to = {"line":0,"column":12};
		const input = "There is only one line of text here.";

	    const actualResult = readRange(from)(to)(input);
	    const expectedResult = " is only one";

	    expect(actualResult).toEqual(expectedResult);
	});

});
