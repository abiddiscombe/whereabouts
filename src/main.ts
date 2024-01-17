// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Hono } from 'hono';
import { cors, logger, prettyJSON } from 'honoMiddleware';
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

const middlewareConfig = {
  cors: {
    origin: readCorsDomain(),
  },
  prettyJSON: {
    space: 4,
  },
};

app.use('*', logger());
app.use('*', cors(middlewareConfig.cors));
app.use('*', prettyJSON(middlewareConfig.prettyJSON));

app.route('/', rootController);
app.route('/classes', classesController);
app.route('/features', featuresController);
app.route('/metadata', metadataController);

app.notFound(notFound);

console.info(`${messages.info.name} (v${messages.info.version}) - Started.`);
Deno.serve({ port: 8080 }, app.fetch);
