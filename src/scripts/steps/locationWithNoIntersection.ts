import { Location } from '../../models/location';

export function locationWithNoIntersection(): (location: Location) => boolean {
    return (location: Location) => {
        if (location === undefined) {
            return false;
        }
        return location.intersection !== undefined;
    };
}
