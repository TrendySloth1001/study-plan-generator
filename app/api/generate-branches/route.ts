import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { topic, context } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file." },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Generate a comprehensive learning structure for: "${topic}"
Context: ${context}

Provide a JSON response with the following structure (respond ONLY with valid JSON, no markdown):
{
  "mainTopic": "${topic}",
  "branches": [
    {
      "id": "branch-1",
      "title": "Branch Title",
      "description": "Brief description",
      "subtopics": [
        {
          "id": "subtopic-1-1",
          "title": "Subtopic Title",
          "description": "Detailed description",
          "duration": "2 hours",
          "resources": [
            {
              "title": "Resource Name",
              "url": "https://example.com",
              "type": "documentation|video|course|book|article"
            }
          ],
          "leafNodes": [
            {
              "id": "leaf-1-1-1",
              "title": "Specific Concept",
              "description": "Very detailed explanation",
              "difficulty": "beginner|intermediate|advanced"
            }
          ]
        }
      ]
    }
  ],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "estimatedTime": "X weeks",
  "skillLevel": "beginner|intermediate|advanced"
}

Generate 3-4 main branches, each with 2-3 subtopics, and each subtopic with 2-4 leaf nodes. Include real, working URLs for resources (documentation, official sites, popular courses).`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Parse JSON
    const data = JSON.parse(text)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("AI Branch Generation Error:", error)
    
    // Provide a fallback structure
    return NextResponse.json({
      error: error.message || "Failed to generate branches",
      fallback: {
        mainTopic: "Learning Topic",
        branches: [
          {
            id: "branch-1",
            title: "Core Concepts",
            description: "Fundamental concepts and basics",
            subtopics: [
              {
                id: "subtopic-1-1",
                title: "Introduction",
                description: "Getting started with the basics",
                duration: "2 hours",
                resources: [
                  {
                    title: "Official Documentation",
                    url: "https://developer.mozilla.org",
                    type: "documentation"
                  }
                ],
                leafNodes: [
                  {
                    id: "leaf-1-1-1",
                    title: "Basic Concepts",
                    description: "Understanding the fundamentals",
                    difficulty: "beginner"
                  }
                ]
              }
            ]
          }
        ],
        prerequisites: ["Basic knowledge required"],
        estimatedTime: "4 weeks",
        skillLevel: "beginner"
      }
    })
  }
}
