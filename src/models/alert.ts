import { v4 as uuid } from 'uuid';
import { Message } from './message';
import { Segment } from './segment';
import { Intersection } from './intersection';

export class Coordinates {
    constructor(
        public readonly latitude: number,
        public readonly longitude: number,
    ) {}
}

export enum AlertStatus {
    NEW = 'new',
}

export enum AlertType {
    CONGESTION = 'congestion',
}

export enum AlertSeverity {
    WARN = 'warn',
}

export default class Alert {
    constructor(
        public readonly id: string,
        public readonly type: AlertType,
        public readonly severity: AlertSeverity,
        public readonly time: string,
        public readonly coordinates: Coordinates,
        public readonly location: string,
        public readonly status: AlertStatus,
        public readonly speed: number,
        public readonly avgSpeed: number,
        public readonly refSpeed: number,
        public readonly camera?: string,
    ) {}
}

export function buildAlert(
    segment: Segment,
    message: Message,
    intersection: Intersection,
): Alert {
    const coordinates = new Coordinates(segment.lat, segment.lon);
    return new Alert(
        uuid(),
        AlertType.CONGESTION,
        AlertSeverity.WARN,
        message.payload.ingestion,
        coordinates,
        intersection.name,
        AlertStatus.NEW,
        message.payload.speed,
        message.payload.average,
        message.payload.reference,
        intersection.camera,
    );
}
