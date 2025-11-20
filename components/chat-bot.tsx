"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Maximize2, Minimize2 } from "lucide-react"
import type { StudyPlan } from "@/lib/types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatBotProps {
  studyPlan: StudyPlan | null
  onGeneratePlan: (topic: string, options?: any) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function ChatBot({ studyPlan, onGeneratePlan, isFullscreen = false, onToggleFullscreen }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👾 Welcome to Study Plan AI! I can help you:\n• Generate a study plan (e.g., 'Create a plan for data science')\n• Browse topics with /topics or @topics\n• Reference plan items with @prerequisites, @core, @resources\n• Get recommendations\n\nWhat would you like to learn?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Extract topics from current study plan
  const getAvailableTopics = () => {
    if (!studyPlan) {
      return [
        "Data Science",
        "Web Development",
        "Machine Learning",
        "Cybersecurity",
        "Mobile App Development",
        "Cloud Computing",
        "DevOps",
        "UI/UX Design",
      ]
    }

    const topics: string[] = []
    
    // Add prerequisites
    studyPlan.prerequisites.forEach(p => topics.push(p.title))
    
    // Add core topics
    studyPlan.coreTopics.forEach(t => topics.push(t.title))
    
    // Add weekly topics
    studyPlan.progressSteps.forEach(step => {
      step.topics.forEach(t => topics.push(t))
    })

    return [...new Set(topics)] // Remove duplicates
  }

  const topics = getAvailableTopics()

  const parseIntent = (input: string) => {
    const lower = input.toLowerCase()

    // Check for @ or / commands for plan references
    if (lower.startsWith("/topics") || lower.startsWith("@topics")) {
      return { type: "topics", data: null }
    }
    if (lower.startsWith("/prerequisites") || lower.startsWith("@prerequisites")) {
      return { type: "prerequisites", data: null }
    }
    if (lower.startsWith("/core") || lower.startsWith("@core")) {
      return { type: "core", data: null }
    }
    if (lower.startsWith("/resources") || lower.startsWith("@resources")) {
      return { type: "resources", data: null }
    }
    if (lower.startsWith("/milestones") || lower.startsWith("@milestones")) {
      return { type: "milestones", data: null }
    }
    if (lower.startsWith("/plan") || lower.startsWith("@plan")) {
      return { type: "plan", data: lower.replace(/[@/]plan/, "").trim() }
    }

    // Check for plan generation keywords
    if (
      lower.includes("create plan") ||
      lower.includes("generate plan") ||
      lower.includes("study plan for") ||
      lower.includes("learn")
    ) {
      // Extract topic
      const topic =
        input
          .replace(/create (a )?plan for/i, "")
          .replace(/generate (a )?plan for/i, "")
          .replace(/study plan for/i, "")
          .replace(/i want to learn/i, "")
          .replace(/learn/i, "")
          .trim() || input

      return { type: "generate", data: topic }
    }

    // Check for recommendations
    if (lower.includes("recommend") || lower.includes("suggest")) {
      return { type: "recommend", data: null }
    }

    return { type: "general", data: input }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setShowSuggestions(false)

    // Parse intent
    const intent = parseIntent(input)

    setTimeout(() => {
      let response = ""

      switch (intent.type) {
        case "topics":
          response = studyPlan 
            ? `📚 Topics in your current plan:\n${topics.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n${topics.length > 15 ? `...and ${topics.length - 15} more topics!` : ""}`
            : `📚 Popular topics:\n${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nType "Create plan for [topic]" to generate a study plan!`
          break

        case "prerequisites":
          response = studyPlan
            ? `🔒 Prerequisites:\n${studyPlan.prerequisites.map((p, i) => `${i + 1}. ${p.title}${p.description ? `\n   ${p.description}` : ""}`).join("\n\n")}`
            : "⚠️ No study plan loaded yet. Generate a plan first!"
          break

        case "core":
          response = studyPlan
            ? `📖 Core Topics:\n${studyPlan.coreTopics.map((t, i) => `${i + 1}. ${t.title}${t.description ? `\n   ${t.description}` : ""}`).join("\n\n")}`
            : "⚠️ No study plan loaded yet. Generate a plan first!"
          break

        case "resources":
          response = studyPlan
            ? `📚 Recommended Resources:\n${studyPlan.resources.map((r, i) => `${i + 1}. ${r.title} [${r.type.toUpperCase()}]${r.url ? `\n   🔗 ${r.url}` : ""}`).join("\n\n")}`
            : "⚠️ No study plan loaded yet. Generate a plan first!"
          break

        case "milestones":
          response = studyPlan
            ? `🎯 Weekly Milestones:\n${studyPlan.progressSteps.slice(0, 3).map((s) => `Week ${s.week}:\n${s.milestones.map((m) => `  • ${m}`).join("\n")}`).join("\n\n")}\n\n${studyPlan.progressSteps.length > 3 ? `...and ${studyPlan.progressSteps.length - 3} more weeks!` : ""}`
            : "⚠️ No study plan loaded yet. Generate a plan first!"
          break

        case "generate":
        case "plan":
          if (intent.data) {
            onGeneratePlan(intent.data)
            response = `🚀 Generating study plan for "${intent.data}"...\n\nI'll create a comprehensive learning path with:\n✓ Prerequisites\n✓ Core topics\n✓ Week-by-week breakdown\n✓ Resources\n✓ Progress tracking`
          } else {
            response = "Please specify a topic! Example: 'Create plan for Python programming'"
          }
          break

        case "recommend":
          response = `💡 Based on current trends, I recommend:\n\n1. **AI/Machine Learning** - High demand\n2. **Cloud Computing** - Essential skill\n3. **Cybersecurity** - Growing field\n4. **Full Stack Development** - Versatile\n\nWhich interests you?`
          break

        default:
          response = studyPlan
            ? `I can help you explore your study plan! Try:\n• "@topics" or "/topics" - View all topics\n• "@prerequisites" - See what you need first\n• "@core" - View core topics\n• "@resources" - Get learning resources\n• "@milestones" - See weekly goals\n• "Create plan for [topic]" - Generate new plan`
            : `I can help you create a personalized study plan! Try:\n• "Create plan for [your topic]"\n• "/topics" to see available topics\n• "Recommend a topic" for suggestions`
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setShowSuggestions(value.startsWith("/") || value.startsWith("@"))
  }

  const slashCommands = [
    { cmd: "/topics", desc: "Browse available topics" },
    { cmd: "@topics", desc: "Browse available topics" },
    { cmd: "/prerequisites", desc: "View prerequisites" },
    { cmd: "@prerequisites", desc: "View prerequisites" },
    { cmd: "/core", desc: "View core topics" },
    { cmd: "@core", desc: "View core topics" },
    { cmd: "/resources", desc: "View resources" },
    { cmd: "@resources", desc: "View resources" },
    { cmd: "/milestones", desc: "View milestones" },
    { cmd: "@milestones", desc: "View milestones" },
    { cmd: "/plan", desc: "Generate a study plan" },
  ]

  return (
    <div className="h-full flex flex-col border-4 border-neon-cyan pixel-border bg-panel-black">
      {/* Header */}
      <div className="border-b-4 border-neon-cyan p-4 bg-terminal-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-neon-cyan w-6 h-6" />
            <h3 className="text-neon-cyan text-xl font-bold neon-glow">STUDY AI CHAT</h3>
          </div>
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="border-2 border-neon-pink p-2 text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}
        </div>
        <p className="text-neon-green text-sm mt-1 opacity-70">Use @ or / for commands</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} slide-in`}
          >
            <div
              className={`max-w-[85%] p-4 border-2 ${
                message.role === "user"
                  ? "border-neon-pink bg-terminal-black text-neon-pink"
                  : "border-neon-green bg-terminal-black text-neon-green"
              }`}
            >
              <p className="text-base whitespace-pre-line leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="border-2 border-neon-green bg-terminal-black text-neon-green p-4">
              <p className="text-base animate-pulse">AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Slash Command Suggestions */}
      {showSuggestions && (
        <div className="border-t-2 border-neon-cyan p-2 bg-terminal-black max-h-64 overflow-y-auto custom-scrollbar">
          {slashCommands
            .filter((cmd) => cmd.cmd.toLowerCase().startsWith(input.toLowerCase()))
            .map((cmd) => (
              <div
                key={cmd.cmd}
                onClick={() => {
                  setInput(cmd.cmd + " ")
                  setShowSuggestions(false)
                  inputRef.current?.focus()
                }}
                className="p-3 hover:bg-panel-black cursor-pointer border border-neon-cyan mb-2 transition-all"
              >
                <p className="text-neon-cyan text-base font-bold">{cmd.cmd}</p>
                <p className="text-neon-green text-sm">{cmd.desc}</p>
              </div>
            ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t-4 border-neon-cyan p-4 bg-terminal-black">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type @ or / for commands..."
            className="flex-1 bg-panel-black border-2 border-neon-cyan text-neon-cyan p-3 text-base focus:outline-none focus:border-neon-pink transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="border-2 border-neon-pink bg-panel-black text-neon-pink p-3 hover:bg-neon-pink hover:text-terminal-black transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
