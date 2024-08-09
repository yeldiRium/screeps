import { defekt, error, Result, value } from 'defekt';

const regExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/u;
const pattern = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const symbols = '012345678abcdef'.split('');

class UuidInvalid extends defekt({ code: 'UuidInvalid' }) {}
type Uuid = string;

const uuid = (): Uuid => {
    return pattern.replace(/x/gu, () => {
        return symbols[Math.floor(Math.random() * symbols.length)];
    });
}

const isUuidValid = (uuid: string): uuid is Uuid => {
    return regExp.test(uuid);
};

const uuidToNumber = (uuid: string): Result<number, UuidInvalid> => {
    if (!isUuidValid(uuid)) {
        return error(new UuidInvalid());
    }

    const lastUuidSegment = uuid.slice(-12);
    const number = parseInt(lastUuidSegment, 16);

    return value(number);
};

const hashUuidToBucket = (uuid: string, buckets: number): Result<number, UuidInvalid> => {
    if (buckets === 0) {
        return value(0);
    }

    const numberResult = uuidToNumber(uuid);
    if (numberResult.hasError()) {
        return numberResult;
    }

    const number = numberResult.value;
    const hashBucket = number % buckets;

    return value(hashBucket);
};

export type {
    Uuid,
};
export {
    UuidInvalid,

    regExp,
    uuid,
    isUuidValid,
    uuidToNumber,
    hashUuidToBucket,
};
