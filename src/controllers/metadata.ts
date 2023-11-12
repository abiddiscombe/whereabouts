import { type Context, Hono } from 'hono';
import { messages } from '../utilities/messages.ts';
import { getFeatureCount } from '../services/getFeatureCount.ts';

export const metadataController = new Hono();

metadataController.get('/', async (c: Context) => {
  const totalFeatures = await getFeatureCount();

  return c.json({
    host: `${messages.info.name} (v${messages.info.version})`,
    endpoint: '/metadata',
    metadata: {
      service: {
        version: messages.info.version,
      },
      dataset: {
        totalFeatures: totalFeatures,
      },
    },
  });
});
