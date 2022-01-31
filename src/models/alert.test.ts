import { AlertSeverity, AlertStatus, AlertType, buildAlert } from './alert';
import { Message, Payload } from './message';
import { Segment } from './segment';
import { Intersection } from './intersection';

describe('Alert', () => {
    it('is built from ingestion time and intersection', () => {
        const ingestionDateTime = '2021-10-05T19:46:00.231343Z';
        const segment = new Segment('000-123-234', 'BRONZE ST', 35, -84, '4');
        const intersection = new Intersection(
            'Intersection Name',
            'Camera Name',
        );
        const payload = new Payload(55, segment.code, ingestionDateTime, 5, 62);
        const message = new Message(payload);

        const alert = buildAlert(segment, message, intersection);

        expect(alert.id).not.toBeUndefined();
        expect(alert.type).toEqual(AlertType.CONGESTION);
        expect(alert.severity).toEqual(AlertSeverity.WARN);
        expect(alert.time).toEqual(ingestionDateTime);
        expect(alert.coordinates.latitude).toEqual(segment.lat);
        expect(alert.coordinates.longitude).toEqual(segment.lon);
        expect(alert.location).toEqual(intersection.name);
        expect(alert.status).toEqual(AlertStatus.NEW);
        expect(alert.camera).toEqual(intersection.camera);
    });
});
