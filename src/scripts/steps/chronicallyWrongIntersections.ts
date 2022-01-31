import { Location } from '../../models/location';

function intersectionPresent(location: Location) {
    return location !== undefined && location.intersection.name !== undefined;
}

function notExcluded(location: Location, exclusions: string[]) {
    return !exclusions.includes(location.intersection.name);
}

export function chronicallyWrongIntersections(
    exclusions: string[],
): (location: Location) => boolean {
    return (location: Location) => {
        return (
            intersectionPresent(location) && notExcluded(location, exclusions)
        );
    };
}
