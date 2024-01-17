import { app } from '../main.ts';
import { assertEquals } from 'assert';
import { messages } from '../utilities/messages.ts';

function assertStandardResponseMetadata(resBody: { host: string; endpoint: string }) {
  assertEquals(typeof (resBody.host), 'string');
  assertEquals(resBody.host, `${messages.info.name} (v${messages.info.version})`);
  assertEquals(typeof (resBody.endpoint), 'string');
  assertEquals(resBody.endpoint, '/features');
}

function assertCorrectErrorMessage(errorId: string, resStatus: number, resBody: { error: string }) {
  assertEquals(resStatus, messages.errors[errorId].status);
  assertEquals(resBody.error, messages.errors[errorId].summary);
}

// invalid search method

Deno.test('NO SEACH METHOD', async () => {
  const res = await app.request('/features');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Gen-NoSearchParameter', res.status, resBody);
});

Deno.test('MULTIPLE SEARCH METHODS - NAME AND RADIUS', async () => {
  const res = await app.request('/features?name=x&radius=y');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Gen-MultipleSearchParameters', res.status, resBody);
});

Deno.test('MULTIPLE SEARCH METHODS - RADIUS AND BOUNDS', async () => {
  const res = await app.request('/features?radius=x&bounds=y');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Gen-MultipleSearchParameters', res.status, resBody);
});

Deno.test('MULTIPLE SEARCH METHODS - BOUNDS AND NAME', async () => {
  const res = await app.request('/features?bounds=x&name=y');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Gen-MultipleSearchParameters', res.status, resBody);
});

// name search method

Deno.test('NAME SEARCH', async () => {
  const res = await app.request('/features?name=Waterloo');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.name, 'Waterloo');

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 435);
});

Deno.test('NAME SEARCH WITH CLASS FILTER', async () => {
  const res = await app.request('/features?name=Waterloo&class=transportnetwork.railwaystation');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.name, 'Waterloo');
  assertEquals(resBody.metadata.queryParams.filter.class, 'transportnetwork.railwaystation');

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 3);
});

Deno.test('NAME SEARCH WITH OFFSET', async () => {
  const res = await app.request('/features?name=Waterloo&offset=1000');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertEquals(resBody.info, "The provided 'offset' filter has no effect on a textual query.");
});

// bounds search method

Deno.test('BOUNDS SEARCH - INPUT TOO SMALL', async () => {
  const res = await app.request('/features?bounds=0,1,2');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Bounds-WrongFormat', res.status, resBody);
});

Deno.test('BOUNDS SEARCH - INPUT TOO LONG', async () => {
  const res = await app.request('/features?bounds=0,1,2,3,4');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Bounds-WrongFormat', res.status, resBody);
});

Deno.test('BOUNDS SEARCH - INPUT CONTAIN LETTERS', async () => {
  const res = await app.request('/features?bounds=0,1,a,3');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Bounds-WrongFormat', res.status, resBody);
});

Deno.test('BOUNDS SEARCH - INPUT AREA TOO LARGE', async () => {
  const res = await app.request('/features?bounds=-0.148916,51.487797,-0.078964,51.534324');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Bounds-TooLarge', res.status, resBody);
});

Deno.test('BOUNDS SEARCH - VALID', async () => {
  const res = await app.request('/features?bounds=-0.126235,51.509991,-0.119927,51.512936');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.bounds, [-0.126235, 51.509991, -0.119927, 51.512936]);

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 210);
});

Deno.test('BOUNDS SEARCH - VALID AND WITH FILTER', async () => {
  const res = await app.request(
    '/features?bounds=-0.126235,51.509991,-0.119927,51.512936&class=transportnetwork.namedroad',
  );
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.bounds, [-0.126235, 51.509991, -0.119927, 51.512936]);
  assertEquals(resBody.metadata.queryParams.filter.class, 'transportnetwork.namedroad');

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 31);
});

Deno.test('BOUNDS SEARCH - VALID BUT NO RESULTS', async () => {
  const res = await app.request('/features?bounds=0.921478,51.507460,0.926285,51.511307');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.bounds, [0.921478, 51.507460, 0.926285, 51.511307]);

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 0);
});

// radius search method

Deno.test('RADIUS SEARCH - INPUT TOO SMALL', async () => {
  const res = await app.request('/features?radius=0');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Radius-WrongFormat', res.status, resBody);
});

Deno.test('RADIUS SEARCH - INPUT TOO LONG', async () => {
  const res = await app.request('/features?radius=0,1,2,3');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Radius-WrongFormat', res.status, resBody);
});

Deno.test('RADIUS SEARCH - INPUT CONTAINS LETTERS', async () => {
  const res = await app.request('/features?radius=0,a,2');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Radius-WrongFormat', res.status, resBody);
});

Deno.test('RADIUS SEARCH - DISTANCE TOO SMALL', async () => {
  const res = await app.request('/features?radius=-3.197021,53.173119,0.2');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Radius-SearchDistance', res.status, resBody);
});

Deno.test('RADIUS SEARCH - DISTANCE TOO LARGE', async () => {
  const res = await app.request('/features?radius=-3.197021,53.173119,2001');
  const resBody = await res.json();
  assertStandardResponseMetadata(resBody);
  assertCorrectErrorMessage('Validation-Radius-SearchDistance', res.status, resBody);
});

Deno.test('RADIUS SEARCH - VALID', async () => {
  const res = await app.request('/features?radius=-0.126235,51.509991,2000');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.radius.distance, 2000);
  assertEquals(resBody.metadata.queryParams.radius.center, [-0.126235, 51.509991]);

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 1000);
});

Deno.test('RADIUS SEARCH - VALID AND WITH CLASS FILTER', async () => {
  const res = await app.request(
    '/features?radius=-0.126235,51.509991,1000&class=populatedplace.city',
  );
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.radius.distance, 1000);
  assertEquals(resBody.metadata.queryParams.radius.center, [-0.126235, 51.509991]);
  assertEquals(resBody.metadata.queryParams.filter.class, 'populatedplace.city');

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 1);
});

Deno.test('RADIUS SEARCH - VALID BUT NO RESULTS', async () => {
  const res = await app.request('/features?radius=0.921478,51.507460,1000');
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertStandardResponseMetadata(resBody);

  // check query
  assertEquals(resBody.metadata.queryParams.radius.distance, 1000);
  assertEquals(resBody.metadata.queryParams.radius.center, [0.921478, 51.507460]);

  // check FeatureCollection
  assertEquals(resBody.type, 'FeatureCollection');
  assertEquals(resBody.features.length, 0);
});
