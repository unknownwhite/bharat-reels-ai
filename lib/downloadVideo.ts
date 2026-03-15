import fs from "fs"

export async function downloadVideo(url: string) {

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to download video")
  }

  const buffer = Buffer.from(await res.arrayBuffer())

  const fileName = `bg-${Date.now()}.mp4`
  const tmpPath = `/tmp/${fileName}`

  fs.writeFileSync(tmpPath, buffer)

  return tmpPath
}