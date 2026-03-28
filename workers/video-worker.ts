import dotenv from "dotenv"
dotenv.config()

import { createClient } from "@supabase/supabase-js"
import { generateScriptAI } from "../lib/gemini.js"

/* ---------------- ENV VALIDATION ---------------- */

if (!process.env.APP_URL) throw new Error("APP_URL missing")
if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL missing")
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_KEY missing")

const BASE_URL = process.env.APP_URL

console.log("🚀 Worker started:", BASE_URL)

/* ---------------- SUPABASE ---------------- */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/* ---------------- UTIL ---------------- */

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
      throw new Error(`API error ${res.status}`)
    }

    return await res.json()

  } catch (err) {
    console.error("Fetch failed:", url, err)
    return null
  } finally {
    clearTimeout(id)
  }
}

/* ---------------- CLAIM JOB ---------------- */

async function claimJob() {
  try {
    const { data, error } = await supabase.rpc("claim_video_job")

    if (error) {
      console.error("RPC error:", error)
      return null
    }

    if (!data) return null
    return Array.isArray(data) ? data[0] : data

  } catch (err) {
    console.error("Claim error:", err)
    return null
  }
}

/* ---------------- EXTERNAL APIs ---------------- */

async function generateVoice(script: string) {
  return fetchWithTimeout(`${BASE_URL}/api/generate-voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script })
  })
}

async function renderVideo(payload: any) {
  return fetchWithTimeout(
    `${BASE_URL}/api/render-video`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    },
    120000
  )
}

/* ---------------- PROCESS JOB ---------------- */

async function processJob(job: any) {
  const startTime = Date.now()

  try {
    console.log(`📦 Processing job: ${job.id}`)

    await supabase
      .from("generated_videos")
      .update({ status: "processing" })
      .eq("id", job.id)

    /* ---------- SCRIPT ---------- */
    const scriptData = await generateScriptAI(job.topic)

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

    /* ---------- TIMEOUT CHECK ---------- */
    if (Date.now() - startTime > 300000) {
      throw new Error("Job timeout")
    }

    /* ---------- VOICE ---------- */
    const voiceData = await generateVoice(scriptData.script)

    if (!voiceData) {
      throw new Error("Voice API timeout")
    }

    if (!voiceData.audio) {
      throw new Error("Voice generation failed")
    }

    await supabase
      .from("generated_videos")
      .update({
        voice_url: voiceData.audio,
        status: "voice_done"
      })
      .eq("id", job.id)

    /* ---------- TIMEOUT CHECK ---------- */
    if (Date.now() - startTime > 300000) {
      throw new Error("Job timeout")
    }

    /* ---------- VIDEO ---------- */
    const renderData = await renderVideo({
      topic: job.topic,
      hook: scriptData.hook,
      script: scriptData.script,
      voiceUrl: voiceData.audio
    })

    if (!renderData) {
      throw new Error("Render API timeout")
    }

    if (!renderData.video) {
      throw new Error("Render failed")
    }

    await supabase
      .from("generated_videos")
      .update({
        video_url: renderData.video,
        status: "completed"
      })
      .eq("id", job.id)

    console.log(`✅ Job completed: ${job.id}`)

  } catch (err: any) {
    console.error(`❌ Job failed: ${job.id}`, err.message)

    await supabase
      .from("generated_videos")
      .update({
        status: "failed",
        error: err.message,
        retry_count: (job.retry_count || 0) + 1
      })
      .eq("id", job.id)
  }
}

/* ---------------- WORKER LOOP ---------------- */

async function worker() {
  try {
    const job = await claimJob()

    if (!job) return false

    await processJob(job)
    return true

  } catch (err) {
    console.error("Worker loop error:", err)
    return false
  }
}

async function startWorker() {
  while (true) {
    const hasJob = await worker()
    await sleep(hasJob ? 1000 : 5000)
  }
}

startWorker()