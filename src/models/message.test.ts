import { parseMessage } from './message';

describe('INRIX Message', () => {
    const exampleMessage =
        '{"event":"update","payload":{"average":20,"c-Value":100,"code":"0000000","ingestion":"2021-10-05T19:46:00.231343Z","reference":22,"score":30,"speed":18,"speedBucket":2,"travelTimeMinutes":2.31,"type":"TMC"},"ref":null,"topic":"streaming:inrix__inrix_traffic_speed_data"}';

    it('returns empty object when undefined', () => {
        const inrixMessage = parseMessage(undefined);
        expect(inrixMessage).toBeUndefined();
    });

    it('returns empty object when null', () => {
        const inrixMessage = parseMessage(null);
        expect(inrixMessage).toBeUndefined();
    });

    it('returns empty object when blank string', () => {
        const inrixMessage = parseMessage('   ');
        expect(inrixMessage).toBeUndefined();
    });

    it('returns domain object when message is valid', () => {
        const inrixMessage = parseMessage(exampleMessage);
        expect(inrixMessage.payload.code).toEqual('0000000');
        expect(inrixMessage.payload.speed).toEqual(18);
        const ingestedDateTime = '2021-10-05T19:46:00.231343Z';
        expect(inrixMessage.payload.ingestion).toEqual(ingestedDateTime);
        expect(inrixMessage.payload.average).toEqual(20);
    });
});
