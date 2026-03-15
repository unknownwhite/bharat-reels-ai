import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {

  const auth = req.headers.get("authorization")

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date().toISOString()

  const { data: jobs } = await supabase
    .from("generated_videos")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_at", now)

  if (!jobs) return NextResponse.json({ message: "no jobs" })

  for (const job of jobs) {

    try {

      const res = await fetch(`${process.env.APP_URL}/api/youtube/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoPath: job.video_url,
          title: job.topic,
          description: job.script,
          user_id: job.user_id
        })
      })

      const data = await res.json()

      if (data.success) {
        await supabase
          .from("generated_videos")
          .update({ status: "uploaded" })
          .eq("id", job.id)
      }

    } catch (err) {

      await supabase
        .from("generated_videos")
        .update({ status: "failed" })
        .eq("id", job.id)

    }

  }

  return NextResponse.json({ processed: jobs.length })

}