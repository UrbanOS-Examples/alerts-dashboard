import { Segment } from '../../models/segment';
import fs from 'fs';

export function readSegments(): Segment[] {
    const segmentsData = fs
        .readFileSync('src/scripts/input/segments.json')
        .toString();
    return JSON.parse(segmentsData) as Segment[];
}
