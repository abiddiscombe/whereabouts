import { mongoConnector } from '../database/database.ts';

export async function getMetadata() {
    if (!mongoConnector.metadata) {
        throw new Error('Failed to connect to MongoDB');
    }

    const metadata = await mongoConnector.metadata.findOne();
    return {
        name: metadata?.name,
        license: metadata?.license,
        version: metadata?.version,
        documentation: metadata?.documentation,
    };
}