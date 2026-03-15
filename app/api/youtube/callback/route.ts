export const runtime = "nodejs"

import { google } from "googleapis"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing OAuth parameters" },
        { status: 400 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YT_CLIENT_ID,
      process.env.YT_CLIENT_SECRET,
      process.env.YT_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)

    const user_id = state

    await supabase
      .from("youtube_accounts")
      .upsert({
        user_id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      })

    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? "https://bharat-reels-ai-gt64.vercel.app/create?youtube=connected"
        
        : "http://localhost:3000/create?youtube=connected"

    return NextResponse.redirect(redirectUrl)

  } catch (err) {

    console.error("YouTube OAuth error:", err)

    return NextResponse.json(
      { error: "OAuth connection failed" },
      { status: 500 }
    )

  }

}