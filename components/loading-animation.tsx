"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, Zap, Brain, Sparkles, Target, Terminal, Code, Database, Cpu } from "lucide-react"

interface LoadingAnimationProps {
  stage?: "analyzing" | "generating" | "finalizing"
}

export default function LoadingAnimation({ stage = "analyzing" }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [dots, setDots] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)

  const steps = [
    { 
      icon: Brain, 
      text: "ANALYZING YOUR TOPIC", 
      color: "neon-cyan",
      commands: [
        "> Initializing neural network...",
        "> Loading topic analysis engine...",
        "> Scanning knowledge database...",
        "> Processing semantic relationships...",
        "> Topic analysis complete [OK]"
      ]
    },
    { 
      icon: Zap, 
      text: "GENERATING CURRICULUM", 
      color: "neon-green",
      commands: [
        "> Building curriculum framework...",
        "> Fetching educational resources...",
        "> Optimizing learning path...",
        "> Compiling topic hierarchy...",
        "> Curriculum generation complete [OK]"
      ]
    },
    { 
      icon: Target, 
      text: "CREATING MILESTONES", 
      color: "neon-pink",
      commands: [
        "> Calculating time estimates...",
        "> Defining weekly goals...",
        "> Creating progress checkpoints...",
        "> Structuring milestone tree...",
        "> Milestone creation complete [OK]"
      ]
    },
    { 
      icon: Sparkles, 
      text: "FINALIZING YOUR PLAN", 
      color: "pixel-yellow",
      commands: [
        "> Integrating all components...",
        "> Validating study plan...",
        "> Generating resource links...",
        "> Optimizing learning schedule...",
        "> Study plan ready [SUCCESS]"
      ]
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  useEffect(() => {
    if (currentStep >= 0 && steps[currentStep]) {
      const commands = steps[currentStep].commands
      let lineIndex = 0
      
      setTerminalLines([])
      
      const addLine = () => {
        if (lineIndex < commands.length) {
          setTerminalLines(prev => [...prev, commands[lineIndex]])
          lineIndex++
          setTimeout(addLine, 600)
        }
      }
      
      setTimeout(addLine, 300)
    }
  }, [currentStep])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  return (
    <div className="border-4 border-neon-cyan pixel-border bg-panel-black/90 backdrop-blur-sm relative overflow-hidden slide-in">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-neon-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Terminal Output */}
          <div className="flex-1">
            <div className="border-2 border-neon-green bg-terminal-black p-4 h-[400px] flex flex-col">
              {/* Terminal Header */}
              <div className="border-b-2 border-neon-green pb-3 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-neon-green" />
                  <span className="text-neon-green font-bold text-sm">STUDY_PLAN_GENERATOR_v2.0</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-pink border border-neon-pink animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-pixel-yellow border border-pixel-yellow" />
                  <div className="w-3 h-3 rounded-full bg-neon-green border border-neon-green" />
                </div>
              </div>

              {/* Terminal Output */}
              <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-neon-green scrollbar-track-terminal-black">
                <p className="text-gray-500"># Study Plan Generator - Gemini AI v2.5-flash</p>
                <p className="text-gray-500"># Initializing learning path optimizer...</p>
                <p className="text-neon-cyan mb-3">&gt; System ready.</p>
                
                {terminalLines.filter(line => line).map((line, i) => (
                  <p 
                    key={i} 
                    className={`${
                      line?.includes('[OK]') ? 'text-neon-green' : 
                      line?.includes('[SUCCESS]') ? 'text-pixel-yellow font-bold' :
                      'text-neon-cyan'
                    } slide-in`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {line}
                  </p>
                ))}
                
                {currentStep < steps.length - 1 && (
                  <p className="text-neon-cyan animate-pulse">
                    &gt; {steps[currentStep].text.toLowerCase()}{dots}
                  </p>
                )}
              </div>

              {/* Terminal Input Line */}
              <div className="border-t-2 border-neon-green pt-3 mt-3">
                <p className="text-neon-green font-mono text-sm">
                  user@study-gen:~$ <span className="animate-pulse">█</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Progress Steps */}
          <div className="lg:w-96 space-y-4">
            {/* Header with System Stats */}
            <div className="border-2 border-neon-cyan bg-terminal-black p-4">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-neon-cyan animate-pulse" />
                <span className="text-neon-cyan font-bold">SYSTEM STATUS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="border border-neon-green p-2 text-center">
                  <p className="text-gray-400">CPU</p>
                  <p className="text-neon-green font-bold">{45 + currentStep * 15}%</p>
                </div>
                <div className="border border-neon-cyan p-2 text-center">
                  <p className="text-gray-400">RAM</p>
                  <p className="text-neon-cyan font-bold">{2.1 + currentStep * 0.3}GB</p>
                </div>
                <div className="border border-neon-pink p-2 text-center">
                  <p className="text-gray-400">GPU</p>
                  <p className="text-neon-pink font-bold">{30 + currentStep * 12}%</p>
                </div>
              </div>
            </div>

            {/* Steps Indicator */}
            <div className="space-y-3">
              {steps.map((step, i) => {
                const Icon = step.icon
                const isActive = i === currentStep
                const isCompleted = i < currentStep

                return (
                  <div
                    key={i}
                    className={`border-2 p-4 transition-all duration-500 transform ${
                      isActive
                        ? `border-${step.color} bg-terminal-black scale-105 shadow-lg shadow-${step.color}/50`
                        : isCompleted
                          ? "border-neon-green bg-terminal-black"
                          : "border-gray-700 bg-panel-black opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? `border-${step.color} animate-pulse`
                            : isCompleted
                              ? "border-neon-green bg-neon-green"
                              : "border-gray-700"
                        }`}
                      >
                        {isCompleted ? (
                          <span className="text-terminal-black text-lg font-bold">✓</span>
                        ) : (
                          <Icon className={`w-5 h-5 ${
                            isActive ? `text-${step.color}` : "text-gray-700"
                          } ${isActive ? "animate-pulse" : ""}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-bold text-xs ${
                            isActive ? `text-${step.color} neon-glow` : isCompleted ? "text-neon-green" : "text-gray-700"
                          }`}
                        >
                          {isCompleted ? "✓" : "▶"} {step.text}
                        </p>
                        {isActive && (
                          <div className="mt-2 h-1 bg-gray-800 overflow-hidden relative">
                            <div className={`h-full bg-${step.color} absolute inset-0`} style={{
                              animation: "loading-bar 2s ease-in-out infinite"
                            }}></div>
                          </div>
                        )}
                        {isCompleted && (
                          <p className="text-neon-green text-xs mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress Summary */}
            <div className="border-2 border-pixel-yellow bg-terminal-black p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-pixel-yellow text-xs font-bold">OVERALL PROGRESS</span>
                <span className="text-pixel-yellow text-lg font-bold">{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-800 border border-pixel-yellow overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-pixel-yellow transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 border-2 border-neon-cyan bg-terminal-black p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-neon-cyan animate-pulse" />
            <span className="text-neon-cyan text-sm font-mono">
              Processing: <span className="text-neon-green">{steps[currentStep]?.text || "..."}</span>
            </span>
          </div>
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
