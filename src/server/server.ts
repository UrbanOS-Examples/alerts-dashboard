import INRIXStream from '../inrix/inrix';
import { STREAMS_URL } from '../inrix/configuration';
import { startSocketServer, stopSocketServer } from './socketServer';
import { connectToRedis } from './store';

export const SOCKET_PORT = 8080;

let inrixStream: INRIXStream;

export function shutDown(): void {
    inrixStream.close();
    stopSocketServer();
    process.exit(0);
}

export function start(): void {
    connectToRedis();
    inrixStream = new INRIXStream(STREAMS_URL);
    startSocketServer(SOCKET_PORT);
    inrixStream.listen();

    process.on('SIGTERM', () => {
        shutDown();
    });

    process.on('SIGINT', () => {
        shutDown();
    });
}
