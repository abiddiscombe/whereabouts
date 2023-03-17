// src/main.ts

// whereabouts (GNU GPL 3.0)
// https://github.com/abiddiscombe/whereabouts

import { Application, Router } from "oak";
import { oakCors } from "cors";

import root from "./controllers/root.ts";
import v1 from "./controllers/v1.ts";

const server = new Application();
const router = new Router();

router.get("/", root.index);
router.get("/v1", v1.index);

server.use(oakCors());
server.use(router.routes());
server.use(router.allowedMethods());

console.info("WHEREABOUTS Server Started.");
console.info("Listening on 8080");

await server.listen({
  port: 8080,
});
