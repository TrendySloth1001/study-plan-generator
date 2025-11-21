import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { topic, context, type } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompts: Record<string, string> = {
      explain: `Explain "${topic}" in a clear, concise way suitable for a study plan. Context: ${context}. Provide a 2-3 sentence explanation focusing on key concepts and practical applications.`,
      tips: `Provide 3 practical study tips for learning "${topic}". Context: ${context}. Make them specific and actionable.`,
      resources: `Suggest 3 high-quality learning resources for "${topic}". Context: ${context}. Include resource types (course, book, documentation, etc.).`,
      prerequisites: `What are the essential prerequisites needed before learning "${topic}"? Context: ${context}. List 2-3 key concepts or skills.`,
      projects: `Suggest 2 hands-on project ideas to practice "${topic}". Context: ${context}. Make them practical and progressively challenging.`,
      breakdown: `Break down "${topic}" into 3-4 main subtopics or learning milestones. Context: ${context}. Provide a logical learning progression.`,
    }

    const prompt = prompts[type] || prompts.explain

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ explanation: text })
  } catch (error: any) {
    console.error("AI Explanation Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    )
  }
}
