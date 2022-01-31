import { segmentByFunctionalClass } from './segmentByFunctionalClass';
import { Segment } from '../../models/segment';

describe('Segment By Functional Class', () => {
    it('returns false if no segment', () => {
        const segmentFn = segmentByFunctionalClass();
        const include = segmentFn(undefined);
        expect(include).toEqual(false);
    });

    it('includes class 3', () => {
        const segmentFn = segmentByFunctionalClass();
        const segment = new Segment('', '', 0, 0, '3');
        const include = segmentFn(segment);
        expect(include).toEqual(true);
    });

    it('includes class 4', () => {
        const segmentFn = segmentByFunctionalClass();
        const segment = new Segment('', '', 0, 0, '4');
        const include = segmentFn(segment);
        expect(include).toEqual(true);
    });
});
