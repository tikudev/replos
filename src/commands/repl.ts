import {words} from "../utils/string";
import {sendToPort} from "../helpers/replIO";

export const repl = config => async (argString: string) => {
    const replInput = words(argString).slice(1).join(' ');
    console.log(await sendToPort(config)(replInput));
};
