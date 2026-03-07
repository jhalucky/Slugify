import { Queue } from 'bullmq';
export declare const analyticsQueue: Queue<any, any, string, any, any, string>;
export declare const addClickJob: (data: {
    slug: string;
    originalUrl: string;
    ip: string;
    userAgent: string;
    referer: string;
    visitorId: string;
}) => Promise<void>;
