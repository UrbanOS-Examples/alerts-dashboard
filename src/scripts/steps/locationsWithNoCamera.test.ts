import { locationsWithNoCamera } from './locationsWithNoCamera';
import { Location } from '../../models/location';
import { Intersection } from '../../models/intersection';

describe('Locations without camera filter', () => {
    it('returns false if no location', () => {
        const filterFn = locationsWithNoCamera([]);
        const result = filterFn(undefined);
        expect(result).toEqual(false);
    });

    it('returns false if no intersection', () => {
        const filterFn = locationsWithNoCamera([]);
        const location = new Location(undefined, undefined);
        const result = filterFn(location);
        expect(result).toEqual(false);
    });

    it('returns false if no camera and for unexceptional intersection', () => {
        const filterFn = locationsWithNoCamera([]);
        const intersection = new Intersection('Intersection', null);
        const location = new Location(undefined, intersection);
        const result = filterFn(location);
        expect(result).toEqual(false);
    });

    it('returns true if intersection has camera', () => {
        const filterFn = locationsWithNoCamera([]);
        const intersection = new Intersection('Intersection', 'Snoopbot');
        const location = new Location(undefined, intersection);
        const result = filterFn(location);
        expect(result).toEqual(true);
    });

    it('returns true if no camera but exceptional intersection', () => {
        const name = 'Special';
        const filterFn = locationsWithNoCamera([name]);
        const intersection = new Intersection(name, null);
        const location = new Location(undefined, intersection);
        const result = filterFn(location);
        expect(result).toEqual(true);
    });
});
