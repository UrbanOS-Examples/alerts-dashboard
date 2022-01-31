import * as redis from 'redis';
import { promisify } from 'util';
import { RedisClient } from 'redis';

let redisClient: RedisClient;

export function connectToRedis(): RedisClient {
    if (redisClient == null) {
        const options = {
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
        };
        redisClient = redis.createClient(options);
        redisClient.on('connect', () => {
            console.log('Connected to redis');
        });
        redisClient.on('error', (error) => {
            console.log(error);
        });
    }
    return redisClient;
}

export async function getStoredKeys(key: string): Promise<string[]> {
    const redisClient = connectToRedis();
    const getAsync = promisify(redisClient.keys).bind(redisClient);
    return await getAsync(key);
}

export async function getStoredValue(key: string): Promise<string> {
    const redisClient = connectToRedis();
    const getAsync = promisify(redisClient.get).bind(redisClient);
    return await getAsync(key);
}

export async function storeValue(key: string, value: string): Promise<boolean> {
    const redisClient = connectToRedis();
    const setAsync = promisify(redisClient.set).bind(redisClient);
    return setAsync(key, value)
        .then(() => {
            return true;
        })
        .catch((error: Error) => {
            console.log(error.message);
            return false;
        });
}

export async function storeValueInList(
    key: string,
    value: string,
): Promise<boolean> {
    const redisClient = connectToRedis();
    const pushAsync = promisify(redisClient.lpush).bind(redisClient);
    return pushAsync(key, value)
        .then(() => {
            return true;
        })
        .catch((error: Error) => {
            console.log(error.message);
            return false;
        });
}

export async function getValuesStoredInList(key: string): Promise<string[]> {
    const redisClient = connectToRedis();
    const rangeAsync = promisify(redisClient.lrange).bind(redisClient);
    return await rangeAsync(key, 0, -1);
}
