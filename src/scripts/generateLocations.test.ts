import { readFileSync } from 'fs';
import { Location } from '../models/location';

// locations file used to have data provided from a proprietary source
// removed it and associated files as part of open sourcing
// these tests are now meaningless but left here for reference
describe('Locations data validation', () => {
    let locations: Location[];

    beforeAll(() => {
        const fileLocation = 'src/scripts/output/locations.json';
        const rawFile = readFileSync(fileLocation).toString();
        locations = JSON.parse(rawFile) as Location[];
    });

    it('all locations have a segment and an intersection', () => {
        locations.forEach((location) => {
            expect(location.segment).toBeDefined();
            expect(location.intersection).toBeDefined();
        });
    });

    it('all intersections have a name', () => {
        locations.forEach((location) => {
            expect(location.intersection.name.length).toBeGreaterThan(0);
        });
    });

    it('all segments have a code and name', () => {
        locations.forEach((location) => {
            expect(location.segment.code.length).toBeGreaterThan(0);
            expect(location.segment.name.length).toBeGreaterThan(0);
        });
    });

    it('all segments have a functional class', () => {
        locations.forEach((location) => {
            expect(location.segment.fclass.length).toBeGreaterThan(0);
        });
    });

    it('all segments have a latitude and longitude', () => {
        locations.forEach((location) => {
            expect(location.segment.lat).not.toEqual(0);
            expect(location.segment.lon).not.toEqual(0);
        });
    });
});
