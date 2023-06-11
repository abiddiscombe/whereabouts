// src/controllers/root.ts

import { getFeatureCount } from '../services/getFeatureCount.ts';

// deno-lint-ignore no-explicit-any
export async function root(ctx: any) {
    const totalFeatures = await _featureCount();

    ctx.response.body = {
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
    };
}

async function _featureCount() {
    try {
        return await getFeatureCount();
    } catch {
        return null;
    }
}
