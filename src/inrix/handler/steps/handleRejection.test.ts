import { nonRushHourMessage, rejectionReasons } from '../rejectionReasons';
import { handleRejection } from './handleRejection';
import SpyInstance = jest.SpyInstance;

describe('Handle Rejection', () => {
    let silentConsole: SpyInstance;

    beforeEach(() => {
        silentConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        silentConsole.mockRestore();
    });

    it('covers every rejection reason', async () => {
        const handleFunction = handleRejection();
        rejectionReasons.map(async (reason) => {
            const shouldIgnore = await handleFunction(reason);
            expect(shouldIgnore).toEqual(true);
        });
    });

    it('does not log for non-rush hour messages', async () => {
        const handleFunction = handleRejection();
        const shouldIgnore = await handleFunction(nonRushHourMessage);
        expect(shouldIgnore).toEqual(true);
        expect(silentConsole).not.toHaveBeenCalled();
    });
});
