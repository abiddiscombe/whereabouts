// src/middlewares/requestLog.ts

// deno-lint-ignore no-explicit-any
export async function requestLogMiddleware(ctx: any, next: any) {
    const url = ctx.request.url;
    console.warn(`[INFO] New Request: ${url}`);
    await next();
}
