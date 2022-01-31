import * as SocketServer from '../../server/socketServer';
import SpyInstance = jest.SpyInstance;
import { handleMessage } from './asyncHandler';
import Alert, {
    AlertSeverity,
    AlertStatus,
    AlertType,
    Coordinates,
} from '../../models/alert';
import { getStoredValue, storeValue } from '../../server/store';
import mock from 'mock-fs';
jest.mock('uuid', () => ({
    v4: () => '1234-uuid',
}));

describe('Handler', () => {
    let fakeConsole: SpyInstance;
    let fakePublish: SpyInstance;
    const congestedLocationCode = '1111111';
    const notCongestedLocationCode = '2222222';
    const okMessage =
        '{"event":"phx_reply","payload":{"response":{},"status":"ok"},"ref":"1","topic":"streaming:inrix__inrix_traffic_speed_data"}';
    const exampleCongestedMessage =
        '{"event":"update","payload":{"average":20,"c-Value":100,"code":"1111111","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":2,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
    const exampleNotCongestedMessage =
        '{"event":"update","payload":{"average":20,"c-Value":100,"code":"2222222","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":20,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
    const exampleIrrelevantFclassMessage =
        '{"event":"update","payload":{"average":20,"c-Value":100,"code":"3333333","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":2,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
    beforeEach(() => {
        fakeConsole = jest.spyOn(console, 'log').mockImplementation();
        fakePublish = jest.spyOn(SocketServer, 'publish').mockImplementation();
        const locationFileContents = `[
          {
            "segment": {
              "code": "1111111",
              "fclass": "4",
              "lat": 40.03314777219885,
              "lon": -83.17328033080445,
              "name": "SOMEWHERE"
            },
            "intersection": {
              "name": "SOMEWHERE @ NOWHERE",
              "camera": "camera @ somewhere"
            }
          }]`;
        mock({
            'src/scripts/output/locations.json': locationFileContents,
        });
    });

    afterEach(() => {
        fakeConsole.mockRestore();
        fakePublish.mockRestore();
        mock.restore();
    });

    it('ignores undefined message', (done) => {
        handleMessage(undefined)
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });

    it('ignores null message', (done) => {
        handleMessage(null)
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });

    it('ignores blank message', (done) => {
        handleMessage(Buffer.from('    '))
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });

    it('ignores initial ok message', (done) => {
        handleMessage(Buffer.from(okMessage))
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });

    it('ignores messages for irrelevant functional classes', (done) => {
        handleMessage(Buffer.from(exampleIrrelevantFclassMessage))
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });

    it('saves and publishes alert if traffic congested', (done) => {
        const rawMessage = Buffer.from(exampleCongestedMessage);
        const expectedAlert = new Alert(
            '1234-uuid',
            AlertType.CONGESTION,
            AlertSeverity.WARN,
            '2021-10-05T19:46:00.231343Z',
            new Coordinates(40.03314777219885, -83.17328033080445),
            'SOMEWHERE @ NOWHERE',
            AlertStatus.NEW,
            2,
            20,
            31,
            'camera @ somewhere',
        );
        const alertString = JSON.stringify(expectedAlert);
        handleMessage(rawMessage)
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).toHaveBeenCalledWith(alertString);
            })
            .then(() => getStoredValue(`location-${congestedLocationCode}`))
            .then((storedValue) => {
                expect(storedValue).toEqual(alertString);
            })
            .then(done);
    });

    it('does not save or publish alert if traffic not congested', (done) => {
        const rawMessage = Buffer.from(exampleNotCongestedMessage);
        handleMessage(rawMessage)
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(() => getStoredValue(`location-${notCongestedLocationCode}`))
            .then((storedValue) => {
                expect(storedValue).toBeNull();
            })
            .then(done);
    });

    it('do not send alerts for continuous congestion and update alert time', (done) => {
        const recentAlert = new Alert(
            '1234-uuid',
            AlertType.CONGESTION,
            AlertSeverity.WARN,
            '2021-10-05T19:43:00.231343Z',
            new Coordinates(40.03314777219885, -83.17328033080445),
            'SCIOTO DARBY RD',
            AlertStatus.NEW,
            2,
            20,
            31,
            undefined,
        );
        const alertString = JSON.stringify(recentAlert);
        const newMessage = Buffer.from(exampleCongestedMessage);
        storeValue(`location-${congestedLocationCode}`, alertString)
            .then(() => handleMessage(newMessage))
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(() => getStoredValue(`location-${congestedLocationCode}`))
            .then((storedValue) => {
                const updatedAlert = JSON.parse(storedValue) as Alert;
                const moreRecentTime = '2021-10-05T19:46:00.231343Z';
                expect(updatedAlert.time).toEqual(moreRecentTime);
            })
            .then(done);
    });

    it('send alert if prior alert is too old', (done) => {
        const recentAlert = new Alert(
            '1234-uuid',
            AlertType.CONGESTION,
            AlertSeverity.WARN,
            '2021-10-05T19:43:00.000000Z',
            new Coordinates(40.03314777219885, -83.17328033080445),
            'SCIOTO DARBY RD',
            AlertStatus.NEW,
            2,
            20,
            31,
            undefined,
        );
        const alertString = JSON.stringify(recentAlert);
        const newMessage = Buffer.from(exampleCongestedMessage);
        storeValue(`location-${congestedLocationCode}`, alertString)
            .then(() => handleMessage(newMessage))
            .then((handled) => {
                expect(handled).toBe(true);
                expect(fakePublish).toHaveBeenCalled();
            })
            .then(done);
    });

    it('return error reason', (done) => {
        const data = Buffer.from('{"error":"promise broken!"}');
        handleMessage(data).catch((reason) => {
            expect(reason.toString()).toContain('TypeError');
            done();
        });
    });

    it('does not send alert if intersection too far away', (done) => {
        const intersectionTooFarAway =
            '{"event":"update","payload":{"average":20,"c-Value":100,"code":"1111111","ingestion":"2021-10-05T19:46:00.231343Z","reference":31,"score":30,"speed":2,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';
        const data = Buffer.from(intersectionTooFarAway);
        handleMessage(data)
            .then((value) => {
                expect(value).toEqual(true);
                expect(fakePublish).not.toHaveBeenCalled();
            })
            .then(done);
    });
});
