import { UuidInvalid } from './UuidInvalid.js';
import { uuidToNumber } from './uuidToNumber.js';

describe('uuidToNumber', (): void => {
    test('converts a zero-uuid to zero', async (): Promise<void> => {
        const uuid = '00000000-0000-0000-0000-000000000000';

        const numberResult = uuidToNumber(uuid);

        expect(numberResult.hasValue()).toBe(true);
        expect(numberResult.unwrapOrThrow()).toBe(0);
    });

    test('converts a uuid to its corresponding number value', async (): Promise<void> => {
        const uuid = 'cfa57e8c-cb4d-4116-a318-53ec74486ddb';

        const numberResult = uuidToNumber(uuid);

        expect(numberResult.hasValue()).toBe(true)
        expect(numberResult.unwrapOrThrow()).toBe(92275028291035);
    });

    test('returns an error, if the given uuid is invalid', async (): Promise<void> => {
        const uuid = 'cfa57e8c';

        const numberResult = uuidToNumber(uuid);

        expect(numberResult.hasValue()).toBe(false)
        expect(numberResult.unwrapErrorOrThrow()).toBeInstanceOf(UuidInvalid);
    });
});
