export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json(
        { error: "Topic required" },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from("generated_videos")
      .insert({
        topic,
        status: "pending"
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      jobId: data.id
    })

  } catch (error: any) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}