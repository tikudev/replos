import * as readline from "readline";

export const ask = (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, answer => {
            rl.close();
            rl.removeAllListeners();

            return resolve(answer);
        });

        rl.on('SIGINT', () => {
            rl.close();
            rl.removeAllListeners();
            return reject('User interrupted input');
        });
    })
};
