  'use client'

  import { supabase } from "@/lib/supabase-browser"
  import { useState, useEffect } from 'react'
  import { PageHeader } from '@/components/page-header'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  import { Label } from '@/components/ui/label'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import { Textarea } from '@/components/ui/textarea'
  import { Badge } from '@/components/ui/badge'
  import { Progress } from '@/components/ui/progress'
  import { Sparkles, Zap } from 'lucide-react'


  export default function CreatePage() {
    const [topics, setTopics] = useState<string[]>([])
const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
useEffect(() => {

  const suggestedTopics = [
    "AI tools that save 10 hours of work",
    "The business mindset of millionaires",
    "Daily habits that make people successful",
    "3 mistakes killing your productivity",
    "How AI will change jobs in 5 years",
    "The psychology behind viral content",
    "Small business ideas with big profit",
    "Why most people stay broke",
    "One skill that will make you rich",
    "Simple habits that build discipline"
  ]

  setTopics(suggestedTopics)

}, [])
  const [showUploadModal, setShowUploadModal] = useState(false)
const [uploadMode, setUploadMode] = useState<"manual" | "auto" | null>(null)
const [bestTime, setBestTime] = useState<string | null>(null)
const getBestUploadTime = () => {

  const slots = [12, 15, 18, 21] // 12pm, 3pm, 6pm, 9pm
  const now = new Date().getHours()

  const next = slots.find(s => s > now) ?? slots[0]

  const label =
    next === 12 ? "12:00 PM" :
    next === 15 ? "3:00 PM" :
    next === 18 ? "6:00 PM" :
    "9:00 PM"

  return label
}
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('engaging')
    const [language, setLanguage] = useState('english')
    const [length, setLength] = useState('60')

    const [userId, setUserId] = useState<string | null>(null)

useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUserId(data.user?.id ?? null)
  }

  getUser()
}, [])

    const [preview, setPreview] = useState<{ hook: string; script: string } | null>(null)

    const [isGenerating, setIsGenerating] = useState(false)
    const [isRendering, setIsRendering] = useState(false)

    const [performance, setPerformance] = useState(75)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [voiceUrl, setVoiceUrl] = useState<string | null>(null)
    const [subtitlesUrl, setSubtitlesUrl] = useState<string | null>(null)
    useEffect(() => {

    const saved = localStorage.getItem("generatedVideo")

    if (saved) {

      const data = JSON.parse(saved)

      setVideoUrl(data.video)
setShowUploadModal(true)

      setPreview({
        hook: data.hook,
        script: data.script
      })

    }

  }, [])
    const [isUploading, setIsUploading] = useState(false)
    

    const handleGenerate = async () => {

    if (!topic) return

    setIsGenerating(true)

    try {

      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          tone,
          language,
          length
        })
      })

      const data = await res.json()

      setPreview({
    hook: data.hook,
    script: data.script
  })

  const voiceRes = await fetch('/api/generate-voice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      script: data.script
    })
  })

  const voiceData = await voiceRes.json()

  setVoiceUrl(voiceData.audio)
  setSubtitlesUrl(voiceData.subtitles)

  setPerformance(85)

    } catch (error) {

      console.error(error)

    }

    setIsGenerating(false)

  }

    const handleRenderVideo = async () => {

      if (!preview) return

      setIsRendering(true)

      try {

        const res = await fetch('/api/render-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
    topic,
    hook: preview.hook,
    script: preview.script,
    voiceUrl,
    subtitlesUrl
  })
        })

        const data = await res.json()

setVideoUrl(data.video)
setShowUploadModal(true)

localStorage.setItem(
  "generatedVideo",
  JSON.stringify({
    video: data.video,
    hook: preview?.hook,
    script: preview?.script
  })

  )

      } catch (error) {

        console.error(error)

      }

      setIsRendering(false)

    }

    const handleUploadYoutube = async () => {

  if (!videoUrl || !preview) return

  setIsUploading(true)

  try {

    const cleanPath = videoUrl.replace(/^.*\/videos\//, "videos/")

    const res = await fetch('/api/youtube/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoPath: cleanPath,
        title: preview.hook,
        description: preview.script + "\n\n#shorts",
        user_id: userId
      })
    })

    const data = await res.json()

    if (data.success) {
      alert("Video uploaded to YouTube 🎉")
    } else {
      alert(data.error)
    }

  } catch (error) {

    console.error(error)

  }

  setIsUploading(false)
}

    const isFormValid = selectedTopic !== null

    return (

      <div className="space-y-8">

        <PageHeader
          title="Create Video"
          description="Generate AI-powered YouTube Shorts in seconds"
        />

        <div className="grid lg:grid-cols-2 gap-8">

          {/* FORM SECTION */}

          <Card className="border-border">

            <CardHeader>
              <CardTitle>Video Details</CardTitle>
              <CardDescription>
                Tell us what your video should be about
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="space-y-4">

<Label className="text-foreground">
Choose a Topic
</Label>

<div className="grid gap-2">

{topics.map((t, index) => (

<button
key={index}
onClick={() => {
  setSelectedTopic(t)
  setTopic(t)
}}
className={`text-left p-3 rounded-lg border transition ${
  selectedTopic === t
    ? "border-purple-500 bg-purple-500/10"
    : "border-border hover:bg-muted"
}`}
>

{t}

</button>

))}

</div>

</div>
              <div className="space-y-2">

                <Label>Content Tone</Label>

                <Select value={tone} onValueChange={setTone}>

                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="engaging">
                      Engaging & Fun
                    </SelectItem>

                    <SelectItem value="informative">
                      Informative
                    </SelectItem>

                    <SelectItem value="educational">
                      Educational
                    </SelectItem>

                    <SelectItem value="motivational">
                      Motivational
                    </SelectItem>

                    <SelectItem value="professional">
                      Professional
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>


                <div className="text-sm text-muted-foreground">
  Video Length: 10 seconds
  </div>


              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11"
                size="lg"
              >

                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Preview
                  </>
                )}

              </Button>

            </CardContent>

          </Card>

          {/* PREVIEW SECTION */}

          <div className="space-y-6">

            {preview ? (

              <>

                <Card className="border-border">

                  <CardHeader>
                    <CardTitle className="text-lg">
                      Performance Score
                    </CardTitle>
                  </CardHeader>

                  <CardContent>

                    <div className="space-y-2">

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium">
                          Content Quality
                        </span>

                        <Badge variant="secondary">
                          {performance}%
                        </Badge>

                      </div>

                      <Progress value={performance} className="h-2" />

                    </div>

                  </CardContent>

                </Card>

                <Card className="border-border">

                  <CardHeader>
                    <CardTitle>Hook</CardTitle>
                  </CardHeader>

                  <CardContent>

                    <p className="bg-muted p-4 rounded-lg">
                      {preview.hook}
                    </p>

                  </CardContent>

                </Card>

                <Card className="border-border">

                  <CardHeader>
                    <CardTitle>Script</CardTitle>
                  </CardHeader>

                  <CardContent>

                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                      {preview.script}
                    </pre>

                  </CardContent>

                </Card>

                <div className="flex gap-3">

                  <Button
                    onClick={() => setPreview(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={handleRenderVideo}
                    disabled={isRendering}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isRendering ? 'Rendering Video...' : 'Generate Video'}
                  </Button>

                </div>

              </>

            ) : (

              <Card className="border-dashed flex items-center justify-center min-h-96">

                <CardContent className="text-center">

                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />

                  <p className="text-muted-foreground">
                    Enter your topic and generate preview
                  </p>

                </CardContent>

              </Card>

            )}

            {videoUrl && (

              <Card>

                <CardHeader>
                  <CardTitle>Generated Video</CardTitle>
                </CardHeader>



                <CardContent>
                  <div className="flex gap-3 mb-4">

  <Button
    onClick={() => window.location.href = "/api/youtube/connect"}
    variant="outline"
  >
    Connect YouTube
  </Button>

  <Button
    onClick={handleUploadYoutube}
    disabled={isUploading}
    className="bg-red-600 hover:bg-red-700 text-white"
  >
    {isUploading ? "Uploading..." : "Upload to YouTube"}
  </Button>

  </div>

                <video
    src={videoUrl}
    controls
    controlsList="nodownload noremoteplayback"
    disablePictureInPicture
    onContextMenu={(e) => e.preventDefault()}
    className="w-full rounded-lg"
  />

                </CardContent>

              </Card>

            )}

          </div>

        </div>
        {/* Upload Mode Modal */}

{showUploadModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<Card className="w-[420px]">

<CardHeader>
<CardTitle>Upload Mode</CardTitle>
<CardDescription>
Choose how you want to upload your video
</CardDescription>
</CardHeader>

<CardContent className="space-y-4">

<button
onClick={() => setUploadMode("manual")}
className={`w-full p-3 border rounded-lg text-left ${
uploadMode === "manual"
? "border-purple-500 bg-purple-500/10"
: "border-border"
}`}
>
Upload Now
</button>

<button
onClick={() => {
setUploadMode("auto")
setBestTime(getBestUploadTime())
}}
className={`w-full p-3 border rounded-lg text-left ${
uploadMode === "auto"
? "border-purple-500 bg-purple-500/10"
: "border-border"
}`}
>
Automatic Upload (Recommended)
</button>

{uploadMode === "auto" && bestTime && (

<p className="text-sm text-muted-foreground">
Best upload time: <strong>{bestTime}</strong>
</p>

)}

<Button
onClick={async () => {

if (uploadMode === "manual") {
await handleUploadYoutube()
}

if (uploadMode === "auto") {

  if (!videoUrl || !preview || !userId) return

  try {

    const cleanPath = videoUrl.replace(/^.*\/videos\//, "videos/")

    const { error } = await supabase
      .from("generated_videos")
      .insert({
  user_id: userId,
  topic: topic,
  script: preview.script,
  video_url: cleanPath,
  scheduled_at: new Date(Date.now() + 60000).toISOString(),
  status: "scheduled"
})

    if (error) throw error

    alert(`Video scheduled for ${bestTime}`)

  } catch (err) {

    console.error(err)
    alert("Scheduling failed")

  }

}

setShowUploadModal(false)

}}
className="w-full bg-purple-600 hover:bg-purple-700 text-white"
>
Continue
</Button>

</CardContent>

</Card>

</div>

)}

      </div>

    )

  }