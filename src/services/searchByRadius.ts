// services/searchByRadius

import { clientFeatures } from "../utilities/database.ts";

export { searchByRadius };

async function searchByRadius(
  geom: number[],
  distance: number,
  classFilter: string,
) {
  return await clientFeatures.find({
    ...(classFilter) ? { "properties.class": classFilter } : {},
    "geometry.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [geom[0], geom[1]],
        },
        $maxDistance: distance,
      },
    },
  }).toArray();
}
