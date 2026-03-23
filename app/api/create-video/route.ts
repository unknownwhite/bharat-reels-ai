import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const body = await req.json()
  const { userId, topic } = body

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!sub) {
    return NextResponse.json({
      error: 'No subscription found'
    }, { status: 403 })
  }

  if (sub.videos_used >= sub.video_limit) {
    return NextResponse.json({
      error: 'Video generation limit reached'
    }, { status: 403 })
  }

  const { data: job } = await supabase
    .from('generated_videos')
    .insert({
      topic,
      status: 'pending',
      user_id: userId
    })
    .select()
    .single()

  await supabase
    .from('subscriptions')
    .update({
      videos_used: sub.videos_used + 1
    })
    .eq('user_id', userId)

  return NextResponse.json({
    job
  })

}