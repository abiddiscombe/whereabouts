// middleware.test.ts
import { assertEquals } from 'assert';
import { MiddlewareConfig } from './middleware.ts';

Deno.test('that an empty middleware config is returned', () => {
    Deno.env.set('AUTH_TOKEN', '');
    Deno.env.set('CORS_ORIGIN', '');
    const result = MiddlewareConfig();
    assertEquals(result, {
        auth: {
            enabled: false,
            token: '',
        },
        cors: {
            enabled: false,
            origin: '',
        },
    });
});

Deno.test('that a valid middleware is returned when environment vars are set', () => {
    Deno.env.set('AUTH_TOKEN', 'testMiddlewareValueForAuth');
    Deno.env.set('CORS_ORIGIN', 'testMiddlewareValueForCors');
    const result = MiddlewareConfig();
    assertEquals(result, {
        auth: {
            enabled: true,
            token: 'testMiddlewareValueForAuth',
        },
        cors: {
            enabled: true,
            origin: 'testMiddlewareValueForCors',
        },
    });
});
