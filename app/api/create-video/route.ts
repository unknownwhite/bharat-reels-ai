import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    // 🔹 Initialize Supabase INSIDE handler (prevents build issues)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 🔹 Parse request body
    const body = await req.json()
    const { userId, topic } = body

    // 🔹 Validate input
    if (!userId || !topic) {
      return NextResponse.json(
        { error: 'Missing userId or topic' },
        { status: 400 }
      )
    }

    // 🔹 Get subscription
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (subError || !sub) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 403 }
      )
    }

    // 🔹 Check usage limit
    if (sub.videos_used >= sub.video_limit) {
      return NextResponse.json(
        { error: 'Video generation limit reached' },
        { status: 403 }
      )
    }

    // 🔹 Create job
    const { data: job, error: jobError } = await supabase
      .from('generated_videos')
      .insert({
        topic,
        status: 'pending',
        user_id: userId,
        retry_count: 0
      })
      .select()
      .single()

    if (jobError || !job) {
      console.error('Job creation error:', jobError)
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    console.log('✅ Job created:', job.id)

    // 🔹 Update usage
    await supabase
      .from('subscriptions')
      .update({
        videos_used: sub.videos_used + 1
      })
      .eq('user_id', userId)

    // 🔹 Return job immediately (worker will process)
    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status
    })

  } catch (err) {
    console.error('❌ API error:', err)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
