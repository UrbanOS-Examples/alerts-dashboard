import * as turf from '@turf/turf';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mock from 'mock-fs';
import { correlateToIntersection } from './correlateToIntersection';
import { Segment } from '../../models/segment';

const intersection1 = {
    camera_description: 'OBERON RD CAMERA',
    cm_pwrsrc: 'OBERON RD @ PARSONS AVE',
    signal_lat: 39.88168677610525,
    signal_lon: -82.98775394713341,
};
const intersection2 = {
    camera_description: 'SHALE RD CAMERA',
    cm_pwrsrc: 'SHALE RD @ PINKERTON AVE',
    signal_lat: 40.88168677610525,
    signal_lon: -83.98775394713341,
};
const intersection3 = {
    camera_description: 'SOMEWHERE LN CAMERA',
    cm_pwrsrc: 'SOMEWHERE LN @ NOWHERE BLVD',
    signal_lat: 40.88168777610525,
    signal_lon: -83.98775394713341,
};
const intersection4 = {
    camera_description: null as string,
    cm_pwrsrc: 'SOMEWHERE LN @ NOWHERE BLVD',
    signal_lat: 41.88168777610525,
    signal_lon: -84.98775394713341,
};
const testIntersections = JSON.stringify([
    intersection1,
    intersection2,
    intersection3,
    intersection4,
]);

const farOffSegment = new Segment(
    '122-14636',
    'SCIO DARBY RD',
    45.03314777219885,
    -86.17328033080445,
    '3',
);
const nearToIntersection1 = new Segment(
    '1',
    'Near to Intersection 1',
    39.88158677610525,
    -82.98675394713341,
    '5',
);
const nearestToIntersection2 = new Segment(
    '2',
    'Nearest to Intersection 2',
    40.88158677610525,
    -83.98765394713341,
    '63',
);
const nearToIntersection4 = new Segment(
    '4',
    'Nearest to Intersection 4',
    41.88168777610525,
    -84.98775394713341,
    '63',
);
function ensureTwoIntersectionsWithinRange(segment: Segment) {
    const closerToIntersection2 = turf.point([segment.lon, segment.lat]);
    const intersection2Point = turf.point([
        intersection2.signal_lon,
        intersection2.signal_lat,
    ]);
    const intersection3Point = turf.point([
        intersection3.signal_lon,
        intersection3.signal_lat,
    ]);
    const distanceToIntersection2 = turf.distance(
        closerToIntersection2,
        intersection2Point,
    );
    const distanceToIntersection3 = turf.distance(
        closerToIntersection2,
        intersection3Point,
    );
    expect(distanceToIntersection2).toBeLessThan(0.1);
    expect(distanceToIntersection3).toBeLessThan(0.1);
    expect(distanceToIntersection2).toBeLessThan(distanceToIntersection3);
}

describe('Correlate to intersection', () => {
    beforeEach(() => {
        mock({
            'src/scripts/input/cameras_and_intersections_v2.json':
                testIntersections,
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('returns undefined intersection if no nearby intersection', () => {
        const mapFunction = correlateToIntersection();
        const location = mapFunction(farOffSegment);
        expect(location.segment).toEqual(farOffSegment);
        expect(location.intersection).toBeUndefined();
    });

    it('returns an intersection if one is within .1 km', () => {
        const mapFunction = correlateToIntersection();
        const location = mapFunction(nearToIntersection1);
        expect(location.segment).toEqual(nearToIntersection1);
        expect(location.intersection.name).toEqual(intersection1.cm_pwrsrc);
        expect(location.intersection.camera).toEqual(
            intersection1.camera_description,
        );
    });

    it('returns the closest camera within .1 km', () => {
        ensureTwoIntersectionsWithinRange(nearestToIntersection2);
        const mapFunction = correlateToIntersection();
        const location = mapFunction(nearestToIntersection2);
        expect(location.segment).toEqual(nearestToIntersection2);
        expect(location.intersection.name).toEqual(intersection2.cm_pwrsrc);
        expect(location.intersection.camera).toEqual(
            intersection2.camera_description,
        );
    });

    it('returned null camera if none on intersection', () => {
        const mapFunction = correlateToIntersection();
        const location = mapFunction(nearToIntersection4);
        expect(location.segment).toEqual(nearToIntersection4);
        expect(location.intersection.name).toEqual(intersection4.cm_pwrsrc);
        expect(location.intersection.camera).toBeNull();
    });
});
