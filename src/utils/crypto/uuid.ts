const regExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/u;
const pattern = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const symbols = '012345678abcdef'.split('');

type Uuid = string;

const uuid = (): Uuid => {
    return pattern.replace(/x/gu, () => {
        return symbols[Math.floor(Math.random() * symbols.length)];
    });
}

const isUuidValid = (uuid: string): uuid is Uuid => {
    return regExp.test(uuid);
};

export {
    isUuidValid,
    regExp,
    uuid
};
