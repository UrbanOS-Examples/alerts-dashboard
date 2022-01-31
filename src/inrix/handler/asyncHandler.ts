import { RawData } from 'ws';
import { filterEmptyMessage } from './steps/filterEmptyMessage';
import { transformDataIntoMessage } from './steps/transformDataIntoMessage';
import { filterInitialOkMessage } from './steps/filterInitialOkMessage';
import { filterNonCongestedMessage } from './steps/filterNonCongestedMessage';
import { saveAlert } from './steps/saveAlert';
import { filterContinuousCongestion } from './steps/filterContinuousCongestion';
import { transformMessageToAlert } from './steps/transformMessageToAlert';
import { publishAlert } from './steps/publishAlert';
import { handleRejection } from './steps/handleRejection';
import { filterNonRushHourMessage } from './steps/filterNonRushHourMessage';
import { filterByLocation } from './steps/filterByLocation';

export function handleMessage(data: RawData): Promise<boolean> {
    return Promise.resolve(data)
        .then(filterEmptyMessage())
        .then(filterInitialOkMessage())
        .then(transformDataIntoMessage())
        .then(filterNonRushHourMessage())
        .then(filterNonCongestedMessage())
        .then(filterByLocation())
        .then(transformMessageToAlert())
        .then(saveAlert())
        .then(filterContinuousCongestion())
        .then(publishAlert())
        .catch(handleRejection());
}
