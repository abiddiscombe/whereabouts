// root.ts
import { type Context, Hono } from 'hono';
import { info, endpointDescs } from '../utilities/constants.ts';
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
                name: 'Feature Search',
                href: '/features',
                desc: endpointDescs.features,
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
