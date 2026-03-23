'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Zap } from 'lucide-react'

export default function DashboardPage() {

  const [user,setUser] = useState<any>(null)

  const [plan,setPlan] = useState("Creator")
  const [videosUsed,setVideosUsed] = useState(0)
  const [videoLimit,setVideoLimit] = useState(80)

  useEffect(()=>{

    const getUser = async () => {
      const {data} = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

  },[])

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <PageHeader
          title="Dashboard"
          description="Create and manage your AI generated videos."
        />

        <Link href="/create">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="w-4 h-4 mr-2"/>
            Create Video
          </Button>
        </Link>

      </div>

      {/* Subscription */}

      <Card className="border-purple-500/30 bg-purple-500/5">

        <CardContent className="pt-6">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="font-semibold text-foreground">
                Current Plan: {plan}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                {videosUsed} of {videoLimit} videos used this month
              </p>

            </div>

            <Link href="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Upgrade Plan
              </Button>
            </Link>

          </div>

        </CardContent>

      </Card>

      {/* Placeholder */}

      <Card>

        <CardContent className="py-16 text-center space-y-4">

          <h3 className="text-lg font-semibold">
            No videos yet
          </h3>

          <p className="text-sm text-muted-foreground">
            Start by creating your first AI video.
          </p>

          <Link href="/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Create Video
            </Button>
          </Link>

        </CardContent>

      </Card>

    </div>

  )

}