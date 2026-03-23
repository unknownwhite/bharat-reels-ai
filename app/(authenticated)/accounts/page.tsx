'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Youtube, CheckCircle2 } from "lucide-react"

export default function AccountsPage(){

  const [youtube,setYoutube] = useState<any>(null)

  useEffect(()=>{

    const loadAccount = async ()=>{

      const {data:userData} = await supabase.auth.getUser()

      if(!userData.user) return

      const {data} = await supabase
        .from("youtube_accounts")
        .select("*")
        .eq("user_id",userData.user.id)
        .single()

      setYoutube(data)

    }

    loadAccount()

  },[])

  const disconnect = async ()=>{

    const {data:userData} = await supabase.auth.getUser()

    if(!userData.user) return

    await supabase
      .from("youtube_accounts")
      .delete()
      .eq("user_id",userData.user.id)

    setYoutube(null)

  }

  return(

    <div className="space-y-8">

      <PageHeader
        title="Connected Accounts"
        description="Manage your social media integrations"
      />

      {/* YouTube */}

      <Card>

        <CardContent className="pt-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <Youtube className="w-8 h-8 text-red-600"/>

            <div>

              <p className="font-semibold">
                YouTube
              </p>

              {youtube ? (

                <p className="text-sm text-muted-foreground">
                  {youtube.channel_name}
                </p>

              ):(
                <p className="text-sm text-muted-foreground">
                  Not connected
                </p>
              )}

            </div>

          </div>

          {youtube ? (

            <div className="flex items-center gap-3">

              <Badge className="bg-green-500 text-white">
                <CheckCircle2 className="w-3 h-3 mr-1"/>
                Connected
              </Badge>

              <Button
                variant="outline"
                onClick={disconnect}
              >
                Disconnect
              </Button>

            </div>

          ):(
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Connect YouTube
            </Button>
          )}

        </CardContent>

      </Card>

      {/* Coming Soon */}

      <Card>

        <CardContent className="pt-6 space-y-3">

          <p className="font-medium">
            More platforms coming soon
          </p>

          <p className="text-sm text-muted-foreground">
            Instagram, TikTok and Facebook publishing integrations will be added soon.
          </p>

        </CardContent>

      </Card>

    </div>

  )

}