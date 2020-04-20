interface IInnerFileLocation {
    line: number;
    column: number;
}

interface IInnerFileLocationRangeEnd {
    toLine: number;
    toColumn: number;
}

interface IFileLocation {
    file: string;
}

interface IFileDescription extends IInnerFileLocation, IFileLocation, IInnerFileLocationRangeEnd {
}

interface INodeType {
    nodeType: string;
}

interface ICode {
    code: string;
}

interface ICodeLocation extends ICode {
    location: IFileDescription
}
