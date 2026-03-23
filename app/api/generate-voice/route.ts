export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import os from "os"
import path from "path"

export async function POST(req: Request) {

  try {

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await req.json()

    if (!body?.script) {
      return NextResponse.json(
        { error: "Script required" },
        { status: 400 }
      )
    }

    /* ---------- sanitize text ---------- */

    const cleanScript = body.script
      .replace(/"/g, "")
      .replace(/\n/g, " ")
      .replace(/[<>]/g, "")
      .trim()

    /* ---------- temp file ---------- */

    const id = Date.now()
    const audioFile = `voice-${id}.mp3`
    const tmpPath = path.join(os.tmpdir(), audioFile)

    /* ---------- SSML ---------- */

    const ssml = `
<speak version="1.0" xml:lang="en-IN">
  <voice name="en-IN-PrabhatNeural">
    ${cleanScript}
  </voice>
</speak>
`

    console.log("Generating voice...")

    /* ---------- Azure TTS ---------- */

    const response = await fetch(
      "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "edge-tts-node",
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TTS_KEY!
        },
        body: ssml
      }
    )

    if (!response.ok) {

      const errorText = await response.text()

      console.error("Azure TTS error:", errorText)

      return NextResponse.json(
        { error: "Azure TTS failed", details: errorText },
        { status: 500 }
      )
    }

    /* ---------- audio buffer ---------- */

    const buffer = Buffer.from(await response.arrayBuffer())

    /* ---------- save temp ---------- */

    fs.writeFileSync(tmpPath, buffer)

    /* ---------- upload to Supabase ---------- */

    const { error } = await supabase.storage
      .from("reels")
      .upload(`voices/${audioFile}`, buffer, {
        contentType: "audio/mpeg",
        upsert: true
      })

    if (error) {
      console.error("Supabase upload error:", error)

      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      )
    }

    /* ---------- cleanup ---------- */

    fs.unlinkSync(tmpPath)

    /* ---------- public url ---------- */

    const { data } = supabase
      .storage
      .from("reels")
      .getPublicUrl(`voices/${audioFile}`)

    console.log("Voice generated:", data.publicUrl)

    return NextResponse.json({
      success: true,
      audio: data.publicUrl
    })

  } catch (error: any) {

    console.error("Voice API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Voice generation failed"
      },
      { status: 500 }
    )

  }

}