import { WebSocketServer } from 'ws';
import waitForExpect from 'wait-for-expect';
import { IncomingHttpHeaders } from 'http';
import INRIXStream from './inrix';
import { REQUEST_INRIX_TOPIC } from './configuration';
import SpyInstance = jest.SpyInstance;
import * as handler from './handler/asyncHandler';
import waitUntil from 'async-wait-until';

describe('INRIX socket', () => {
    const testPort = 1234;
    const testUrl = `ws://localhost:${testPort}`;

    describe('when server unavailable', () => {
        let fakeConsole: SpyInstance;
        let client: INRIXStream;

        beforeEach(() => {
            fakeConsole = jest.spyOn(console, 'log').mockImplementation();
            client = new INRIXStream(testUrl);
        });

        afterEach(() => {
            client.close();
            fakeConsole.mockRestore();
        });

        it('handles connection errors gracefully', async () => {
            client.listen();
            const cannotConnectMessage = 'connect ECONNREFUSED 127.0.0.1:1234';
            await waitForExpect(() => {
                expect(fakeConsole).toHaveBeenCalledWith(cannotConnectMessage);
            });
        });
    });

    describe('when server available', () => {
        let testServer: WebSocketServer;
        let fakeHandler: SpyInstance;
        let fakeConsole: SpyInstance;
        let client: INRIXStream;

        beforeEach(() => {
            fakeConsole = jest.spyOn(console, 'log').mockImplementation();
            fakeHandler = jest
                .spyOn(handler, 'handleMessage')
                .mockImplementation();
            testServer = new WebSocketServer({ port: testPort });
            client = new INRIXStream(testUrl);
        });

        afterEach(async () => {
            client.close();
            testServer.clients.forEach((client) => client.close());
            await waitUntil(() => {
                return testServer.clients.size === 0;
            });
            await new Promise((resolve) => {
                testServer.close(resolve);
            });
            fakeHandler.mockRestore();
            fakeConsole.mockRestore();
        });

        it('listens to the inrix topic', async () => {
            let connectionHeaders: IncomingHttpHeaders;
            let connectionMade = false;
            testServer.on('connection', (ws, req) => {
                connectionMade = true;
                connectionHeaders = req.headers;
            });
            client.listen();
            await waitForExpect(() => {
                expect(connectionMade).toBe(true);
            });
            expect(connectionHeaders).toHaveProperty('user-agent');
            expect(connectionHeaders['user-agent']).toBe('node');
        });

        it('is open after starting to listen', async () => {
            expect(client.isOpen()).toBeFalsy();
            client.listen();
            await waitForExpect(() => {
                expect(client.isOpen()).toBeTruthy();
            });
        });

        it('can close connection', async () => {
            client.listen();
            await waitForExpect(() => {
                expect(client.isOpen()).toBeTruthy();
            });
            client.close();
            await waitForExpect(() => {
                expect(client.isOpen()).toBeFalsy();
            });
        });

        it('requests inrix topic', async () => {
            let parsedMessage = {};
            testServer.on('connection', (socket) => {
                socket.on('message', (data) => {
                    parsedMessage = JSON.parse(data.toString());
                });
            });
            client.listen();
            await waitForExpect(() => {
                expect(parsedMessage).toEqual(REQUEST_INRIX_TOPIC);
            });
        });

        it('handles messages from inrix stream', async () => {
            const message =
                '{"event":"update","payload":{"average":20,"c-Value":100,"code":"0000000","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":2,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
            testServer.on('connection', (socket) => {
                socket.on('message', () => {
                    socket.send(message);
                });
            });
            fakeHandler.mockResolvedValue(true);
            client.listen();
            await waitForExpect(() => {
                const data = Buffer.from(message);
                expect(fakeHandler).toHaveBeenCalledWith(data);
            });
        });

        it('logs when disconnected', async () => {
            client.listen();
            await waitForExpect(() => {
                expect(client.isOpen()).toBeTruthy();
            });
            testServer.clients.forEach((socket) => {
                socket.close();
            });
            await waitForExpect(() => {
                expect(fakeConsole).toHaveBeenCalledWith(
                    'Disconnected from INRIX stream',
                );
            });
        });

        it('reconnects on disconnect', async () => {
            let initialConnect = false;
            testServer.on('connection', (socket) => {
                if (!initialConnect) {
                    initialConnect = true;
                    socket.close();
                }
            });
            client.listen();
            await waitForExpect(() => {
                expect(fakeConsole).toHaveBeenCalledWith(
                    'Disconnected from INRIX stream',
                );
            });
            await waitForExpect(() => {
                expect(testServer.clients.size).toEqual(1);
            });
        });

        it('logs when message could not be handled', async () => {
            const message =
                '{"event":"update","payload":{"average":20,"c-Value":100,"code":"0000000","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":2,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
            testServer.on('connection', (socket) => {
                socket.on('message', () => {
                    socket.send(message);
                });
            });
            const error = 'No Can Do';
            fakeHandler.mockRejectedValue(error);
            client.listen();
            await waitForExpect(() => {
                const log = `Could not handle message ${message} because of error: ${error}`;
                expect(fakeConsole).toHaveBeenCalledWith(log);
            });
        });
    });
});
