// middleware.ts

export function MiddlewareConfig() {
    const authEnv = Deno.env.get('AUTH_TOKEN') || '';
    const corsEnv = Deno.env.get('CORS_ORIGIN') || '';

    if (authEnv && authEnv.length < 20) {
        throw new Error(
            'Variable \'AUTH_TOKEN\' is not of suitable length (20+).',
        );
    }

    return {
        auth: {
            enabled: (authEnv) ? true : false,
            token: authEnv,
        },
        cors: {
            enabled: (corsEnv) ? true : false,
            origin: corsEnv,
        },
    };
}
