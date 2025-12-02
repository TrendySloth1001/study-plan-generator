import { Ollama } from "ollama"

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const systemMessage = `You are an expert AI learning assistant for a study plan generator app. You help users:

1. Learn effectively by answering questions about any topic
2. Provide study strategies and learning techniques
3. Answer questions about their study plans
4. Give motivation and encouragement
5. Explain complex topics in simple terms
6. Suggest learning resources and approaches

Be helpful, encouraging, and concise. Format responses clearly with bullet points when appropriate.
Use a friendly but professional tone. Keep responses focused and actionable.`

    // Format messages for Ollama
    const formattedMessages = [
      { role: 'system', content: systemMessage },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ]

    const response = await ollama.chat({
      model: 'llama2',
      messages: formattedMessages,
      stream: true,
    })

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of response) {
            const text = part.message.content
            controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error("[Chat API] Error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate response. Please check that Ollama is running with llama2 model." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
