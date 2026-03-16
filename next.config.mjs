/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@remotion/renderer",
    "@remotion/bundler",
    "remotion"
  ],

  transpilePackages: [
    "edge-tts"
  ],

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig