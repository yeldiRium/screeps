import { error, Result, value } from 'defekt';
import { UuidInvalid } from './UuidInvalid';
import { isUuidValid } from './uuid';

const uuidToNumber = (uuid: string): Result<number, UuidInvalid> => {
    if (!isUuidValid(uuid)) {
        return error(new UuidInvalid());
    }

    const uuidWithoutDashes = uuid.replace(/-/gu, '');
    const number = parseInt(uuidWithoutDashes, 16);

    return value(number);
};

export {
    uuidToNumber
};
