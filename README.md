## REPLos the repl on steroids for javascript and typescript

REPLos is a tool that enables developers to keep working in a single context.

Without REPLos, you need to switch context every time you verify your codes correctness.

With REPLos, you write a short unit of functionality and immediately check for mistakes, by evaluating just the code you have written and not leaving your IDE.

Additional benefit: You can use the inputs you provided to generate unit tests.

![](doc/replos.gif)

## Status: Open Alpha

## Installation
#### 1. Install as global npm module
`npm i -g replos`

#### 2. start replos server
`replos-server`

default port is set to `9464` can be changed with `-p <PORT>`
e.g. `replos-server -p 9465`;

#### 3. start using the replos client
`replos repl "1 + 1"` or `replos repl -p <PORT> "1 + 1"`

#### 4. Wire your IDE to replos

For Intellij you can register replos as external tool. 
You can download and import ./ide-integration/intellij/exportedSettings.zip into intellij with File > Import Settings.
This settings-package contains replos commands as external tool and key-bindings to them.

### Commands
`replos <Command> <CommandArgs>`

| Command | Description |
| --- | --- |
| [call](#call) | Calls first named function<sup>1</sup> at location |
| [declare](#declare) | Declares word at location as variable |
| [find](#find) | Finds and evaluates $NodeType$ at location |
| [load](#load) | Loads file, line or word at location |
| [repl](#repl) | Pipes input unprocessed to the repl |
| [test](#test) | Generates test for function at location |

[1] Non-anonymous functions or anonymous functions which are immediately assigned to a variable are considered named functions.

### call 

`replos call $FilePath$ $LineNumber$ $ColumnNumber$`

### declare

`replos declare $FilePath$ $LineNumber$ $ColumnNumber$`

### find

`replos find $NODE$ $FilePath$ $LineNumber$ $ColumnNumber$`

Node is a string that matches against node types of the abstract syntax tree (https://babeljs.io/docs/en/babel-types)

e.g.
```
replos find VariableDeclaration ...
replos find Function ...
replos find Expression ...
```

### load

`replos load ...`

The behavior depends on the amount of arguments provided

`replos load $FilePath$` loads whole file

`replos load $FilePath$ $LineNumber$` load line

`replos load $FilePath$ $LineNumber$ $ColumnNumber` loads word at location

`replos load $FilePath$ $SelectionStartLine$ $SelectionStartColumn$ $SelectionEndLine$ $SelectionEndColumn$` loads everything between

### repl

sends code directly to to the node repl

e.g.:

`replos repl 1 + 1`

`replos repl .clear`

### test

Generates a test about the function at the location.
Can be configured to use jest or mocha and commonjs or modules.

`test $FilePath$ $LineNumber$ $ColumnNumber$`

## Other usages
Netcat to the repl server.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, Tim Kutscha
