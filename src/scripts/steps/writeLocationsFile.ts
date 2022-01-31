import { Location } from '../../models/location';
import fs from 'fs';

export function writeLocationsFile(data: Location[]): void {
    const fileName = 'src/scripts/output/locations.json';
    const locations = JSON.stringify(data, null, 4);
    fs.writeFileSync(fileName, locations);
    console.log(`File written to ${fileName}`);
}
