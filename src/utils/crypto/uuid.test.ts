import { uuid } from './uuid.js';

const uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gu

describe('uuid', (): void => {
    test('generates a valid uuid', async (): Promise<void> => {
        const generatedUuid = uuid();

        expect(generatedUuid).toMatch(uuidRegExp);
    });
});