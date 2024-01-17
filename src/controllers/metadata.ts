import { type Context, Hono } from 'hono';
import { messages } from '../utilities/messages.ts';
import { getMetadata } from '../services/getMetadata.ts';
import { getClassList } from '../services/getClassList.ts';
import { getFeatureCount } from '../services/getFeatureCount.ts';

export const metadataController = new Hono();

metadataController.get('/', async (c: Context) => {
  const classes = await getClassList();
  const totalClasses = classes.length;
  const totalFeatures = await getFeatureCount();
  const otherMetadata = await getMetadata();

  return c.json({
    host: `${messages.info.name} (v${messages.info.version})`,
    endpoint: '/metadata',
    metadata: {
      service: {
        version: messages.info.version,
      },
      dataset: {
        name: otherMetadata.name,
        license: otherMetadata.license,
        version: otherMetadata.version,
        documentation: otherMetadata.documentation,
        totalClasses: totalClasses,
        totalFeatures: totalFeatures,
      },
    },
  });
});
