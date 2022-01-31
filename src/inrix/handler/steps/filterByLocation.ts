import { Message } from '../../../models/message';
import { LocatedMessage } from '../../../models/locatedMessage';
import { noMatchingLocation } from '../rejectionReasons';
import * as fs from 'fs';
import { Location } from '../../../models/location';

let locations: Location[] = null;

function readLocationsFile() {
    if (locations === null) {
        const filePath = 'src/scripts/output/locations.json';
        const locationsRaw = fs.readFileSync(filePath).toString();
        locations = JSON.parse(locationsRaw) as Location[];
    }
    return locations;
}

function matchMessageToLocation(locations: Location[], message: Message) {
    return locations
        .filter((location: Location) => {
            return location.segment.code === message.payload.code;
        })
        .map((location: Location) => {
            return new LocatedMessage(
                message,
                location.segment,
                location.intersection,
            );
        })
        .pop();
}

export function filterByLocation(): (
    message: Message,
) => Promise<LocatedMessage> {
    return (message: Message) => {
        const locations = readLocationsFile();
        const locatedMessage = matchMessageToLocation(locations, message);
        if (locatedMessage === undefined) {
            const stringMessage = JSON.stringify(message);
            const error = `${noMatchingLocation}: ${stringMessage}`;
            return Promise.reject(error);
        }
        return Promise.resolve(locatedMessage);
    };
}
