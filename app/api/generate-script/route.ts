export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing")
}

const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req: Request) {
  try {

    const { topic, tone, language } = await req.json()

    if (!topic) {
      return NextResponse.json(
        { error: "Topic required" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
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

    const result = await model.generateContent(prompt)

    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error("Invalid AI response")
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.hook || !parsed.script) {
      throw new Error("Incomplete AI response")
    }

    return NextResponse.json(parsed)

  } catch (error) {

    console.error("Gemini error:", error)

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    )

  }
}