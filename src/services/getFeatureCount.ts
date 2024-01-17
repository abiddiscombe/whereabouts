import { mongoConnector } from '../database/database.ts';

export async function getFeatureCount() {
  if (!mongoConnector.features) {
    throw new Error('Failed to connect to MongoDB');
  }

  return await mongoConnector.features.countDocuments();
}
