import { filterInitialAlerts } from './retrieveInitialAlerts';
import * as redisMock from 'redis-mock';
import Alert from '../models/alert';

describe('retrieve initial alerts', () => {
    it('can retrieve', async () => {
        const redisClient = redisMock.createClient();
        redisClient.set(
            'location-000000008',
            '{"id":"cda107b5-ee1f-4e3c-b565-b4bf7c294aa5","type":"congestion","severity":"warn","time":"2030-12-21T23:56:00.288297Z","coordinates":{"latitude":40.01643350805392,"longitude":-83.02315475166553},"location":"ACKERMAN RD & DODRIDGE ST @ OLENTANGY RIVER RD","status":"new","speed":9,"avgSpeed":32,"refSpeed":32,"camera":"(City of Columbus) Ackerman Rd at Olentangy River Rd"}',
        );
        await filterInitialAlerts().then((alert: Alert[]) => {
            alert.forEach((singleAlert) => {
                expect(singleAlert).toMatchObject({
                    id: 'cda107b5-ee1f-4e3c-b565-b4bf7c294aa5',
                    type: 'congestion',
                    severity: 'warn',
                    time: '2030-12-21T23:56:00.288297Z',
                    coordinates: {
                        latitude: 40.01643350805392,
                        longitude: -83.02315475166553,
                    },
                    location: 'ACKERMAN RD & DODRIDGE ST @ OLENTANGY RIVER RD',
                    status: 'new',
                    speed: 9,
                    avgSpeed: 32,
                    refSpeed: 32,
                    camera: '(City of Columbus) Ackerman Rd at Olentangy River Rd',
                });
            });
        });
    });
});
