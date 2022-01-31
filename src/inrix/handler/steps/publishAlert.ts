import Alert from '../../../models/alert';
import { publish } from '../../../server/socketServer';

export function publishAlert(): (alert: Alert) => boolean {
    return (alert: Alert) => {
        const alertString = JSON.stringify(alert);
        publish(alertString);
        console.log(`Published alert: ${alertString}`);
        return true;
    };
}
