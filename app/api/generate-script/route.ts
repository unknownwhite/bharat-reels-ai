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

Rules:
- Maximum 18 words
- Spoken style
- No emojis
- No formatting

Topic: ${topic}
Tone: ${tone}
Language: ${language}

Return ONLY JSON:

{
 "hook": "",
 "script": ""
}
`

    const result = await model.generateContent(prompt)

    const text = result.response.text()

    const cleaned = text.replace(/```json|```/g, "").trim()

    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)

  } catch (error) {

    console.error("Gemini error:", error)

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    )
  }
}