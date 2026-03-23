import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const supabase = createClient(
process.env.SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateTopic(){

const topics=[
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

return topics[Math.floor(Math.random()*topics.length)]

}

export async function GET(){

try{

const todayStart=new Date()

todayStart.setHours(0,0,0,0)

const {data:users,error:userError}=await supabase
.from("users")
.select("id,automation_enabled,daily_video_limit")

if(userError) throw userError

let jobsCreated=0

for(const user of users || []){

if(!user.automation_enabled) continue

const {count}=await supabase
.from("generated_videos")
.select("*",{count:"exact",head:true})
.eq("user_id",user.id)
.gte("created_at",todayStart.toISOString())

if((count || 0)>= (user.daily_video_limit || 5)) continue

const topic=generateTopic()

const {error:insertError}=await supabase
.from("generated_videos")
.insert({
user_id:user.id,
topic,
status:"pending"
})

if(insertError){
console.error("Job insert error:",insertError)
continue
}

jobsCreated++

}

return NextResponse.json({
success:true,
jobs_created:jobsCreated
})

}catch(err){

console.error("Scheduler failed:",err)

return NextResponse.json(
{error:"Scheduler failed"},
{status:500}
)

}

}