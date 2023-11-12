// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Hono } from 'hono';
import { cors, logger } from 'honoMiddleware';
import { readCorsDomain } from './utilities/readCorsDomain.ts';
import { initializeMongoConnector } from './database/database.ts';
import { messages } from './utilities/messages.ts';
import { notFound } from './utilities/notFound.ts';
import { rootController } from './controllers/root.ts';
import { classesController } from './controllers/classes.ts';
import { featuresController } from './controllers/features.ts';
import { metadataController } from './controllers/metadata.ts';

await initializeMongoConnector();

export const app = new Hono();

app.use(
  '*',
  cors({
    origin: readCorsDomain(),
  }),
);

app.use('*', logger());
app.route('/', rootController);
app.route('/classes', classesController);
app.route('/features', featuresController);
app.route('/metadata', metadataController);

app.notFound(notFound);

console.info(`${messages.info.name} (v${messages.info.version}) - Started.`);
Deno.serve({ port: 8080 }, app.fetch);
