// src/controllers/stats.ts

import { verifyKey } from "../services/verifyKey.ts";
import { newHeader } from "../utilities/newHeader.ts";
import { getFeatureCount } from "../services/getFeatureCount.ts";
import { getAuthTokenCount } from "../services/getAuthTokenCount.ts";

export { stats };

// deno-lint-ignore no-explicit-any
async function stats(ctx: any) {
  const res = newHeader("API Service Statistics");

  const userKey = ctx.request.url.searchParams.get("key") || "";

  if (!userKey /* allows fast-fail */ || !await verifyKey(userKey)) {
    ctx.response.status = 401;
    ctx.response.body = {
      ...res,
      error: "Unauthorised. A valid API key is required.",
    };
    return;
  }

  try {
    ctx.response.body = {
      ...res,
      totalKeys: await getAuthTokenCount(),
      totalFeatures: await getFeatureCount(),
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      ...res,
      error: "Failed to fetch statistics. Please try again later.",
    };
  }
}
