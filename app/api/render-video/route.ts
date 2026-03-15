import { exec } from "child_process";
import { getStockVideo } from "@/lib/getStockVideo";
import { downloadVideo } from "@/lib/downloadVideo";

export async function POST(req: Request) {

  const { topic, hook, script, voiceUrl, subtitlesUrl } = await req.json();

  // 1️⃣ fetch stock video
  const videoUrl = await getStockVideo(topic);

  // 2️⃣ download locally
  const localPath = await downloadVideo(videoUrl);

  // convert path for Remotion
  const bg = localPath.replace("public", "");

  // pass voice + subtitles to renderer
const voice = voiceUrl || "";
const subtitles = subtitlesUrl || "";

const command = `node scripts/render-video.js "${hook}" "${script}" "${bg}" "${voice}" "${subtitles}"`;

  return new Promise((resolve, reject) => {

    exec(command, (error, stdout) => {

      if (error) {
        reject(error);
        return;
      }

      const lines = stdout.trim().split("\n");
      const videoPath = lines[lines.length - 1];

      resolve(Response.json({ video: videoPath }));

    });

  });

}