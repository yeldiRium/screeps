import { error, Result, value } from 'defekt';
import { UuidInvalid } from './UuidInvalid';
import { isUuidValid } from './uuid';

const uuidToNumber = (uuid: string): Result<number, UuidInvalid> => {
    if (!isUuidValid(uuid)) {
        return error(new UuidInvalid());
    }

    const lastUuidSegment = uuid.slice(-12);
    const number = parseInt(lastUuidSegment, 16);

    return value(number);
};

export {
    uuidToNumber
};
