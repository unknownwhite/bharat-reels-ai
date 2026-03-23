import { google } from "googleapis"
import { supabase } from "@/lib/supabaseClient"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function getValidYoutubeToken(userId: string) {

  const { data, error } = await supabase
    .from("youtube_accounts")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    throw new Error("YouTube account not connected")
  }

  let accessToken = data.access_token
  const expiry = data.expiry_date

  const now = Date.now()

  // refresh if expired or about to expire (5 min buffer)
  if (!accessToken || now > expiry - 300000) {

    oauth2Client.setCredentials({
      refresh_token: data.refresh_token
    })

    const { credentials } = await oauth2Client.refreshAccessToken()

    accessToken = credentials.access_token!

    const newExpiry = credentials.expiry_date!

    await supabase
      .from("youtube_accounts")
      .update({
        access_token: accessToken,
        expiry_date: newExpiry
      })
      .eq("user_id", userId)

  }

  return accessToken
}