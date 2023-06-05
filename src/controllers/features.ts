// controllers/features.ts

import { verifyKey } from "../services/verifyKey.ts";
import { bboxTooLarge } from "../utilities/bbox.ts";
import { searchByRadius } from "../services/searchByRadius.ts";
import { searchByBounds } from "../services/searchByBounds.ts";
import { stringToFloatArray } from "../utilities/conversion.ts";

export { features };

// deno-lint-ignore no-explicit-any
async function features(ctx: any) {
  ctx.state.metadata.title += ' > Features';

  const params = {
    key: ctx.request.url.searchParams.get("key"),
    bbox: ctx.request.url.searchParams.get("bbox"),
    radius: ctx.request.url.searchParams.get("radius"),
    filter: ctx.request.url.searchParams.get("filter") || "",
  };

  params.filter = params.filter.toLowerCase();

  if (!params.key || !await verifyKey(params.key)) {
    ctx.response.status = 401;
    ctx.response.body = {
      ...ctx.state.metadata,
      error: "Unauthorised. A valid API key is required.",
    };
    return;
  }

  if (params.bbox && params.radius) {
    ctx.response.status = 406;
    ctx.response.body = {
      ...ctx.state.metadata,
      error: "Please provide only a single method (bbox, radius) to search by.",
    };
    return;
  }

  if (params.bbox) {
    const handlerResponse = await _handleBBox(params.bbox, params.filter);
    ctx.response.status = handlerResponse.status;
    ctx.response.body = {
      ...ctx.state.metadata,
      ...handlerResponse.body
    };
    return;
  }

  if (params.radius) {
    const handlerResponse = await _handleRadius(params.radius, params.filter);
    ctx.response.status = handlerResponse.status;
    ctx.response.body = {
      ...ctx.state.metadata,
      ...handlerResponse.body
    };
    return;
  }

  ctx.response.status = 406;
  ctx.response.body = {
    ...ctx.state.metadata,
    error: "Please provide one search method (bbox or radius).",
  };
}

async function _handleBBox(bbox: string, filter: string) {
  const bboxFiltered = stringToFloatArray(bbox);

  if (bboxFiltered.length !== 4) {
    return {
      status: 401,
      body: {
        error: "Bounding Box (bbox) invalid.",
      },
    };
  }

  if (bboxTooLarge(bboxFiltered)) {
    return {
      status: 401,
      body: {
        error: "Bounding Box too large. Maximum size is 1 km2",
      },
    };
  }

  return {
    status: 200,
    body: {
      search: {
        ...(filter) ? { filter: filter } : {},
        bbox: bbox,
      },
      type: "FeatureCollection",
      features: await searchByBounds(bboxFiltered, filter),
    },
  };
}

async function _handleRadius(radius: string, filter: string) {
  const center = stringToFloatArray(radius);
  const distance = (center.length === 3) ? center.pop() : 1000;

  if (center.length !== 2) {
    return {
      status: 401,
      body: {
        error: "Radius (radius) invalid.",
      },
    };
  }

  if (distance < 1 || distance > 1000) {
    return {
      status: 401,
      body: {
        error: "Distance outside of acceptable range (1 to 1000 meters).",
      },
    };
  }

  return {
    status: 200,
    body: {
      search: {
        ...(filter) ? { filter: filter } : {},
        radius: {
          center: center,
          distance: distance,
        },
      },
      type: "FeatureCollection",
      features: await searchByRadius(center, distance, filter),
    },
  };
}
