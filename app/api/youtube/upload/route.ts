export const runtime = "nodejs"

import { google } from "googleapis"
import fs from "fs"
import path from "path"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { videoPath, title, description, user_id } = body

    if (!videoPath || !title || !user_id) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("youtube_accounts")
      .select("*")
      .eq("user_id", user_id)
      .single()

    if (error || !data) {
      return Response.json(
        { error: "YouTube account not connected" },
        { status: 400 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YT_CLIENT_ID,
      process.env.YT_CLIENT_SECRET,
      process.env.YT_REDIRECT_URI
    )

    oauth2Client.setCredentials({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    })

    oauth2Client.on("tokens", async (tokens) => {
      if (tokens.access_token) {
        await supabase
          .from("youtube_accounts")
          .update({ access_token: tokens.access_token })
          .eq("user_id", user_id)
      }
    })

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client
    })

    const safePath = videoPath.replace(/\.\./g, "")
    const videoFile = path.join(process.cwd(), "public", safePath)

    if (!fs.existsSync(videoFile)) {
      return Response.json(
        { error: "Video file not found", path: videoFile },
        { status: 400 }
      )
    }

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description: description + "\n\n#shorts",
          tags: ["ai", "shorts"],
          categoryId: "22"
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: fs.createReadStream(videoFile)
      }
    })

    return Response.json({
      success: true,
      videoId: response.data.id
    })

  } catch (error: any) {

    console.error("Upload error:", error?.response?.data || error)

    return Response.json(
      {
        error: "Video upload failed",
        details: error?.response?.data || null
      },
      { status: 500 }
    )
  }
}