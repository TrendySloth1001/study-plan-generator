"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Handle,
  Position,
  Panel,
  MiniMap,
} from "reactflow"
import "reactflow/dist/style.css"
import {
  Maximize2,
  Minimize2,
  Download,
  Lock,
  Check,
  Clock,
  Calendar,
  Edit2,
  Save,
  X,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Target,
  Plus,
  Trash2,
} from "lucide-react"
import type { StudyPlan, TrackedProgress } from "@/lib/types"

interface EnhancedCanvasProps {
  studyPlan: StudyPlan
  progress: TrackedProgress
  onToggleProgress: (key: string) => void
}

interface NodeComment {
  id: string
  text: string
  timestamp: string
  author: string
}

interface NodeData {
  label: string
  description?: string
  duration?: string
  completed: boolean
  timestamp?: string
  icon?: any
  category?: string
  onClick: () => void
  nodeKey: string
  aiExplanation?: string
  customNotes?: string
  comments?: NodeComment[]
  subtopics?: string[]
}

// Enhanced Custom Node Component with AI, Editing, and Comments
function DetailedCustomNode({ data }: { data: NodeData }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(data.customNotes || "")
  const [aiExplanation, setAiExplanation] = useState(data.aiExplanation || "")
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<NodeComment[]>(data.comments || [])
  const [showSubtopics, setShowSubtopics] = useState(false)

  const isCompleted = data.completed
  const Icon = data.icon

  const fetchAIExplanation = async (type: string = "explain") => {
    setIsLoadingAI(true)
    try {
      const response = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: data.label,
          context: data.description || "",
          type,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAiExplanation(result.explanation)
        // Save to localStorage
        localStorage.setItem(`ai-explanation-${data.nodeKey}`, result.explanation)
      }
    } catch (error) {
      console.error("Failed to fetch AI explanation:", error)
      setAiExplanation("Failed to load AI explanation. Please try again.")
    }
    setIsLoadingAI(false)
  }

  const saveNotes = () => {
    localStorage.setItem(`custom-notes-${data.nodeKey}`, editedNotes)
    setIsEditing(false)
  }

  const addComment = () => {
    if (newComment.trim()) {
      const comment: NodeComment = {
        id: Date.now().toString(),
        text: newComment,
        timestamp: new Date().toISOString(),
        author: "You",
      }
      const updatedComments = [...comments, comment]
      setComments(updatedComments)
      localStorage.setItem(`comments-${data.nodeKey}`, JSON.stringify(updatedComments))
      setNewComment("")
    }
  }

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId)
    setComments(updatedComments)
    localStorage.setItem(`comments-${data.nodeKey}`, JSON.stringify(updatedComments))
  }

  // Load saved data on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`custom-notes-${data.nodeKey}`)
    const savedAI = localStorage.getItem(`ai-explanation-${data.nodeKey}`)
    const savedComments = localStorage.getItem(`comments-${data.nodeKey}`)

    if (savedNotes) setEditedNotes(savedNotes)
    if (savedAI) setAiExplanation(savedAI)
    if (savedComments) setComments(JSON.parse(savedComments))
  }, [data.nodeKey])

  const getBorderColor = () => {
    if (isCompleted) return "border-neon-green shadow-lg shadow-neon-green/30"
    if (data.category === "prereq") return "border-neon-cyan shadow-lg shadow-neon-cyan/20"
    if (data.category === "core") return "border-neon-green shadow-lg shadow-neon-green/20"
    if (data.category === "milestone") return "border-neon-pink shadow-lg shadow-neon-pink/20"
    return "border-neon-cyan"
  }

  return (
    <div
      className={`min-w-[320px] max-w-[420px] border-4 pixel-border transition-all ${getBorderColor()} ${
        isCompleted ? "bg-terminal-black" : "bg-panel-black hover:bg-terminal-black"
      } ${isExpanded ? "min-h-[400px]" : ""}`}
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-neon-cyan border-2 border-neon-cyan" />

      {/* Header Section */}
      <div
        className="p-4 cursor-pointer hover:bg-terminal-black/50 transition-colors border-b-2 border-gray-800"
        onClick={data.onClick}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-14 h-14 border-2 flex items-center justify-center flex-shrink-0 ${
              isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
            }`}
          >
            {isCompleted ? (
              <Check className="text-terminal-black w-7 h-7" />
            ) : Icon ? (
              <Icon className="text-neon-cyan w-7 h-7" />
            ) : (
              <span className="text-2xl">📚</span>
            )}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-base mb-2 ${
                isCompleted ? "text-neon-green line-through" : "text-neon-cyan"
              }`}
            >
              {data.label}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {data.duration && (
                <span className="text-neon-pink flex items-center gap-1 bg-terminal-black/50 px-2 py-1 border border-neon-pink/30">
                  <Clock className="w-3 h-3" />
                  {data.duration}
                </span>
              )}
              {isCompleted && data.timestamp && (
                <span className="text-neon-green flex items-center gap-1 bg-terminal-black/50 px-2 py-1 border border-neon-green/30">
                  <Calendar className="w-3 h-3" />
                  {new Date(data.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>

            {data.category && (
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs border font-bold ${
                  data.category === "prereq"
                    ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                    : data.category === "core"
                      ? "border-neon-green text-neon-green bg-neon-green/10"
                      : "border-neon-pink text-neon-pink bg-neon-pink/10"
                }`}
              >
                {data.category.toUpperCase()}
              </span>
            )}
          </div>

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="text-neon-cyan hover:text-neon-green transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {/* Description */}
          {data.description && (
            <div className="border-l-2 border-neon-cyan pl-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-bold text-neon-cyan">DESCRIPTION</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Subtopics */}
          {data.subtopics && data.subtopics.length > 0 && (
            <div className="border-l-2 border-neon-green pl-3">
              <button
                onClick={() => setShowSubtopics(!showSubtopics)}
                className="flex items-center gap-2 mb-2 text-neon-green hover:text-neon-cyan transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold">SUBTOPICS</span>
                {showSubtopics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showSubtopics && (
                <ul className="space-y-1">
                  {data.subtopics.map((subtopic, i) => (
                    <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-neon-green">▸</span>
                      <span>{subtopic}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* AI Explanation */}
          <div className="border-l-2 border-neon-pink pl-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-pink" />
                <span className="text-xs font-bold text-neon-pink">AI EXPLANATION</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => fetchAIExplanation("explain")}
                  disabled={isLoadingAI}
                  className="text-xs px-2 py-1 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all disabled:opacity-50"
                  title="Get explanation"
                >
                  {isLoadingAI ? "..." : "💡"}
                </button>
                <button
                  onClick={() => fetchAIExplanation("tips")}
                  disabled={isLoadingAI}
                  className="text-xs px-2 py-1 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all disabled:opacity-50"
                  title="Get tips"
                >
                  📝
                </button>
                <button
                  onClick={() => fetchAIExplanation("projects")}
                  disabled={isLoadingAI}
                  className="text-xs px-2 py-1 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all disabled:opacity-50"
                  title="Get projects"
                >
                  🚀
                </button>
              </div>
            </div>
            {aiExplanation ? (
              <div className="text-gray-300 text-sm leading-relaxed bg-terminal-black/50 p-3 border border-neon-pink/20">
                {aiExplanation}
              </div>
            ) : (
              <p className="text-gray-500 text-xs italic">Click an icon above to get AI-powered insights</p>
            )}
          </div>

          {/* Custom Notes */}
          <div className="border-l-2 border-neon-green pl-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-neon-green" />
                <span className="text-xs font-bold text-neon-green">YOUR NOTES</span>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs px-2 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={saveNotes}
                    className="text-xs px-2 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs px-2 py-1 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="w-full p-2 bg-terminal-black border border-neon-green text-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neon-green min-h-[80px]"
                placeholder="Add your personal notes here..."
              />
            ) : editedNotes ? (
              <div className="text-gray-300 text-sm bg-terminal-black/50 p-3 border border-neon-green/20 whitespace-pre-wrap">
                {editedNotes}
              </div>
            ) : (
              <p className="text-gray-500 text-xs italic">Click edit to add personal notes</p>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-l-2 border-pixel-yellow pl-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 mb-2 text-pixel-yellow hover:text-neon-cyan transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold">COMMENTS ({comments.length})</span>
              {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showComments && (
              <div className="space-y-2">
                {/* Comment List */}
                {comments.length > 0 && (
                  <div className="space-y-2 mb-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-terminal-black/50 p-2 border border-pixel-yellow/20 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-pixel-yellow font-bold">{comment.author}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="text-neon-pink hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-2 py-1 bg-terminal-black border border-pixel-yellow text-gray-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-pixel-yellow"
                  />
                  <button
                    onClick={addComment}
                    className="px-3 py-1 border border-pixel-yellow text-pixel-yellow hover:bg-pixel-yellow hover:text-terminal-black transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-neon-cyan border-2 border-neon-cyan" />
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: DetailedCustomNode,
}

export default function SuperEnhancedCanvas({ studyPlan, progress, onToggleProgress }: EnhancedCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#00e1ff", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  )

  // Generate nodes and edges from study plan with enhanced data
  useEffect(() => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []
    let yPosition = 0
    let previousNodeId: string | null = null

    // Start node
    const startNodeId = "start"
    newNodes.push({
      id: startNodeId,
      type: "custom",
      position: { x: 500, y: yPosition },
      data: {
        label: "🚀 START YOUR JOURNEY",
        description: "Welcome to your personalized learning roadmap!",
        completed: true,
        icon: null,
        category: "start",
        nodeKey: "start",
        subtopics: [],
        onClick: () => {},
      },
    })
    previousNodeId = startNodeId
    yPosition += 200

    // Prerequisites with enhanced data
    studyPlan.prerequisites.forEach((prereq, i) => {
      const key = `prereq-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: i % 2 === 0 ? 250 : 750, y: yPosition },
        data: {
          label: prereq.title,
          description: prereq.description,
          duration: prereq.duration,
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          icon: Lock,
          category: "prereq",
          nodeKey: key,
          subtopics: prereq.description
            ? prereq.description.split(".").filter((s) => s.trim().length > 10).slice(0, 3)
            : [],
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: {
            stroke: progressEntry?.completed ? "#00ff41" : "#00e1ff",
            strokeWidth: progressEntry?.completed ? 3 : 2,
          },
        })
      }

      previousNodeId = nodeId
      yPosition += 250
    })

    // Core topics with subtopics
    studyPlan.coreTopics.forEach((topic, i) => {
      const key = `topic-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: i % 2 === 0 ? 750 : 250, y: yPosition },
        data: {
          label: topic.title,
          description: topic.description,
          duration: topic.duration,
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          category: "core",
          nodeKey: key,
          subtopics: topic.description
            ? topic.description.split(",").filter((s) => s.trim().length > 5).slice(0, 4)
            : [],
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: {
            stroke: progressEntry?.completed ? "#00ff41" : "#00ff00",
            strokeWidth: progressEntry?.completed ? 3 : 2,
          },
        })
      }

      previousNodeId = nodeId
      yPosition += 250
    })

    // Milestones
    studyPlan.progressSteps.forEach((step, i) => {
      const key = `step-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: 500, y: yPosition },
        data: {
          label: `📍 Week ${step.week} Milestone`,
          description: step.milestones[0] || step.topics.join(", "),
          duration: `Week ${step.week}`,
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          category: "milestone",
          nodeKey: key,
          subtopics: step.topics.slice(0, 5),
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: {
            stroke: progressEntry?.completed ? "#00ff41" : "#ff006e",
            strokeWidth: progressEntry?.completed ? 3 : 2,
          },
        })
      }

      previousNodeId = nodeId
      yPosition += 250
    })

    // Finish node
    const finishNodeId = "finish"
    newNodes.push({
      id: finishNodeId,
      type: "custom",
      position: { x: 500, y: yPosition },
      data: {
        label: "🎉 COMPLETED!",
        description: "Congratulations on completing your learning journey!",
        completed: false,
        category: "finish",
        nodeKey: "finish",
        subtopics: [],
        onClick: () => {},
      },
    })

    if (previousNodeId) {
      newEdges.push({
        id: `edge-${previousNodeId}-${finishNodeId}`,
        source: previousNodeId,
        target: finishNodeId,
        animated: true,
        style: { stroke: "#ffea00", strokeWidth: 2 },
      })
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [studyPlan, progress, onToggleProgress, setNodes, setEdges])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleExport = () => {
    const data = {
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        position: n.position,
        completed: n.data.completed,
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${studyPlan.title}-roadmap.json`
    a.click()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const completedCount = nodes.filter((n) => n.data.completed).length
  const totalCount = nodes.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div
      ref={containerRef}
      className={`border-4 border-neon-cyan pixel-border bg-terminal-black relative ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[900px]"
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="bg-terminal-black"
        style={{
          background: "#000000",
        }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background color="#00e1ff" gap={25} size={1.5} style={{ opacity: 0.15 }} />

        <Controls className="border-2 border-neon-cyan bg-panel-black/90 backdrop-blur-sm" />

        <MiniMap
          className="border-2 border-neon-pink bg-panel-black/90 backdrop-blur-sm"
          style={{ background: "#0f0f0f" }}
          nodeColor={(node) => {
            if (node.data.completed) return "#00ff41"
            if (node.data.category === "prereq") return "#00e1ff"
            if (node.data.category === "core") return "#00ff00"
            if (node.data.category === "milestone") return "#ff006e"
            return "#ffea00"
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />

        <Panel position="top-right" className="space-y-2">
          <button
            onClick={toggleFullscreen}
            className="border-2 border-neon-cyan bg-panel-black/95 backdrop-blur-sm p-3 text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black transition-all flex items-center gap-2 font-bold shadow-lg"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleExport}
            className="border-2 border-neon-green bg-panel-black/95 backdrop-blur-sm p-3 text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all flex items-center gap-2 font-bold shadow-lg"
            title="Export Roadmap Data"
          >
            <Download className="w-5 h-5" />
          </button>
        </Panel>

        <Panel position="top-left">
          <div className="border-2 border-neon-pink bg-panel-black/95 backdrop-blur-sm p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-neon-pink animate-pulse" />
              <h3 className="text-neon-pink font-bold">🗺️ INTERACTIVE ROADMAP</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <p>• Click nodes to mark complete</p>
              <p>• Expand for AI insights & notes</p>
              <p>• Drag to rearrange layout</p>
              <p>• Add comments & custom notes</p>
              <p>• Get AI explanations & tips</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-neon-green font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 border border-neon-green/30">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-neon-pink/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-cyan border border-neon-cyan" />
                <span className="text-gray-400">Prerequisites</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-green border border-neon-green" />
                <span className="text-gray-400">Core Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-pink border border-neon-pink" />
                <span className="text-gray-400">Milestones</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
          border: 1px solid #333;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00e1ff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00ff41;
        }
      `}</style>
    </div>
  )
}
