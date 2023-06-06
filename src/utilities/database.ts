// utilities/database.ts

import { MongoClient } from "mongo";

export { dbClient, initializeDbClient };

// deno-lint-ignore no-explicit-any
let dbClient: any;

async function initializeDbClient() {
  if (dbClient) {
    console.warn("The client is already initialised.");
    return;
  }

  const uri = Deno.env.get("MONGO_URI") || undefined;

  if (!uri) {
    throw new Error(
      "The environment variable 'MONGO_URI' was not found. Aborting.",
    );
  }

  try {
    const mongoClient = new MongoClient();
    await mongoClient.connect(uri);
    dbClient = await mongoClient.database().collection("features");
  } catch {
    throw new Error("Failed to connect to MongoDB. Aborting.");
  }
}
