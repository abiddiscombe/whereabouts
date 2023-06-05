// src/controllers/stats.ts

import { getKeyCount } from "../services/getKeyCount.ts";
import { getFeatureCount } from "../services/getFeatureCount.ts";

export { stats };

// deno-lint-ignore no-explicit-any
async function stats(ctx: any) {
  ctx.state.metadata.title += ' > Statistics';
  try {
    ctx.response.body = {
      ...ctx.state.metadata,
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
      ...ctx.state.metadata,
      error: "Failed to fetch statistics. Please try again later.",
    };
  }
}
