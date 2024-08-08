import { error, Result, value } from 'defekt';

import { UuidInvalid } from './UuidInvalid.js';
import { isUuidValid } from './uuid.js';
import { uuidToNumber } from './uuidToNumber.js';

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

export {
    hashUuidToBucket,
};
