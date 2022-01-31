import { UpdatedAlert } from '../../../models/updatedAlert';
import { continuousCongestionMessage } from '../rejectionReasons';
import Alert from '../../../models/alert';

const THREE_MINUTES = 180000;

function determineOriginalTime(original: Alert) {
    return original == null ? new Date(0) : new Date(original.time);
}

function timeSinceLastAlert(updatedAlert: UpdatedAlert) {
    const originalTime = determineOriginalTime(updatedAlert.original);
    const newTime = new Date(updatedAlert.update.time);
    return newTime.getTime() - originalTime.getTime();
}

function ignoreIfAlertedRecently(
    timeDifference: number,
    updatedAlert: UpdatedAlert,
) {
    if (timeDifference > THREE_MINUTES) {
        return Promise.resolve(updatedAlert.update);
    }
    const jsonAlerts = JSON.stringify(updatedAlert);
    const rejectionMessage = `${continuousCongestionMessage}: ${jsonAlerts}`;
    return Promise.reject(rejectionMessage);
}

export function filterContinuousCongestion(): (
    updatedAlert: UpdatedAlert,
) => Promise<Alert> {
    return (updatedAlert: UpdatedAlert) => {
        const timeDifference = timeSinceLastAlert(updatedAlert);
        return ignoreIfAlertedRecently(timeDifference, updatedAlert);
    };
}
