"use client"

import { useState, useEffect } from "react"
import { Check, Circle, Lock, MapPin, Trophy, BookOpen, Target, Award } from "lucide-react"
import type { StudyPlan } from "@/lib/types"

interface TrackedProgress {
  [key: string]: boolean
}

export default function EnhancedStudyMap({ studyPlan }: { studyPlan: StudyPlan }) {
  const [progress, setProgress] = useState<TrackedProgress>({})
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`progress-${studyPlan.title}`)
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [studyPlan.title])

  // Save progress to localStorage
  const toggleProgress = (key: string) => {
    const newProgress = { ...progress, [key]: !progress[key] }
    setProgress(newProgress)
    localStorage.setItem(`progress-${studyPlan.title}`, JSON.stringify(newProgress))
  }

  const calculateCompletionRate = () => {
    const totalItems =
      studyPlan.prerequisites.length +
      studyPlan.coreTopics.length +
      studyPlan.progressSteps.reduce((sum, step) => sum + step.topics.length + step.milestones.length, 0)
    const completed = Object.values(progress).filter(Boolean).length
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  }

  const completionRate = calculateCompletionRate()

  return (
    <div className="w-full space-y-6 slide-in">
      {/* Progress Overview */}
      <div className="border-4 border-neon-cyan pixel-border p-6 bg-terminal-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-pixel-yellow w-8 h-8" />
            <h3 className="text-neon-cyan text-2xl font-bold neon-glow">PROGRESS TRACKER</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "map"
                  ? "border-neon-cyan bg-neon-cyan text-terminal-black"
                  : "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black"
              }`}
            >
              🗺️ MAP
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "list"
                  ? "border-neon-green bg-neon-green text-terminal-black"
                  : "border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black"
              }`}
            >
              📋 LIST
            </button>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-neon-cyan text-sm mb-2">
            <span>Overall Completion</span>
            <span className="font-bold text-lg">{completionRate}%</span>
          </div>
          <div className="w-full h-6 border-2 border-neon-cyan bg-panel-black">
            <div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink transition-all duration-500 flex items-center justify-center"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && (
                <span className="text-terminal-black text-xs font-bold">{completionRate}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        // Map View - Visual RPG-style Journey
        <div className="space-y-8">
          {/* Starting Point */}
          <div className="flex flex-col items-center">
            <div className="border-4 border-pixel-yellow pixel-border p-4 bg-terminal-black">
              <MapPin className="text-pixel-yellow w-12 h-12 mx-auto animate-bounce" />
              <p className="text-pixel-yellow text-center mt-2 font-bold">START HERE</p>
            </div>
            <div className="w-1 h-12 bg-neon-cyan"></div>
          </div>

          {/* Prerequisites Path */}
          {studyPlan.prerequisites.length > 0 && (
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neon-cyan -translate-x-1/2" />
              <div className="relative space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-block border-4 border-neon-cyan pixel-border p-3 bg-terminal-black">
                    <Lock className="inline text-neon-cyan w-6 h-6 mr-2" />
                    <h3 className="inline text-2xl font-bold text-neon-cyan neon-glow">PREREQUISITES</h3>
                  </div>
                </div>
                {studyPlan.prerequisites.map((prereq, i) => {
                  const key = `prereq-${i}`
                  const isCompleted = progress[key]
                  return (
                    <div
                      key={i}
                      className={`relative ${i % 2 === 0 ? "ml-auto mr-4 sm:mr-12" : "mr-auto ml-4 sm:ml-12"} w-11/12 sm:w-2/5`}
                    >
                      <div
                        onClick={() => toggleProgress(key)}
                        className={`border-4 pixel-border p-4 cursor-pointer transition-all transform hover:scale-105 ${
                          isCompleted
                            ? "border-neon-green bg-terminal-black"
                            : "border-neon-cyan bg-panel-black hover:bg-terminal-black"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 border-2 flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
                            }`}
                          >
                            {isCompleted && <Check className="text-terminal-black w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-xl font-bold mb-2 ${isCompleted ? "text-neon-green" : "text-neon-cyan"}`}>
                              {prereq.title}
                            </p>
                            {prereq.description && (
                              <p className="text-gray-300 text-sm mb-2">{prereq.description}</p>
                            )}
                            {prereq.duration && (
                              <p className="text-neon-cyan text-xs">⏱️ {prereq.duration}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Core Topics Path */}
          {studyPlan.coreTopics.length > 0 && (
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neon-green -translate-x-1/2" />
              <div className="relative space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-block border-4 border-neon-green pixel-border p-3 bg-terminal-black">
                    <BookOpen className="inline text-neon-green w-6 h-6 mr-2" />
                    <h3 className="inline text-2xl font-bold text-neon-green neon-glow">CORE TOPICS</h3>
                  </div>
                </div>
                {studyPlan.coreTopics.map((topic, i) => {
                  const key = `topic-${i}`
                  const isCompleted = progress[key]
                  return (
                    <div
                      key={i}
                      className={`relative ${i % 2 === 0 ? "ml-auto mr-4 sm:mr-12" : "mr-auto ml-4 sm:ml-12"} w-11/12 sm:w-2/5`}
                    >
                      <div
                        onClick={() => toggleProgress(key)}
                        className={`border-4 pixel-border p-4 cursor-pointer transition-all transform hover:scale-105 ${
                          isCompleted
                            ? "border-neon-green bg-terminal-black"
                            : "border-neon-green bg-panel-black hover:bg-terminal-black"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 border-2 flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? "border-neon-green bg-neon-green" : "border-neon-green"
                            }`}
                          >
                            {isCompleted && <Check className="text-terminal-black w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-neon-green text-xl font-bold mb-2">{topic.title}</p>
                            {topic.description && (
                              <p className="text-gray-300 text-sm mb-2">{topic.description}</p>
                            )}
                            {topic.duration && (
                              <p className="text-neon-green text-xs">⏱️ {topic.duration}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Weekly Progress Path */}
          {studyPlan.progressSteps.length > 0 && (
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neon-pink -translate-x-1/2" />
              <div className="relative space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-block border-4 border-neon-pink pixel-border p-3 bg-terminal-black">
                    <Target className="inline text-neon-pink w-6 h-6 mr-2" />
                    <h3 className="inline text-2xl font-bold text-neon-pink neon-glow">WEEKLY MILESTONES</h3>
                  </div>
                </div>
                {studyPlan.progressSteps.map((step, i) => (
                  <div key={i} className="relative mx-4 sm:mx-12">
                    <div className="border-4 border-neon-pink pixel-border p-6 bg-panel-black">
                      <h4 className="text-2xl text-neon-pink font-bold mb-4 flex items-center gap-2">
                        <span className="border-2 border-neon-pink px-3 py-1 text-sm">WEEK {step.week}</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-neon-cyan text-sm font-bold mb-2">📚 TOPICS:</p>
                          <div className="space-y-2">
                            {step.topics.map((topic, j) => {
                              const key = `step-${i}-topic-${j}`
                              const isCompleted = progress[key]
                              return (
                                <div
                                  key={j}
                                  onClick={() => toggleProgress(key)}
                                  className={`flex items-center gap-2 p-2 border-2 cursor-pointer transition-all ${
                                    isCompleted
                                      ? "border-neon-green bg-terminal-black"
                                      : "border-neon-cyan hover:bg-terminal-black"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${
                                      isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
                                    }`}
                                  >
                                    {isCompleted && <Check className="text-terminal-black w-3 h-3" />}
                                  </div>
                                  <span className={isCompleted ? "text-neon-green" : "text-gray-300"}>{topic}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-pixel-yellow text-sm font-bold mb-2">🎯 MILESTONES:</p>
                          <div className="space-y-2">
                            {step.milestones.map((milestone, j) => {
                              const key = `step-${i}-milestone-${j}`
                              const isCompleted = progress[key]
                              return (
                                <div
                                  key={j}
                                  onClick={() => toggleProgress(key)}
                                  className={`flex items-center gap-2 p-2 border-2 cursor-pointer transition-all ${
                                    isCompleted
                                      ? "border-neon-green bg-terminal-black"
                                      : "border-pixel-yellow hover:bg-terminal-black"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${
                                      isCompleted ? "border-neon-green bg-neon-green" : "border-pixel-yellow"
                                    }`}
                                  >
                                    {isCompleted && <Check className="text-terminal-black w-3 h-3" />}
                                  </div>
                                  <span className={isCompleted ? "text-neon-green" : "text-gray-300"}>
                                    {milestone}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End Point */}
          <div className="flex flex-col items-center">
            <div className="w-1 h-12 bg-neon-pink"></div>
            <div className="border-4 border-pixel-yellow pixel-border p-6 bg-terminal-black">
              <Award className="text-pixel-yellow w-16 h-16 mx-auto animate-pulse" />
              <p className="text-pixel-yellow text-center mt-4 text-xl font-bold">🎉 CONGRATULATIONS! 🎉</p>
              <p className="text-neon-green text-center mt-2">You've completed your journey!</p>
            </div>
          </div>
        </div>
      ) : (
        // List View - Compact checklist
        <div className="space-y-6">
          {/* Prerequisites List */}
          {studyPlan.prerequisites.length > 0 && (
            <div className="border-4 border-neon-cyan pixel-border p-4 bg-panel-black">
              <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                PREREQUISITES
              </h3>
              <div className="space-y-2">
                {studyPlan.prerequisites.map((prereq, i) => {
                  const key = `prereq-${i}`
                  const isCompleted = progress[key]
                  return (
                    <div
                      key={i}
                      onClick={() => toggleProgress(key)}
                      className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-all ${
                        isCompleted ? "border-neon-green bg-terminal-black" : "border-neon-cyan hover:bg-terminal-black"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
                        }`}
                      >
                        {isCompleted && <Check className="text-terminal-black w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isCompleted ? "text-neon-green line-through" : "text-neon-cyan"}`}>
                          {prereq.title}
                        </p>
                        {prereq.description && <p className="text-gray-300 text-sm mt-1">{prereq.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Core Topics List */}
          {studyPlan.coreTopics.length > 0 && (
            <div className="border-4 border-neon-green pixel-border p-4 bg-panel-black">
              <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                CORE TOPICS
              </h3>
              <div className="space-y-2">
                {studyPlan.coreTopics.map((topic, i) => {
                  const key = `topic-${i}`
                  const isCompleted = progress[key]
                  return (
                    <div
                      key={i}
                      onClick={() => toggleProgress(key)}
                      className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-all ${
                        isCompleted ? "border-neon-green bg-terminal-black" : "border-neon-green hover:bg-terminal-black"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          isCompleted ? "border-neon-green bg-neon-green" : "border-neon-green"
                        }`}
                      >
                        {isCompleted && <Check className="text-terminal-black w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isCompleted ? "text-neon-green line-through" : "text-neon-green"}`}>
                          {topic.title}
                        </p>
                        {topic.description && <p className="text-gray-300 text-sm mt-1">{topic.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Weekly Progress List */}
          {studyPlan.progressSteps.map((step, i) => (
            <div key={i} className="border-4 border-neon-pink pixel-border p-4 bg-panel-black">
              <h3 className="text-xl font-bold text-neon-pink mb-4">WEEK {step.week}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-neon-cyan text-sm font-bold mb-2">Topics:</p>
                  <div className="space-y-2">
                    {step.topics.map((topic, j) => {
                      const key = `step-${i}-topic-${j}`
                      const isCompleted = progress[key]
                      return (
                        <div
                          key={j}
                          onClick={() => toggleProgress(key)}
                          className={`flex items-center gap-2 p-2 border cursor-pointer transition-all ${
                            isCompleted ? "border-neon-green" : "border-neon-cyan"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 border flex items-center justify-center ${
                              isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
                            }`}
                          >
                            {isCompleted && <Check className="text-terminal-black w-3 h-3" />}
                          </div>
                          <span className={isCompleted ? "text-neon-green line-through" : "text-gray-300"}>
                            {topic}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-pixel-yellow text-sm font-bold mb-2">Milestones:</p>
                  <div className="space-y-2">
                    {step.milestones.map((milestone, j) => {
                      const key = `step-${i}-milestone-${j}`
                      const isCompleted = progress[key]
                      return (
                        <div
                          key={j}
                          onClick={() => toggleProgress(key)}
                          className={`flex items-center gap-2 p-2 border cursor-pointer transition-all ${
                            isCompleted ? "border-neon-green" : "border-pixel-yellow"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 border flex items-center justify-center ${
                              isCompleted ? "border-neon-green bg-neon-green" : "border-pixel-yellow"
                            }`}
                          >
                            {isCompleted && <Check className="text-terminal-black w-3 h-3" />}
                          </div>
                          <span className={isCompleted ? "text-neon-green line-through" : "text-gray-300"}>
                            {milestone}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources Section */}
      <div className="border-4 border-pixel-yellow pixel-border p-4 bg-panel-black">
        <h3 className="text-xl font-bold text-pixel-yellow mb-4">📚 RECOMMENDED RESOURCES</h3>
        <div className="space-y-2">
          {studyPlan.resources.map((resource, i) => (
            <div key={i} className="border-2 border-pixel-yellow p-3 bg-terminal-black flex justify-between items-center">
              <div>
                <p className="text-pixel-yellow font-bold">{resource.title}</p>
                <p className="text-gray-300 text-xs uppercase">[{resource.type}]</p>
              </div>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan font-bold hover:text-neon-pink transition-colors"
                >
                  OPEN →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="border-4 border-neon-cyan pixel-border p-4 bg-panel-black">
        <h3 className="text-xl font-bold text-neon-cyan mb-4">💡 TIPS FOR SUCCESS</h3>
        <div className="space-y-2">
          {studyPlan.tips.map((tip, i) => (
            <div key={i} className="border-l-4 border-neon-cyan pl-4 py-2 bg-terminal-black">
              <p className="text-gray-300 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
