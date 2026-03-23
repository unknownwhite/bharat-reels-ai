import "dotenv/config"
import { supabaseAdmin } from "../lib/supabase-admin"
import { sleep } from "../lib/sleep"

async function scheduler() {

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, automation_enabled")

  if (error) {
    console.error("User fetch failed:", error)
    return
  }

  for (const user of users || []) {

    if (!user.automation_enabled) continue

    const topicRes = await fetch(
      `${process.env.APP_URL}/api/generate-topic`
    )

    const topicData = await topicRes.json()

    if (!topicData.topic) continue

    const { error: insertError } = await supabaseAdmin
      .from("generated_videos")
      .insert({
        user_id: user.id,
        topic: topicData.topic,
        status: "pending"
      })

    if (insertError) {
      console.error("Job creation failed:", insertError)
    } else {
      console.log("Job created:", topicData.topic)
    }

  }

}

async function run() {

  console.log("Scheduler started")

  while (true) {

    try {
      await scheduler()
    } catch (err) {
      console.error("Scheduler error:", err)
    }

    await sleep(60 * 60 * 1000)

  }

}

run()