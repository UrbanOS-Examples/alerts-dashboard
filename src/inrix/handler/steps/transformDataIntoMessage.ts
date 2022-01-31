import { RawData } from 'ws';
import { Message, parseMessage } from '../../../models/message';

export function transformDataIntoMessage(): (
    data: RawData,
) => Promise<Message> {
    return (data: RawData) => {
        const message = parseMessage(data.toString());
        return Promise.resolve(message);
    };
}
