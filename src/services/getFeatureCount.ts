// src/services/getFeatureCount.ts

import { dbClient } from "../utilities/database.ts";

export async function getFeatureCount() {
  return await dbClient.count();
}
