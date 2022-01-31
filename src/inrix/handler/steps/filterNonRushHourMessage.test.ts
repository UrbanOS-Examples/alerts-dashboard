import { filterNonRushHourMessage } from './filterNonRushHourMessage';
import { nonRushHourMessage } from '../rejectionReasons';
import { Message, Payload } from '../../../models/message';

describe('Filtering by Non Rush Hour Message', () => {
    function buildMessageForTime(time: string) {
        const payload = new Payload(0, 'code', time, 0, 0);
        return new Message(payload);
    }

    it('rejects if before 7 am eastern', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const justBefore7AM = '2021-12-01T11:59:59.999999Z';
        const message = buildMessageForTime(justBefore7AM);
        filterFunction(message)
            .catch((error) => {
                expect(error).toContain(nonRushHourMessage);
            })
            .then(done);
    });

    it('rejects if 10 am eastern', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const justAfter10AM = '2021-12-01T15:00:00.000000Z';
        const message = buildMessageForTime(justAfter10AM);
        filterFunction(message)
            .catch((error) => {
                expect(error).toContain(nonRushHourMessage);
            })
            .then(done);
    });

    it('allows message at 7 am', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const eastern7AM = '2021-12-01T12:00:00.000000Z';
        const message = buildMessageForTime(eastern7AM);
        filterFunction(message)
            .then((filteredMessage) => {
                expect(filteredMessage).toEqual(message);
            })
            .then(done);
    });

    it('allows message before 10 am', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const justBefore10AM = '2021-12-01T14:59:59.999999Z';
        const message = buildMessageForTime(justBefore10AM);
        filterFunction(message)
            .then((filteredMessage) => {
                expect(filteredMessage).toEqual(message);
            })
            .then(done);
    });

    it('rejects message if before 2 pm', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const justBefore2PM = '2021-12-01T18:59:59.999999Z';
        const message = buildMessageForTime(justBefore2PM);
        filterFunction(message)
            .catch((error) => {
                expect(error).toContain(nonRushHourMessage);
            })
            .then(done);
    });

    it('rejects message if 6 pm', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const eastern6PM = '2021-12-01T23:00:00.000000Z';
        const message = buildMessageForTime(eastern6PM);
        filterFunction(message)
            .catch((error) => {
                expect(error).toContain(nonRushHourMessage);
            })
            .then(done);
    });

    it('allows message at 2 pm', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const eastern2PM = '2021-12-01T19:00:00.000000Z';
        const message = buildMessageForTime(eastern2PM);
        filterFunction(message)
            .then((filteredMessage) => {
                expect(filteredMessage).toEqual(message);
            })
            .then(done);
    });

    it('allows message before 6 pm', (done) => {
        const filterFunction = filterNonRushHourMessage();
        const justBefore6PM = '2021-12-01T22:59:59.999999Z';
        const message = buildMessageForTime(justBefore6PM);
        filterFunction(message)
            .then((filteredMessage) => {
                expect(filteredMessage).toEqual(message);
            })
            .then(done);
    });
});
