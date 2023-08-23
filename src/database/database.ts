// database.ts
import { MongoClient } from 'mongodb';

// deno-lint-ignore no-explicit-any
export let mongoConnector: any;

export async function initializeMongoConnector() {
    if (mongoConnector) return;
    const mongoConnString = Deno.env.get('MONGO_URL') || '';
    const mongoDatabaseName = Deno.env.get('MONGO_DATABASE') || '';

    if (!mongoConnString) {
        throw new Error('Environment Variable \'MONGO_URL\' is missing.');
    } else if (!mongoDatabaseName) {
        throw new Error('Environment Variable \'MONGO_DATABASE\' is missing.');
    }

    try {
        const client = new MongoClient(mongoConnString);
        await client.connect();
        mongoConnector = client.db(mongoDatabaseName).collection('features');
    } catch {
        throw new Error('Failed to connect to MongoDB instance.');
    }
}
