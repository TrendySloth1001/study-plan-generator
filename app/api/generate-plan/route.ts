import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const studyPlanSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  timePerWeek: z.number(),
  format: z.enum(["theory-heavy", "project-heavy", "balanced"]),
  prerequisites: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      duration: z.string().optional(),
    }),
  ),
  coreTopics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      duration: z.string().optional(),
    }),
  ),
  progressSteps: z.array(
    z.object({
      week: z.number(),
      topics: z.array(z.string()),
      milestones: z.array(z.string()),
    }),
  ),
  resources: z.array(
    z.object({
      title: z.string(),
      type: z.enum(["book", "course", "article", "video", "project"]),
      url: z.string().optional(),
    }),
  ),
  timeline: z.string(),
  estimatedDuration: z.string(),
  tips: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, difficulty, timePerWeek, format } = body

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 })
    }

    console.log("[v0] Generating plan for:", topic)

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: studyPlanSchema,
      system: `You are an expert educational curriculum designer. Generate a comprehensive, well-structured study plan in JSON format.
      
      The plan must include:
      - Prerequisites (what learners should know first)
      - Core topics (main subjects to master)
      - Progress steps (week-by-week breakdown)
      - Resources (recommended books, courses, videos, projects)
      - Realistic timeline and estimated duration
      - Practical tips for success
      
      Format the response as valid JSON only. No markdown, no explanations, just JSON.`,
      prompt: `Create a detailed study plan for: "${topic}"
      
      Difficulty Level: ${difficulty}
      Available Time: ${timePerWeek} hours per week
      Learning Format: ${format}
      
      Generate a realistic, actionable study plan tailored to these parameters. Ensure topics are logically ordered and milestones are measurable.`,
    })

    return Response.json(object)
  } catch (error) {
    console.error("[v0] Error generating plan:", error)
    return Response.json({ error: "Failed to generate study plan" }, { status: 500 })
  }
}
