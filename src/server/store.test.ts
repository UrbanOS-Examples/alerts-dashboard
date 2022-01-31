import {
    getValuesStoredInList,
    getStoredValue,
    storeValue,
    storeValueInList,
} from './store';
import * as redisMock from 'redis-mock';
import SpyInstance = jest.SpyInstance;

describe('Store', () => {
    let fakeConsole: SpyInstance;

    beforeEach(() => {
        fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        fakeConsole.mockRestore();
    });

    it('can retrieve', async () => {
        const redisClient = redisMock.createClient();
        redisClient.set('test', 'success');
        const value = await getStoredValue('test');
        expect(value).toBe('success');
    });

    it('can store value', async () => {
        const key = 'make';
        const value = 'work';
        const success = await storeValue(key, value);
        expect(success).toBe(true);
        const storedValue = await getStoredValue(key);
        expect(storedValue).toBe(value);
    });

    it('returns false if cannot store value', async () => {
        const key: string = null;
        const value = 'work';
        const success = await storeValue(key, value);
        expect(success).toBe(false);
    });

    it('can store values in list', async () => {
        const key = 'fruit';
        const firstValue = 'pomegranate';
        const secondValue = 'avocado';

        let success = await storeValueInList(key, firstValue);
        expect(success).toBe(true);
        success = await storeValueInList(key, secondValue);
        expect(success).toBe(true);

        const valuesInList = await getValuesStoredInList(key);
        expect(valuesInList.length).toBe(2);
        expect(valuesInList).toContain(firstValue);
        expect(valuesInList).toContain(secondValue);
    });

    it('returns false if cannot store values in list', async () => {
        const key = 'pet';
        const firstValue = 'Hazel';
        const secondValue = 'Meloy';

        await storeValue(key, firstValue);

        const success = await storeValueInList(key, secondValue);
        expect(success).toBe(false);
    });
});
