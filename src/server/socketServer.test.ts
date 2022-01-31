import { publish, startSocketServer, stopSocketServer } from './socketServer';
import WebSocket, { WebSocketServer } from 'ws';
import waitForExpect from 'wait-for-expect';
import SpyInstance = jest.SpyInstance;

describe('Socket Server', () => {
    const testPort = 1235;
    const testUrl = `ws://localhost:${testPort}`;
    const connectedMessage = '';
    let testClient: WebSocket;
    let fakeConsole: SpyInstance;
    let wsServer: WebSocketServer;

    beforeEach(() => {
        wsServer = startSocketServer(testPort);
        testClient = new WebSocket(testUrl);
        fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        stopSocketServer();
        testClient.close();
        fakeConsole.mockRestore();
    });

    it('connect to socket server', (done) => {
        testClient.on('open', () => {
            done();
        });
    });

    it('stop closes clients', (done) => {
        testClient.on('open', () => {
            stopSocketServer();
        });
        testClient.on('close', (code: number) => {
            const normalClose = 1000;
            expect(code).toEqual(normalClose);
            done();
        });
    });

    it('can publish alerts to client', async (done) => {
        await waitForExpect(() =>
            expect(testClient.readyState).toEqual(WebSocket.OPEN),
        );
        const message = 'Any random string';
        testClient.on('message', (data) => {
            if (data.toString() != connectedMessage) {
                expect(data.toString()).toEqual(message);
                done();
            }
        });
        publish(message);
    });

    it('logs errors', async () => {
        wsServer.on('connection', () => {
            wsServer.emit('error', new Error('kaboom!'));
        });
        await waitForExpect(() => {
            expect(fakeConsole).toHaveBeenCalledWith('kaboom!');
        });
    });
});
