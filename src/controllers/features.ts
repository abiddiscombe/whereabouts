// features.ts
import { type Context, Hono, HTTPException } from 'hono';
import { errors, info } from '../utilities/constants.ts';
import { bboxTooLarge } from '../utilities/bbox.ts';
import { searchByRadius } from '../services/searchByRadius.ts';
import { searchByBounds } from '../services/searchByBounds.ts';

export const featuresController = new Hono();

featuresController.get('/', async (c: Context) => {
    const bbox = c.req.query('bbox') || '';
    const radius = c.req.query('radius') || '';
    const filter = c.req.query('filter') || '';

    c.set('header', {
        time: Math.floor(Date.now() / 1000),
        host: `${info.WHEREABOUTS_NAME} > Feature Search`,
    });

    if (bbox && radius) {
        throw new HTTPException(406, {
            message: JSON.stringify({
                ...c.get('header'),
                error: 'Please provide either a bbox or radius search query.',
            }),
        });
    }

    if (bbox) {
        const bboxFiltered = _stringToFloatArray(bbox);

        // check length is acceptable
        if (bboxFiltered.length !== 4) {
            throw new HTTPException(406, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: 'Bounding Box (bbox) invalid.',
                }),
            });
        }

        // check area within the hard limit
        if (bboxTooLarge(bboxFiltered)) {
            throw new HTTPException(406, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: 'Bounding Box too large. Maximum size is 1 km2',
                }),
            });
        }

        // execute request
        try {
            const features = await searchByBounds(bboxFiltered, filter);
            return c.json({
                ...c.get('header'),
                query: {
                    ..._featureLimitWarning(features.length),
                    ...(filter) ? { filter: filter } : {},
                    bbox: bbox,
                },
                type: 'FeatureCollection',
                features: features,
            });
        } catch {
            throw new HTTPException(500, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: errors.HTTP_500,
                }),
            });
        }
    }

    if (radius) {
        const centerFiltered = _stringToFloatArray(radius);
        const distanceFiltered: number = (centerFiltered.length === 3) ? centerFiltered.pop() || 1000 : 1000;

        // check center-point is acceptable
        if (centerFiltered.length !== 2) {
            throw new HTTPException(406, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: 'Radius parameter is invalid.',
                }),
            });
        }

        // check distance is acceptable
        if (distanceFiltered < 1 || distanceFiltered > 1000) {
            throw new HTTPException(406, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: 'Distance outside of acceptable range (1 to 1000 meters).',
                }),
            });
        }

        try {
            const features = await searchByRadius(
                centerFiltered,
                distanceFiltered,
                filter,
            );
            return c.json({
                ...c.get('header'),
                query: {
                    ..._featureLimitWarning(features.length),
                    ...(filter) ? { filter: filter } : {},
                    radius: {
                        center: centerFiltered,
                        distance: distanceFiltered,
                    },
                },
                type: 'FeatureCollection',
                features: features,
            });
        } catch {
            throw new HTTPException(500, {
                message: JSON.stringify({
                    ...c.get('header'),
                    error: errors.HTTP_500,
                }),
            });
        }
    }

    throw new HTTPException(406, {
        message: JSON.stringify({
            ...c.get('header'),
            error: 'Please provide one method (bbox or radius) to search by.',
        }),
    });
});

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
    return (numOfFeatures === 1000)
        ? {
            warning: 'Feature limit reached. Additional features may be available',
        }
        : {};
}
