import { Segment } from '../../models/segment';

export function segmentByFunctionalClass(): (segment: Segment) => boolean {
    return (segment) => {
        if (segment === undefined) {
            return false;
        }
        return segment.fclass === '3' || segment.fclass === '4';
    };
}
