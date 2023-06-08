// src/middlewares/auth.ts

const _auth = {
  token: '',
};

// deno-lint-ignore no-explicit-any
export async function authMiddleware(ctx: any, next: any) {
  if (!_auth.token) {
    await next();
    return;
  }

  const userToken = ctx.request.headers.get('authorization')?.split(' ')?.[1];

  if (userToken === _auth.token) {
    await next();
    return;
  }

  ctx.response.status = 401;
  ctx.response.body = {
    error: {
      code: 401,
      desc: 'Unauthorized. A valid bearer token is required.',
    },
  };
}

export function initAuthMiddleware() {
  const token = Deno.env.get('AUTH_TOKEN');
  if (token) {
    if (token.length < 20) {
      throw Error('Variable \'AUTH_TOKEN\' is not of suitable length (20+).');
    }
    _auth.token = token;
  }
}
