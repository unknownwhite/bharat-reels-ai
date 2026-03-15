import { NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"

export async function POST(req: Request) {

  const { script } = await req.json()

  const id = Date.now()

  const audioFile = `voice-${id}.mp3`
  const subtitleFile = `voice-${id}.vtt`

  const audioPath = path.join(process.cwd(), "public", audioFile)
  const subtitlePath = path.join(process.cwd(), "public", subtitleFile)

  const cleanScript = script.replace(/"/g, "").replace(/\n/g, " ")

  const command = `python -m edge_tts --voice "en-IN-PrabhatNeural" --text "${cleanScript}" --write-media "${audioPath}" --write-subtitles "${subtitlePath}"`

  return new Promise((resolve, reject) => {

    exec(command, (error) => {

      if (error) {
        reject(error)
        return
      }

      resolve(
        NextResponse.json({
          audio: `/${audioFile}`,
          subtitles: `/${subtitleFile}`
        })
      )

    })

  })

}