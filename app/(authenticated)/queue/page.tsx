'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Play, Trash2 } from 'lucide-react'

export default function QueuePage() {

  const [videos,setVideos] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchVideos = async () => {

      const {data} = await supabase
        .from('generated_videos')
        .select('*')
        .order('created_at',{ascending:false})

      if(data) setVideos(data)

      setLoading(false)

    }

    fetchVideos()

  },[])

  const deleteVideo = async(id:string)=>{

    await supabase
      .from('generated_videos')
      .delete()
      .eq('id',id)

    setVideos(videos.filter(v=>v.id!==id))

  }

  return (

    <div className="space-y-8">

      <PageHeader
        title="My Videos"
        description="All your generated videos"
      />

      {loading && (

        <Card>
          <CardContent className="py-12 text-center">
            Loading videos...
          </CardContent>
        </Card>

      )}

      {!loading && videos.length === 0 && (

        <Card>
          <CardContent className="py-12 text-center space-y-4">

            <p className="text-muted-foreground">
              No videos generated yet
            </p>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={()=>window.location.href="/create"}
            >
              Create Video
            </Button>

          </CardContent>
        </Card>

      )}

      {!loading && videos.length > 0 && (

        <div className="grid gap-4">

          {videos.map(video=> (

            <Card key={video.id}>

              <CardContent className="pt-6 flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    {video.topic || "Untitled Video"}
                  </h3>

                  <p className="text-sm text-muted-foreground">

                    Status: {video.status}

                  </p>

                </div>

                <div className="flex gap-2">

                  {video.video_url && (

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={()=>window.open(video.video_url)}
                    >
                      <Play className="w-4 h-4"/>
                    </Button>

                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={()=>deleteVideo(video.id)}
                  >
                    <Trash2 className="w-4 h-4"/>
                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>

  )

}