import { AlertSeverity, AlertStatus, AlertType } from '../../../models/alert';
import { Message, Payload } from '../../../models/message';
import { transformMessageToAlert } from './transformMessageToAlert';
import { Segment } from '../../../models/segment';
import { LocatedMessage } from '../../../models/locatedMessage';
import { Intersection } from '../../../models/intersection';

jest.mock('uuid', () => ({
    v4: () => '1234-uuid',
}));

describe('Transform Message to Alert', () => {
    it('returns domain object when message is valid', () => {
        const intersection = new Intersection('Somewhere @ Nowhere', 'Camera1');
        const payload = new Payload(
            20,
            '0000000',
            '2021-10-05T19:46:00.231343Z',
            18,
            22,
        );
        const message = new Message(payload);
        const segment = new Segment('code', 'name', -19, 20, '4');
        const locatedMessage = new LocatedMessage(
            message,
            segment,
            intersection,
        );
        const transformFunction = transformMessageToAlert();
        const alertRecord = transformFunction(locatedMessage);
        expect(alertRecord.key).toEqual('location-0000000');
        expect(alertRecord.alert.id).toEqual('1234-uuid');
        expect(alertRecord.alert.type).toEqual(AlertType.CONGESTION);
        expect(alertRecord.alert.severity).toEqual(AlertSeverity.WARN);
        expect(alertRecord.alert.time).toEqual(message.payload.ingestion);
        expect(alertRecord.alert.coordinates).toEqual({
            latitude: segment.lat,
            longitude: segment.lon,
        });
        expect(alertRecord.alert.location).toEqual(intersection.name);
        expect(alertRecord.alert.status).toEqual(AlertStatus.NEW);
        expect(alertRecord.alert.speed).toEqual(message.payload.speed);
        expect(alertRecord.alert.avgSpeed).toEqual(message.payload.average);
        expect(alertRecord.alert.refSpeed).toEqual(message.payload.reference);
        expect(alertRecord.alert.camera).toEqual(intersection.camera);
    });
});
