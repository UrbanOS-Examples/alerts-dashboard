import { buildAlert } from '../../../models/alert';
import { AlertRecord } from '../../../models/alertRecord';
import { LocatedMessage } from '../../../models/locatedMessage';

export function transformMessageToAlert(): (
    locatedMessage: LocatedMessage,
) => AlertRecord {
    return (locatedMessage: LocatedMessage) => {
        const alert = buildAlert(
            locatedMessage.segment,
            locatedMessage.message,
            locatedMessage.intersection,
        );
        const key = `location-${locatedMessage.message.payload.code}`;
        return new AlertRecord(key, alert);
    };
}
