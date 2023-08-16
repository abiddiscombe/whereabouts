// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Hono } from 'hono';
import { bearerAuth, cors, logger } from 'honoMiddleware';
import { MiddlewareConfig } from './utilities/middleware.ts';
import { initializeMongoConnector } from './utilities/database.ts';

import { rootController } from './controllers/root.ts';
import { featuresController } from './controllers/features.ts';

await initializeMongoConnector();

const app = new Hono();
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
app.route('/features', featuresController);

app.notFound((c) => {
    return c.json({
        error: {
            code: 404,
            desc: 'Resource not found. Please check your URL.',
        },
    }, 404);
});

console.info('[INFO] WHEREABOUTS API Server Started (Port 8080).');
Deno.serve({ port: 8080 }, app.fetch);
