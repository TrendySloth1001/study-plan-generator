import { NextResponse } from "next/server"
import { Ollama } from "ollama"

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
})

export async function POST(req: Request) {
  try {
    const { topic, context, type } = await req.json()

    const prompts: Record<string, string> = {
      explain: `Explain "${topic}" in a clear, concise way suitable for a study plan. Context: ${context}. Provide a 2-3 sentence explanation focusing on key concepts and practical applications.`,
      tips: `Provide 3 practical study tips for learning "${topic}". Context: ${context}. Make them specific and actionable.`,
      resources: `Suggest 3 high-quality learning resources for "${topic}". Context: ${context}. Include resource types (course, book, documentation, etc.).`,
      prerequisites: `What are the essential prerequisites needed before learning "${topic}"? Context: ${context}. List 2-3 key concepts or skills.`,
      projects: `Suggest 2 hands-on project ideas to practice "${topic}". Context: ${context}. Make them practical and progressively challenging.`,
      breakdown: `Break down "${topic}" into 3-4 main subtopics or learning milestones. Context: ${context}. Provide a logical learning progression.`,
    }

    const prompt = prompts[type] || prompts.explain

    const response = await ollama.chat({
      model: 'llama2',
      messages: [
        { role: 'user', content: prompt }
      ],
      stream: false,
    })

    const text = response.message.content

    return NextResponse.json({ explanation: text })
  } catch (error: any) {
    console.error("AI Explanation Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation. Please check that Ollama is running with llama2 model." },
      { status: 500 }
    )
  }
}
