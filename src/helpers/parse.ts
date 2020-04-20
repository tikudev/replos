import {getLineAt, readWordAtCharPosition} from "../utils/string";
import {dec} from "../utils/number";

export const parseFileLocation = (args: string[]) => (offset: number) => {
    return {
        file: args[offset],
        line: parseInt(args[offset + 1]),
        column: parseInt(args[offset + 2]),
        toLine: parseInt(args[offset + 3]),
        toColumn: parseInt(args[offset + 4]),
    };
};

export const readWordAtLocation = ({line, column}: IInnerFileLocation) => (code: string) =>
    readWordAtCharPosition(getLineAt(dec(line))(code))("|().:;'\"` {}")(column);
