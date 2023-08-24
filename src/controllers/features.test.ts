// features.test.ts
import { assertEquals } from 'assert';
import { info } from '../utilities/constants.ts';
import { app } from '../main.ts';

function assertStandardResponseMetadata(resBody: { time: string; host: string }) {
    assertEquals(typeof (resBody.time), 'number');
    assertEquals(typeof (resBody.host), 'string');
    assertEquals(resBody.host, `${info.WHEREABOUTS_NAME} > Feature Search`);
}

// invalid search method

Deno.test('the response without a search method provided', async () => {
    const res = await app.request('/features');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Please provide one method (bbox or radius) to search by.');
});

Deno.test('the response with both search methods provided', async () => {
    const res = await app.request('/features?bbox=0,1,2,3&radius=0,1');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Please provide either a bbox or radius search query.');
});

// bbox search method

Deno.test('the response with the bbox search method - bbox length too small', async () => {
    const res = await app.request('/features?bbox=0,1,2');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Bounding Box (bbox) invalid.');
});

Deno.test('the response with the bbox search method - bbox length too large', async () => {
    const res = await app.request('/features?bbox=0,1,2,3,4');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Bounding Box (bbox) invalid.');
});

Deno.test('the response with the bbox search method - bbox contains letters', async () => {
    const res = await app.request('/features?bbox=0,1,a,3');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Bounding Box (bbox) invalid.');
});

Deno.test('the response with the bbox search method - bbox is too large', async () => {
    const res = await app.request('/features?bbox=-3.197021,53.173119,-2.559814,53.546836');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Bounding Box too large. Maximum size is 1 km2');
});

Deno.test('the response with the bbox search method - bbox is valid', async () => {
    const res = await app.request('/features?bbox=-0.126235,51.509991,-0.119927,51.512936');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.bbox, '-0.126235,51.509991,-0.119927,51.512936');

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 1);
});

Deno.test('the response with the bbox search method - bbox is valid and filter provided', async () => {
    const res = await app.request('/features?bbox=-0.126235,51.509991,-0.119927,51.512936&filter=other.postcode');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.bbox, '-0.126235,51.509991,-0.119927,51.512936');
    assertEquals(resBody.query.filter, 'other.postcode');

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 0);
});

Deno.test('the response with the bbox search method - bbox is valid but there are no results', async () => {
    const res = await app.request('/features?bbox=0.921478,51.507460,0.926285,51.511307');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.bbox, '0.921478,51.507460,0.926285,51.511307');

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 0);
});

// radius search method

Deno.test('the response with the radius search method - radius length too small', async () => {
    const res = await app.request('/features?radius=0');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Radius parameter is invalid.');
});

Deno.test('the response with the radius search method - radius length too large', async () => {
    const res = await app.request('/features?radius=0,1,2,3');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Radius parameter is invalid.');
});

Deno.test('the response with the radius search method - radius contains letters', async () => {
    const res = await app.request('/features?radius=0,a,2');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Radius parameter is invalid.');
});

Deno.test('the response with the radius search method - optional distance is too large', async () => {
    const res = await app.request('/features?radius=-3.197021,53.173119,1001');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Distance outside of acceptable range (1 to 1000 meters).');
});

Deno.test('the response with the radius search method - optional distance is too small', async () => {
    const res = await app.request('/features?radius=-3.197021,53.173119,0.2');
    const resBody = await res.json();
    assertEquals(res.status, 406);
    assertStandardResponseMetadata(resBody);

    // check error message
    assertEquals(resBody.error, 'Distance outside of acceptable range (1 to 1000 meters).');
});

Deno.test('the response with the radius search method - radius is valid', async () => {
    const res = await app.request('/features?radius=-0.126235,51.509991');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.radius.distance, 1000);
    assertEquals(resBody.query.radius.center, [-0.126235, 51.509991]);

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 6);
});

Deno.test('the response with the radius search method - radius is valid and filter provided', async () => {
    const res = await app.request('/features?radius=-0.126235,51.509991&filter=populatedplace.city');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.radius.distance, 1000);
    assertEquals(resBody.query.radius.center, [-0.126235, 51.509991]);
    assertEquals(resBody.query.filter, 'populatedplace.city');

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 1);
});

Deno.test('the response with the radius search method - radius is valid and custom distance supplied', async () => {
    const res = await app.request('/features?radius=-0.126235,51.509991,500');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.radius.distance, 500);
    assertEquals(resBody.query.radius.center, [-0.126235, 51.509991]);

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 3);
});

Deno.test('the response with the radius search method - radius is valid but there are no results', async () => {
    const res = await app.request('/features?radius=0.921478,51.507460');
    const resBody = await res.json();
    assertEquals(res.status, 200);
    assertStandardResponseMetadata(resBody);

    // check query
    assertEquals(resBody.query.radius.distance, 1000);
    assertEquals(resBody.query.radius.center, [0.921478, 51.507460]);

    // check FeatureCollection
    assertEquals(resBody.type, 'FeatureCollection');
    assertEquals(resBody.features.length, 0);
});
