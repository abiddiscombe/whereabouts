// utilities/database.ts

import { MongoClient } from "mongo";

export { clientAuthentication, clientFeatures, initDatabaseClients };

// deno-lint-ignore no-explicit-any
let clientFeatures: any;
// deno-lint-ignore no-explicit-any
let clientAuthentication: any;

async function initDatabaseClients() {
  if (clientFeatures) { // assume clientAuthentication shares state
    console.warn("The clients are already initialised. Aborting.");
    return;
  }

  const uri = Deno.env.get("MONGO_URI") || undefined;

  if (!uri) {
    throw new Error(
      "The environment variable 'MONGO_URI' was not found. Aborting.",
    );
  }

  try {
    const mongoFeatures = new MongoClient();
    await mongoFeatures.connect(uri);
    clientFeatures = await mongoFeatures.database().collection("main");

    const mongoAuthentication = new MongoClient();
    await mongoAuthentication.connect(uri);
    clientAuthentication = await mongoAuthentication.database().collection(
      "authentication",
    );
  } catch {
    throw new Error("Failed to connect to MongoDB. Aborting.");
  }
}
