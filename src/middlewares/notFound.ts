// src/middlewares/notFound.ts

// deno-lint-ignore no-explicit-any
export function notFound(ctx: any) {
  ctx.response.status = 404;
  ctx.response.body = {
    ...ctx.state.metadata,
    error: {
      code: 404,
      desc: 'Resource not found. Please check your URL.',
    },
  };
}
