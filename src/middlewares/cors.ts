// src/middlewares/cors.ts

const _cors = {
    origin: "*",
    enabled: false
};

// deno-lint-ignore no-explicit-any
export async function cors(ctx: any, next: any) {
    if (_cors.enabled) {
        ctx.response.headers.set("Access-Control-Allow-Origin", _cors.origin);
    }
    await next();
}

export function initializeCors() {
  const userOrigin = Deno.env.get("CORS_ORIGIN") || "";
  if (userOrigin === "*") {
    _cors.enabled = true;
    console.info("CORS has been enabled for any (wildcard) origin.")
  } else if (userOrigin && !userOrigin.includes(" ")) {
    _cors.enabled = true;
    _cors.origin = userOrigin;
    console.info(`CORS has been enabled for the '${userOrigin}' origin.`)
  }
}