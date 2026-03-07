import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { createClient } from 'redis';
export const prisma = new PrismaClient();
export const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (err) => console.log('Redis Error', err));
export const connectRedis = async () => {
    try {
        await redis.connect();
        console.log('Redis connected ✅');
    }
    catch (error) {
        console.error('Redis connection failed ❌', error);
        process.exit(1);
    }
};
export const connectPrisma = async () => {
    try {
        await prisma.$connect();
        console.log('PostgreSQL connected ✅');
    }
    catch (error) {
        console.error('PostgreSQL connection failed ❌', error);
        process.exit(1);
    }
};
export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected ✅');
    }
    catch (error) {
        console.error('MongoDB connection failed ❌', error);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map