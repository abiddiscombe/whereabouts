// root.ts
import { type Context, Hono } from 'hono';
import { getFeatureCount } from '../services/getFeatureCount.ts';

export const rootController = new Hono();

rootController.get('/', async (c: Context) => {
    const totalFeatures = await _featureCount();

    return c.json({
        time: Math.floor(Date.now() / 1000),
        host: 'Whereabouts API',
        info: {
            version: '2.0.0',
            totalFeatures: totalFeatures,
        },
        links: [
            {
                name: 'Feature Search',
                href: '/features',
                desc: 'Returns GeoJSON features. Supports either bbox or radial search methods.',
            },
        ],
    });
});

async function _featureCount() {
    try {
        return await getFeatureCount();
    } catch {
        return null;
    }
}
