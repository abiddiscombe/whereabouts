// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Hono } from 'hono';
import { bearerAuth, cors, logger } from 'honoMiddleware';
import { MiddlewareConfig } from './utilities/middleware.ts';
import { initializeMongoConnector } from './database/database.ts';
import { errors, info } from './utilities/constants.ts';
import { rootController } from './controllers/root.ts';
import { classesController } from './controllers/classes.ts';
import { featuresController } from './controllers/features.ts';

await initializeMongoConnector();

export const app = new Hono();
const mwConfig = MiddlewareConfig();

// enable cors if requested
if (mwConfig.cors.enabled) {
    app.use(
        '*',
        cors({
            origin: mwConfig.cors.origin,
        }),
    );
}

// enable auth if requested
if (mwConfig.auth.token) {
    app.use(
        '*',
        bearerAuth({
            token: mwConfig.auth.token,
        }),
    );
}

app.use('*', logger());
app.route('/', rootController);
app.route('/classes', classesController);
app.route('/features', featuresController);

app.notFound((c) => {
    return c.json({
        error: {
            code: 404,
            desc: errors.HTTP_404,
        },
    }, 404);
});

console.info(`${info.WHEREABOUTS_NAME} (${info.WHEREABOUTS_VERSION}) Server Started`);
Deno.serve({ port: 8080 }, app.fetch);
