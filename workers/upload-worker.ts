import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { google } from "googleapis"
import fs from "fs"
import path from "path"
import os from "os"

/* ------------------------------------------------ */
/* SUPABASE CLIENT */
/* ------------------------------------------------ */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ------------------------------------------------ */
/* CONFIG */
/* ------------------------------------------------ */

const WORKER_INTERVAL = 3000
const MAX_CONCURRENT = 3
let runningJobs = 0

/* ------------------------------------------------ */
/* CACHE */
/* ------------------------------------------------ */

const youtubeClients = new Map<string, any>()

/* ------------------------------------------------ */
/* UTILITIES */
/* ------------------------------------------------ */

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function downloadVideo(url: string, filePath: string) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Download failed: ${res.status}`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(filePath, buffer)
}

async function uploadWithTimeout(promise: Promise<any>, ms = 60000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), ms)
    )
  ])
}

/* ------------------------------------------------ */
/* CLAIM JOB */
/* ------------------------------------------------ */

async function claimUploadJob() {
  try {
    const { data, error } = await supabase.rpc("claim_upload_job")

    if (error) {
      console.error("Job claim error:", error)
      return null
    }

    if (!data || data.length === 0) return null

    return data[0]

  } catch (err) {
    console.error("RPC error:", err)
    return null
  }
}

/* ------------------------------------------------ */
/* YOUTUBE CLIENT */
/* ------------------------------------------------ */

async function getYoutubeClient(userId: string) {

  const { data, error } = await supabase
    .from("youtube_accounts")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    throw new Error("YouTube token not found")
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: data.access_token,
    refresh_token: data.refresh_token
  })

  // 🔥 FORCE REFRESH + VALIDATE
  const tokenResponse = await oauth2Client.getAccessToken()

  if (!tokenResponse || !tokenResponse.token) {
    throw new Error("Failed to refresh YouTube access token")
  }

  // ✅ SAVE refreshed tokens
  oauth2Client.on("tokens", async (tokens) => {
    try {
      if (tokens.access_token) {
        await supabase
          .from("youtube_accounts")
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || data.refresh_token
          })
          .eq("user_id", userId)
      }
    } catch (err) {
      console.error("Token update failed:", err)
    }
  })

  return google.youtube({
    version: "v3",
    auth: oauth2Client
  })
}

/* ------------------------------------------------ */
/* CACHED CLIENT */
/* ------------------------------------------------ */

async function getYoutubeClientCached(userId: string) {
  if (youtubeClients.has(userId)) {
    return youtubeClients.get(userId)
  }

  const client = await getYoutubeClient(userId)
  youtubeClients.set(userId, client)

  return client
}

/* ------------------------------------------------ */
/* UPLOAD VIDEO */
/* ------------------------------------------------ */

async function uploadVideo(job: any) {

  const youtube = await getYoutubeClientCached(job.user_id)

  const tempDir = path.join(os.tmpdir(), "bharat-reels")
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const localPath = path.join(tempDir, `${job.id}.mp4`)

  try {

    console.log("Downloading video:", job.video_url)
    await downloadVideo(job.video_url, localPath)

    console.log("Uploading to YouTube...")

    const res = await uploadWithTimeout(
      youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
          snippet: {
            title: job.hook || "Short Video",
            description: (job.script || "") + "\n\n#shorts",
            categoryId: "22"
          },
          status: {
            privacyStatus: "public"
          }
        },
        media: {
          body: fs.createReadStream(localPath)
        }
      }),
      60000
    )

    return res.data.id

  } finally {

    // ✅ CLEANUP
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }

  }
}

/* ------------------------------------------------ */
/* PROCESS JOB */
/* ------------------------------------------------ */

async function processUpload(job: any) {

  const MAX_RETRIES = 3

  // 🔒 LOCK JOB
  await supabase
    .from("generated_videos")
    .update({ status: "uploading" })
    .eq("id", job.id)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    try {

      console.log(`Uploading ${job.id} (Attempt ${attempt})`)

      const videoId = await uploadVideo(job)

      await supabase
        .from("generated_videos")
        .update({
          status: "uploaded",
          youtube_video_id: videoId
        })
        .eq("id", job.id)

      console.log("Upload complete:", videoId)
      return

    } catch (err) {

      console.error(`Attempt ${attempt} failed:`, err)

      if (attempt === MAX_RETRIES) {

        await supabase
          .from("generated_videos")
          .update({
            status: "failed",
            error: String(err)
          })
          .eq("id", job.id)

        return
      }

      await sleep(2000 * attempt)
    }
  }
}

/* ------------------------------------------------ */
/* WORKER LOOP */
/* ------------------------------------------------ */

async function worker() {

  if (runningJobs >= MAX_CONCURRENT) return

  const job = await claimUploadJob()
  if (!job) return

  runningJobs++

  processUpload(job)
    .catch(console.error)
    .finally(() => runningJobs--)
}

/* ------------------------------------------------ */
/* START */
/* ------------------------------------------------ */

console.log("Upload worker started")

setInterval(worker, WORKER_INTERVAL)