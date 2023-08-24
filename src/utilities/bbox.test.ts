// bbox.test.ts
import { assertEquals } from 'assert';
import { bboxTooLarge } from './bbox.ts';

const samples = [
    [-1.409941, 50.898161, -1.389298, 50.908959],
    [-1.405563, 50.901057, -1.394320, 50.906727],
];

Deno.test('that a bbox greater-then the max area returns true', () => {
    const result = bboxTooLarge(samples[0]);
    assertEquals(result, true);
});

Deno.test('that a bbox smaller-than the max area returns false', () => {
    const result = bboxTooLarge(samples[1]);
    assertEquals(result, false);
});
