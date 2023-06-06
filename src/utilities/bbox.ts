// src/utilities/bbox.ts

import area from 'turf-area';
import bboxPolygon from 'turf-bboxPolygon';

export function bboxTooLarge(bbox: number[]) {
  const featurePolygon = bboxPolygon(bbox);
  const featurePolygonArea = area(featurePolygon);
  return (featurePolygonArea >= 1000000) ? true : false;
}
