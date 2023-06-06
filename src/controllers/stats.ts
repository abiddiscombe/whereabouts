// src/controllers/stats.ts

import { getFeatureCount } from '../services/getFeatureCount.ts';

// deno-lint-ignore no-explicit-any
export async function stats(ctx: any) {
  ctx.state.metadata.title += ' > Statistics';
  try {
    ctx.response.body = {
      ...ctx.state.metadata,
      features: {
        totalFeatures: await getFeatureCount(),
      },
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      ...ctx.state.metadata,
      error: 'Failed to fetch statistics. Please try again later.',
    };
  }
}
