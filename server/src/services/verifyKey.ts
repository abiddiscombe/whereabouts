// src/services/verifyKey.ts

import { clientAuthentication } from "../utilities/database.ts";

export { verifyKey };

async function verifyKey(userKey: string) {
	const matches = await clientAuthentication.find({
		"key": userKey,
		"enabled": true,
	}).toArray();

	return (matches.length == 0) ? false : true;
}
