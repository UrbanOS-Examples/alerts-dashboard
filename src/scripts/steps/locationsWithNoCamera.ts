import { Location } from '../../models/location';

function isException(location: Location, exceptions: string[]) {
    return exceptions.includes(location.intersection.name);
}

function hasCamera(location: Location) {
    return location.intersection.camera !== null;
}

function intersectionPresent(location: Location) {
    return location !== undefined && location.intersection !== undefined;
}

function shouldInclude(location: Location, exceptions: string[]) {
    return hasCamera(location) || isException(location, exceptions);
}

export function locationsWithNoCamera(
    exceptions: string[],
): (location: Location) => boolean {
    return (location: Location) => {
        return (
            intersectionPresent(location) && shouldInclude(location, exceptions)
        );
    };
}
