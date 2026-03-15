export const runtime = "nodejs"

import { exec } from "child_process"
import { promisify } from "util"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"

import { getStockVideo } from "@/lib/getStockVideo"
import { downloadVideo } from "@/lib/downloadVideo"

const execAsync = promisify(exec)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  try {

    const { topic, hook, script, voiceUrl, subtitlesUrl } = await req.json()

    const id = Date.now()

    // 1️⃣ get stock video
    const videoUrl = await getStockVideo(topic)

    // 2️⃣ download to /tmp (serverless safe)
    const localPath = await downloadVideo(videoUrl)

    const bg = localPath

    const voice = voiceUrl || ""
    const subtitles = subtitlesUrl || ""

    // rendered output path
    const outputFile = `reel-${id}.mp4`
    const outputTmpPath = `/tmp/${outputFile}`

    // run remotion renderer
    const command = `node scripts/render-video.js "${hook}" "${script}" "${bg}" "${voice}" "${subtitles}" "${outputTmpPath}"`

    await execAsync(command)

    const fileBuffer = fs.readFileSync(outputTmpPath)

    // upload final video to supabase
    const { error } = await supabase.storage
      .from("reels")
      .upload(`renders/${outputFile}`, fileBuffer, {
        contentType: "video/mp4"
      })

    if (error) throw error

    fs.unlinkSync(outputTmpPath)

    const { data } = supabase
      .storage
      .from("reels")
      .getPublicUrl(`renders/${outputFile}`)

    return NextResponse.json({
      video: data.publicUrl
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      { error: "Video rendering failed" },
      { status: 500 }
    )

  }

}