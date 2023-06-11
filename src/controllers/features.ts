// controllers/features.ts

import { bboxTooLarge } from '../utilities/bbox.ts';
import { searchByRadius } from '../services/searchByRadius.ts';
import { searchByBounds } from '../services/searchByBounds.ts';
import { stringToFloatArray } from '../utilities/conversion.ts';

// deno-lint-ignore no-explicit-any
export async function features(ctx: any) {
    const rawParams = {
        bbox: ctx.request.url.searchParams.get('bbox') || '',
        radius: ctx.request.url.searchParams.get('radius') || '',
        filter: ctx.request.url.searchParams.get('filter')
            ? ctx.request.url.searchParams.get('filter').toLowerCase()
            : ''
    }

    const resHeading = {
        time: Math.floor(Date.now() / 1000),
        host: 'Whereabouts API > Feature Search',
    };

    if (rawParams.bbox && rawParams.radius) {
        ctx.response.status = 406;
        ctx.response.body = { ...resHeading,
            error: 'Please provide either a bbox or radius search query.'
        };
        return;
    }
    
    if (rawParams.bbox) {
        const response = await _handleBboxQuery(rawParams.bbox, rawParams.filter);
        ctx.response.status = response.status;
        ctx.response.body = { ...resHeading, ...response.body };
        return;
    }

    if (rawParams.radius) {
        const response = await _handleRadiusQuery(rawParams.radius, rawParams.filter);
        ctx.response.status = response.status;
        ctx.response.body = { ...resHeading, ...response.body };
        return;
    }

    ctx.response.status = 406;
    ctx.response.body = { ...resHeading,
        error: 'Please provide one method (bbox or radius) to search by.'
    }
}

async function _handleBboxQuery(bbox: string, filter: string) {
    const bboxFiltered = stringToFloatArray(bbox);

    if (bboxFiltered.length !== 4) {
        return {
            status: 401,
            body: {
                error: 'Bounding Box (bbox) invalid.',
            },
        };
    }

    if (bboxTooLarge(bboxFiltered)) {
        return {
            status: 401,
            body: {
                error: 'Bounding Box too large. Maximum size is 1 km2',
            },
        };
    }

    try {
        const features: any = await searchByBounds(bboxFiltered, filter);
        return {
            status: 200,
            body: {
                query: {
                    ...(features.length === 1000)
                        ? { warning: "Feature limit reached. Additional features may be available" }
                        : {},
                    ...(filter)
                        ? { filter: filter }
                        : {},
                    bbox: bbox,
                },
                type: 'FeatureCollection',
                features: features
            }
        };
    } catch {
        return {
            status: 500,
            body: {
                error: 'Internal server error. Please try again later.'
            }
        };
    }
}

async function _handleRadiusQuery(radius: string, filter: string) {
    const center = stringToFloatArray(radius);
    const distance = (center.length === 3) ? center.pop() : 1000;

    if (center.length !== 2) {
        return {
            status: 401,
            body: {
                error: 'Radius (radius) invalid.',
            },
        };
    }

    if (distance < 1 || distance > 1000) {
        return {
            status: 401,
            body: {
                error: 'Distance outside of acceptable range (1 to 1000 meters).',
            },
        };
    }

    try {
        const features: any = await searchByRadius(center, distance, filter);
        return {
            status: 200,
            body: {
                query: {
                    ...(features.length === 1000)
                        ? { warning: "Feature limit reached. Additional features may be available" }
                        : {},
                    ...(filter)
                        ? { filter: filter }
                        : {},
                    radius: {
                        center: center,
                        distance: distance
                    }
                },
                type: 'FeatureCollection',
                features: features
            }
        };
    } catch {
        return {
            status: 500,
            body: {
                error: 'Internal server error. Please try again later.'
            }
        };
    }
}
