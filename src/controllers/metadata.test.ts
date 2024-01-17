import { app } from '../main.ts';
import { assertEquals } from 'assert';
import { messages } from '../utilities/messages.ts';

Deno.test('that the default response is constructed correctly', async () => {
  const res = await app.request('/metadata');
  const resBody = await res.json();
  assertEquals(res.status, 200);

  // body
  assertEquals(typeof (resBody.host), 'string');
  assertEquals(resBody.host, `${messages.info.name} (v${messages.info.version})`);
  assertEquals(typeof (resBody.endpoint), 'string');
  assertEquals(resBody.endpoint, '/metadata');

  // body > metadata
  assertEquals(resBody.metadata.service.version, messages.info.version);
  assertEquals(typeof (resBody.metadata.dataset.totalFeatures), 'number');
});
