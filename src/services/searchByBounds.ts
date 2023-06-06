// services/searchByBounds

import { mongoConnector } from "../utilities/database.ts";

export { searchByBounds };

async function searchByBounds(bbox: number[], classFilter: string) {
  return await mongoConnector.find({
    ...(classFilter) ? { "properties.class": classFilter } : {},
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
