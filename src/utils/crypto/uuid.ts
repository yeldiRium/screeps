const pattern = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const symbols = '012345678abcdef'.split('');

const uuid = () => {
    return pattern.replace(/x/gu, () => {
        return symbols[Math.floor(Math.random() * symbols.length)];
    });
}

export {
    uuid
};