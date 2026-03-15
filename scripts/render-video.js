const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");

async function render() {

  const hook = process.argv[2] || "Example Hook";
  const script = process.argv[3] || "Example Script";
  let bg = process.argv[4] || "/videos/bg.mp4";
  let voiceUrl = process.argv[5] || null;
  let subtitlesUrl = process.argv[6] || null;

// convert relative path to absolute URL
if (bg.startsWith("/videos")) {
  bg = `http://localhost:3000${bg}`;
}// background video

if (voiceUrl && voiceUrl.startsWith("/")) {
  voiceUrl = `http://localhost:3000${voiceUrl}`;
}

if (subtitlesUrl && subtitlesUrl.startsWith("/")) {
  subtitlesUrl = `http://localhost:3000${subtitlesUrl}`;
}

  const entry = path.resolve("./remotion/index.ts");

  const bundleLocation = await bundle({
    entryPoint: entry,
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "ShortVideo",
    inputProps: {
      hook,
      script,
      bg,
      voiceUrl,
      subtitlesUrl
    },
  });

  const filename = `video-${Date.now()}.mp4`;

  const outputDir = path.resolve("./public/videos");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputLocation = path.join(outputDir, filename);

  await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: "h264",
  outputLocation,
  inputProps: {
    hook,
    script,
    bg,
    voiceUrl,
    subtitlesUrl
  },
});

  console.log(`/videos/${filename}`);
}

render();