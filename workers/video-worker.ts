import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const BASE_URL = process.env.APP_URL || "http://localhost:3000"

console.log("APP_URL:", BASE_URL)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function safeRpc(name: string) {

  for (let i = 0; i < 3; i++) {

    try {

      const { data, error } = await supabase.rpc(name)

      if (!error) {
        return data
      }

      console.error("RPC error:", error)

    } catch (err) {

      console.error("RPC retry:", err)

    }

    await sleep(2000)

  }

  return null
}

/* ------------------------------------------------ */
/* UTILITIES */
/* ------------------------------------------------ */

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchWithTimeout(url: string, options: any, timeout = 30000) {

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {

    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return await res.json()

  } finally {
    clearTimeout(id)
  }

}

/* ------------------------------------------------ */
/* CLAIM JOB */
/* ------------------------------------------------ */

async function claimJob() {

  try {

    const data = await safeRpc("claim_video_job")

if (!data) return null
return Array.isArray(data) ? data[0] : data

  } catch (err) {

    console.error("RPC connection error:", err)
    return null

  }

}

/* ------------------------------------------------ */
/* GENERATION APIS */
/* ------------------------------------------------ */

async function generateScript(topic: string) {

  return await fetchWithTimeout(
    `${BASE_URL}/api/generate-script`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic })
    }
  )

}

async function generateVoice(script: string) {

  return await fetchWithTimeout(
    `${BASE_URL}/api/generate-voice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ script })
    }
  )

}

async function renderVideo(payload: any) {

  return await fetchWithTimeout(
    `${BASE_URL}/api/render-video`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    },
    120000
  )

}

/* ------------------------------------------------ */
/* PROCESS JOB */
/* ------------------------------------------------ */

async function processJob(job: any) {

  try {

    console.log("Processing job:", job.id)

    if ((job.retry_count || 0) >= 3) {

      console.log("Retry limit reached:", job.id)

      await supabase
        .from("generated_videos")
        .update({ status: "permanently_failed" })
        .eq("id", job.id)

      return

    }

    /* ---------- SCRIPT ---------- */

    console.log("Generating script...")
const scriptData = await generateScript(job.topic)

    if (!scriptData?.script) {
      throw new Error("Script generation failed")
    }

    await supabase
      .from("generated_videos")
      .update({
        hook: scriptData.hook,
        script: scriptData.script,
        status: "script_done"
      })
      .eq("id", job.id)

    /* ---------- VOICE ---------- */

    console.log("Generating voice...")
const voiceData = await generateVoice(scriptData.script)

    if (!voiceData?.audio) {
      throw new Error("Voice generation failed")
    }

    await supabase
      .from("generated_videos")
      .update({
        voice_url: voiceData.audio,
        status: "voice_done"
      })
      .eq("id", job.id)

    /* ---------- RENDER ---------- */

    console.log("Rendering video...")
const renderData = await renderVideo({
      topic: job.topic,
      hook: scriptData.hook,
      script: scriptData.script,
      voiceUrl: voiceData.audio
    })

    if (!renderData?.video) {
      throw new Error("Render failed")
    }

   await supabase
  .from("generated_videos")
  .update({
    video_url: renderData.video,
    status: "pending_upload"
  })
  .eq("id", job.id)

console.log("Ready for upload:", job.id)

  } catch (err) {

    console.error("Job failed:", err)

    await supabase
      .from("generated_videos")
      .update({
        status: "failed",
        error: String(err),
        retry_count: (job.retry_count || 0) + 1
      })
      .eq("id", job.id)

  }

}

/* ------------------------------------------------ */
/* WORKER LOOP */
/* ------------------------------------------------ */

async function worker() {

  try {

    const job = await claimJob()

    if (!job) {
      return
    }

    await processJob(job)

  } catch (err) {

    console.error("Worker error:", err)

  }

}

console.log("Video worker started")

setInterval(worker, 2000)