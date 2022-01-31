import fs from 'fs';
import * as turf from '@turf/turf';
import { Feature, Point, Units } from '@turf/turf';
import { Segment } from '../../models/segment';
import { Intersection } from '../../models/intersection';
import { Location } from '../../models/location';

class IntersectionData {
    constructor(
        public readonly camera_description: string,
        public readonly cm_pwrsrc: string,
        public readonly signal_lat: number,
        public readonly signal_lon: number,
    ) {}
}

class IntersectionPoint {
    constructor(
        public readonly intersection: IntersectionData,
        public readonly point: Feature<Point>,
    ) {}
}

class IntersectionDistance {
    constructor(
        public readonly intersection: IntersectionData,
        public readonly distance: number,
    ) {}
}

let intersections: IntersectionData[];

function readIntersectionsFile() {
    if (intersections === undefined) {
        const rawFile = fs
            .readFileSync('src/scripts/input/cameras_and_intersections_v2.json')
            .toString();
        intersections = JSON.parse(rawFile) as IntersectionData[];
    }
    return intersections;
}

function toIntersectionPoint() {
    return (place: IntersectionData) => {
        const point = turf.point([place.signal_lon, place.signal_lat]);
        return new IntersectionPoint(place, point);
    };
}

function toIntersectionDistance(congestionPoint: Feature<Point>) {
    return (intersectionPoint: IntersectionPoint) => {
        const options = { units: 'kilometers' as Units };
        const distance = turf.distance(
            congestionPoint,
            intersectionPoint.point,
            options,
        );
        return new IntersectionDistance(
            intersectionPoint.intersection,
            distance,
        );
    };
}

function onlyIntersectionsWithinRange() {
    return (intersection: IntersectionDistance) => {
        return intersection.distance <= 0.1;
    };
}

function shortestDistanceLast() {
    return (
        intersection1: IntersectionDistance,
        intersection2: IntersectionDistance,
    ) => {
        if (intersection1.distance <= intersection2.distance) {
            return 1;
        } else if (intersection1.distance === intersection2.distance) {
            return 0;
        } else {
            return -1;
        }
    };
}

function toIntersection() {
    return (distancedIntersection: IntersectionDistance) =>
        new Intersection(
            distancedIntersection.intersection.cm_pwrsrc,
            distancedIntersection.intersection.camera_description,
        );
}

export function correlateToIntersection(): (segment: Segment) => Location {
    return (segment: Segment) => {
        const congestionPoint = turf.point([segment.lon, segment.lat]);
        const intersection = readIntersectionsFile()
            .map(toIntersectionPoint())
            .map(toIntersectionDistance(congestionPoint))
            .filter(onlyIntersectionsWithinRange())
            .sort(shortestDistanceLast())
            .map(toIntersection())
            .pop();
        return new Location(segment, intersection);
    };
}
