// src/services/getAuthTokenCount.ts

import { clientAuthentication } from "../utilities/database.ts";

export async function getAuthTokenCount() {
  return await clientAuthentication.count();
}
