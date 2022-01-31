import { Message } from '../../../models/message';
import { nonRushHourMessage } from '../rejectionReasons';

function duringMorningRushHour(date: Date) {
    return date.getHours() >= 7 && date.getHours() < 10;
}

function duringEveningRushHour(date: Date) {
    return date.getHours() >= 14 && date.getHours() < 18;
}

function duringRushHours(date: Date) {
    return duringMorningRushHour(date) || duringEveningRushHour(date);
}

function convertToEasternTimezone(ingestion: string) {
    const date = new Date(ingestion);
    const options = { timeZone: 'America/Detroit' };
    const easternLocale = date.toLocaleString('en-US', options);
    return new Date(easternLocale);
}

export function filterNonRushHourMessage(): (
    message: Message,
) => Promise<Message> {
    return (message: Message) => {
        const easternDate = convertToEasternTimezone(message.payload.ingestion);
        if (duringRushHours(easternDate)) {
            return Promise.resolve(message);
        }
        return Promise.reject(nonRushHourMessage);
    };
}
