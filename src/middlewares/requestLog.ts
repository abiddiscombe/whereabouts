// src/middlewares/requestLog.ts

export function requestLogMiddleware(ctx: any, next: any) {
    const url = ctx.request.url;
    const code = ctx.response.status.toString();
    if (code.slice(0, 1) === 500) {
        console.warn(`[WARN] New Request (${code} / ERROR): ${url}`);
    } else {
        console.info(`[OKAY] New Request (${code}): ${url}`);
    }
}
