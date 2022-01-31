import { getStoredKeys, getStoredValue } from './store';
import Alert from '../models/alert';
import { DateTime } from 'luxon';

export async function filterInitialAlerts(): Promise<Alert[]> {
    const alertKeys = await getStoredKeys('location*');
    const alertRequests: any[] = [];
    alertKeys.forEach((element) => {
        alertRequests.push(
            getStoredValue(element).then((alert) => {
                const typedAlert = JSON.parse(alert) as Alert;
                if (alertOccuredWithinDays(typedAlert, 1)) return typedAlert;
                else return null;
            }),
        );
    });

    const resolvedPromises = Promise.all(alertRequests).then((values) =>
        values.filter((v) => v),
    );
    return resolvedPromises;
}

function alertOccuredWithinDays(alert: Alert, days: number) {
    const isoTime = DateTime.now().minus({ days: days });
    const alertTime = DateTime.fromISO(alert.time);
    if (alertTime > isoTime) return true;
    else return false;
}
