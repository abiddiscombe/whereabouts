// src/controllers/stats.ts

import { newHeader } from "../utilities/header.ts";
import { getKeyCount } from "../services/getKeyCount.ts";
import { getFeatureCount } from "../services/getFeatureCount.ts";

export { stats };

// deno-lint-ignore no-explicit-any
async function stats(ctx: any) {
  const res = newHeader("API Service Statistics");

  try {
    ctx.response.body = {
      ...res,
      features: {
        totalFeatures: await getFeatureCount(),
      },
      authentication: {
        totalKeys: await getKeyCount(),
      }
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      ...res,
      error: "Failed to fetch statistics. Please try again later.",
    };
  }
}
