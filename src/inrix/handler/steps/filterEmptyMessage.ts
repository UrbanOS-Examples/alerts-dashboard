import { RawData } from 'ws';
import { emptyMessage } from '../rejectionReasons';

function messageIsEmpty(data: Buffer | ArrayBuffer | Buffer[]) {
    return (
        data === undefined ||
        data === null ||
        data.toString().trim().length === 0
    );
}

export function filterEmptyMessage(): (data: RawData) => Promise<RawData> {
    return (data: RawData) => {
        if (messageIsEmpty(data)) {
            return Promise.reject(emptyMessage);
        }
        return Promise.resolve(data);
    };
}
