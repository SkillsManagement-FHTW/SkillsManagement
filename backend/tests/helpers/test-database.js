import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectTestDatabase = async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
};

export const clearTestDatabase = async () => {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(collections.map(collection => collection.deleteMany({})));
};

export const disconnectTestDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};
