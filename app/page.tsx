"use client"

import { ArrowRight, Zap, Map, Target, TrendingUp, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

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

  const stats = [
    { value: "1000+", label: "Study Plans Generated", color: "neon-cyan" },
    { value: "50+", label: "Topics Covered", color: "neon-green" },
    { value: "95%", label: "Success Rate", color: "neon-pink" },
  ]

  return (
    <main className="min-h-screen grid-bg bg-terminal-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 border-4 border-neon-cyan animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-neon-pink animate-pulse"></div>
        </div>

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
              <div key={i} className={`border-4 border-${stat.color} pixel-border p-6 bg-panel-black hover:bg-terminal-black transition-all`}>
                <p className={`text-4xl font-bold text-${stat.color} neon-glow mb-2`}>{stat.value}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-panel-black">
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
                  className={`border-4 border-${feature.color} pixel-border p-6 bg-terminal-black hover:bg-panel-black transition-all transform hover:scale-105 cursor-pointer slide-in`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-16 h-16 border-4 border-${feature.color} flex items-center justify-center mb-4 ${hoveredFeature === i ? "animate-bounce" : ""}`}>
                    <Icon className={`text-${feature.color} w-8 h-8`} />
                  </div>
                  <h3 className={`text-${feature.color} text-xl font-bold mb-3`}>{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
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
                description: "Tell us what you want to learn - from data science to web development",
                color: "neon-cyan",
              },
              {
                step: "02",
                title: "AI GENERATES PLAN",
                description: "Our AI creates a personalized roadmap with prerequisites, topics, and resources",
                color: "neon-green",
              },
              {
                step: "03",
                title: "TRACK PROGRESS",
                description: "Follow your visual map, check off completed items, and watch yourself grow",
                color: "neon-pink",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-6 border-4 border-${item.color} pixel-border p-8 bg-panel-black slide-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`text-6xl font-bold text-${item.color} border-4 border-${item.color} w-32 h-32 flex items-center justify-center flex-shrink-0`}>
                  {item.step}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`text-2xl font-bold text-${item.color} mb-3`}>{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-panel-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border-4 border-neon-cyan pixel-border p-12 bg-terminal-black">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-neon-cyan neon-glow">READY TO</span>
              <br />
              <span className="text-neon-pink neon-glow">LEVEL UP?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">Start your personalized learning journey today</p>
            <Link
              href="/app"
              className="inline-flex items-center gap-3 border-4 border-neon-green pixel-border px-12 py-6 bg-neon-green text-terminal-black font-bold text-xl hover:bg-terminal-black hover:text-neon-green transition-all"
            >
              <TrendingUp className="w-6 h-6" />
              GENERATE MY PLAN
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-neon-cyan py-12 bg-terminal-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-neon-green text-lg font-bold mb-2">STUDY PLAN GENERATOR</p>
            <p className="text-gray-400 text-sm">Powered by Gemini AI • Built for learners</p>
            <p className="text-neon-cyan text-xs mt-4">© 2025 • Made with 💚 for continuous learners</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
