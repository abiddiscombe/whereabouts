// root.ts
import { type Context, Hono } from 'hono';
import { info } from '../utilities/constants.ts';
import { getFeatureCount } from '../services/getFeatureCount.ts';

export const rootController = new Hono();

rootController.get('/', async (c: Context) => {
    const totalFeatures = await _featureCount();

    return c.json({
        time: Math.floor(Date.now() / 1000),
        host: info.WHEREABOUTS_NAME,
        info: {
            version: info.WHEREABOUTS_VERSION,
            totalFeatures: totalFeatures,
        },
        links: [
            {
                name: 'Class List',
                href: '/classes',
                desc: 'Returns a list of available classes by which searches can be filtered on',
            },
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
