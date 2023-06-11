// src/utilities/bbox.ts

import * as turf from '@turf/turf';

export function bboxTooLarge(bbox: number[]) {
    const featurePolygon = turf.bboxPolygon(bbox);
    const featurePolygonArea = turf.area(featurePolygon);
    return (featurePolygonArea >= 1000000) ? true : false;
}
