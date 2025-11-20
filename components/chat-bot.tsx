"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Maximize2, Minimize2, Lightbulb, Loader2 } from "lucide-react"
import type { StudyPlan } from "@/lib/types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface UserContext {
  name?: string
  learningGoals: string[]
  preferences: {
    difficulty?: string
    timePerWeek?: number
    format?: string
    timeUnit?: "hours" | "days" | "weeks" | "months"
  }
  conversationHistory: string[]
}

interface ChatBotProps {
  studyPlan: StudyPlan | null
  onGeneratePlan: (topic: string, options?: any) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function ChatBot({ studyPlan, onGeneratePlan, isFullscreen = false, onToggleFullscreen }: ChatBotProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to Study Plan AI! I'm your personalized learning assistant powered by Gemini AI.\n\nI can help you:\n• Generate customized study plans\n• Answer ANY question about any topic\n• Browse and explore your current plan\n• Provide learning strategies and study tips\n• Explain complex concepts\n• Suggest resources and approaches\n\nTry asking me anything: from study strategies to explaining quantum physics!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [userContext, setUserContext] = useState<UserContext>({
    learningGoals: [],
    preferences: {},
    conversationHistory: [],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  // Load user context from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatbot-context")
    if (saved) {
      try {
        setUserContext(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load context")
      }
    }
  }, [])

  // Save user context to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot-context", JSON.stringify(userContext))
  }, [userContext])

  // Update context from conversation
  const updateContext = (userMessage: string, assistantResponse: string) => {
    setUserContext((prev) => {
      const newHistory = [...prev.conversationHistory, userMessage, assistantResponse].slice(-20) // Keep last 20 messages
      
      // Extract preferences from conversation
      const newPrefs = { ...prev.preferences }
      
      // Detect time preferences
      if (userMessage.match(/(\d+)\s*(hour|hr|h)/i)) {
        const hours = parseInt(userMessage.match(/(\d+)\s*(hour|hr|h)/i)![1])
        newPrefs.timePerWeek = hours
        newPrefs.timeUnit = "hours"
      }
      if (userMessage.match(/(\d+)\s*(day|d)/i)) {
        newPrefs.timeUnit = "days"
      }
      if (userMessage.match(/(\d+)\s*(week|wk|w)/i)) {
        newPrefs.timeUnit = "weeks"
      }
      if (userMessage.match(/(\d+)\s*(month|mo|m)/i)) {
        newPrefs.timeUnit = "months"
      }
      
      // Detect difficulty preferences
      if (userMessage.match(/beginner|easy|basic|novice/i)) {
        newPrefs.difficulty = "beginner"
      } else if (userMessage.match(/advanced|expert|hard|difficult/i)) {
        newPrefs.difficulty = "advanced"
      } else if (userMessage.match(/intermediate|medium/i)) {
        newPrefs.difficulty = "intermediate"
      }
      
      // Detect format preferences
      if (userMessage.match(/theory|theoretical|academic/i)) {
        newPrefs.format = "theory-heavy"
      } else if (userMessage.match(/project|practical|hands.?on/i)) {
        newPrefs.format = "project-heavy"
      }
      
      return {
        ...prev,
        preferences: newPrefs,
        conversationHistory: newHistory,
      }
    })
  }

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
    if (lower.startsWith("/help") || lower.startsWith("@help")) {
      return { type: "help", data: null }
    }
    if (lower.startsWith("/preferences") || lower.startsWith("@preferences")) {
      return { type: "preferences", data: null }
    }

    // Check for help/assistance requests
    if (lower.match(/^(help|assist|how|what|why|when|where|can you|could you)/)) {
      return { type: "question", data: input }
    }

    // Check for plan generation keywords
    if (
      lower.includes("create plan") ||
      lower.includes("generate plan") ||
      lower.includes("study plan for") ||
      lower.includes("i want to learn") ||
      (lower.includes("learn") && lower.includes("about"))
    ) {
      // Extract topic
      const topic =
        input
          .replace(/create (a )?plan for/i, "")
          .replace(/generate (a )?plan for/i, "")
          .replace(/study plan for/i, "")
          .replace(/i want to learn (about)?/i, "")
          .replace(/learn about/i, "")
          .trim() || input

      return { type: "generate", data: topic }
    }

    // Check for customization requests
    if (lower.match(/(change|set|update|modify|adjust).*(time|schedule|hours|days|difficulty)/)) {
      return { type: "customize", data: input }
    }

    // Check for recommendations
    if (lower.includes("recommend") || lower.includes("suggest")) {
      return { type: "recommend", data: null }
    }

    // Check for greeting
    if (lower.match(/^(hi|hello|hey|greetings)/)) {
      return { type: "greeting", data: null }
    }

    return { type: "general", data: input }
  }

  const answerQuestion = (question: string): string | null => {
    const q = question.toLowerCase()

    // Learning strategies
    if (q.match(/(stay motivated|keep motivated|lose motivation|motivation)/)) {
      return "Staying motivated requires a mix of strategies:\n\n1. Set Clear Goals - Break your study plan into smaller, achievable milestones\n2. Track Progress - Use the completion checkboxes to visualize your progress\n3. Reward Yourself - Celebrate completing major topics or milestones\n4. Mix It Up - Alternate between theory and projects to keep things interesting\n5. Join Communities - Connect with others learning the same topic\n6. Remember Your Why - Keep your end goal in mind\n\nBased on your preferences, I've noticed you're working with " + (userContext.preferences.timePerWeek || "limited time") + " per week. Setting realistic expectations is key!"
    }

    if (q.match(/(learn (programming|coding)|best way to learn code)/)) {
      return "The most effective way to learn programming:\n\n1. Start with Fundamentals - Understand basic concepts before advanced topics\n2. Code Every Day - Even 30 minutes daily is better than 3 hours once a week\n3. Build Projects - Apply what you learn to real projects immediately\n4. Debug Actively - Don't just copy code; understand why it works\n5. Read Others' Code - Study well-written code to learn best practices\n6. Use Multiple Resources - Mix videos, documentation, and hands-on practice\n\nI can help generate a structured study plan for any programming language. Just ask!"
    }

    if (q.match(/(effective study|study techniques|study methods)/)) {
      return "Research-backed study techniques:\n\n1. Active Recall - Test yourself instead of re-reading\n2. Spaced Repetition - Review material at increasing intervals\n3. Feynman Technique - Explain concepts in simple terms\n4. Pomodoro Method - 25min focused work + 5min breaks\n5. Interleaving - Mix different topics in one session\n6. Practice Testing - Do exercises before you feel ready\n\nI can customize your study plan based on your preferred learning format: " + (userContext.preferences.format || "theory-heavy, project-heavy, or balanced") + "."
    }

    if (q.match(/(time management|manage time|not enough time)/)) {
      return "Time management tips for learners:\n\n1. Consistent Schedule - Study at the same time each day\n2. Prioritize Topics - Focus on prerequisites and core concepts first\n3. Use Dead Time - Review flashcards during commutes\n4. Minimize Distractions - Use focus apps, turn off notifications\n5. Batch Similar Tasks - Group similar learning activities\n6. Time Units - Work in hours, days, or weeks based on your schedule\n\nYou can customize your plan's time unit (hours/days/weeks/months) based on your availability!"
    }

    if (q.match(/(choose topic|what should i learn|what to study)/)) {
      return "Choosing what to learn:\n\n1. Career Goals - What skills does your target job require?\n2. Interest Level - Are you passionate about this topic?\n3. Prerequisites - Do you have the foundational knowledge?\n4. Market Demand - Is this skill in demand?\n5. Learning Curve - Matches your difficulty level (" + (userContext.preferences.difficulty || "beginner/intermediate/advanced") + ")?\n\nTell me your goals and I can suggest topics and generate customized study plans!"
    }

    if (q.match(/(overcome challenges|stuck|difficult|frustrated)/)) {
      return "When learning gets tough:\n\n1. Break It Down - Split complex topics into smaller parts\n2. Change Resources - Try a different book, video, or course\n3. Take Breaks - Step away and return with fresh perspective\n4. Ask for Help - Use forums, communities, or mentors\n5. Review Basics - Sometimes you need to revisit fundamentals\n6. Adjust Difficulty - Consider moving between " + (userContext.preferences.difficulty || "beginner/intermediate/advanced") + " levels\n\nI can help restructure your study plan if you're finding it too easy or too hard!"
    }

    if (q.match(/(online course|resource|where to learn|platform)/)) {
      return "Quality learning platforms by type:\n\nFree Resources:\n- FreeCodeCamp (programming)\n- Khan Academy (math, science)\n- MIT OpenCourseWare (university courses)\n- YouTube channels (specific topics)\n\nPaid Platforms:\n- Udemy (project-based courses)\n- Coursera (university partnerships)\n- Pluralsight (tech skills)\n- Frontend Masters (web development)\n\nEvery study plan I generate includes curated resources. Use @resources to see recommendations for your current plan!"
    }

    if (q.match(/(progress|track progress|how am i doing)/)) {
      return "Track your progress effectively:\n\n1. Use Checkboxes - Mark completed topics in the plan\n2. Map View - Visualize your journey with the study map\n3. Regular Reviews - Check what you've learned weekly\n4. Export Plans - Download as PDF or JSON for records\n5. Celebrate Wins - Acknowledge completed milestones\n\nYour current plan has tracking enabled. Click the checkboxes as you complete each topic!"
    }

    return null
  }

  const handleSend = async () => {
    if (!input.trim() || isAIResponding) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setLocalMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setShowSuggestions(false)
    updateContext(currentInput, "")

    // Parse intent
    const intent = parseIntent(currentInput)

    // Handle special commands first
    if (intent.type === "topics" || intent.type === "prerequisites" || intent.type === "core" || 
        intent.type === "resources" || intent.type === "milestones" || intent.type === "plan" ||
        intent.type === "help" || intent.type === "preferences" || intent.type === "recommend") {
      
      setIsAIResponding(true)
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

        case "help":
          response = `Available Commands:\n\n📋 Plan Navigation:\n• /topics or @topics - View all topics\n• /prerequisites or @prerequisites - See prerequisites\n• /core or @core - View core topics\n• /resources or @resources - Get learning resources\n• /milestones or @milestones - See weekly goals\n\n🤖 Actions:\n• "Create plan for [topic]" - Generate new plan\n• "Recommend a topic" - Get suggestions\n\n💡 Ask Questions:\n• "How do I stay motivated?"\n• "What's the best way to learn programming?"\n• "Time management tips?"\n\n⚙️ Customize:\n• Mention hours, days, weeks, or months for time preferences\n• Say "beginner", "intermediate", or "advanced" for difficulty\n• Say "theory" or "project" for learning format preference`
          break

        case "preferences":
          const prefs = userContext.preferences
          response = `Your Current Preferences:\n\n${prefs.difficulty ? `🎯 Difficulty: ${prefs.difficulty}` : "🎯 Difficulty: Not set"}\n${prefs.timePerWeek ? `⏰ Time per Week: ${prefs.timePerWeek} ${prefs.timeUnit || "hours"}` : "⏰ Time per Week: Not set"}\n${prefs.format ? `📚 Format: ${prefs.format}` : "📚 Format: Not set"}\n\n${userContext.learningGoals.length > 0 ? `🎓 Learning Goals:\n${userContext.learningGoals.map((g, i) => `${i + 1}. ${g}`).join("\n")}` : "🎓 Learning Goals: None set yet"}\n\nTip: Just mention your preferences in conversation and I'll remember them!`
          break

        case "greeting":
          response = `Hello! I'm your AI study assistant. I can:\n\n✓ Generate personalized study plans\n✓ Answer your learning questions\n✓ Track your preferences\n✓ Navigate your current plan\n\nTry asking: "Create plan for React" or "How do I stay motivated?"`
          break

        case "customize":
          updateContext(input, "")
          response = `Got it! I've updated your preferences. Use /preferences to see what I remember about you.`
          break

        case "question":
          const answer = answerQuestion(intent.data as string)
          response = answer || `That's a great question! While I specialize in study plan generation, I can help with learning strategies. Try asking about:\n• Motivation and staying focused\n• Best ways to learn programming\n• Effective study techniques\n• Time management\n• Choosing what to learn\n• Overcoming challenges\n• Finding resources`
          break

        default:
          // Try answering as a question first
          const generalAnswer = answerQuestion(input)
          if (generalAnswer) {
            response = generalAnswer
          } else if (studyPlan) {
            response = `I can help you explore your study plan! Try:\n• "@topics" or "/topics" - View all topics\n• "@prerequisites" - See what you need first\n• "@core" - View core topics\n• "@resources" - Get learning resources\n• "@milestones" - See weekly goals\n• "Create plan for [topic]" - Generate new plan\n\nOr ask me learning questions like "How do I stay motivated?"`
          } else {
            response = `I can help you create a personalized study plan! Try:\n• "Create plan for [your topic]"\n• "/topics" to see available topics\n• "Recommend a topic" for suggestions\n• Ask me questions about learning strategies`
          }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setLocalMessages((prev) => [...prev, assistantMessage])
        updateContext(currentInput, response)
        setIsAIResponding(false)
      }, 800)
      return
    }

    // For general questions, use Gemini AI
    setIsAIResponding(true)
    
    try {
      abortControllerRef.current = new AbortController()
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...localMessages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: currentInput },
          ],
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setLocalMessages((prev) => [...prev, assistantMessage])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        aiResponse += chunk
        
        setLocalMessages((prev) => 
          prev.map((msg, idx) => 
            idx === prev.length - 1 
              ? { ...msg, content: aiResponse }
              : msg
          )
        )
      }

      updateContext(currentInput, aiResponse)
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Chat error:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API key configuration or try again.",
          timestamp: new Date(),
        }
        setLocalMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsAIResponding(false)
      abortControllerRef.current = null
    }
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
    { cmd: "/help", desc: "Show all commands" },
    { cmd: "/preferences", desc: "View your preferences" },
  ]

  // Show form suggestions based on detected preferences
  const getFormSuggestions = () => {
    const prefs = userContext.preferences
    if (!prefs.difficulty && !prefs.timePerWeek && !prefs.format) {
      return null
    }

    return (
      <div className="border-2 border-neon-green bg-terminal-black p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-neon-yellow" />
          <span className="text-neon-yellow text-sm font-bold">DETECTED PREFERENCES</span>
        </div>
        <div className="text-xs text-neon-green space-y-1">
          {prefs.difficulty && <div>• Difficulty: {prefs.difficulty}</div>}
          {prefs.timePerWeek && <div>• Time: {prefs.timePerWeek} {prefs.timeUnit || "hours"}/week</div>}
          {prefs.format && <div>• Format: {prefs.format}</div>}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Tip: These will be used when you generate a plan!
        </div>
      </div>
    )
  }

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
        {localMessages.map((message) => (
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

        {isAIResponding && (
          <div className="flex justify-start">
            <div className="border-2 border-neon-green bg-terminal-black text-neon-green p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-base">Gemini AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Suggestions */}
      {getFormSuggestions()}

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
