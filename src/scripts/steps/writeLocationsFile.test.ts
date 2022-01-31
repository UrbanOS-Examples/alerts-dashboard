import { writeLocationsFile } from './writeLocationsFile';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mock from 'mock-fs';
import { readFileSync } from 'fs';
import { Location } from '../../models/location';
import { Segment } from '../../models/segment';
import SpyInstance = jest.SpyInstance;
import { Intersection } from '../../models/intersection';

describe('Write locations file', () => {
    const fileLocation = 'src/scripts/output/locations.json';
    let silentConsole: SpyInstance;

    beforeEach(() => {
        mock({
            'src/scripts/output': {},
        });
        silentConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        silentConsole.mockRestore();
        mock.restore();
    });

    it('creates file at specified location', () => {
        writeLocationsFile([]);
        const file = readFileSync(fileLocation).toString();
        expect(file).toEqual('[]');
    });

    it('converts locations to json with indentation', () => {
        const segment = new Segment('code', 'name', 0, 0, 'fclass');
        const intersection = new Intersection('intersection', 'camera');
        const location = new Location(segment, intersection);
        writeLocationsFile([location]);
        const file = readFileSync(fileLocation).toString();
        const expectedContents = `[
    {
        "segment": {
            "code": "code",
            "name": "name",
            "lat": 0,
            "lon": 0,
            "fclass": "fclass"
        },
        "intersection": {
            "name": "intersection",
            "camera": "camera"
        }
    }
]`;
        expect(file).toEqual(expectedContents);
    });
});
