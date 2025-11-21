"use client"

import { ArrowRight, Zap, Map, Target, TrendingUp, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import { useState, Suspense, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Dynamically import Solar System (client-side only)
const SolarSystemScene = dynamic(() => import("@/components/solar-system"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] md:h-[800px] flex items-center justify-center">
      <div className="text-pixel-yellow animate-pulse">Loading Solar System...</div>
    </div>
  ),
})

// 3D Floating Cubes
function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={2}>
          <mesh position={[Math.cos(i * 1.26) * 4, Math.sin(i * 1.26) * 2, -5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#00e1ff" : i % 3 === 1 ? "#00ff41" : "#ff00e6"} 
              emissive={i % 3 === 0 ? "#00e1ff" : i % 3 === 1 ? "#00ff41" : "#ff00e6"}
              emissiveIntensity={0.3}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// 3D Rotating Ring
function RotatingRing() {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <mesh ref={ringRef} position={[0, 0, -8]}>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial color="#00e1ff" emissive="#00e1ff" emissiveIntensity={0.5} wireframe />
    </mesh>
  )
}

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [buttonMessage, setButtonMessage] = useState("")
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const roastyMessages = [
    "Still procrastinating? 🤨",
    "Your brain cells are waiting... ⏰",
    "Netflix can wait! 📚",
    "Stop reading, START learning! 🚀",
    "Even your cat judges you 🐱",
    "Your future self is disappointed 😤",
    "The 'Later' pile is getting tall 📚",
    "Motivation expires in 3...2...1... ⚡",
    "Your GPA called, it's lonely 📉",
    "Knowledge won't download itself 🧠",
    "Those YouTube tutorials won't watch themselves... wait 🤔",
    "Your goals are gathering dust 🕸️",
    "Stop hovering, START clicking! 👆",
    "This button won't bite... probably 😈",
    "Press me before I change my mind! 💭",
    "Your competition isn't hovering 🏃",
    "Scared of learning? I thought so 😏",
    "Coward mode: ACTIVATED 🐔",
    "Just DO IT already! ✨",
    "You've been staring for 5 seconds 👀"
  ]

  const handleButtonHover = () => {
    setIsButtonHovered(true)
    const randomMessage = roastyMessages[Math.floor(Math.random() * roastyMessages.length)]
    setButtonMessage(randomMessage)
  }

  const handleButtonLeave = () => {
    setIsButtonHovered(false)
    setTimeout(() => setButtonMessage(""), 300)
  }

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
    <main className="min-h-screen bg-gradient-to-br from-terminal-black via-gray-900 to-black relative overflow-hidden">
      {/* Top App Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b-2 border-neon-cyan/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
                STUDY PLAN AI
              </span>
            </div>

            {/* Nav Items */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-neon-cyan transition-colors font-semibold">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-neon-green transition-colors font-semibold">
                How It Works
              </a>
              <a href="#demo" className="text-gray-300 hover:text-neon-pink transition-colors font-semibold">
                Demo
              </a>
            </div>

            {/* CTA Button in Nav */}
            <Link
              href="/app"
              className="border-2 border-neon-cyan px-6 py-2 bg-neon-cyan/10 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Subtle 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.3} color="#00e1ff" />
            <Stars radius={100} depth={50} count={500} factor={2} saturation={0} fade speed={0.3} />
            <FloatingCubes />
          </Suspense>
        </Canvas>
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 225, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 225, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center z-10">
        {/* Floating particles - fixed positions to prevent hydration errors */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[10, 25, 40, 55, 70, 85, 15, 35, 60, 80, 5, 95, 30, 50, 75, 20, 45, 65, 90, 12].map((left, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-neon-cyan animate-float"
                style={{
                  left: `${left}%`,
                  top: `${(i * 5.26) % 100}%`,
                  animationDelay: `${(i * 0.25) % 5}s`,
                  animationDuration: `${8 + (i % 7)}s`,
                  boxShadow: '0 0 10px rgba(0, 225, 255, 0.8)'
                }}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Enhanced Badge with Glow */}
          <div className="inline-block relative mb-12 slide-in">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-green/20 blur-xl animate-pulse"></div>
            <div className="relative border-2 border-neon-green bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg">
              <span className="text-neon-green text-sm font-bold flex items-center gap-2 tracking-wider">
                <Zap className="w-5 h-5 animate-pulse" />
                POWERED BY GEMINI AI
                <Sparkles className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </span>
            </div>
          </div>

          {/* Enhanced Main Heading with Gradient - Smaller Size */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 slide-in tracking-tight" style={{ animationDelay: "0.1s" }}>
            <span className="block bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-cyan bg-clip-text text-transparent neon-glow drop-shadow-2xl">
              STUDY
            </span>
            <span className="block bg-gradient-to-r from-neon-pink via-purple-400 to-neon-pink bg-clip-text text-transparent neon-glow drop-shadow-2xl mt-2">
              PLAN
            </span>
            <span className="block bg-gradient-to-r from-neon-green via-emerald-400 to-neon-green bg-clip-text text-transparent neon-glow drop-shadow-2xl mt-2">
              GENERATOR
            </span>
          </h1>

          {/* Enhanced Description */}
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto slide-in leading-relaxed font-light"
            style={{ animationDelay: "0.2s" }}
          >
            Transform your learning journey with{" "}
            <span className="text-neon-cyan font-bold animate-pulse">AI-powered study plans</span>,{" "}
            <span className="text-neon-green font-bold animate-pulse" style={{ animationDelay: '0.3s' }}>visual progress tracking</span>, and{" "}
            <span className="text-neon-pink font-bold animate-pulse" style={{ animationDelay: '0.6s' }}>interactive roadmaps</span>
          </p>

          {/* Interactive CTA Button with Roasty Messages */}
          <div className="flex flex-col gap-6 justify-center items-center slide-in mb-20" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Roasty Message Popup */}
              {isButtonHovered && buttonMessage && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
                  <div className="relative bg-gradient-to-r from-neon-pink via-purple-500 to-neon-cyan px-6 py-3 rounded-xl border-2 border-white shadow-2xl shadow-neon-pink/50">
                    <p className="text-white font-black text-lg">{buttonMessage}</p>
                    {/* Speech bubble arrow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neon-pink rotate-45 border-r-2 border-b-2 border-white"></div>
                  </div>
                </div>
              )}

              <Link
                href="/app"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                className="group relative border-4 border-neon-cyan px-12 py-6 bg-gradient-to-r from-neon-cyan to-blue-500 text-terminal-black font-black text-2xl hover:shadow-2xl hover:shadow-neon-cyan/50 transition-all flex items-center gap-3 rounded-2xl overflow-hidden transform hover:scale-105"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>

                <span className="relative z-10">START LEARNING</span>
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Encouragement text */}
            <p className="text-gray-400 text-sm animate-pulse">
              {isButtonHovered ? "Yeah, that's what I thought 😎" : "Hover for motivation... or roasting 🔥"}
            </p>
          </div>

          {/* Enhanced Stats with Consistent Design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 slide-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat, i) => {
              const colors = {
                'neon-cyan': { from: '#00e1ff', to: '#00b8d4', shadow: 'rgba(0, 225, 255, 0.3)' },
                'neon-green': { from: '#00ff41', to: '#00cc33', shadow: 'rgba(0, 255, 65, 0.3)' },
                'neon-pink': { from: '#ff00e6', to: '#cc00b8', shadow: 'rgba(255, 0, 230, 0.3)' }
              }
              const color = colors[stat.color as keyof typeof colors]
              
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i + 20)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative slide-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  ></div>
                  
                  {/* Main card */}
                  <div className="relative bg-black border-2 rounded-3xl p-10 transition-all duration-300 group-hover:border-opacity-100 text-center"
                       style={{ borderColor: hoveredFeature === i + 20 ? color.from : 'rgba(255, 255, 255, 0.1)' }}>
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-20 overflow-hidden rounded-tr-3xl">
                      <div className="absolute inset-0" style={{
                        background: `linear-gradient(135deg, ${color.from}, transparent)`,
                      }}></div>
                    </div>

                    <div className="relative">
                      {/* Value */}
                      <p 
                        className="text-8xl font-black mb-6 transition-all duration-300 group-hover:scale-110"
                        style={{
                          color: hoveredFeature === i + 20 ? color.from : '#ffffff',
                          textShadow: hoveredFeature === i + 20 ? `0 0 30px ${color.shadow}` : 'none'
                        }}
                      >
                        {stat.value}
                      </p>
                      
                      {/* Label */}
                      <p className="text-gray-400 text-xl font-semibold tracking-wide group-hover:text-gray-300 transition-colors">
                        {stat.label}
                      </p>
                      
                      {/* Hover indicator */}
                      <div className="mt-6 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.from }}></div>
                        <div className="h-px w-20 bg-gradient-to-r from-current to-transparent" style={{ color: color.from }}></div>
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity"
                         style={{ borderColor: color.from, color: color.from }}>
                      {i + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Visual Demos */}
      <section id="demo" className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-cyan bg-clip-text text-transparent drop-shadow-2xl">SEE IT IN ACTION</span>
            </h2>
            <p className="text-2xl text-gray-400 font-light max-w-3xl mx-auto">Experience the power of AI-generated study plans with interactive visualizations and smart assistance</p>
          </div>

          {/* Visual Learning Map Preview */}
          <div className="mb-20">
            <div className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-neon-cyan/30 rounded-3xl overflow-hidden shadow-2xl hover:border-neon-cyan/60 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-xl flex items-center justify-center">
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-neon-cyan">Interactive Learning Map</h3>
                    <p className="text-gray-400">Visualize your entire learning journey as an RPG-style skill tree</p>
                  </div>
                </div>

                {/* Map Preview Mockup - Retro Terminal Style */}
                <div className="relative bg-black border-2 border-neon-cyan/30 p-8 overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Learning Path - Terminal Style */}
                    <div className="space-y-6">
                      
                      {/* Prerequisites Section */}
                      <div>
                        <h3 className="text-xl font-bold text-neon-cyan mb-3 border-2 border-neon-cyan inline-block px-4 py-2 bg-black">
                          PREREQUISITES
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className="border-2 border-neon-cyan p-4 bg-black hover:bg-gray-950 transition-colors cursor-pointer">
                            <p className="text-lg text-neon-cyan font-bold mb-1">Basic Computer Skills</p>
                            <p className="text-sm text-gray-400">File management and browser usage</p>
                            <p className="text-sm text-neon-cyan mt-2">Duration: 1 week</p>
                          </div>
                          <div className="border-2 border-neon-cyan p-4 bg-black hover:bg-gray-950 transition-colors cursor-pointer">
                            <p className="text-lg text-neon-cyan font-bold mb-1">Text Editor Setup</p>
                            <p className="text-sm text-gray-400">Install VS Code and extensions</p>
                            <p className="text-sm text-neon-cyan mt-2">Duration: 1 day</p>
                          </div>
                        </div>
                      </div>

                      {/* Core Topics Section */}
                      <div>
                        <h3 className="text-xl font-bold text-neon-green mb-3 border-2 border-neon-green inline-block px-4 py-2 bg-black">
                          CORE TOPICS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className="border-2 border-neon-green p-4 bg-black hover:bg-gray-950 transition-colors cursor-pointer">
                            <p className="text-lg text-neon-green font-bold mb-1">HTML5 & Semantic Tags</p>
                            <p className="text-sm text-gray-400">Structure and accessibility best practices</p>
                            <p className="text-sm text-neon-green mt-2">Duration: 2 weeks</p>
                          </div>
                          <div className="border-2 border-neon-green p-4 bg-black hover:bg-gray-950 transition-colors cursor-pointer">
                            <p className="text-lg text-neon-green font-bold mb-1">CSS Grid & Flexbox</p>
                            <p className="text-sm text-gray-400">Modern layout techniques</p>
                            <p className="text-sm text-neon-green mt-2">Duration: 3 weeks</p>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Milestones Section */}
                      <div>
                        <h3 className="text-xl font-bold text-neon-pink mb-3 border-2 border-neon-pink inline-block px-4 py-2 bg-black">
                          WEEKLY MILESTONES
                        </h3>
                        <div className="space-y-3 mt-3">
                          <div className="border-2 border-neon-pink p-4 bg-black">
                            <p className="text-xl text-neon-pink font-bold mb-2">Week 1</p>
                            <div className="mb-2">
                              <p className="text-sm text-neon-green mb-1">Topics:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="text-sm text-gray-400">Introduction to HTML</li>
                                <li className="text-sm text-gray-400">Basic tags and structure</li>
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm text-neon-green mb-1">Milestones:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="text-sm text-gray-400">Build your first webpage</li>
                                <li className="text-sm text-gray-400">Create a personal portfolio</li>
                              </ul>
                            </div>
                          </div>
                          <div className="border-2 border-neon-pink p-4 bg-black">
                            <p className="text-xl text-neon-pink font-bold mb-2">Week 2</p>
                            <div className="mb-2">
                              <p className="text-sm text-neon-green mb-1">Topics:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="text-sm text-gray-400">CSS fundamentals</li>
                                <li className="text-sm text-gray-400">Styling and colors</li>
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm text-neon-green mb-1">Milestones:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="text-sm text-gray-400">Style your portfolio</li>
                                <li className="text-sm text-gray-400">Responsive design basics</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resources Section */}
                      <div>
                        <h3 className="text-xl font-bold text-neon-green mb-3 border-2 border-neon-yellow inline-block px-4 py-2 bg-black">
                          RESOURCES
                        </h3>
                        <div className="space-y-2 mt-3">
                          <div className="border-2 border-neon-yellow p-4 bg-black flex justify-between items-center hover:bg-gray-950 transition-colors cursor-pointer">
                            <div>
                              <p className="text-lg text-sm text-neon-green font-bold">MDN Web Docs</p>
                              <p className="text-sm text-gray-400 uppercase tracking-wide">[DOCUMENTATION]</p>
                            </div>
                            <span className="text-neon-cyan text-lg font-bold">→</span>
                          </div>
                          <div className="border-2 border-neon-yellow p-4 bg-black flex justify-between items-center hover:bg-gray-950 transition-colors cursor-pointer">
                            <div>
                              <p className="text-lg text-sm text-neon-green font-bold">FreeCodeCamp</p>
                              <p className="text-sm text-gray-400 uppercase tracking-wide">[COURSE]</p>
                            </div>
                            <span className="text-neon-cyan text-lg font-bold">→</span>
                          </div>
                        </div>
                      </div>

                      {/* Tips Section */}
                      <div>
                        <h3 className="text-xl font-bold text-neon-cyan mb-3 border-2 border-neon-cyan inline-block px-4 py-2 bg-black">
                          TIPS FOR SUCCESS
                        </h3>
                        <div className="space-y-2 mt-3">
                          <div className="border-l-4 border-neon-cyan pl-4 py-2 bg-black">
                            <p className="text-sm text-gray-400">Practice coding every day, even if just for 30 minutes</p>
                          </div>
                          <div className="border-l-4 border-neon-cyan pl-4 py-2 bg-black">
                            <p className="text-sm text-gray-400">Build projects to reinforce your learning</p>
                          </div>
                          <div className="border-l-4 border-neon-cyan pl-4 py-2 bg-black">
                            <p className="text-sm text-gray-400">Join online communities for support and networking</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Assistant Preview */}
          <div>
            <div className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-2 border-neon-green/30 rounded-3xl overflow-hidden shadow-2xl hover:border-neon-green/60 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-emerald-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-neon-green">AI Study Assistant</h3>
                    <p className="text-gray-400">Get instant help with slash commands and smart suggestions</p>
                  </div>
                </div>

                {/* Chat Preview Mockup */}
                <div className="relative bg-gradient-to-br from-black to-gray-900 border-2 border-neon-green/20 rounded-2xl p-6 min-h-[400px] overflow-hidden">
                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-neon-cyan/20 border border-neon-cyan/40 rounded-2xl rounded-tr-none px-6 py-4 max-w-md backdrop-blur-xl">
                        <p className="text-white font-medium">/topics</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-neon-green/20 border border-neon-green/40 rounded-2xl rounded-tl-none px-6 py-4 max-w-lg backdrop-blur-xl">
                        <p className="text-white font-medium mb-3">Here are your study topics:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                            <span className="text-gray-300">Introduction to React</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                            <span className="text-gray-300">Component Lifecycle</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
                            <span className="text-gray-300">State Management</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-neon-cyan/20 border border-neon-cyan/40 rounded-2xl rounded-tr-none px-6 py-4 max-w-md backdrop-blur-xl">
                        <p className="text-white font-medium">How should I start learning React?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-neon-green/20 border border-neon-green/40 rounded-2xl rounded-tl-none px-6 py-4 max-w-lg backdrop-blur-xl">
                        <p className="text-white font-medium">I recommend starting with the basics! Begin with "Introduction to React" which covers JSX, components, and props. This will give you a solid foundation. Would you like me to generate a detailed study plan?</p>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-gray-900/80 border-2 border-neon-green/30 rounded-xl px-6 py-4 backdrop-blur-xl">
                      <p className="text-gray-500 font-medium">Try commands: /topics, /help, /progress, /resources...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative z-10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-neon-green/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Title with decorative elements */}
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
            
            <div className="inline-block relative">
              {/* Floating icons around title */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-neon-cyan/30 rounded-lg rotate-12 animate-float"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-neon-pink/30 rounded-lg -rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tight relative">
                <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent drop-shadow-2xl">
                  FEATURES
                </span>
              </h2>
            </div>
            
            <div className="relative inline-block mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-green/20 blur-xl"></div>
              <p className="text-2xl text-gray-300 font-light relative px-8 py-2 border-l-4 border-r-4 border-neon-cyan/50">
                Everything you need to <span className="text-neon-green font-bold">master any subject</span>
              </p>
            </div>
          </div>

          {/* Features Grid with Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const colors = {
                'neon-cyan': { from: '#00e1ff', to: '#00b8d4', shadow: 'rgba(0, 225, 255, 0.3)', border: 'neon-cyan' },
                'neon-green': { from: '#00ff41', to: '#00cc33', shadow: 'rgba(0, 255, 65, 0.3)', border: 'neon-green' },
                'neon-pink': { from: '#ff00e6', to: '#cc00b8', shadow: 'rgba(255, 0, 230, 0.3)', border: 'neon-pink' },
                'pixel-yellow': { from: '#ffea00', to: '#ccbb00', shadow: 'rgba(255, 234, 0, 0.3)', border: 'pixel-yellow' }
              }
              const color = colors[feature.color as keyof typeof colors]
              
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative slide-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  ></div>
                  
                  {/* Main card */}
                  <div className="relative bg-black border-2 rounded-3xl p-10 transition-all duration-300 group-hover:border-opacity-100"
                       style={{ borderColor: hoveredFeature === i ? color.from : 'rgba(255, 255, 255, 0.1)' }}>
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-20 overflow-hidden rounded-tr-3xl">
                      <div className="absolute inset-0" style={{
                        background: `linear-gradient(135deg, ${color.from}, transparent)`,
                      }}></div>
                    </div>

                    <div className="relative flex items-start gap-6">
                      {/* Icon Container */}
                      <div className="flex-shrink-0">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                          style={{
                            background: hoveredFeature === i ? `linear-gradient(135deg, ${color.from}, ${color.to})` : 'rgba(255, 255, 255, 0.05)',
                            boxShadow: hoveredFeature === i ? `0 10px 40px ${color.shadow}` : 'none'
                          }}
                        >
                          <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 
                          className="text-3xl font-black mb-3 tracking-wide transition-all duration-300"
                          style={{
                            color: hoveredFeature === i ? color.from : '#ffffff',
                            textShadow: hoveredFeature === i ? `0 0 20px ${color.shadow}` : 'none'
                          }}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                          {feature.description}
                        </p>
                        
                        {/* Hover indicator */}
                        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.from }}></div>
                          <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent" style={{ color: color.from }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-2xl opacity-20 group-hover:opacity-100 transition-opacity"
                         style={{ borderColor: color.from, color: color.from }}>
                      {i + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative z-10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-neon-green/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Title with decorative elements */}
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-30"></div>
            
            <div className="inline-block relative">
              {/* Floating icons around title */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-neon-green/30 rounded-lg rotate-12 animate-float"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-neon-cyan/30 rounded-lg -rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tight relative">
                <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink bg-clip-text text-transparent drop-shadow-2xl">
                  HOW IT WORKS
                </span>
              </h2>
            </div>
            
            <div className="relative inline-block mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 blur-xl"></div>
              <p className="text-2xl text-gray-300 font-light relative px-8 py-2 border-l-4 border-r-4 border-neon-green/50">
                Get started in <span className="text-neon-cyan font-bold">3 simple steps</span>
              </p>
            </div>
          </div>

          {/* Steps Grid with Enhanced Design */}
          <div className="grid grid-cols-1 gap-8">
            {[
              {
                step: "01",
                title: "ENTER YOUR TOPIC",
                description: "Tell us what you want to learn - any subject, any level. Our AI understands context and creates a comprehensive curriculum tailored to your needs.",
                color: { from: '#00e1ff', to: '#00b8d4', shadow: 'rgba(0, 225, 255, 0.3)' }
              },
              {
                step: "02",
                title: "AI GENERATES PLAN",
                description: "Gemini AI analyzes your topic and creates a personalized roadmap with prerequisites, core concepts, advanced topics, practice exercises, and weekly milestones.",
                color: { from: '#00ff41', to: '#00cc33', shadow: 'rgba(0, 255, 65, 0.3)' }
              },
              {
                step: "03",
                title: "TRACK PROGRESS",
                description: "Visualize your journey on an interactive 3D map, mark topics complete, chat with AI for help, and watch your knowledge tree grow as you learn.",
                color: { from: '#ff00e6', to: '#cc00b8', shadow: 'rgba(255, 0, 230, 0.3)' }
              },
            ].map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i + 10)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative slide-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: `linear-gradient(135deg, ${item.color.from}, ${item.color.to})` }}
                ></div>
                
                {/* Main card */}
                <div className="relative bg-black border-2 rounded-3xl p-10 transition-all duration-300 group-hover:border-opacity-100"
                     style={{ borderColor: hoveredFeature === i + 10 ? item.color.from : 'rgba(255, 255, 255, 0.1)' }}>
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-24 h-24 opacity-20 overflow-hidden rounded-tl-3xl">
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(135deg, ${item.color.from}, transparent)`,
                    }}></div>
                  </div>

                  <div className="relative flex flex-col md:flex-row items-start gap-8">
                    {/* Step Number Container */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: hoveredFeature === i + 10 ? `linear-gradient(135deg, ${item.color.from}, ${item.color.to})` : 'rgba(255, 255, 255, 0.05)',
                          boxShadow: hoveredFeature === i + 10 ? `0 10px 40px ${item.color.shadow}` : 'none'
                        }}
                      >
                        <span className="text-6xl font-black text-white drop-shadow-lg">{item.step}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 
                        className="text-4xl font-black mb-4 tracking-wide transition-all duration-300"
                        style={{
                          color: hoveredFeature === i + 10 ? item.color.from : '#ffffff',
                          textShadow: hoveredFeature === i + 10 ? `0 0 20px ${item.color.shadow}` : 'none'
                        }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xl leading-relaxed group-hover:text-gray-300 transition-colors">
                        {item.description}
                      </p>
                      
                      {/* Hover indicator */}
                      <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.from }}></div>
                        <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent" style={{ color: item.color.from }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-bold" style={{ color: item.color.from }}>STEP {item.step}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar System - Learning Journey */}
      <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative z-10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pixel-yellow/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Title with decorative elements */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-pixel-yellow to-transparent opacity-30"></div>
            
            <div className="inline-block relative">
              {/* Floating icons around title */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-pixel-yellow/30 rounded-lg rotate-12 animate-float"></div>
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-neon-cyan/30 rounded-lg -rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tight relative">
                <span className="bg-gradient-to-r from-pixel-yellow via-neon-cyan to-neon-pink bg-clip-text text-transparent drop-shadow-2xl">
                  YOUR LEARNING SOLAR SYSTEM
                </span>
              </h2>
            </div>
            
            <div className="relative inline-block mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-pixel-yellow/20 to-neon-cyan/20 blur-xl"></div>
              <p className="text-2xl text-gray-300 font-light relative px-8 py-2 border-l-4 border-r-4 border-pixel-yellow/50">
                Navigate your educational universe - from <span className="text-neon-cyan font-bold">beginner to expert</span>
              </p>
            </div>
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

      {/* Enhanced Footer */}
      <footer className="relative py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h3 className="text-4xl font-black mb-4 tracking-wide bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              STUDY PLAN GENERATOR
            </h3>
            <p className="text-gray-400 text-lg mb-8">Powered by Gemini AI • Built for continuous learners</p>
            <div className="flex justify-center gap-8 mb-8 flex-wrap">
              <span className="px-6 py-2 bg-gradient-to-r from-neon-cyan/10 to-blue-500/10 border border-neon-cyan/30 rounded-full text-neon-cyan font-bold text-lg backdrop-blur-xl">INNOVATE</span>
              <span className="px-6 py-2 bg-gradient-to-r from-neon-green/10 to-emerald-500/10 border border-neon-green/30 rounded-full text-neon-green font-bold text-lg backdrop-blur-xl">LEARN</span>
              <span className="px-6 py-2 bg-gradient-to-r from-neon-pink/10 to-purple-500/10 border border-neon-pink/30 rounded-full text-neon-pink font-bold text-lg backdrop-blur-xl">GROW</span>
            </div>
            <p className="text-gray-500 text-base">© 2025 • Built for learners worldwide</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
