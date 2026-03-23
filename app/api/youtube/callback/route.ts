export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { google } from "googleapis"
import { createSupabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const code = searchParams.get("code")
  const userId = searchParams.get("state")

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/account", req.url))
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  )

  const { tokens } = await oauth2Client.getToken(code)

  oauth2Client.setCredentials(tokens)

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client
  })

  const channelRes = await youtube.channels.list({
    part: ["snippet"],
    mine: true
  })

  const channel = channelRes.data.items?.[0]

  const supabase = await createSupabaseServer()

  const { data: existing } = await supabase
  .from("youtube_accounts")
  .select("refresh_token")
  .eq("user_id", userId)
  .single()

await supabase
  .from("youtube_accounts")
  .upsert({
    user_id: userId,
    channel_id: channel?.id,
    channel_name: channel?.snippet?.title,
    access_token: tokens.access_token,
    // ✅ NEVER overwrite refresh_token with null
    refresh_token: tokens.refresh_token || existing?.refresh_token
  })

  return NextResponse.redirect(new URL("/accounts", req.url))
}