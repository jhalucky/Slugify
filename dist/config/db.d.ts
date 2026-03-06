import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, import("@prisma/client").Prisma.LogLevel, import("@prisma/client/runtime/client").DefaultArgs>;
export declare const connectPrisma: () => Promise<void>;
export declare const connectMongo: () => Promise<void>;
