export class Segment {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly lat: number,
        public readonly lon: number,
        public readonly fclass: string,
    ) {}
}
