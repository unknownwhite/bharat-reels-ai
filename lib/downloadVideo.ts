import fs from "fs"
import os from "os"
import path from "path"

export async function downloadVideo(url: string) {

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Video download failed")
  }

  const buffer = Buffer.from(await res.arrayBuffer())

  const fileName = `bg-${Date.now()}.mp4`

  const tmpDir = os.tmpdir()
  const tmpPath = path.join(tmpDir, fileName)

  fs.writeFileSync(tmpPath, buffer)

  return tmpPath
}