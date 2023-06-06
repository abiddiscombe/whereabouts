// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Application, Router } from "oak";
import { initializeMongoConnector } from "./utilities/database.ts";

import { metadata } from "./middlewares/metadata.ts";
import { auth, initializeAuth } from "./middlewares/auth.ts";
import { cors, initializeCors } from "./middlewares/cors.ts";

import { root } from "./controllers/root.ts";
import { stats } from "./controllers/stats.ts";
import { features } from "./controllers/features.ts";

initializeAuth();
initializeCors();
await initializeMongoConnector();

const server = new Application();
const router = new Router();

router.get("/", root);
router.get("/stats", stats);
router.get("/features", features);

server.use(cors);
server.use(auth);
server.use(metadata);
server.use(router.routes());
server.use(router.allowedMethods());

console.info("WHEREABOUTS API Server Started.");
console.info("Listening on http://127.0.0.1:8080.");

await server.listen({
  port: 8080,
});
