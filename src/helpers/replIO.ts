import * as net from "net";
import {DEFAULT_PORT, PROMPT, REQUEST_MORE} from "../constants";

export const getPromptingConnection = (port: number): Promise<net.Socket> => {
    return new Promise(resolve => {
        const repl = net.createConnection({
            port
        });

        const initListener = () => {
            resolve(repl);
            repl.off('data', initListener);
        };

        repl.on('data', initListener);
    })
};

export const sendCodeToRepl = (repl: net.Socket) => (code: string): Promise<string> => {
    return new Promise<string>(resolve => {
        let dataBuffer = '';
        const dataListener = data => {
            dataBuffer += `${data}`;
            if (dataBuffer.endsWith(PROMPT)) {
                resolve(dataBuffer.substr(0, dataBuffer.length - `\n${PROMPT}`.length));
                repl.off('data', dataListener);
            }
            if (dataBuffer.endsWith(REQUEST_MORE)) {
                resolve(dataBuffer);
                repl.off('data', dataListener);
            }
        };

        repl.on('data', dataListener);
        repl.write(code + '\n');
    });
};

export const sendStringifyEvalToRepl = (repl: net.Socket) => async (code: string): Promise<string> => {
    let output = await sendCodeToRepl(repl)(`JSON.stringify(${code})`);
    try {
        output = eval(output);
    } catch(e) {}
    return output;
};

export const sendToPort = config => async (code: string) => {
    const repl = await getPromptingConnection(config.port || DEFAULT_PORT);
    const output = await sendCodeToRepl(repl)(code);
    repl.end();
    return output;
};
