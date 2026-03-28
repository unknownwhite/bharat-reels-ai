import { GoogleGenerativeAI } from "@google/generative-ai"

/* ---------------- ENV VALIDATION ---------------- */

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing")
}

/* ---------------- INIT ---------------- */

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
})

/* ---------------- MAIN FUNCTION ---------------- */

export async function generateScriptAI(
  topic: string,
  tone: string = "engaging",
  language: string = "English"
) {
  if (!topic) {
    throw new Error("Topic is required")
  }

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

  /* ---------------- RETRY LOGIC ---------------- */

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🤖 Gemini attempt ${attempt}`)

      const result = await model.generateContent(prompt)

      if (!result?.response) {
        throw new Error("No response from Gemini")
      }

      const rawText = result.response.text()

      if (!rawText) {
        throw new Error("Empty Gemini response")
      }

      /* ---------------- CLEAN RESPONSE ---------------- */

      let cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      /* ---------------- PARSE ---------------- */

      let parsed: any

      try {
        parsed = JSON.parse(cleaned)
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (!match) {
          throw new Error("Invalid JSON format from Gemini")
        }
        parsed = JSON.parse(match[0])
      }

      /* ---------------- VALIDATE ---------------- */

      if (!parsed?.hook || !parsed?.script) {
        throw new Error("Invalid AI response structure")
      }

      console.log("✅ Gemini success")

      return {
        hook: parsed.hook,
        script: parsed.script
      }

    } catch (err: any) {
      console.error(`❌ Gemini attempt ${attempt} failed:`, err.message)

      /* RATE LIMIT HANDLING */
      if (err?.status === 429) {
        const delay = 2000 * attempt
        console.log(`⏳ Rate limited. Waiting ${delay}ms`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }

      /* UNKNOWN ERROR → FAIL FAST */
      if (attempt === 3) {
        throw err
      }
    }
  }

  throw new Error("Gemini failed after retries")
}