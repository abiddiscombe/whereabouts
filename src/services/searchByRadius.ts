// services/searchByRadius

import { mongoConnector } from "../utilities/database.ts";

export { searchByRadius };

async function searchByRadius(geom: number[], distance: number, filter: string) {
  return await mongoConnector.find({
    ...(filter) ? { "properties.class": filter } : {},
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
