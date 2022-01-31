import { isCongested } from './calculator';

describe('Calculator', () => {
    describe('finds no congestion', () => {
        it('if no speed', () => {
            const speed: number = undefined;
            const average = 26;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });

        it('if no average', () => {
            const speed = 26;
            const average: number = undefined;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });

        it('if speed is above threshold', () => {
            const speed = 30.00000001;
            const average = 100;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });

        it('if average is 0', () => {
            const speed = 10;
            const average = 0;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });

        it('if both speed and average are 0', () => {
            const speed = 0;
            const average = 0;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });

        it('if reference speed less than 30', () => {
            const speed = 10;
            const average = 50;
            const reference = 25;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(false);
        });
    });

    describe('finds congestion', () => {
        it('if traffic is stopped', () => {
            const speed = 0;
            const average = 10;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if speed is at threshold', () => {
            const speed = 30;
            const average = 100;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if speed is below threshold', () => {
            const speed = 29.999999999;
            const average = 100;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if speed is negative', () => {
            const speed = -1;
            const average = 10;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if average is negative', () => {
            const speed = 10;
            const average = -1;
            const reference = 35;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if reference speed is 30', () => {
            const speed = 10;
            const average = 50;
            const reference = 30;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });

        it('if reference speed is over 30', () => {
            const speed = 10;
            const average = 50;
            const reference = 31;

            const alerted = isCongested(speed, average, reference);

            expect(alerted).toEqual(true);
        });
    });
});
