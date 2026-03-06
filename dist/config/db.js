// @ts-ignore - Prisma type import issue 
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
// Prisma (PostgreSQL)
export const prisma = new PrismaClient();
// MongoDB
export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected ✅');
    }
    catch (error) {
        console.error('MongoDB connection failed ❌', error);
        process.exit(1);
    }
};
// Prisma connect (optional but good practice)
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
//# sourceMappingURL=db.js.map