import { Message } from '../../../models/message';
import { isCongested } from './calculator';
import { noCongestionMessage } from '../rejectionReasons';

export function filterNonCongestedMessage(): (
    message: Message,
) => Promise<Message> {
    return (message: Message) => {
        const payload = message.payload;
        if (isCongested(payload.speed, payload.average, payload.reference)) {
            return Promise.resolve(message);
        }
        const jsonMessage = JSON.stringify(message);
        const rejectionMessage = `${noCongestionMessage}: ${jsonMessage}`;
        return Promise.reject(rejectionMessage);
    };
}
