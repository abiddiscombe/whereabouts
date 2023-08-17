// searchByBounds.ts
import { mongoConnector } from '../utilities/database.ts';

export async function searchByBounds(bbox: number[], classFilter: string) {
    return await mongoConnector.find({
        ...(classFilter) ? { 'properties.class': classFilter } : {},
        'geometry.coordinates': {
            $geoWithin: {
                $box: [
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[3]],
                ],
            },
        },
    }, {
        projection: {
            _id: false
        }
    }).limit(1000).toArray();
}
