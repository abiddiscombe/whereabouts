// src/services/getKeyCount.ts

import { clientAuthentication } from "../utilities/database.ts";

export async function getKeyCount() {
  return await clientAuthentication.count();
}
