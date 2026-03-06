import { Worker } from 'bullmq'
import { redis } from '../config/db.js'
import Click from '../models/Click.js'

export const startAnalyticsWorker = () => {
  const worker = new Worker('analytics', async (job) => {
    if (job.name === 'click') {
      const { slug, originalUrl, ip, userAgent, referer } = job.data

      await Click.create({
        slug,
        originalUrl,
        ip,
        userAgent,
        referer
      })

      console.log(`Click tracked for slug: ${slug} ✅`)
    }
  }, { connection: redis as any })

  worker.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.id}`, err)
  })

  console.log('Analytics worker started ✅')
}