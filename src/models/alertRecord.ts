import Alert from './alert';

export class AlertRecord {
    constructor(public readonly key: string, public readonly alert: Alert) {}
}
