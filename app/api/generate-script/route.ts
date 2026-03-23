export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    console.log("API HIT: generate-script")

    /* ---------- ENV ---------- */

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    /* ---------- INPUT ---------- */

    const { topic, tone = "engaging", language = "English" } = await req.json()

    if (!topic) {
      return NextResponse.json(
        { error: "Topic required" },
        { status: 400 }
      )
    }

    /* ---------- CACHE CHECK ---------- */

    const cached = await supabase
      .from("generated_videos")
      .select("hook, script")
      .eq("topic", topic)
      .not("script", "is", null)
      .limit(1)
      .single()

    if (cached.data?.hook && cached.data?.script) {
      console.log("Using cached script")

      return NextResponse.json({
        hook: cached.data.hook,
        script: cached.data.script
      })
    }

    /* ---------- MODEL ---------- */

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash" // ✅ correct format
    })

    const prompt = `
Create a viral YouTube Shorts script.

STRICT RULES:
- Maximum 18 words TOTAL
- Spoken conversational style
- No emojis
- No formatting
- Hook must grab attention instantly

Topic: ${topic}
Tone: ${tone}
Language: ${language}

Return ONLY valid JSON:

{
 "hook": "",
 "script": ""
}
`

    /* ---------- RETRY ---------- */

    async function generateWithRetry(retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          console.log("Calling Gemini... attempt:", i + 1)

          const result = await model.generateContent(prompt)

          console.log("Gemini response received")

          return result
        } catch (err: any) {
          console.error("Gemini error:", err)

          if (err?.status === 429) {
            console.log("Rate limited. Waiting 60s...")
            await new Promise(r => setTimeout(r, 60000))
          } else {
            throw err
          }
        }
      }
      return null
    }

    /* ---------- TIMEOUT WRAPPER ---------- */

    const result: any = await Promise.race([
      generateWithRetry(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), 15000)
      )
    ])

    /* ---------- VALIDATION ---------- */

    if (!result || !result.response) {
      throw new Error("No response from Gemini")
    }

    const rawText = result.response.text()

    if (!rawText) {
      throw new Error("Empty AI response")
    }

    /* ---------- CLEAN ---------- */

    let cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    /* ---------- PARSE ---------- */

    let parsed

    try {
      parsed = JSON.parse(cleaned)
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/)

      if (!match) {
        throw new Error("Invalid AI response format")
      }

      parsed = JSON.parse(match[0])
    }

    /* ---------- FINAL VALIDATION ---------- */

    if (!parsed?.hook || !parsed?.script) {
      throw new Error("Invalid AI structure")
    }

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error("FINAL ERROR:", error)

    return NextResponse.json(
      {
        error: "AI generation failed",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    )
  }
}