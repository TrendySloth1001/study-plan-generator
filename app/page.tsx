"use client"

import { useState } from "react"
import StudyForm, { type FormData } from "@/components/study-form"
import StudyMap from "@/components/study-map"
import ExportButtons from "@/components/export-buttons"
import type { StudyPlan } from "@/lib/types"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGeneratePlan = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[v0] Submitting form data:", formData)
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate study plan")
      }

      const plan = await response.json()
      console.log("[v0] Received plan:", plan)
      setStudyPlan(plan)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[v0] Error generating plan:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid-bg bg-terminal-black p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-4 border-neon-cyan pixel-border mb-8 p-6 bg-panel-black slide-in">
          <h1 className="text-neon-cyan neon-glow text-center text-4xl sm:text-5xl leading-tight mb-2">STUDY PLAN</h1>
          <h2 className="text-neon-green neon-glow text-center text-2xl sm:text-3xl leading-tight">GENERATOR</h2>
          <p className="text-neon-pink text-center text-sm sm:text-base mt-4 opacity-80 pulse-glow">
            powered by gemini ai
          </p>
        </div>

        {/* Form */}
        <StudyForm onSubmit={handleGeneratePlan} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="border-4 border-pixel-yellow pixel-border p-6 bg-panel-black mt-8 slide-in">
            <p className="text-pixel-yellow text-base sm:text-lg pulse-glow">ERROR: {error}</p>
          </div>
        )}

        {/* Output area */}
        {!studyPlan && !error && (
          <div
            className="border-4 border-neon-pink pixel-border p-6 bg-panel-black mt-8 min-h-96 slide-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-neon-pink text-center text-base sm:text-lg">
              {isLoading ? (
                <p className="animate-pulse-glow">&gt; GENERATING YOUR STUDY MAP...</p>
              ) : (
                <p>&gt; ENTER A TOPIC AND GENERATE YOUR PLAN</p>
              )}
            </div>
          </div>
        )}

        {/* Study Plan Output */}
        {studyPlan && !isLoading && (
          <div
            className="border-4 border-neon-green pixel-border p-6 bg-panel-black mt-8 space-y-6 slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-neon-green text-2xl sm:text-3xl mb-6 font-bold neon-glow">{studyPlan.title}</h3>

            {/* RPG Map */}
            <StudyMap studyPlan={studyPlan} />

            {/* Plan Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="border-2 border-neon-cyan p-3 bg-terminal-black slide-in"
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-neon-cyan text-sm font-bold">TIMELINE</p>
                <p className="text-neon-cyan text-sm mt-1">{studyPlan.timeline}</p>
              </div>
              <div
                className="border-2 border-neon-green p-3 bg-terminal-black slide-in"
                style={{ animationDelay: "0.4s" }}
              >
                <p className="text-neon-green text-sm font-bold">ESTIMATED DURATION</p>
                <p className="text-neon-green text-sm mt-1">{studyPlan.estimatedDuration}</p>
              </div>
            </div>

            {/* Export Buttons */}
            <div
              className="border-2 border-neon-pink p-4 bg-terminal-black slide-in"
              style={{ animationDelay: "0.5s" }}
            >
              <p className="text-neon-pink text-sm font-bold mb-4">DOWNLOAD PLAN:</p>
              <ExportButtons studyPlan={studyPlan} />
            </div>

            {/* Tips */}
            {studyPlan.tips.length > 0 && (
              <div
                className="border-2 border-pixel-yellow p-3 bg-terminal-black slide-in"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="text-pixel-yellow text-sm font-bold mb-2">TIPS FOR SUCCESS:</p>
                <ul className="space-y-1">
                  {studyPlan.tips.slice(0, 3).map((tip, i) => (
                    <li key={i} className="text-pixel-yellow text-sm">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
