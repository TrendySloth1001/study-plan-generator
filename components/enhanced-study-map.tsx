"use client"

import { useState, useEffect } from "react"
import { Check, Circle, Lock, MapPin, Trophy, BookOpen, Target, Award, Clock, Calendar } from "lucide-react"
import type { StudyPlan, ProgressEntry, TrackedProgress } from "@/lib/types"
import dynamic from "next/dynamic"

const Roadmap3D = dynamic(() => import("@/components/roadmap-3d"), { ssr: false })
const EnhancedCanvas = dynamic(() => import("@/components/enhanced-canvas"), { ssr: false })

export default function EnhancedStudyMap({ studyPlan }: { studyPlan: StudyPlan }) {
  const [progress, setProgress] = useState<TrackedProgress>({})
  const [viewMode, setViewMode] = useState<"map" | "list" | "3d" | "canvas">("canvas")
  const [showStats, setShowStats] = useState(false)

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`progress-${studyPlan.title}`)
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [studyPlan.title])

  // Save progress to localStorage with timestamp
  const toggleProgress = (key: string) => {
    const newProgress = { ...progress }
    
    if (newProgress[key]?.completed) {
      // Uncompleting - remove the entry
      delete newProgress[key]
    } else {
      // Completing - add timestamp
      newProgress[key] = {
        completed: true,
        timestamp: new Date().toISOString(),
      }
    }
    
    setProgress(newProgress)
    localStorage.setItem(`progress-${studyPlan.title}`, JSON.stringify(newProgress))
  }

  const calculateCompletionRate = () => {
    const totalItems =
      studyPlan.prerequisites.length +
      studyPlan.coreTopics.length +
      studyPlan.progressSteps.reduce((sum, step) => sum + step.topics.length + step.milestones.length, 0)
    const completed = Object.values(progress).filter((p) => p?.completed).length
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  }

  const getFormattedTimestamp = (timestamp?: string) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getRecentCompletions = () => {
    const completed = Object.entries(progress)
      .filter(([_, p]) => p?.completed && p?.timestamp)
      .map(([key, p]) => ({
        key,
        timestamp: p.timestamp!,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
    return completed
  }

  const completionRate = calculateCompletionRate()
  
  // Create simpler progress object for 3D view
  const simpleProgress = Object.entries(progress).reduce((acc, [key, entry]) => {
    acc[key] = entry?.completed || false
    return acc
  }, {} as { [key: string]: boolean })

  return (
    <div className="w-full space-y-6 slide-in">
      {/* Progress Overview */}
      <div className="border-4 border-neon-cyan pixel-border p-6 bg-terminal-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-pixel-yellow w-8 h-8 animate-pulse" />
            <h3 className="text-neon-cyan text-2xl font-bold neon-glow">PROGRESS TRACKER</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setViewMode("canvas")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "canvas"
                  ? "border-neon-pink bg-neon-pink text-terminal-black"
                  : "border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black"
              }`}
            >
              🎯 CANVAS
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "3d"
                  ? "border-neon-cyan bg-neon-cyan text-terminal-black"
                  : "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black"
              }`}
            >
              🎮 3D
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "map"
                  ? "border-neon-green bg-neon-green text-terminal-black"
                  : "border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black"
              }`}
            >
              🗺️ MAP
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                viewMode === "list"
                  ? "border-pixel-yellow bg-pixel-yellow text-terminal-black"
                  : "border-pixel-yellow text-pixel-yellow hover:bg-pixel-yellow hover:text-terminal-black"
              }`}
            >
              📋 LIST
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 text-sm font-bold border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all"
            >
              📊 STATS
            </button>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-neon-cyan text-sm mb-2">
            <span>Overall Completion</span>
            <span className="font-bold text-lg">{completionRate}%</span>
          </div>
          <div className="w-full h-6 border-2 border-neon-cyan bg-panel-black relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink transition-all duration-500 flex items-center justify-center relative"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && (
                <span className="text-terminal-black text-xs font-bold">{completionRate}%</span>
              )}
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="mt-4 border-2 border-neon-cyan p-4 bg-panel-black slide-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-neon-cyan text-2xl font-bold">
                  {Object.values(progress).filter((p) => p?.completed).length}
                </p>
                <p className="text-gray-400 text-xs">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-neon-pink text-2xl font-bold">
                  {studyPlan.prerequisites.length + studyPlan.coreTopics.length + studyPlan.progressSteps.reduce((sum, step) => sum + step.topics.length + step.milestones.length, 0) - Object.values(progress).filter((p) => p?.completed).length}
                </p>
                <p className="text-gray-400 text-xs">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-neon-green text-2xl font-bold">
                  {studyPlan.progressSteps.length}
                </p>
                <p className="text-gray-400 text-xs">Weeks</p>
              </div>
              <div className="text-center">
                <p className="text-pixel-yellow text-2xl font-bold">
                  {studyPlan.timePerWeek}h
                </p>
                <p className="text-gray-400 text-xs">Per Week</p>
              </div>
            </div>

            {/* Recent Activity */}
            {getRecentCompletions().length > 0 && (
              <div>
                <h4 className="text-neon-cyan text-sm font-bold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  RECENT ACTIVITY
                </h4>
                <div className="space-y-2">
                  {getRecentCompletions().map((completion, i) => (
                    <div key={i} className="flex items-center justify-between text-xs border-l-2 border-neon-green pl-2 py-1">
                      <span className="text-gray-300">{completion.key.replace(/-/g, " ").toUpperCase()}</span>
                      <span className="text-neon-green flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {getFormattedTimestamp(completion.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Canvas View */}
      {viewMode === "canvas" && (
        <div className="slide-in">
          <EnhancedCanvas 
            studyPlan={studyPlan} 
            progress={progress} 
            onToggleProgress={toggleProgress} 
          />
        </div>
      )}

      {/* 3D Roadmap View */}
      {viewMode === "3d" && (
        <div className="slide-in">
          <Roadmap3D 
            studyPlan={studyPlan} 
            progress={simpleProgress} 
            onToggleProgress={toggleProgress} 
          />
        </div>
      )}

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
                  const progressEntry = progress[key]
                  const isCompleted = progressEntry?.completed || false
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
                            <div className="flex items-center gap-4 flex-wrap">
                              {prereq.duration && (
                                <p className="text-neon-cyan text-xs">⏱️ {prereq.duration}</p>
                              )}
                              {isCompleted && progressEntry?.timestamp && (
                                <p className="text-neon-green text-xs flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {getFormattedTimestamp(progressEntry.timestamp)}
                                </p>
                              )}
                            </div>
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
                  const progressEntry = progress[key]
                  const isCompleted = progressEntry?.completed || false
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
                            <div className="flex items-center gap-4 flex-wrap">
                              {topic.duration && (
                                <p className="text-neon-green text-xs">⏱️ {topic.duration}</p>
                              )}
                              {isCompleted && progressEntry?.timestamp && (
                                <p className="text-neon-green text-xs flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {getFormattedTimestamp(progressEntry.timestamp)}
                                </p>
                              )}
                            </div>
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
      <div className="border-4 border-pixel-yellow pixel-border p-8 bg-panel-black/90 backdrop-blur-sm relative overflow-hidden group">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pixel-yellow/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Floating decorative boxes */}
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-pixel-yellow/30 rotate-45 animate-float" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-neon-pink/30 rotate-12 animate-float" style={{ animationDelay: "0.5s" }} />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-pixel-yellow to-transparent opacity-30" />
            <h3 className="relative inline-block text-3xl font-bold mb-3 px-6 bg-panel-black">
              <span className="bg-gradient-to-r from-pixel-yellow via-neon-pink to-neon-cyan bg-clip-text text-transparent animate-gradient">
                RECOMMENDED RESOURCES
              </span>
            </h3>
            <p className="text-gray-400 text-sm mt-2 border-l-2 border-r-2 border-pixel-yellow/50 inline-block px-4 py-1">
              <span className="text-pixel-yellow">▸</span> Curated learning materials <span className="text-pixel-yellow">◂</span>
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyPlan.resources.map((resource, i) => (
              <div
                key={i}
                className="border-2 border-pixel-yellow p-4 bg-terminal-black/80 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-pixel-yellow to-transparent opacity-20 group-hover:opacity-40 transition-opacity" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-pixel-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{resource.type === "book" ? "📚" : resource.type === "video" ? "🎥" : resource.type === "course" ? "🎓" : resource.type === "project" ? "🔨" : "📄"}</span>
                      <p className="text-pixel-yellow font-bold text-lg">{resource.title}</p>
                    </div>
                    <span className="inline-block border border-pixel-yellow/50 px-2 py-1 text-xs text-pixel-yellow uppercase">
                      {resource.type}
                    </span>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-neon-cyan px-4 py-2 text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black transition-all font-bold text-sm whitespace-nowrap"
                    >
                      OPEN →
                    </a>
                  )}
                </div>

                {/* Number badge */}
                <div className="absolute bottom-2 right-2 w-8 h-8 border border-pixel-yellow/30 flex items-center justify-center text-pixel-yellow/30 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="border-4 border-neon-cyan pixel-border p-8 bg-panel-black/90 backdrop-blur-sm relative overflow-hidden group">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        
        {/* Floating decorative boxes */}
        <div className="absolute top-6 right-6 w-10 h-10 border-2 border-neon-cyan/30 -rotate-12 animate-float" />
        <div className="absolute bottom-6 left-6 w-7 h-7 border-2 border-neon-green/30 rotate-45 animate-float" style={{ animationDelay: "0.7s" }} />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30" />
            <h3 className="relative inline-block text-3xl font-bold mb-3 px-6 bg-panel-black">
              <span className="bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink bg-clip-text text-transparent animate-gradient">
                TIPS FOR SUCCESS
              </span>
            </h3>
            <p className="text-gray-400 text-sm mt-2 border-l-2 border-r-2 border-neon-cyan/50 inline-block px-4 py-1">
              <span className="text-neon-cyan">▸</span> Pro strategies from experts <span className="text-neon-cyan">◂</span>
            </p>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyPlan.tips.map((tip, i) => (
              <div
                key={i}
                className="border-2 border-neon-cyan p-5 bg-terminal-black/80 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-neon-cyan to-transparent opacity-20 group-hover:opacity-40 transition-opacity" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                <div className="relative z-10 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 border-2 border-neon-cyan flex items-center justify-center bg-terminal-black group-hover:bg-neon-cyan group-hover:text-terminal-black transition-all">
                      <span className="text-2xl">💡</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-base leading-relaxed">{tip}</p>
                  </div>
                </div>

                {/* Number badge */}
                <div className="absolute top-2 right-2 w-8 h-8 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan/30 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
