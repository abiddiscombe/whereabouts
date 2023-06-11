// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Application, Router } from 'oak';
import { initializeMongoConnector } from './utilities/database.ts';

import { http404Middleware } from './middlewares/http404.ts';
import { requestLogMiddleware } from './middlewares/requestLog.ts';
import { authMiddleware, initAuthMiddleware } from './middlewares/auth.ts';
import { corsMiddleware, initCorsMiddleware } from './middlewares/cors.ts';

import { root } from './controllers/root.ts';
import { features } from './controllers/features.ts';

initAuthMiddleware();
initCorsMiddleware();
await initializeMongoConnector();

const server = new Application();
const router = new Router();

router.get('/', root);
router.get('/features', features);

server.use(corsMiddleware);
server.use(authMiddleware);
server.use(router.routes());
server.use(router.allowedMethods());
server.use(http404Middleware);
server.use(requestLogMiddleware);

server.addEventListener('listen', ({ secure, hostname, port }) => {
    const protocol = secure ? 'https' : 'http';
    hostname = hostname ?? 'localhost';
    console.info('[INFO] WHEREABOUTS API Server Started.');
    console.info(`[INFO] Listening on ${protocol}://${hostname}:${port}.`);
});

await server.listen({
    port: 8080,
});
