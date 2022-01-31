import { saveAlert } from './saveAlert';
import { AlertRecord } from '../../../models/alertRecord';
import Alert, {
    AlertSeverity,
    AlertStatus,
    AlertType,
    Coordinates,
} from '../../../models/alert';
import { getStoredValue } from '../../../server/store';
import SpyInstance = jest.SpyInstance;

describe('Save Alert', () => {
    let silentConsole: SpyInstance;

    beforeAll(() => {
        silentConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterAll(() => {
        silentConsole.mockRestore();
    });

    it('stores alert under alert prefix', (done) => {
        const saveFunction = saveAlert();
        const alert = new Alert(
            '1234',
            AlertType.CONGESTION,
            AlertSeverity.WARN,
            'whenever',
            new Coordinates(0, 0),
            'somewhere',
            AlertStatus.NEW,
            0,
            0,
            0,
            'camera bot',
        );
        const record = new AlertRecord('location-1234', alert);
        saveFunction(record)
            .then(() => getStoredValue(`alert-${alert.id}`))
            .then((storedValue) => {
                const alertString = JSON.stringify(alert);
                expect(storedValue).toEqual(alertString);
            })
            .then(done);
    });
});
