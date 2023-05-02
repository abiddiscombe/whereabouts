// src/controllers/root.ts

import { newHeader } from "../utilities/newHeader.ts";

export { root };

// deno-lint-ignore no-explicit-any
function root(ctx: any) {
  const res = newHeader("Service Capabilities / Endpoints");

  ctx.response.body = {
    ...res,
    capabilities: [
      {
        href: "/stats",
        methods: ["GET"],
        description:
          "Returns statistics related to service and dataset health.",
      },
      {
        href: "/features",
        methods: ["GET"],
        description:
          "Returns dataset features as determined by client search parameters.",
      },
    ],
  };
}
