export const emptyMessage = 'Received empty INRIX message';
export const connectedMessage = 'Connected to INRIX stream';
export const noCongestionMessage = 'Not congested';
export const continuousCongestionMessage =
    'Alert received in last INRIX batch for same location';
export const irrelevantFunctionalClassMessage =
    'Ignoring message for location with functional class';
export const noIntersectionInRange = 'No intersection in range';
export const nonRushHourMessage = 'Ignoring message outside of rush hours';
export const noCameraAtIntersection = 'No camera at intersection';
export const noMatchingLocation = 'No match found for location code';

export const rejectionReasons: string[] = [
    emptyMessage,
    connectedMessage,
    noCongestionMessage,
    continuousCongestionMessage,
    irrelevantFunctionalClassMessage,
    noIntersectionInRange,
    nonRushHourMessage,
    noCameraAtIntersection,
    noMatchingLocation,
];
