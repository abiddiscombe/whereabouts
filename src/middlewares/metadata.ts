// src/middlewares/metadata.ts

// deno-lint-ignore no-explicit-any
export async function metadata(ctx: any, next: any) {
  ctx.state.metadata = {
    time: Math.floor(Date.now() / 1000),
    title: 'Whereabouts API',
  };
  await next();
}
