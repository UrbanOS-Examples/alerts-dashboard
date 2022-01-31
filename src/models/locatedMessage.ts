import { Message } from './message';
import { Segment } from './segment';
import { Intersection } from './intersection';

export class LocatedMessage {
    constructor(
        public readonly message: Message,
        public readonly segment: Segment,
        public readonly intersection: Intersection,
    ) {}
}
