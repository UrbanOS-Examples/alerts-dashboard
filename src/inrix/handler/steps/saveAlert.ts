import { getStoredValue, storeValue } from '../../../server/store';
import Alert from '../../../models/alert';
import { UpdatedAlert } from '../../../models/updatedAlert';
import { AlertRecord } from '../../../models/alertRecord';

export function saveAlert(): (record: AlertRecord) => Promise<UpdatedAlert> {
    return (record: AlertRecord) => {
        const value = JSON.stringify(record.alert);
        const alertKey = `alert-${record.alert.id}`;
        return storeValue(alertKey, value)
            .then(() => getStoredValue(record.key))
            .then((oldAlert) => {
                return storeValue(record.key, value).then(() => {
                    const original = JSON.parse(oldAlert) as Alert;
                    return new UpdatedAlert(original, record.alert);
                });
            });
    };
}
