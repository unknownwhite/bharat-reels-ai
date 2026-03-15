export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { google } from "googleapis"
import { createSupabaseServer } from "@/lib/supabase-server"

export async function GET(req: Request) {

  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()

  console.log("Server user:", user)

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  )

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    prompt: "consent",
    state: user.id
  })

  return NextResponse.redirect(authUrl)
}