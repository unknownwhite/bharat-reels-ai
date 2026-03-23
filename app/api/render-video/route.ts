export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { spawn } from "child_process";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

import { getStockVideo } from "@/lib/getStockVideo";

/* ------------------------------------------------ */
/* CONFIG */
/* ------------------------------------------------ */

const MAX_RENDER_TIME = 90000;
const MAX_RETRIES = 2;

/* ------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------ */

function sanitize(text: string) {
  return text
    ?.replace(/"/g, "")
    .replace(/\n/g, " ")
    .replace(/[<>]/g, "")
    .trim();
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ------------------------------------------------ */
/* SAFE VIDEO FILTER */
/* ------------------------------------------------ */

function isSafeVideo(meta: any) {
  return (
    meta?.width <= 1080 &&
    meta?.height <= 1920 &&
    meta?.duration <= 30
  );
}

/* ------------------------------------------------ */
/* RENDER PROCESS */
/* ------------------------------------------------ */

function runRender(args: string[], timeout = MAX_RENDER_TIME): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", args);

    let stderr = "";

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || "Render process failed"));
    });

    setTimeout(() => {
      proc.kill();
      reject(new Error("Render timeout"));
    }, timeout);
  });
}

/* ------------------------------------------------ */
/* MAIN */
/* ------------------------------------------------ */

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.json();

    const topic = sanitize(body.topic);
    const hook = sanitize(body.hook);
    const script = sanitize(body.script);

    const voiceUrl = body.voiceUrl || "";
    const subtitlesUrl = body.subtitlesUrl || "";

    if (!topic || !script || !voiceUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("🎬 Starting render:", topic);

    const id = Date.now();
    const outputFile = `reel-${id}.mp4`;
    const outputTmpPath = path.join(os.tmpdir(), outputFile);

    /* ------------------------------------------------ */
    /* GET SAFE BACKGROUND VIDEO */
    /* ------------------------------------------------ */

    let bg = "";
    let attempts = 0;

    while (attempts < 3) {
      const candidate = await getStockVideo(topic);

if (candidate && typeof candidate === "string") {
  bg = candidate;
  break;
}

      console.log("⚠️ Rejected unsafe video:", candidate);
      attempts++;
    }

    /* ---------- FALLBACK VIDEO ---------- */

    if (!bg) {
      console.log("⚠️ Using fallback video");

      bg =
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }

    /* ------------------------------------------------ */
    /* RENDER WITH RETRY */
    /* ------------------------------------------------ */

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "render-video.cjs"
    );

    const args = [
      scriptPath,
      hook,
      script,
      bg,
      voiceUrl,
      subtitlesUrl,
      outputTmpPath,
    ];

    let success = false;

    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        console.log(`🚀 Render attempt ${i + 1}`);

        await runRender(args);

        success = true;
        break;
      } catch (err) {
        console.error(`❌ Render attempt ${i + 1} failed`, err);

        if (i === MAX_RETRIES) throw err;

        await sleep(2000 * (i + 1));
      }
    }

    if (!success) {
      throw new Error("Render failed after retries");
    }

    /* ------------------------------------------------ */
    /* VERIFY OUTPUT */
    /* ------------------------------------------------ */

    await fs.access(outputTmpPath);

    const buffer = await fs.readFile(outputTmpPath);

    /* ------------------------------------------------ */
    /* UPLOAD TO SUPABASE */
    /* ------------------------------------------------ */

    const { error } = await supabase.storage
      .from("reels")
      .upload(`renders/${outputFile}`, buffer, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (error) {
      console.error("❌ Upload error:", error);
      throw new Error("Upload failed");
    }

    await fs.unlink(outputTmpPath).catch(() => {});

    const { data } = supabase.storage
      .from("reels")
      .getPublicUrl(`renders/${outputFile}`);

    console.log("✅ Render success:", data.publicUrl);

    return NextResponse.json({
      success: true,
      video: data.publicUrl,
    });
  } catch (error: any) {
    console.error("🔥 Render failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Video rendering failed",
      },
      { status: 500 }
    );
  }
}