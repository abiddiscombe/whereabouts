import { app } from '../main.ts';
import { assertEquals } from 'assert';
import { messages } from '../utilities/messages.ts';

Deno.test('that the default response is constructed correctly', async () => {
  const res = await app.request('/');
  const resBody = await res.json();
  assertEquals(res.status, 200);

  // body
  assertEquals(typeof (resBody.host), 'string');
  assertEquals(resBody.host, `${messages.info.name} (v${messages.info.version})`);
  assertEquals(typeof (resBody.endpoint), 'string');
  assertEquals(resBody.endpoint, '/');

  // body > capabilities
  assertEquals(resBody.capabilities.length, 4);
  resBody.capabilities.forEach((link: { name: string; href: string; about: string }) => {
    assertEquals(typeof (link.href), 'string');
    assertEquals(typeof (link.name), 'string');
    assertEquals(typeof (link.about), 'string');
  });
});
