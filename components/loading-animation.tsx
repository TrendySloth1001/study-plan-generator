"use client"

import { useEffect, useState } from "react"
import { Loader2, Zap, Brain, Sparkles, Target } from "lucide-react"

interface LoadingAnimationProps {
  stage?: "analyzing" | "generating" | "finalizing"
}

export default function LoadingAnimation({ stage = "analyzing" }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Brain, text: "ANALYZING YOUR TOPIC", color: "neon-cyan" },
    { icon: Zap, text: "GENERATING CURRICULUM", color: "neon-green" },
    { icon: Target, text: "CREATING MILESTONES", color: "neon-pink" },
    { icon: Sparkles, text: "FINALIZING YOUR PLAN", color: "pixel-yellow" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-4 border-neon-cyan pixel-border p-8 bg-panel-black">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Main Spinner */}
        <div className="relative">
          <div className="w-32 h-32 border-8 border-neon-cyan animate-spin-slow" style={{ borderTopColor: "transparent" }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-neon-green animate-spin" />
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="w-full max-w-md space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === currentStep
            const isCompleted = i < currentStep

            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 border-2 transition-all duration-500 ${
                  isActive
                    ? `border-${step.color} bg-terminal-black scale-105`
                    : isCompleted
                      ? "border-neon-green bg-terminal-black"
                      : "border-gray-700 bg-panel-black opacity-50"
                }`}
              >
                <div
                  className={`w-12 h-12 border-2 flex items-center justify-center ${
                    isActive
                      ? `border-${step.color} animate-pulse`
                      : isCompleted
                        ? "border-neon-green bg-neon-green"
                        : "border-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-terminal-black text-xl">✓</span>
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? `text-${step.color}` : "text-gray-700"}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-bold text-sm ${
                      isActive ? `text-${step.color} neon-glow` : isCompleted ? "text-neon-green" : "text-gray-700"
                    }`}
                  >
                    {step.text}
                  </p>
                  {isActive && (
                    <div className="mt-2 h-1 bg-gray-700 overflow-hidden">
                      <div className={`h-full bg-${step.color} animate-loading-bar`}></div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-neon-cyan text-lg font-bold animate-pulse">
            &gt; {steps[currentStep].text}...
          </p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 border-2 transition-all ${
                i === currentStep
                  ? "border-neon-cyan bg-neon-cyan scale-125"
                  : i < currentStep
                    ? "border-neon-green bg-neon-green"
                    : "border-gray-700"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
