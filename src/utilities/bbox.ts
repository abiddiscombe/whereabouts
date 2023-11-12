import * as turf from '@turf/turf';

export const bbox = {
  isValidSize,
};

function isValidSize(bbox: number[]) {
  // @ts-ignore: turf bug requires 6 params, but only need four.
  const featurePolygon = turf.bboxPolygon(bbox);
  const featurePolygonArea = turf.area(featurePolygon);
  return (featurePolygonArea <= 4000000) ? true : false;
}
