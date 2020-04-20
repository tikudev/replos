import * as net from "net";
import repl from "repl";
import {getPromptingConnection} from "./helpers/replIO";
import {DEFAULT_PORT, INJECT_MARKER_REGEX, PROMPT, REQUEST_MORE} from './constants';

const serverListen = (server): Promise<number> => {
    return new Promise(resolve => {
        server.listen(0, () => resolve(server.address().port));
    })
};

const startReplosServers = async (args) => {
    const server = net.createServer();
    const proxyServer = net.createServer();
    const currentConnections = [];
    const state = [];
    server.maxConnections = 1;

    server.on('connection', (client) => {
        const replServer = repl.start({
            prompt: PROMPT,
            input: client,
            output: client,
            useGlobal: false,
        });

        replServer.on('exit', () => {
            console.info('repl received .exit command');
            proxyServer.close();
            server.close();
            client.destroy();

            for (let connection of currentConnections) {
                connection.destroy();
            }
        })
    });

    const replPort = await serverListen(server);


    let customPortArgs = args.match(/-p (\d*)/);
    const customPort = customPortArgs ? customPortArgs[1] : undefined;

    proxyServer.listen({port: customPort || DEFAULT_PORT}, async () => {
        console.info(`listening on ${customPort || DEFAULT_PORT}`);
        const replSocket = await getPromptingConnection(replPort);
        currentConnections.push(replSocket);

        let lastReplOutput = undefined;

        proxyServer.on('connection', (client) => {
            currentConnections.push(client);
            client.write(PROMPT);

            const toReplSocket = (data) => {

                // check for state output requext start
                const stringData = `${data}`;
                if (stringData === '**\n') {
                    client.write(JSON.stringify(state, undefined, 4));
                    client.write('\n' + PROMPT);
                    return;
                }
                const regexOut = stringData.match(/^(?:\*(\d+))/);
                if (regexOut) {
                    const selectedState = state[parseInt(regexOut[1])];
                    if (selectedState) {
                        client.write(selectedState.output);
                    } else {
                        client.write('State does not exist');
                    }
                    client.write('\n' + PROMPT);
                    return;
                }
                // end

                if (lastReplOutput === REQUEST_MORE) {
                    // remove injected code, code was already injected before
                    data = `${data}`.replace(INJECT_MARKER_REGEX, "");
                }
                state.unshift({input: `${data}`.replace(INJECT_MARKER_REGEX, "").trim()});
                replSocket.write(data);
            };

            client.on("data", toReplSocket);

            const toClient = (data) => {
                lastReplOutput = `${data}`;
                state[0].output = lastReplOutput.replace(`\n${PROMPT}`, '');
                client.write(data)
            };
            replSocket.on("data", toClient);

            const endClient = () => {
                currentConnections.splice(currentConnections.indexOf(client), 1);
                currentConnections.splice(currentConnections.indexOf(replSocket), 1);

                client.off('data', toReplSocket);
                replSocket.off('data', toClient);
                client.off('end', endClient);
            };
            client.on('end', endClient);
            client.on('error', e => {
                console.error(e);
            })
        });

        proxyServer.on('error', e => {
            console.error(e);
        })
    });
};

module.exports = {
    startReplosServers
};
