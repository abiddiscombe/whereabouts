// src/utilities/bbox.ts

import area from "turf-area";
import bboxPolygon from "turf-bboxPolygon";

export { bboxTooLarge };

// (const) define max bbox extent
const MAX_BBOX_SIZE = 1000000;

function bboxTooLarge(bbox: number[]) {
  const featurePolygon = bboxPolygon(bbox);
  const featurePolygonArea = area(featurePolygon);
  return (featurePolygonArea >= MAX_BBOX_SIZE) ? true : false;
}
