import { UuidInvalid } from './UuidInvalid.js';
import { hashUuidToBucket } from './hashUuidToBucket.js';

describe('hashUuidToBucket', (): void => {
    test('returns an error if the given uuid is invalid', async (): Promise<void> => {
        const uuid = 'foobar';

        const result = hashUuidToBucket(uuid, 5);

        expect(result.hasError()).toBe(true);
        expect(result.unwrapErrorOrThrow()).toBeInstanceOf(UuidInvalid);
    });

    test('returns zero if the number of buckets is zero', async (): Promise<void> => {
        const uuid = 'cfa57e8c-cb4d-4116-a318-53ec74486ddb';
        const buckets = 0;

        const result = hashUuidToBucket(uuid, buckets);

        expect(result.hasValue()).toBe(true);
        expect(result.unwrapOrThrow()).toBe(0);
    });

    test('maps the uuid to one of the buckets', async (): Promise<void> => {
        const uuid = 'cfa57e8c-cb4d-4116-a318-53ec74486ddb';
        const buckets = 7;

        const result = hashUuidToBucket(uuid, buckets);

        expect(result.hasValue()).toBe(true);
        expect(result.unwrapOrThrow()).toBe(2);
    });
});
