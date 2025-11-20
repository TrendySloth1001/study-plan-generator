import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      system: `You are an expert AI learning assistant for a study plan generator app. You help users:

1. Learn effectively by answering questions about any topic
2. Provide study strategies and learning techniques
3. Answer questions about their study plans
4. Give motivation and encouragement
5. Explain complex topics in simple terms
6. Suggest learning resources and approaches

Be helpful, encouraging, and concise. Format responses clearly with bullet points when appropriate.
Use a friendly but professional tone. Keep responses focused and actionable.`,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[Chat API] Error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate response. Please check your API key and try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
