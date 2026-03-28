import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing")
}

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
})

export async function generateScriptAI(
  topic: string,
  tone = "engaging",
  language = "English"
) {
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

  for (let i = 0; i < 3; i++) {
    try {
      const result = await model.generateContent(prompt)

      const rawText = result.response.text()

      if (!rawText) throw new Error("Empty AI response")

      let cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      let parsed

      try {
        parsed = JSON.parse(cleaned)
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (!match) throw new Error("Invalid JSON")
        parsed = JSON.parse(match[0])
      }

      if (!parsed?.hook || !parsed?.script) {
        throw new Error("Invalid AI structure")
      }

      return parsed

    } catch (err: any) {
      console.error(`Gemini attempt ${i + 1} failed`, err.message)

      if (err?.status === 429) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1))) // exponential backoff
      } else {
        throw err
      }
    }
  }

  throw new Error("Gemini failed after retries")
}