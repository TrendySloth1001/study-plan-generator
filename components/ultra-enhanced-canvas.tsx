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
  ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import {
  Maximize2,
  Minimize2,
  Download,
  Lock,
  Unlock,
  Check,
  Clock,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Target,
  Link as LinkIcon,
  GitBranch,
  Leaf,
} from "lucide-react"
import type { StudyPlan, TrackedProgress, Branch, BranchStructure } from "@/lib/types"
import { saveAllData, exportDataAsJSON, autoSave } from "@/lib/storage-manager"

interface UltraCanvasProps {
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
  resources?: Array<{
    title: string
    url: string
    type: string
  }>
  isLeaf?: boolean
  isBranch?: boolean
  parentBranch?: string
}

// Enhanced Custom Node Component with Resources
function UltraCustomNode({ data }: { data: NodeData }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [aiExplanation, setAiExplanation] = useState(data.aiExplanation || "")
  const [isLoadingAI, setIsLoadingAI] = useState(false)

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
        localStorage.setItem(`ai-explanation-${data.nodeKey}`, result.explanation)
      } else {
        const error = await response.json()
        setAiExplanation(`Error: ${error.error || "Failed to fetch AI explanation"}`)
      }
    } catch (error) {
      console.error("Failed to fetch AI explanation:", error)
      setAiExplanation("Failed to load AI explanation. Check your GEMINI_API_KEY in .env file.")
    }
    setIsLoadingAI(false)
  }

  useEffect(() => {
    const savedAI = localStorage.getItem(`ai-explanation-${data.nodeKey}`)
    if (savedAI) setAiExplanation(savedAI)
  }, [data.nodeKey])

  const getBorderColor = () => {
    if (data.isLeaf) return "border-pixel-yellow shadow-lg shadow-pixel-yellow/20"
    if (data.isBranch) return "border-neon-pink shadow-lg shadow-neon-pink/30"
    if (isCompleted) return "border-neon-green shadow-lg shadow-neon-green/30"
    if (data.category === "prereq") return "border-neon-cyan shadow-lg shadow-neon-cyan/20"
    if (data.category === "core") return "border-neon-green shadow-lg shadow-neon-green/20"
    if (data.category === "milestone") return "border-neon-pink shadow-lg shadow-neon-pink/20"
    return "border-neon-cyan"
  }

  const getIcon = () => {
    if (data.isLeaf) return <Leaf className="text-pixel-yellow w-7 h-7" />
    if (data.isBranch) return <GitBranch className="text-neon-pink w-7 h-7" />
    if (isCompleted) return <Check className="text-terminal-black w-7 h-7" />
    if (Icon) return <Icon className="text-neon-cyan w-7 h-7" />
    return <span className="text-2xl">📚</span>
  }

  return (
    <div
      className={`min-w-[340px] max-w-[460px] border-4 pixel-border transition-all ${getBorderColor()} ${
        isCompleted ? "bg-terminal-black" : "bg-panel-black hover:bg-terminal-black"
      } ${isExpanded ? "min-h-[450px]" : ""}`}
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
              data.isLeaf
                ? "border-pixel-yellow bg-pixel-yellow/10"
                : data.isBranch
                  ? "border-neon-pink bg-neon-pink/10"
                  : isCompleted
                    ? "border-neon-green bg-neon-green"
                    : "border-neon-cyan"
            }`}
          >
            {getIcon()}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-base mb-2 ${
                data.isLeaf
                  ? "text-pixel-yellow"
                  : data.isBranch
                    ? "text-neon-pink"
                    : isCompleted
                      ? "text-neon-green line-through"
                      : "text-neon-cyan"
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
              {data.resources && data.resources.length > 0 && (
                <span className="text-neon-cyan flex items-center gap-1 bg-terminal-black/50 px-2 py-1 border border-neon-cyan/30">
                  <LinkIcon className="w-3 h-3" />
                  {data.resources.length} Resources
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
        <div className="p-4 space-y-4 max-h-[550px] overflow-y-auto custom-scrollbar">
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

          {/* Resources Section - Always Visible */}
          {data.resources && data.resources.length > 0 && (
            <div className="border-l-2 border-neon-cyan pl-3">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-bold text-neon-cyan">STUDY RESOURCES</span>
              </div>
              <div className="space-y-2">
                {data.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-terminal-black/50 border border-neon-cyan/20 hover:border-neon-cyan hover:bg-terminal-black transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <LinkIcon className="w-3 h-3 text-neon-cyan flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm font-bold group-hover:text-neon-cyan transition-colors">
                          {resource.title}
                        </p>
                        <p className="text-neon-cyan text-xs mt-1 font-bold">{resource.type.toUpperCase()}</p>
                        <p className="text-gray-500 text-xs truncate hover:text-neon-cyan transition-colors">{resource.url}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Subtopics */}
          {data.subtopics && data.subtopics.length > 0 && (
            <div className="border-l-2 border-neon-green pl-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-neon-green" />
                <span className="text-xs font-bold text-neon-green">SUBTOPICS</span>
              </div>
              <ul className="space-y-1">
                {data.subtopics.map((subtopic, i) => (
                  <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
                    <span className="text-neon-green">▸</span>
                    <span>{subtopic}</span>
                  </li>
                ))}
              </ul>
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
                  onClick={() => fetchAIExplanation("resources")}
                  disabled={isLoadingAI}
                  className="text-xs px-2 py-1 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all disabled:opacity-50"
                  title="Get resources"
                >
                  📚
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


        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-neon-cyan border-2 border-neon-cyan" />
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: UltraCustomNode,
}

export default function UltraEnhancedCanvas({ studyPlan, progress, onToggleProgress }: UltraCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)

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

  // Generate AI branches
  const generateBranches = async () => {
    setIsLoadingBranches(true)
    try {
      const response = await fetch("/api/generate-branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: studyPlan.title,
          context: `Study plan for ${studyPlan.title}. Difficulty: ${studyPlan.difficulty}. Time per week: ${studyPlan.timePerWeek} hours.`,
        }),
      })

      if (response.ok) {
        const branchStructure: BranchStructure = await response.json()
        
        // Save to localStorage
        localStorage.setItem(`branches-${studyPlan.title}`, JSON.stringify(branchStructure))
        
        // Regenerate nodes with branches
        generateNodesWithBranches(branchStructure)
      } else {
        const error = await response.json()
        alert(`Failed to generate branches: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to generate branches:", error)
      alert("Failed to generate branches. Check console for details.")
    }
    setIsLoadingBranches(false)
  }

  // Generate nodes with branch structure
  const generateNodesWithBranches = (branchStructure?: BranchStructure) => {
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

    if (branchStructure && branchStructure.branches) {
      // Generate branch structure
      branchStructure.branches.forEach((branch, branchIndex) => {
        const branchKey = `branch-${branchIndex}`
        const branchNodeId = `node-${branchKey}`
        const progressEntry = progress[branchKey]

        // Main branch node
        newNodes.push({
          id: branchNodeId,
          type: "custom",
          position: { x: 500, y: yPosition },
          data: {
            label: branch.title,
            description: branch.description,
            completed: progressEntry?.completed || false,
            timestamp: progressEntry?.timestamp,
            category: "branch",
            nodeKey: branchKey,
            isBranch: true,
            onClick: () => onToggleProgress(branchKey),
          },
        })

        if (previousNodeId) {
          newEdges.push({
            id: `edge-${previousNodeId}-${branchNodeId}`,
            source: previousNodeId,
            target: branchNodeId,
            animated: !progressEntry?.completed,
            style: {
              stroke: progressEntry?.completed ? "#00ff41" : "#ff006e",
              strokeWidth: 3,
            },
          })
        }

        previousNodeId = branchNodeId
        yPosition += 250

        // Subtopics
        branch.subtopics.forEach((subtopic, subtopicIndex) => {
          const subtopicKey = `${branchKey}-subtopic-${subtopicIndex}`
          const subtopicNodeId = `node-${subtopicKey}`
          const subtopicProgress = progress[subtopicKey]

          newNodes.push({
            id: subtopicNodeId,
            type: "custom",
            position: { x: subtopicIndex % 2 === 0 ? 250 : 750, y: yPosition },
            data: {
              label: subtopic.title,
              description: subtopic.description,
              duration: subtopic.duration,
              completed: subtopicProgress?.completed || false,
              timestamp: subtopicProgress?.timestamp,
              category: "subtopic",
              nodeKey: subtopicKey,
              parentBranch: branchKey,
              resources: subtopic.resources,
              onClick: () => onToggleProgress(subtopicKey),
            },
          })

          newEdges.push({
            id: `edge-${branchNodeId}-${subtopicNodeId}`,
            source: branchNodeId,
            target: subtopicNodeId,
            animated: !subtopicProgress?.completed,
            style: {
              stroke: subtopicProgress?.completed ? "#00ff41" : "#00e1ff",
              strokeWidth: 2,
            },
          })

          // Leaf nodes
          subtopic.leafNodes.forEach((leaf, leafIndex) => {
            const leafKey = `${subtopicKey}-leaf-${leafIndex}`
            const leafNodeId = `node-${leafKey}`
            const leafProgress = progress[leafKey]

            newNodes.push({
              id: leafNodeId,
              type: "custom",
              position: {
                x: subtopicIndex % 2 === 0 ? 100 : 900,
                y: yPosition + 80 + leafIndex * 120,
              },
              data: {
                label: leaf.title,
                description: leaf.description,
                completed: leafProgress?.completed || false,
                timestamp: leafProgress?.timestamp,
                category: "leaf",
                nodeKey: leafKey,
                isLeaf: true,
                parentBranch: subtopicKey,
                onClick: () => onToggleProgress(leafKey),
              },
            })

            newEdges.push({
              id: `edge-${subtopicNodeId}-${leafNodeId}`,
              source: subtopicNodeId,
              target: leafNodeId,
              animated: !leafProgress?.completed,
              style: {
                stroke: leafProgress?.completed ? "#00ff41" : "#ffea00",
                strokeWidth: 1.5,
              },
            })
          })

          yPosition += 250 + subtopic.leafNodes.length * 120
        })
      })
    } else {
      // Fallback to original structure
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
              strokeWidth: 2,
            },
          })
        }

        previousNodeId = nodeId
        yPosition += 200
      })

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
              strokeWidth: 2,
            },
          })
        }

        previousNodeId = nodeId
        yPosition += 200
      })
    }

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
  }

  // Initial load
  useEffect(() => {
    // Check for saved branches
    const savedBranches = localStorage.getItem(`branches-${studyPlan.title}`)
    if (savedBranches) {
      try {
        const branchStructure: BranchStructure = JSON.parse(savedBranches)
        generateNodesWithBranches(branchStructure)
      } catch (e) {
        generateNodesWithBranches()
      }
    } else {
      generateNodesWithBranches()
    }
  }, [studyPlan, progress, onToggleProgress])

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
    // Load branches from localStorage
    const savedBranches = localStorage.getItem(`branches-${studyPlan.title}`)
    const branchStructure = savedBranches ? JSON.parse(savedBranches) : undefined
    
    // Save and export all data
    const storageData = saveAllData(studyPlan, progress, branchStructure)
    exportDataAsJSON(storageData, `${studyPlan.title}-complete-${Date.now()}.json`)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Handle wheel scrolling when locked
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isLocked) return

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        const flowViewport = container.querySelector('.react-flow__viewport')
        if (flowViewport) {
          const currentTransform = flowViewport.getAttribute('style') || ''
          const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/)
          
          if (translateMatch) {
            const currentY = parseFloat(translateMatch[2])
            const newY = currentY - e.deltaY
            
            flowViewport.setAttribute(
              'style',
              currentTransform.replace(
                /translate\([^)]+\)/,
                `translate(${translateMatch[1]}, ${newY}px)`
              )
            )
          }
        }
        e.preventDefault()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [isLocked])

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
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={true}
        zoomOnScroll={!isLocked}
        panOnScroll={false}
        panOnDrag={!isLocked}
        onInit={(instance) => {
          reactFlowInstance.current = instance
        }}
      >
        <Background color="#00e1ff" gap={25} size={1.5} style={{ opacity: 0.15 }} />

        <Controls className="border-2 border-neon-cyan bg-panel-black/90 backdrop-blur-sm" />

        <MiniMap
          className="border-2 border-neon-pink bg-panel-black/90 backdrop-blur-sm"
          style={{ background: "#0f0f0f" }}
          nodeColor={(node) => {
            if (node.data.isLeaf) return "#ffea00"
            if (node.data.isBranch) return "#ff006e"
            if (node.data.completed) return "#00ff41"
            if (node.data.category === "prereq") return "#00e1ff"
            if (node.data.category === "core") return "#00ff00"
            return "#00e1ff"
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />

        <Panel position="top-right" className="space-y-2">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`border-2 bg-panel-black/95 backdrop-blur-sm p-3 transition-all flex items-center gap-2 font-bold shadow-lg ${
              isLocked
                ? "border-neon-green text-neon-green hover:bg-neon-green hover:text-terminal-black"
                : "border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black"
            }`}
            title={isLocked ? "Unlock (Enable Drag)" : "Lock (Enable Scroll)"}
          >
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="border-2 border-neon-cyan bg-panel-black/95 backdrop-blur-sm p-3 text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black transition-all flex items-center gap-2 font-bold shadow-lg"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={generateBranches}
            disabled={isLoadingBranches}
            className="border-2 border-neon-pink bg-panel-black/95 backdrop-blur-sm p-3 text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all flex items-center gap-2 font-bold shadow-lg disabled:opacity-50"
            title="Generate AI Branches"
          >
            <GitBranch className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="border-2 border-neon-green bg-panel-black/95 backdrop-blur-sm p-3 text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all flex items-center gap-2 font-bold shadow-lg"
            title="Export All Data (JSON)"
          >
            <Download className="w-5 h-5" />
          </button>
        </Panel>

        <Panel position="top-left">
          <div className="border-2 border-neon-pink bg-panel-black/95 backdrop-blur-sm p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-neon-pink animate-pulse" />
              <h3 className="text-neon-pink font-bold">🗺️ ULTRA CANVAS</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <p>• Click {isLocked ? <Unlock className="inline w-3 h-3" /> : <Lock className="inline w-3 h-3" />} to {isLocked ? "unlock dragging" : "lock & enable scroll"}</p>
              <p>• Click <GitBranch className="inline w-3 h-3" /> to generate AI branches</p>
              <p>• Expand cards for resources & AI help</p>
              <p>• Export complete data as JSON</p>
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
                <GitBranch className="w-3 h-3 text-neon-pink" />
                <span className="text-gray-400">Branches</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-neon-cyan" />
                <span className="text-gray-400">Subtopics</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-3 h-3 text-pixel-yellow" />
                <span className="text-gray-400">Leaf Nodes</span>
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
