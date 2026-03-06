import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
export const prisma = new PrismaClient();
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
export const connectMongo = async () => {
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