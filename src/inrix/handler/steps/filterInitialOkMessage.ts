import { RawData } from 'ws';
import { connectedMessage } from '../rejectionReasons';

export function filterInitialOkMessage(): (data: RawData) => Promise<RawData> {
    return (data: RawData) => {
        if (data.toString().includes('phx_reply')) {
            console.log('OK Message: ' + data.toString());
            return Promise.reject(connectedMessage);
        }
        return Promise.resolve(data);
    };
}
