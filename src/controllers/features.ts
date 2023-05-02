// controllers/features.ts

import { verifyKey } from "../services/verifyKey.ts";
import { newHeader } from "../utilities/newHeader.ts";
import { bboxAreaCheck } from "../utilities/bboxAreaCheck.ts";
import { searchByRadius } from "../services/searchByRadius.ts";
import { searchByBounds } from "../services/searchByBounds.ts";

export { features };

// deno-lint-ignore no-explicit-any
async function features(ctx: any) {
  const res = newHeader("Geospatial Feature Search");

  const userKey = ctx.request.url.searchParams.get("key") || "";

  if (!userKey /* allows fast-fail */ || !await verifyKey(userKey)) {
    ctx.response.status = 401;
    ctx.response.body = {
      ...res,
      error: "Unauthorised. A valid API key is required.",
    };
    return;
  }

  const userParams = {
    bbox: ctx.request.url.searchParams.get("bbox") || undefined,
    radius: ctx.request.url.searchParams.get("radius") || undefined,
  };

  if (userParams.bbox && userParams.radius) {
    ctx.response.status = 406;
    ctx.response.body = {
      ...res,
      error: "Please provide a single method (bbox, radius) to search by.",
    };
  } else if (userParams.bbox) {
    res.name += " (Bounding Box)";
    const resPayload = await _handleBoundsQuery(userParams.bbox);
    ctx.response.status = resPayload.status;
    ctx.response.body = {
      ...res,
      ...resPayload.body,
    };
  } else if (userParams.radius) {
    res.name += " (Radius)";
    const resPayload = await _handleRadiusQuery(userParams.radius);
    ctx.response.status = resPayload.status;
    ctx.response.body = {
      ...res,
      ...resPayload.body,
    };
  } else {
    ctx.response.status = 406;
    ctx.response.body = {
      ...res,
      error:
        "Please provide a method via query param (bbox, radius) to search by.",
    };
  }
}

async function _handleBoundsQuery(bbox: string) {
  const elements: number[] = [];

  bbox.split(",").forEach((element) => {
    try {
      elements.push(parseFloat(element));
    } catch {
      return {
        status: 401,
        body: {
          error: "The Bounding Box must contain only decimals.",
        },
      };
    }
  });

  if (elements.length != 4) {
    return {
      status: 401,
      body: {
        error: "The Bounding Box must contain four elements.",
      },
    };
  }

  if (bboxAreaCheck(elements)) {
    return {
      status: 401,
      body: {
        error: "The Bounding Box is too large. Maximum size is 500 m2",
      },
    };
  }

  return {
    status: 200,
    body: {
      type: "FeatureCollection",
      search: {
        bbox: elements,
      },
      features: await searchByBounds(elements),
    },
  };
}

async function _handleRadiusQuery(radius: string) {
  const elements: number[] = [];

  radius.split(",").forEach((element) => {
    try {
      elements.push(parseFloat(element));
    } catch {
      return {
        status: 401,
        body: {
          error: "The Radius must contain only decimals.",
        },
      };
    }
  });

  if (elements.length === 2) elements.push(1000);

  if (elements.length != 3) {
    return {
      status: 401,
      body: {
        error: "A Radius must contain two or three elements.",
      },
    };
  }

  if (elements[2] < 1 || elements[2] > 1000) {
    return {
      status: 401,
      body: {
        error:
          "Distance (dist) out of range. Please specify a search distance between 1 and 1000 meters.",
      },
    };
  }

  const features = await searchByRadius([
    elements[0],
    elements[1],
  ], elements[2]);

  return {
    status: 200,
    body: {
      type: "FeatureCollection",
      search: {
        center: [elements[0], elements[1]],
        distance: elements[2],
      },
      features: features,
    },
  };
}
