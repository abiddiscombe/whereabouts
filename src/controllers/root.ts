// src/controllers/root.ts

export { root };

// deno-lint-ignore no-explicit-any
function root(ctx: any) {
  ctx.response.body = {
    ...ctx.state.metadata,
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
