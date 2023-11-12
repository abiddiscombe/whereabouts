import Fuse from 'npm:fuse.js';
import { mongoConnector } from '../database/database.ts';

export async function getFeatureByName(name: string, classFilter: string) {
  try {
    const querySpec = {
      '$text': {
        '$search': name,
      },
      ...classFilter && {
        'properties.class': classFilter,
      },
    };

    const featuresRaw = await mongoConnector.find(querySpec, {
      projection: {
        _id: false,
      },
    }).sort({
      score: { '$meta': 'textScore' },
    }).limit(1000).toArray();

    return {
      success: true,
      features: _filterByFuse(featuresRaw, name),
    };
  } catch (e) {
    console.error(`MongoDB Client: ${e.message}`);
    return {
      success: false,
      features: [],
    };
  }
}

function _filterByFuse(features: [], target: string) {
  const fuseAgent = new Fuse(features, {
    threshold: 0.4,
    keys: ['properties.name'],
  });
  const filtered = fuseAgent.search(target);
  return filtered.map((item) => item.item);
}
