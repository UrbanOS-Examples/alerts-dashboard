// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mock from 'mock-fs';
import { readSegments } from './readSegments';

describe('Read Segments', () => {
    afterEach(() => {
        mock.restore();
    });

    it('returns parsed segments', () => {
        const segmentFileContents = `[
          {
            "code": "0000000",
            "fclass": "4",
            "lat": 40.03314777219885,
            "lon": -83.17328033080445,
            "name": "SCIOTO DARBY RD"
          },
          {
            "code": "1111111",
            "fclass": "4",
            "lat": 40.031629523032535,
            "lon": -82.9896787723154,
            "name": "MAIZE RD"
          },
          {
            "code": "2222222",
            "fclass": "7",
            "lat": 40.00288577872029,
            "lon": -83.00552903812125,
            "name": "WALDECK AVE"
          }]`;
        mock({
            'src/scripts/input/segments.json': segmentFileContents,
        });

        const segments = readSegments();

        expect(segments.length).toEqual(3);

        const firstSegment = segments[0];
        expect(firstSegment.code).toEqual('0000000');
        expect(firstSegment.fclass).toEqual('4');
        expect(firstSegment.lat).toEqual(40.03314777219885);
        expect(firstSegment.lon).toEqual(-83.17328033080445);
        expect(firstSegment.name).toEqual('SCIOTO DARBY RD');

        const secondSegment = segments[1];
        expect(secondSegment.code).toEqual('1111111');
        expect(secondSegment.fclass).toEqual('4');
        expect(secondSegment.lat).toEqual(40.031629523032535);
        expect(secondSegment.lon).toEqual(-82.9896787723154);
        expect(secondSegment.name).toEqual('MAIZE RD');

        const thirdSegment = segments[2];
        expect(thirdSegment.code).toEqual('2222222');
        expect(thirdSegment.fclass).toEqual('7');
        expect(thirdSegment.lat).toEqual(40.00288577872029);
        expect(thirdSegment.lon).toEqual(-83.00552903812125);
        expect(thirdSegment.name).toEqual('WALDECK AVE');
    });
});
