// classes.test.ts
import { assertEquals } from 'assert';
import { info } from '../utilities/constants.ts';
import { app } from '../main.ts';

Deno.test('that the default response is constructed correctly', async () => {
    const res = await app.request('/classes');
    const resBody = await res.json();
    assertEquals(res.status, 200);

    // body > metadata
    assertEquals(typeof (resBody.time), 'number');
    assertEquals(typeof (resBody.host), 'string');
    assertEquals(resBody.host, `${info.WHEREABOUTS_NAME} > Class List`);

    // body > classes
    resBody.classes.forEach((classname: string) => {
        assertEquals(typeof (classname), 'string');
    });
});
