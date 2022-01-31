import { chronicallyWrongIntersections } from './chronicallyWrongIntersections';
import { Location } from '../../models/location';
import { Intersection } from '../../models/intersection';

describe('Chronically Wrong Intersections filter', () => {
    it('returns false if there is no location provided', () => {
        const filterFn = chronicallyWrongIntersections([]);

        const result = filterFn(undefined);

        expect(result).toEqual(false);
    });

    it('returns true if intersection name not in exclusions list', () => {
        const filterFn = chronicallyWrongIntersections([]);
        const intersection = new Intersection('Correct Intersection', 'camera');
        const location = new Location(undefined, intersection);

        const result = filterFn(location);

        expect(result).toEqual(true);
    });

    it('returns false if intersection in exclusions list', () => {
        const name = 'Excluded';
        const filterFn = chronicallyWrongIntersections([name]);
        const intersection = new Intersection(name, 'camera');
        const location = new Location(undefined, intersection);

        const result = filterFn(location);

        expect(result).toEqual(false);
    });

    it('returns false if no intersection name', () => {
        const filterFn = chronicallyWrongIntersections([]);
        const intersection = new Intersection(undefined, 'camera');
        const location = new Location(undefined, intersection);

        const result = filterFn(location);

        expect(result).toEqual(false);
    });
});
