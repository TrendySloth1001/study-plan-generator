"use client"

import { useState } from "react"
import StudyForm, { type FormData } from "@/components/study-form"
import EnhancedStudyMap from "@/components/enhanced-study-map"
import ChatBot from "@/components/chat-bot"
import LoadingAnimation from "@/components/loading-animation"
import ExportButtons from "@/components/export-buttons"
import type { StudyPlan } from "@/lib/types"
import { MessageSquare, X, Home } from "lucide-react"
import Link from "next/link"

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [isChatFullscreen, setIsChatFullscreen] = useState(false)

  const handleGeneratePlan = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setStudyPlan(null)

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

  const handleChatGenerate = (topic: string, options?: any) => {
    handleGeneratePlan({
      topic,
      difficulty: options?.difficulty || "intermediate",
      timePerWeek: options?.timePerWeek || 10,
      format: options?.format || "balanced",
    })
    setShowChat(false)
  }

  return (
    <main className="min-h-screen grid-bg bg-terminal-black">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="border-4 border-neon-cyan pixel-border mb-8 p-6 bg-panel-black slide-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-neon-cyan neon-glow text-3xl sm:text-5xl leading-tight mb-2 font-bold">
                STUDY PLAN GENERATOR
              </h1>
              <p className="text-neon-pink text-sm sm:text-base opacity-80 pulse-glow">
                powered by gemini ai • track your progress • achieve your goals
              </p>
            </div>
            <Link
              href="/"
              className="border-2 border-neon-green px-4 py-2 text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">HOME</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form */}
            {!studyPlan && <StudyForm onSubmit={handleGeneratePlan} isLoading={isLoading} />}

            {/* Error Message */}
            {error && (
              <div className="border-4 border-pixel-yellow pixel-border p-6 bg-panel-black slide-in">
                <p className="text-pixel-yellow text-base sm:text-lg pulse-glow">ERROR: {error}</p>
                <p className="text-gray-400 text-sm mt-2">
                  There was an issue generating your study plan. Please check your API configuration or try again.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="slide-in">
                <LoadingAnimation />
              </div>
            )}

            {/* Study Plan Output */}
            {studyPlan && !isLoading && (
              <div className="space-y-6 slide-in">
                <div className="border-4 border-neon-green pixel-border p-6 bg-panel-black">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-neon-green text-3xl sm:text-4xl font-bold neon-glow">{studyPlan.title}</h3>
                    <button
                      onClick={() => setStudyPlan(null)}
                      className="border-2 border-neon-pink px-4 py-2 text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all text-sm font-bold"
                    >
                      NEW PLAN
                    </button>
                  </div>

                  {/* Plan Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="border-2 border-neon-cyan p-4 bg-terminal-black">
                      <p className="text-neon-cyan text-xs font-bold mb-1">DIFFICULTY</p>
                      <p className="text-neon-cyan text-lg capitalize">{studyPlan.difficulty}</p>
                    </div>
                    <div className="border-2 border-neon-green p-4 bg-terminal-black">
                      <p className="text-neon-green text-xs font-bold mb-1">TIME PER WEEK</p>
                      <p className="text-neon-green text-lg">{studyPlan.timePerWeek} hours</p>
                    </div>
                    <div className="border-2 border-neon-pink p-4 bg-terminal-black">
                      <p className="text-neon-pink text-xs font-bold mb-1">TIMELINE</p>
                      <p className="text-neon-pink text-lg">{studyPlan.timeline}</p>
                    </div>
                    <div className="border-2 border-pixel-yellow p-4 bg-terminal-black">
                      <p className="text-pixel-yellow text-xs font-bold mb-1">ESTIMATED DURATION</p>
                      <p className="text-pixel-yellow text-lg">{studyPlan.estimatedDuration}</p>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="border-2 border-neon-cyan p-4 bg-terminal-black">
                    <p className="text-neon-cyan text-sm font-bold mb-3">📥 EXPORT YOUR PLAN:</p>
                    <ExportButtons studyPlan={studyPlan} />
                  </div>
                </div>

                {/* Enhanced Study Map with Tracking */}
                <EnhancedStudyMap studyPlan={studyPlan} />
              </div>
            )}

            {/* Empty State */}
            {!studyPlan && !error && !isLoading && (
              <div className="border-4 border-neon-pink pixel-border p-12 bg-panel-black slide-in text-center">
                <div className="max-w-md mx-auto">
                  <p className="text-neon-pink text-2xl mb-4 font-bold">&gt; READY TO START?</p>
                  <p className="text-gray-300 text-base mb-6">
                    Enter a topic above to generate your personalized study plan, or try the AI chat assistant!
                  </p>
                  <button
                    onClick={() => setShowChat(true)}
                    className="border-2 border-neon-cyan px-6 py-3 text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black transition-all font-bold flex items-center gap-2 mx-auto"
                  >
                    <MessageSquare className="w-5 h-5" />
                    OPEN AI CHAT
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {!showChat ? (
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full border-4 border-neon-cyan pixel-border p-6 bg-panel-black hover:bg-terminal-black transition-all slide-in"
                >
                  <MessageSquare className="w-12 h-12 text-neon-cyan mx-auto mb-3" />
                  <p className="text-neon-cyan text-xl font-bold">AI CHAT ASSISTANT</p>
                  <p className="text-gray-300 text-base mt-2">Click to open intelligent chat with @ or / commands</p>
                </button>
              ) : (
                <div className="relative slide-in">
                  <button
                    onClick={() => {
                      setShowChat(false)
                      setIsChatFullscreen(false)
                    }}
                    className="absolute -top-4 -right-4 z-10 w-10 h-10 border-2 border-neon-pink bg-neon-pink text-terminal-black hover:bg-terminal-black hover:text-neon-pink transition-all flex items-center justify-center font-bold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="h-[600px]">
                    <ChatBot 
                      studyPlan={studyPlan} 
                      onGeneratePlan={handleChatGenerate}
                      isFullscreen={isChatFullscreen}
                      onToggleFullscreen={() => setIsChatFullscreen(!isChatFullscreen)}
                    />
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              {!showChat && (
                <div className="mt-8 border-4 border-neon-green pixel-border p-6 bg-panel-black slide-in">
                  <h3 className="text-neon-green text-xl font-bold mb-4">💡 QUICK TIPS</h3>
                  <ul className="space-y-3 text-base text-gray-300">
                    <li className="flex gap-2">
                      <span className="text-neon-cyan">•</span>
                      <span>Click items on the map to mark them complete</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-cyan">•</span>
                      <span>Use @ or / in chat for commands</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-cyan">•</span>
                      <span>Switch between map and list view</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-cyan">•</span>
                      <span>Export your plan as PDF or JSON</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neon-cyan">•</span>
                      <span>Progress saves automatically</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Chat Overlay */}
      {isChatFullscreen && showChat && (
        <div className="fixed inset-0 z-50 bg-terminal-black">
          <div className="h-full p-4">
            <ChatBot 
              studyPlan={studyPlan} 
              onGeneratePlan={handleChatGenerate}
              isFullscreen={isChatFullscreen}
              onToggleFullscreen={() => setIsChatFullscreen(false)}
            />
          </div>
        </div>
      )}
    </main>
  )
}
