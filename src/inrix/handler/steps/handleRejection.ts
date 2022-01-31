import { nonRushHourMessage, rejectionReasons } from '../rejectionReasons';

function shouldIgnore(error: string) {
    for (let index = 0; index < rejectionReasons.length; index++) {
        const reason = rejectionReasons[index];
        if (error == reason || error.includes(reason)) {
            return true;
        }
    }
    return false;
}

export function handleRejection(): (error: string) => Promise<boolean> {
    return (error: string) => {
        if (shouldIgnore(error)) {
            const duringRushHour = !error.includes(nonRushHourMessage);
            if (duringRushHour) {
                console.log(error);
            }
            return Promise.resolve(true);
        }
        return Promise.reject(error);
    };
}
