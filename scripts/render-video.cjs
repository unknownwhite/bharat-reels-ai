const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");

async function render() {
  try {

    /* ---------- CLI ARGUMENTS ---------- */

    const hook = process.argv[2] || "Example Hook";
    const script = process.argv[3] || "Example Script";
    const bg = process.argv[4] || "";
    const voiceUrl = process.argv[5] || null;
    const subtitlesUrl = process.argv[6] || null;
    const outputPath = process.argv[7];

    if (!outputPath) {
      throw new Error("Output path missing");
    }

    console.log("Starting render...");
    console.log("Hook:", hook);
    console.log("Script:", script);
    console.log("Background:", bg);
    console.log("Voice:", voiceUrl);
    console.log("Output:", outputPath);

    /* ---------- REMOTION ENTRY ---------- */

    const entry = path.resolve(process.cwd(), "remotion/index.ts");

    console.log("Bundling Remotion project...");

    const bundleLocation = await bundle({
      entryPoint: entry,
    });

    console.log("Bundle ready:", bundleLocation);

    /* ---------- SELECT COMPOSITION ---------- */

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "ShortVideo",
      inputProps: {
        hook,
        script,
        bg,
        voiceUrl,
        subtitlesUrl,
      },
    });

    console.log("Composition duration:", composition.durationInFrames);

    /* ---------- RENDER VIDEO ---------- */

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: {
        hook,
        script,
        bg,
        voiceUrl,
        subtitlesUrl,
      },
      concurrency: 2,
    });

    console.log("Render complete:", outputPath);

  } catch (err) {

    console.error("Render error:", err);

    process.exit(1);

  }
}

render();