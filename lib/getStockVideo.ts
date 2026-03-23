import crypto from "crypto";

type PexelsVideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
};

type PexelsVideo = {
  id: number;
  width: number;
  height: number;
  duration: number;
  video_files: PexelsVideoFile[];
};

type PexelsResponse = {
  videos: PexelsVideo[];
};

const VISUAL_MAPPINGS: Record<string, string> = {
  trading: "stock market trading charts screen",
  crypto: "cryptocurrency trading chart screen",
  business: "business people working laptop office",
  money: "counting money finance cash",
  motivation: "success businessman sunrise city",
  success: "business success celebration",
  ai: "artificial intelligence futuristic technology",
  startup: "startup founders brainstorming laptop",
  coding: "developer coding laptop programming",
  fitness: "fitness workout gym training",
  travel: "cinematic travel landscape drone",
  luxury: "luxury lifestyle rich aesthetic",
};

function extractVisualQuery(topic?: string) {

  if (!topic || typeof topic !== "string") {
    return "technology abstract background";
  }

  const lower = topic.toLowerCase();

  for (const key of Object.keys(VISUAL_MAPPINGS)) {
    if (lower.includes(key)) {
      return VISUAL_MAPPINGS[key];
    }
  }

  const words = topic.split(" ").slice(0, 3).join(" ");

  return words || "technology abstract background";
}

function pickRandom<T>(arr: T[]): T {
  const index = crypto.randomInt(0, arr.length);
  return arr[index];
}

function selectBestVideo(video: PexelsVideo) {

  // prefer portrait videos for Shorts
  const portraitFiles = video.video_files.filter(
    (file) =>
      file.height > file.width &&
      file.file_type === "video/mp4"
  );

  if (portraitFiles.length > 0) {
    return pickRandom(portraitFiles).link;
  }

  // fallback to any mp4
  const fallback = video.video_files.filter(
    (file) => file.file_type === "video/mp4"
  );

  return pickRandom(fallback).link;
}

async function searchPexels(query: string): Promise<string | null> {

  const API_KEY = process.env.PEXELS_API_KEY;

  if (!API_KEY) {
    console.warn("PEXELS_API_KEY missing");
    return null;
  }

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    query
  )}&per_page=15&orientation=portrait`;

  try {

    const res = await fetch(url, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!res.ok) {

      const text = await res.text();

      console.error("PEXELS STATUS:", res.status);
      console.error("PEXELS RESPONSE:", text);

      return null;

    }

    const data: PexelsResponse = await res.json();

    if (!data.videos || data.videos.length === 0) {
      return null;
    }

    const randomVideo = pickRandom(data.videos);

    return selectBestVideo(randomVideo);

  } catch (error) {

    console.error("Pexels fetch failed:", error);

    return null;

  }
}

export async function getStockVideo(topic: string): Promise<string> {

  const visualQuery = extractVisualQuery(topic);

  // attempt 1: mapped visual query
  let video = await searchPexels(visualQuery);

  if (video) return video;

  // attempt 2: original topic
  video = await searchPexels(topic);

  if (video) return video;

  // attempt 3: generic search
  video = await searchPexels("technology abstract background");

  if (video) return video;

  // final fallback
  console.warn("Using fallback video");

  return "https://xaiyexnmvkkmfkwdppxw.supabase.co/storage/v1/object/public/reels/bg/default.mp4";

}