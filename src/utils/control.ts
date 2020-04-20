export const cond = <Props, Result>(options: {
    if: (props?: Props) => any;
    then: (props?: Props) => Result;
    else: (props?: Props) => Result;
}) => (props: Props) => options.if(props) ? options.then(props) : options.else(props);

export const c = (...fns: Function[]) => start => fns.reduceRight((state, fn) => fn(state), start);

export const p = (...fns: Function[]) => start => fns.reduce((state, fn) => fn(state), start);

export const pA = (...fns) => async (input) => {
    let output = input;
    for (let fn of fns) {
        if (typeof fn == 'function') {
            output = fn(output);
        }
        if (output && output.then && typeof output.then == 'function') {
            output = await output;
        }
    }
    return output;
};

export const identityPromise = a => Promise.resolve(a);

export const at = object => key => object[key];

export const withRecoveryAsync = fn => recoveryFn => async input => {
    let output;
    try {
        output = await fn(input);
    } catch (_) {
        output = await recoveryFn(input)
    }

    return output;
};

export const add = a => b => a + b;

export const repeat = (fn: Function) => input => (n: number) => {
    let output = input;
    for (let i = 0; i < n; i++) {
        output = fn(output);
    }
    return output;
};


