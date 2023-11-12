import { mongoConnector } from '../database/database.ts';

export async function getFeatureByBounds(
  bounds: [number, number, number, number],
  classFilter: string,
  offset: number,
) {
  try {
    const querySpec = {
      'geometry.coordinates': {
        '$geoWithin': {
          '$box': [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ],
        },
      },
      ...classFilter && {
        'properties.class': classFilter,
      },
    };
    return {
      success: true,
      features: await mongoConnector.find(querySpec, {
        projection: {
          _id: false,
        },
      }).skip(offset).limit(1000).toArray(),
    };
  } catch (e) {
    console.error(`MongoDB Client: ${e.message}`);
    return {
      success: false,
      features: [],
    };
  }
}
