// lib/queue.ts
import { Queue } from 'bullmq'

export const videoQueue = new Queue('video', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
  }
})