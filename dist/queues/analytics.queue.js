import { Queue } from 'bullmq';
import { redis } from '../config/db.js';
export const analyticsQueue = new Queue('analytics', {
    connection: redis
});
export const addClickJob = async (data) => {
    await analyticsQueue.add('click', data);
};
//# sourceMappingURL=analytics.queue.js.map