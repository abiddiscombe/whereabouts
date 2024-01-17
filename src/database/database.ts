import { Collection, Document, MongoClient } from 'mongodb';

interface mongoConnectorType {
  features: Collection<Document> | null;
  metadata: Collection<Document> | null;
}

export const mongoConnector: mongoConnectorType = {
  features: null,
  metadata: null,
};

export async function initializeMongoConnector() {
  const mongoConnString = Deno.env.get('MONGO_URL') || '';
  const mongoDatabaseName = Deno.env.get('MONGO_DATABASE') || '';

  if (mongoConnector.features && mongoConnector.metadata) {
    return;
  }

  if (!mongoConnString) {
    throw new Error("Environment Variable 'MONGO_URL' is missing.");
  }
  
  if (!mongoDatabaseName) {
    throw new Error("Environment Variable 'MONGO_DATABASE' is missing.");
  }

  try {
    const client = new MongoClient(mongoConnString);
    await client.connect();
    mongoConnector.features = client.db(mongoDatabaseName).collection('features');
    mongoConnector.metadata = client.db(mongoDatabaseName).collection('metadata');
  } catch {
    throw new Error('Failed to connect to MongoDB instance.');
  }
}
