import { Worker } from 'bullmq'
import { bullConnection } from '../config/bullmq.js'
import Click from '../models/Click.js'

export const startAnalyticsWorker = () => {
  const worker = new Worker(
    'analytics',
    async (job) => {
      await Click.create(job.data)
    },
    { connection: bullConnection as any}
  )

  worker.on('completed', (job) => {
    console.log(`Click job ${job.id} done ✅`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Click job ${job?.id} failed ❌`, err.message)
  })

  console.log('Analytics worker started ✅')
}