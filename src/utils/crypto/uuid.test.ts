import { isUuidValid, regExp, uuid } from './uuid.js';

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
