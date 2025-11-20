"use client"

import type React from "react"

import { useState } from "react"

interface StudyFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isLoading: boolean
}

export interface FormData {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  timePerWeek: number
  timeUnit: "hours" | "days" | "weeks" | "months"
  format: "theory-heavy" | "project-heavy" | "balanced"
}

export default function StudyForm({ onSubmit, isLoading }: StudyFormProps) {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [timePerWeek, setTimePerWeek] = useState(10)
  const [timeUnit, setTimeUnit] = useState<"hours" | "days" | "weeks" | "months">("hours")
  const [format, setFormat] = useState<"theory-heavy" | "project-heavy" | "balanced">("balanced")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setSubmitted(true)
    try {
      await onSubmit({
        topic: topic.trim(),
        difficulty,
        timePerWeek,
        timeUnit,
        format,
      })
    } finally {
      setSubmitted(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div className="border-4 border-neon-green pixel-border p-8 bg-panel-black slide-in">
        <label className="text-neon-green text-lg block mb-4 font-bold">&gt; TOPIC:</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., data science, web development, cybersecurity..."
          className="w-full h-32 text-neon-green bg-terminal-black border-2 border-neon-green p-4 text-base focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan transition-all"
          disabled={isLoading}
        />
        <p className="text-neon-green text-base mt-3 opacity-70">describe what you want to learn</p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty */}
        <div
          className="border-4 border-neon-pink pixel-border p-6 bg-panel-black slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <label className="text-neon-pink text-base block mb-4 font-bold">DIFFICULTY:</label>
          <div className="space-y-3">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <label
                key={level}
                className="flex items-center gap-3 cursor-pointer text-base text-neon-pink hover:text-neon-cyan transition-colors"
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Per Week */}
        <div
          className="border-4 border-neon-cyan pixel-border p-6 bg-panel-black slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          <label className="text-neon-cyan text-base block mb-4 font-bold">TIME/WEEK:</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="168"
              value={timePerWeek}
              onChange={(e) => setTimePerWeek(Math.max(1, Number.parseInt(e.target.value) || 1))}
              disabled={isLoading}
              className="flex-1 text-neon-cyan bg-terminal-black border-2 border-neon-cyan p-3 text-base focus:outline-none focus:border-neon-pink"
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as typeof timeUnit)}
              disabled={isLoading}
              className="text-neon-cyan bg-terminal-black border-2 border-neon-cyan p-3 text-base focus:outline-none focus:border-neon-pink"
            >
              <option value="hours">hrs</option>
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
            </select>
          </div>
          <p className="text-neon-cyan text-sm mt-3 opacity-70">time available per week</p>
        </div>

        {/* Format */}
        <div
          className="border-4 border-pixel-yellow pixel-border p-6 bg-panel-black slide-in"
          style={{ animationDelay: "0.3s" }}
        >
          <label className="text-pixel-yellow text-base block mb-4 font-bold">FORMAT:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            disabled={isLoading}
            className="w-full text-pixel-yellow bg-terminal-black border-2 border-pixel-yellow p-3 text-base focus:outline-none focus:border-neon-pink"
          >
            <option value="theory-heavy">Theory Heavy</option>
            <option value="project-heavy">Project Heavy</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center slide-in" style={{ animationDelay: "0.4s" }}>
        <button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className={`bg-neon-green text-terminal-black border-4 border-neon-green px-12 py-6 text-xl font-bold hover:bg-neon-cyan hover:border-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 ${isLoading ? "crt-flicker" : ""}`}
        >
          {isLoading ? "> GENERATING..." : "> GENERATE PLAN"}
        </button>
      </div>
    </form>
  )
}
