'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function BillingPage() {

  const [plan,setPlan] = useState("Starter")
  const [videosUsed,setVideosUsed] = useState(0)
  const [videoLimit,setVideoLimit] = useState(20)

  useEffect(()=>{

    const loadSubscription = async ()=>{

      const {data:userData} = await supabase.auth.getUser()

      if(!userData.user) return

      const {data} = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id',userData.user.id)
        .single()

      if(data){
        setPlan(data.plan)
        setVideosUsed(data.videos_used)
        setVideoLimit(data.video_limit)
      }

    }

    loadSubscription()

  },[])

  return (

    <div className="space-y-8">

      <PageHeader
        title="Billing"
        description="Manage your subscription"
      />

      {/* Current Plan */}

      <Card>

        <CardContent className="pt-6 space-y-4">

          <h3 className="text-lg font-semibold">
            Current Plan: {plan}
          </h3>

          <p className="text-sm text-muted-foreground">
            {videosUsed} of {videoLimit} videos used this month
          </p>

          <Link href="/pricing">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Upgrade Plan
            </Button>
          </Link>

        </CardContent>

      </Card>

      {/* Pricing Options */}

      <div className="grid md:grid-cols-3 gap-6">

        {[
          {name:"Starter",price:"₹299",limit:"20 videos/month"},
          {name:"Creator",price:"₹799",limit:"80 videos/month"},
          {name:"Pro",price:"₹1999",limit:"250 videos/month"}
        ].map(plan=> (

          <Card key={plan.name}>

            <CardContent className="p-6 text-center space-y-3">

              <h3 className="font-semibold text-lg">
                {plan.name}
              </h3>

              <p className="text-3xl font-bold">
                {plan.price}
              </p>

              <p className="text-sm text-muted-foreground">
                {plan.limit}
              </p>

              <Button
                className="w-full"
                onClick={()=>window.location.href=`/checkout?plan=${plan.name}`}
              >
                Choose Plan
              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  )

}