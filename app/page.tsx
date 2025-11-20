"use client"

import { ArrowRight, Zap, Map, Target, TrendingUp, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import { useState, Suspense, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import Solar System (client-side only)
const SolarSystemScene = dynamic(() => import("@/components/solar-system"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] md:h-[800px] flex items-center justify-center">
      <div className="text-pixel-yellow animate-pulse">Loading Solar System...</div>
    </div>
  ),
})

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-POWERED",
      description: "Intelligent curriculum generation tailored to your learning style",
      color: "neon-cyan",
    },
    {
      icon: Map,
      title: "VISUAL JOURNEY",
      description: "Interactive RPG-style map to track your learning progress",
      color: "neon-green",
    },
    {
      icon: Target,
      title: "GOAL TRACKING",
      description: "Mark milestones complete and watch your progress grow",
      color: "neon-pink",
    },
    {
      icon: Sparkles,
      title: "SMART CHAT",
      description: "AI chatbot with slash commands for instant help",
      color: "pixel-yellow",
    },
  ]

  // Dynamic stats - no hardcoded numbers
  const [stats, setStats] = useState([
    { value: "AI", label: "Powered Learning", color: "neon-cyan" },
    { value: "∞", label: "Unlimited Topics", color: "neon-green" },
    { value: "24/7", label: "Always Available", color: "neon-pink" },
  ])

  return (
    <main className="min-h-screen grid-bg bg-terminal-black relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border-4 border-neon-cyan animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-neon-pink animate-pulse delay-100"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 border-4 border-neon-green animate-pulse delay-200"></div>
          <div className="absolute bottom-1/4 left-1/2 w-40 h-40 border-4 border-pixel-yellow animate-pulse delay-300"></div>
        </div>

        {/* Floating particles - fixed positions to prevent hydration errors */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[10, 25, 40, 55, 70, 85, 15, 35, 60, 80, 5, 95, 30, 50, 75, 20, 45, 65, 90, 12].map((left, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-neon-cyan animate-float"
                style={{
                  left: `${left}%`,
                  top: `${(i * 5.26) % 100}%`,
                  animationDelay: `${(i * 0.25) % 5}s`,
                  animationDuration: `${8 + (i % 7)}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-block border-2 border-neon-green pixel-border px-4 py-2 mb-8 slide-in bg-terminal-black">
            <span className="text-neon-green text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              POWERED BY GEMINI AI
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 slide-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-neon-cyan neon-glow">STUDY</span>
            <br />
            <span className="text-neon-pink neon-glow">PLAN</span>
            <br />
            <span className="text-neon-green neon-glow">GENERATOR</span>
          </h1>

          <p
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            Transform your learning journey with{" "}
            <span className="text-neon-cyan font-bold">AI-powered study plans</span>,{" "}
            <span className="text-neon-green font-bold">visual progress tracking</span>, and{" "}
            <span className="text-neon-pink font-bold">interactive roadmaps</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-in" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/app"
              className="group border-4 border-neon-cyan pixel-border px-8 py-4 bg-neon-cyan text-terminal-black font-bold text-lg hover:bg-terminal-black hover:text-neon-cyan transition-all flex items-center gap-2"
            >
              START LEARNING
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 slide-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className={`border-4 border-${stat.color} pixel-border p-8 bg-panel-black hover:bg-terminal-black transition-all transform hover:scale-105 hover:rotate-1 cursor-pointer group`}
              >
                <p className={`text-6xl font-bold text-${stat.color} neon-glow mb-4 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </p>
                <p className="text-gray-300 text-xl font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Interactive Section */}
      <section className="py-24 bg-terminal-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-neon-pink neon-glow">INTERACTIVE</span>{" "}
              <span className="text-neon-cyan neon-glow">3D</span>{" "}
              <span className="text-neon-green neon-glow">EXPERIENCE</span>
            </h2>
            <p className="text-xl text-gray-300">Explore the future of learning visualization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border-2 border-neon-cyan p-6 bg-terminal-black">
              <p className="text-neon-cyan text-xl font-bold mb-2">INTERACTIVE</p>
              <p className="text-gray-300">Rotate and explore 3D geometries</p>
            </div>
            <div className="border-2 border-neon-pink p-6 bg-terminal-black">
              <p className="text-neon-pink text-xl font-bold mb-2">DYNAMIC</p>
              <p className="text-gray-300">Watch objects morph and animate</p>
            </div>
            <div className="border-2 border-neon-green p-6 bg-terminal-black">
              <p className="text-neon-green text-xl font-bold mb-2">FUTURISTIC</p>
              <p className="text-gray-300">Next-gen learning interface</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-panel-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-neon-cyan neon-glow">FEATURES</span>
            </h2>
            <p className="text-xl text-gray-300">Everything you need to master any subject</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`border-4 border-${feature.color} pixel-border p-8 bg-terminal-black hover:bg-panel-black transition-all transform hover:scale-110 hover:-translate-y-2 cursor-pointer slide-in group`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-20 h-20 border-4 border-${feature.color} flex items-center justify-center mb-6 mx-auto transition-all ${hoveredFeature === i ? "animate-bounce rotate-12" : ""} group-hover:shadow-[0_0_20px_currentColor]`}>
                    <Icon className={`text-${feature.color} w-10 h-10`} />
                  </div>
                  <h3 className={`text-${feature.color} text-2xl font-bold mb-4 neon-glow`}>{feature.title}</h3>
                  <p className="text-gray-300 text-base leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-neon-green neon-glow">HOW IT WORKS</span>
            </h2>
            <p className="text-xl text-gray-300">Get started in 3 simple steps</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "ENTER YOUR TOPIC",
                description: "Tell us what you want to learn - any subject, any level",
                color: "neon-cyan"
              },
              {
                step: "02",
                title: "AI GENERATES PLAN",
                description: "AI creates a personalized roadmap with prerequisites, topics, and milestones",
                color: "neon-green"
              },
              {
                step: "03",
                title: "TRACK PROGRESS",
                description: "Interactive map, check off items, watch yourself grow",
                color: "neon-pink"
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`group flex flex-col md:flex-row items-center gap-8 border-4 border-${item.color} pixel-border p-10 bg-panel-black hover:bg-terminal-black transition-all transform hover:scale-105 slide-in cursor-pointer`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`relative text-7xl font-bold text-${item.color} border-4 border-${item.color} w-40 h-40 flex items-center justify-center flex-shrink-0 group-hover:animate-pulse group-hover:shadow-[0_0_30px_currentColor]`}>
                  {item.step}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`text-3xl font-bold text-${item.color} mb-4 neon-glow`}>{item.title}</h3>
                  <p className="text-gray-300 text-xl leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar System - Learning Journey */}
      <section className="py-24 bg-terminal-black relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-pixel-yellow neon-glow">YOUR LEARNING</span>{" "}
              <span className="text-neon-cyan neon-glow">SOLAR SYSTEM</span>
            </h2>
            <p className="text-xl text-gray-300">Navigate your educational universe - from beginner to expert</p>
          </div>

          <div className="border-4 border-pixel-yellow pixel-border bg-panel-black p-4 mb-8">
            <Suspense fallback={<div className="h-[800px] flex items-center justify-center text-pixel-yellow">Loading...</div>}>
              <SolarSystemScene />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border-2 border-neon-cyan p-6 bg-terminal-black">
              <p className="text-neon-cyan text-xl font-bold mb-2">8 PLANETS</p>
              <p className="text-gray-300">8 stages of learning mastery</p>
            </div>
            <div className="border-2 border-pixel-yellow p-6 bg-terminal-black">
              <p className="text-pixel-yellow text-xl font-bold mb-2">ASTEROID BELT</p>
              <p className="text-gray-300">Challenges and practice problems</p>
            </div>
            <div className="border-2 border-neon-green p-6 bg-terminal-black">
              <p className="text-neon-green text-xl font-bold mb-2">INTERACTIVE</p>
              <p className="text-gray-300">Drag, zoom, and explore your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-panel-black relative overflow-hidden z-10">
        {mounted && (
          <div className="absolute inset-0 opacity-5">
            {[80, 120, 95, 110, 75, 130, 88, 105, 92, 115].map((size, i) => (
              <div
                key={i}
                className="absolute border-2 border-neon-cyan animate-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${(i * 11) % 90}%`,
                  top: `${(i * 13) % 80}%`,
                  animationDelay: `${(i * 0.2) % 2}s`,
                }}
              />
            ))}
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="border-4 border-neon-cyan pixel-border p-16 bg-terminal-black transform hover:scale-105 transition-all group">
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 animate-pulse">
              <span className="text-neon-cyan neon-glow">READY TO</span>
              <br />
              <span className="text-neon-pink neon-glow">LEVEL UP?</span>
            </h2>
            <p className="text-2xl text-gray-300 mb-10 leading-relaxed">Start your personalized learning journey today — free and instant</p>
            <Link
              href="/app"
              className="inline-flex items-center gap-4 border-4 border-neon-green pixel-border px-16 py-8 bg-neon-green text-terminal-black font-bold text-2xl hover:bg-terminal-black hover:text-neon-green transition-all transform hover:scale-110 group-hover:animate-bounce glow-button"
            >
              <TrendingUp className="w-8 h-8" />
              GENERATE MY PLAN
              <ArrowRight className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-neon-cyan py-16 bg-terminal-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-neon-green text-2xl font-bold mb-4 neon-glow">STUDY PLAN GENERATOR</p>
            <p className="text-gray-400 text-lg mb-6">Powered by Gemini AI • Built for continuous learners</p>
            <div className="flex justify-center gap-6 mb-6">
              <span className="text-neon-cyan text-2xl font-bold neon-glow">INNOVATE</span>
              <span className="text-neon-green text-2xl font-bold neon-glow">LEARN</span>
              <span className="text-neon-pink text-2xl font-bold neon-glow">GROW</span>
            </div>
            <p className="text-neon-cyan text-base">© 2025 • Built for learners worldwide</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
