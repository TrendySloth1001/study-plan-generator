"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
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
}

export default function ChatBot({ studyPlan, onGeneratePlan }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👾 Welcome to Study Plan AI! I can help you:\n• Generate a study plan (e.g., 'Create a plan for data science')\n• Browse topics with /topics\n• Get recommendations\n\nWhat would you like to learn?",
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

  const topics = [
    "Data Science",
    "Web Development",
    "Machine Learning",
    "Cybersecurity",
    "Mobile App Development",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
  ]

  const parseIntent = (input: string) => {
    const lower = input.toLowerCase()

    // Check for slash commands
    if (lower.startsWith("/topics")) {
      return { type: "topics", data: null }
    }
    if (lower.startsWith("/plan")) {
      return { type: "plan", data: lower.replace("/plan", "").trim() }
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
          response = `📚 Available topics:\n${topics.map((t) => `• ${t}`).join("\n")}\n\nType "Create plan for [topic]" to generate a study plan!`
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
          response = `I can help you create a personalized study plan! Try:\n• "Create plan for [your topic]"\n• "/topics" to see available topics\n• "Recommend a topic" for suggestions`
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
    setShowSuggestions(value.startsWith("/"))
  }

  const slashCommands = [
    { cmd: "/topics", desc: "Browse available topics" },
    { cmd: "/plan", desc: "Generate a study plan" },
  ]

  return (
    <div className="h-full flex flex-col border-4 border-neon-cyan pixel-border bg-panel-black">
      {/* Header */}
      <div className="border-b-4 border-neon-cyan p-4 bg-terminal-black">
        <div className="flex items-center gap-2">
          <Sparkles className="text-neon-cyan w-5 h-5" />
          <h3 className="text-neon-cyan text-lg font-bold neon-glow">STUDY AI CHAT</h3>
        </div>
        <p className="text-neon-green text-xs mt-1 opacity-70">powered by intelligent parsing</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} slide-in`}
          >
            <div
              className={`max-w-[80%] p-3 border-2 ${
                message.role === "user"
                  ? "border-neon-pink bg-terminal-black text-neon-pink"
                  : "border-neon-green bg-terminal-black text-neon-green"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="border-2 border-neon-green bg-terminal-black text-neon-green p-3">
              <p className="text-sm animate-pulse">AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Slash Command Suggestions */}
      {showSuggestions && (
        <div className="border-t-2 border-neon-cyan p-2 bg-terminal-black">
          {slashCommands
            .filter((cmd) => cmd.cmd.startsWith(input))
            .map((cmd) => (
              <div
                key={cmd.cmd}
                onClick={() => {
                  setInput(cmd.cmd + " ")
                  setShowSuggestions(false)
                  inputRef.current?.focus()
                }}
                className="p-2 hover:bg-panel-black cursor-pointer border border-neon-cyan mb-1 transition-all"
              >
                <p className="text-neon-cyan text-sm font-bold">{cmd.cmd}</p>
                <p className="text-neon-green text-xs">{cmd.desc}</p>
              </div>
            ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t-4 border-neon-cyan p-4 bg-terminal-black">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type / for commands or ask anything..."
            className="flex-1 bg-panel-black border-2 border-neon-cyan text-neon-cyan p-2 text-sm focus:outline-none focus:border-neon-pink transition-all"
          />
          <button
            onClick={handleSend}
            className="border-2 border-neon-pink bg-panel-black text-neon-pink p-2 hover:bg-neon-pink hover:text-terminal-black transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
