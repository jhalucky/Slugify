import { Queue } from 'bullmq'
import { bullConnection } from '../config/bullmq.js'

export const analyticsQueue = new Queue('analytics', {
  connection: bullConnection as any,
})

export const addClickJob = async (data: {
  slug: string
  originalUrl: string
  ip: string
  userAgent: string
  referer: string
  visitorId: string
}) => {
  await analyticsQueue.add('click', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  })
}