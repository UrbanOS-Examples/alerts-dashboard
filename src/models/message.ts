export class Payload {
    constructor(
        public readonly average: number,
        public readonly code: string,
        public readonly ingestion: string,
        public readonly speed: number,
        public readonly reference: number,
    ) {}
}

export class Message {
    constructor(public readonly payload: Payload) {}
}

function noMessage(rawMessage: string) {
    return (
        rawMessage === undefined ||
        rawMessage === null ||
        rawMessage.trim().length === 0
    );
}

export function parseMessage(rawMessage: string): Message {
    if (noMessage(rawMessage)) {
        return undefined;
    }
    return JSON.parse(rawMessage) as Message;
}
