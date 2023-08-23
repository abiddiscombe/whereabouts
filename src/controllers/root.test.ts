// root.test.ts
import { assertEquals } from "assert";
import { info } from "../utilities/constants.ts";
import { app } from '../main.ts';

Deno.test('that the default response is constructed correctly', async () => {
    const res = await app.request('/');
    const resBody = await res.json();
    assertEquals(res.status, 200);

    // body > metadata
    assertEquals(typeof(resBody.time), 'number');
    assertEquals(typeof(resBody.host), 'string');
    assertEquals(typeof(resBody.info.version), 'string');
    assertEquals(typeof(resBody.info.totalFeatures), 'number');
    assertEquals(resBody.host, info.WHEREABOUTS_NAME);
    assertEquals(resBody.info.version, info.WHEREABOUTS_VERSION);

    // body > links
    assertEquals(resBody.links.length, 1);
    resBody.links.forEach((link: { name: string, href: string, desc: string}) => {
        assertEquals(typeof(link.name), 'string');
        assertEquals(typeof(link.href), 'string');
        assertEquals(typeof(link.desc), 'string');
    });
})