export const insertAt = list => item => (index: number) => {
    return [
        ...list.slice(0, index),
        item,
        ...list.slice(index)
    ]
};
