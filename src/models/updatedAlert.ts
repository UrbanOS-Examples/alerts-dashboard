import Alert from './alert';

export class UpdatedAlert {
    constructor(
        public readonly original: Alert,
        public readonly update: Alert,
    ) {}
}
