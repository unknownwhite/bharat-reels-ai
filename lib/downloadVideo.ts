import fs from "fs";
import path from "path";

export async function downloadVideo(url: string) {

  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  const fileName = `bg-${Date.now()}.mp4`;

  const filePath = path.join(
    process.cwd(),
    "public",
    "videos",
    fileName
  );

  fs.writeFileSync(filePath, buffer);

  return `/videos/${fileName}`;
}