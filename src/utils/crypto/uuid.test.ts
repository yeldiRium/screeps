import { UuidInvalid, hashUuidToBucket, isUuidValid, regExp, uuid, uuidToNumber } from './uuid.js';

describe('uuid', (): void => {
    test('generates a valid uuid', async (): Promise<void> => {
        const generatedUuid = uuid();

        expect(generatedUuid).toMatch(regExp);
    });
});

describe('isValidUuid', (): void => {
    test('returns true for a valid uuid', async (): Promise<void> => {
        const uuid = '12345678-1234-1234-1234-123456789012';

        const result = isUuidValid(uuid);

        expect(result).toBe(true);
    });

    test('returns false for an invalid uuid', async (): Promise<void> => {
        const invalidUuid = 'foobar';

        const result = isUuidValid(invalidUuid);

        expect(result).toBe(false);
    });
});

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
