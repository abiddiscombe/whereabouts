// src/services/getFeatureCount.ts

import { mongoConnector } from "../utilities/database.ts";

export async function getFeatureCount() {
  return await mongoConnector.count();
}
