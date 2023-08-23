// constants.test.ts
import { assertEquals } from "assert";
import {
    info,
    errors,
    endpointDescs
} from './constants.ts';

Deno.test('that the required info params are in the correct format', () => {
    assertEquals(typeof(info.WHEREABOUTS_NAME), 'string');
    assertEquals(typeof(info.WHEREABOUTS_VERSION), 'string');
});

Deno.test('that the required error params are in the correct format', () => {
    assertEquals(typeof(errors.HTTP_404), 'string');
    assertEquals(typeof(errors.HTTP_500), 'string');
});

Deno.test('that the required endpointDesc params are in the correct format', () => {
    assertEquals(typeof(endpointDescs.features), 'string');
});