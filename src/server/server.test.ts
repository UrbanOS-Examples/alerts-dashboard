import { SOCKET_PORT, start } from './server';
import { STREAMS_URL } from '../inrix/configuration';
import INRIXStream from '../inrix/inrix';
import SpyInstance = jest.SpyInstance;
import * as SocketServer from './socketServer';
import * as Store from './store';
jest.mock('../inrix/inrix');

describe('Server', () => {
    const mockINRIXStream = INRIXStream as jest.MockedClass<typeof INRIXStream>;
    let fakeConsole: SpyInstance;
    let fakeSocketStart: SpyInstance;
    let fakeSocketStop: SpyInstance;
    let fakeRedis: SpyInstance;

    beforeEach(() => {
        fakeConsole = jest.spyOn(console, 'log').mockImplementation();
        fakeSocketStart = jest
            .spyOn(SocketServer, 'startSocketServer')
            .mockImplementation();
        fakeSocketStop = jest
            .spyOn(SocketServer, 'stopSocketServer')
            .mockImplementation();
        fakeRedis = jest.spyOn(Store, 'connectToRedis').mockImplementation();
        start();
    });

    afterEach(() => {
        mockINRIXStream.mockReset();
        fakeSocketStart.mockRestore();
        fakeSocketStop.mockRestore();
        fakeRedis.mockRestore();
        fakeConsole.mockRestore();
    });

    it('listens to INRIX topic on startup', async () => {
        expect(mockINRIXStream).toHaveBeenCalledTimes(1);
        expect(mockINRIXStream).toHaveBeenLastCalledWith(STREAMS_URL);

        const mockInstance = mockINRIXStream.mock.instances[0];
        expect(mockInstance.listen).toHaveBeenCalledTimes(1);
    });

    it('starts socket server at startup', async () => {
        expect(fakeSocketStart).toHaveBeenCalledWith(SOCKET_PORT);
    });

    it('connects to redis', () => {
        expect(fakeRedis).toHaveBeenCalled();
    });
});
