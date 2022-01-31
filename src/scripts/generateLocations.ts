import { segmentByFunctionalClass } from './steps/segmentByFunctionalClass';
import { locationWithNoIntersection } from './steps/locationWithNoIntersection';
import { chronicallyWrongIntersections } from './steps/chronicallyWrongIntersections';
import { locationsWithNoCamera } from './steps/locationsWithNoCamera';
import { writeLocationsFile } from './steps/writeLocationsFile';
import { readSegments } from './steps/readSegments';
import { correlateToIntersection } from './steps/correlateToIntersection';
import { cameraExceptions } from './config/cameraExceptions';
import { intersectionExclusions } from './config/intersectionExclusions';

function generateLocations(): void {
    console.log('Generating location file');
    const locations = readSegments()
        .filter(segmentByFunctionalClass())
        .map(correlateToIntersection())
        .filter(locationWithNoIntersection())
        .filter(locationsWithNoCamera(cameraExceptions))
        .filter(chronicallyWrongIntersections(intersectionExclusions));
    console.log(`There are ${locations.length} acceptable locations`);
    writeLocationsFile(locations);
}

generateLocations();
