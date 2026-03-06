import { Queue } from 'bullmq'
import { redis } from '../config/db.js'

export const analyticsQueue = new Queue('analytics', {
  connection: redis as any
})

export const addClickJob = async (data: {
  slug: string
  originalUrl: string
  ip: string
  userAgent: string
  referer: string
}) => {
  await analyticsQueue.add('click', data)
}