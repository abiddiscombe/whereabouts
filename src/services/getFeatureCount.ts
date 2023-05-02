// src/services/getFeatureCount.ts

import { clientFeatures } from "../utilities/database.ts";

export async function getFeatureCount() {
  return await clientFeatures.count();
}
