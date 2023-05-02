// services/searchByBounds

import { clientFeatures } from "../utilities/database.ts";

export { searchByBounds };

async function searchByBounds(bbox: number[]) {
  return await clientFeatures.find({
    "geometry.coordinates": {
      $geoWithin: {
        $box: [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
      },
    },
  }).toArray();
}
