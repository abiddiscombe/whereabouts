import { mongoConnector } from '../database/database.ts';

export async function getClassList() {
  return await mongoConnector.distinct('properties.class');
}
