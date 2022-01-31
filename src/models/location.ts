import { Segment } from './segment';
import { Intersection } from './intersection';

export class Location {
    constructor(
        public readonly segment: Segment,
        public readonly intersection: Intersection,
    ) {}
}
