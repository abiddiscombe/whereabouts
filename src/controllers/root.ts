import { type Context, Hono } from 'hono';
import { messages } from '../utilities/messages.ts';

export const rootController = new Hono();

rootController.get('/', (c: Context) => {
  return c.json({
    host: `${messages.info.name} (v${messages.info.version})`,
    endpoint: '/',
    capabilities: [
      {
        href: '/',
        name: messages.endpoints.root.name,
        about: messages.endpoints.root.about,
      },
      {
        href: '/classes',
        name: messages.endpoints.classes.name,
        about: messages.endpoints.classes.about,
      },
      {
        href: '/features',
        name: messages.endpoints.features.name,
        about: messages.endpoints.features.about,
      },
      {
        href: '/metadata',
        name: messages.endpoints.metadata.name,
        about: messages.endpoints.metadata.about,
      },
    ],
  });
});
