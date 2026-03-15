export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const edgeTTS = require("edge-tts")

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const { script } = await req.json()

  const id = Date.now()

  const audioFile = `voice-${id}.mp3`
  const audioTmpPath = `/tmp/${audioFile}`

  const cleanScript = script
    .replace(/"/g, "")
    .replace(/\n/g, " ")
    .replace(/[<>]/g, "")

  const tts = new edgeTTS.Communicate(
    cleanScript,
    "en-IN-PrabhatNeural"
  )

  await tts.save(audioTmpPath)

  const buffer = fs.readFileSync(audioTmpPath)

  await supabase.storage
    .from("reels")
    .upload(`voices/${audioFile}`, buffer, {
      contentType: "audio/mpeg"
    })

  fs.unlinkSync(audioTmpPath)

  const { data } = supabase
    .storage
    .from("reels")
    .getPublicUrl(`voices/${audioFile}`)

  return NextResponse.json({ audio: data.publicUrl })

}