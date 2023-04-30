// services/searchByRadius

import { clientFeatures } from "../utilities/database.ts";

export { searchByRadius };

async function searchByRadius(geom: number[], distance: number) {
	return await clientFeatures.find({
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
