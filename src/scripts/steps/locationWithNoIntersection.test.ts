import { locationWithNoIntersection } from './locationWithNoIntersection';
import { Location } from '../../models/location';
import { Segment } from '../../models/segment';
import { Intersection } from '../../models/intersection';

describe('Location with No Intersection', () => {
    it('returns false if no location', () => {
        const filterFn = locationWithNoIntersection();
        const result = filterFn(undefined);
        expect(result).toEqual(false);
    });

    it('returns true if intersection existed', () => {
        const filterFn = locationWithNoIntersection();
        const segment = new Segment('', '', 0, 0, '');
        const intersection = new Intersection('', '');
        const location = new Location(segment, intersection);
        const result = filterFn(location);
        expect(result).toEqual(true);
    });

    it('returns false if no intersection', () => {
        const filterFn = locationWithNoIntersection();
        const segment = new Segment('', '', 0, 0, '');
        const location = new Location(segment, undefined);
        const result = filterFn(location);
        expect(result).toEqual(false);
    });
});
