// searchByRadius.ts
import { mongoConnector } from '../database/database.ts';

export async function searchByRadius(
    geom: number[],
    distance: number,
    filter: string,
) {
    return await mongoConnector.find({
        ...(filter) ? { 'properties.class': filter } : {},
        'geometry.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [geom[0], geom[1]],
                },
                $maxDistance: distance,
            },
        },
    }, {
        projection: {
            _id: false
        }
    }).limit(1000).toArray();
}
