import { mongoConnector } from '../database/database.ts';

export async function getFeatureByRadius(
  radius: [number, number, number],
  classFilter: string,
  offset: number,
) {
  if (!mongoConnector.features) {
    throw new Error('Failed to connect to MongoDB');
  }

  try {
    const querySpec = {
      'geometry.coordinates': {
        '$near': {
          type: 'Point',
          coordinates: [radius[0], radius[1]],
        },
        '$maxDistance': radius[2],
      },
      ...classFilter && {
        'properties.class': classFilter,
      },
    };
    return {
      success: true,
      features: await mongoConnector.features.find(querySpec, {
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
