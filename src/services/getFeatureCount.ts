import { mongoConnector } from '../database/database.ts';

export async function getFeatureCount() {
  return await mongoConnector.count();
}
