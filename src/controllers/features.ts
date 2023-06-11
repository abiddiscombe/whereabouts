// controllers/features.ts

import { bboxTooLarge } from '../utilities/bbox.ts';
import { searchByRadius } from '../services/searchByRadius.ts';
import { searchByBounds } from '../services/searchByBounds.ts';

// deno-lint-ignore no-explicit-any
export async function features(ctx: any) {
    const rawParams = {
        bbox: ctx.request.url.searchParams.get('bbox') || '',
        radius: ctx.request.url.searchParams.get('radius') || '',
        filter: ctx.request.url.searchParams.get('filter')
            ? ctx.request.url.searchParams.get('filter').toLowerCase()
            : '',
    };

    const resHeading = {
        time: Math.floor(Date.now() / 1000),
        host: 'Whereabouts API > Feature Search',
    };

    if (rawParams.bbox && rawParams.radius) {
        ctx.response.status = 406;
        ctx.response.body = {
            ...resHeading,
            error: 'Please provide either a bbox or radius search query.',
        };
        return;
    }

    if (rawParams.bbox) {
        const response = await _handleBboxQuery(rawParams.bbox, rawParams.filter);
        ctx.response.status = response.status;
        ctx.response.body = {
            ...resHeading,
            ...response.body,
        };
        return;
    }

    if (rawParams.radius) {
        const response = await _handleRadiusQuery(rawParams.radius, rawParams.filter);
        ctx.response.status = response.status;
        ctx.response.body = {
            ...resHeading,
            ...response.body,
        };
        return;
    }

    ctx.response.status = 406;
    ctx.response.body = {
        ...resHeading,
        error: 'Please provide one method (bbox or radius) to search by.',
    };
}

async function _handleBboxQuery(bbox: string, filter: string) {
    const bboxFiltered = _stringToFloatArray(bbox);

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
        const features = await searchByBounds(bboxFiltered, filter);
        return {
            status: 200,
            body: {
                query: {
                    ..._featureLimitWarning(features.length),
                    ...(filter) ? { filter: filter } : {},
                    bbox: bbox,
                },
                type: 'FeatureCollection',
                features: features,
            },
        };
    } catch {
        return {
            status: 500,
            body: {
                error: 'Internal server error. Please try again later.',
            },
        };
    }
}

async function _handleRadiusQuery(radius: string, filter: string) {
    const center = _stringToFloatArray(radius);
    const distance: number = (center.length === 3) ? center.pop() : 1000;

    if (center.length !== 2) {
        return {
            status: 401,
            body: {
                error: 'Radius parameter is invalid.',
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
        const features = await searchByRadius(center, distance, filter);
        return {
            status: 200,
            body: {
                query: {
                    ..._featureLimitWarning(features.length),
                    ...(filter) ? { filter: filter } : {},
                    radius: {
                        center: center,
                        distance: distance,
                    },
                },
                type: 'FeatureCollection',
                features: features,
            },
        };
    } catch {
        return {
            status: 500,
            body: {
                error: 'Internal server error. Please try again later.',
            },
        };
    }
}

function _stringToFloatArray(input: string) {
    try {
        return input.split(',').map((element) => {
            if (element.toUpperCase() != element) {
                throw new Error();
            }
            return parseFloat(element);
        });
    } catch {
        return [];
    }
}

function _featureLimitWarning(numOfFeatures: number) {
    return (numOfFeatures === 1000) ? { warning: 'Feature limit reached. Additional features may be available' } : {};
}
