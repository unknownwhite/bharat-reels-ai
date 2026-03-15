const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runAutomation() {

  const now = new Date().toISOString()

  const { data: jobs, error } = await supabase
    .from('generated_videos')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)

  if (error) {
    console.error(error)
    return
  }

  for (const job of jobs) {

    try {

      const res = await fetch(`${process.env.APP_URL}/api/youtube/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          .from('generated_videos')
          .update({ status: 'uploaded' })
          .eq('id', job.id)

      } else {

        await supabase
          .from('generated_videos')
          .update({ status: 'failed' })
          .eq('id', job.id)

      }

    } catch (err) {

      console.error(err)

      await supabase
        .from('generated_videos')
        .update({ status: 'failed' })
        .eq('id', job.id)

    }

  }

}

runAutomation()