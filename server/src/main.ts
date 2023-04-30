// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Application, Router } from "oak";
import { oakCors } from "cors";

import { root } from "./controllers/root.ts";
import { stats } from "./controllers/stats.ts";
import { features } from "./controllers/features.ts";

import { initDatabaseClients } from "./utilities/database.ts";

const server = new Application();
const router = new Router();

router.get("/", root);
router.get("/stats", stats);
router.get("/features", features);

server.use(oakCors());
server.use(router.routes());
server.use(router.allowedMethods());

await initDatabaseClients();

console.info("WHEREABOUTS API Server Started.");
console.info("Listening on http://127.0.0.1:8080.");

await server.listen({
	port: 8080,
});
