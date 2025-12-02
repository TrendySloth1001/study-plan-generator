import { Ollama } from "ollama"
import { z } from "zod"

const studyPlanSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  timePerWeek: z.number(),
  timeUnit: z.enum(["hours", "days", "weeks", "months"]),
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

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, difficulty, timePerWeek, timeUnit = "hours", format } = body

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 })
    }

    console.log("[v0] Generating plan for:", topic, "with", timePerWeek, timeUnit, "per week")

    const systemPrompt = `You are an expert educational curriculum designer. Generate a comprehensive, well-structured study plan in JSON format.
      
The plan must include:
- Prerequisites (what learners should know first)
- Core topics (main subjects to master)
- Progress steps (week-by-week breakdown)
- Resources (recommended books, courses, videos, projects)
- Realistic timeline and estimated duration
- Practical tips for success

Format the response as valid JSON only. No markdown, no explanations, just JSON.`

    const userPrompt = `Create a detailed study plan for: "${topic}"
      
Difficulty Level: ${difficulty}
Available Time: ${timePerWeek} ${timeUnit} per week
Learning Format: ${format}
      
IMPORTANT: Adjust the timeline and pacing based on the time unit provided:
- If timeUnit is "hours": Schedule around ${timePerWeek} hours per week
- If timeUnit is "days": Schedule around ${timePerWeek} days per week (full days)
- If timeUnit is "weeks": Schedule the full week (${timePerWeek} weeks per week means intensive study)
- If timeUnit is "months": Schedule long-term learning spanning multiple months
      
Generate a realistic, actionable study plan tailored to these parameters. Ensure topics are logically ordered and milestones are measurable. Include timeUnit: "${timeUnit}" in the response.

Respond with ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "difficulty": "beginner|intermediate|advanced",
  "timePerWeek": number,
  "timeUnit": "hours|days|weeks|months",
  "format": "theory-heavy|project-heavy|balanced",
  "prerequisites": [{"id": "string", "title": "string", "description": "string", "duration": "string"}],
  "coreTopics": [{"id": "string", "title": "string", "description": "string", "duration": "string"}],
  "progressSteps": [{"week": number, "topics": ["string"], "milestones": ["string"]}],
  "resources": [{"title": "string", "type": "book|course|article|video|project", "url": "string"}],
  "timeline": "string",
  "estimatedDuration": "string",
  "tips": ["string"]
}`

    const response = await ollama.chat({
      model: 'llama2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      format: 'json',
      stream: false,
    })

    // Parse and validate the JSON response
    const jsonResponse = JSON.parse(response.message.content)
    const validatedPlan = studyPlanSchema.parse(jsonResponse)

    return Response.json(validatedPlan)
  } catch (error) {
    console.error("[v0] Error generating plan:", error)
    return Response.json({ error: "Failed to generate study plan" }, { status: 500 })
  }
}
