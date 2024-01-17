import { mongoConnector } from '../database/database.ts';

export async function getClassList() {
  if (!mongoConnector.features) {
    throw new Error('Failed to connect to MongoDB');
  }

  return await mongoConnector.features.distinct('properties.class');
}
