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
import { Maximize2, Minimize2, Download, Lock, Check, Clock, Calendar } from "lucide-react"
import type { StudyPlan, TrackedProgress } from "@/lib/types"

interface EnhancedCanvasProps {
  studyPlan: StudyPlan
  progress: TrackedProgress
  onToggleProgress: (key: string) => void
}

// Custom Node Component
function CustomNode({ data }: { data: any }) {
  const isCompleted = data.completed
  const Icon = data.icon

  return (
    <div
      className={`px-6 py-4 border-4 pixel-border min-w-[280px] transition-all cursor-pointer ${
        isCompleted
          ? "border-neon-green bg-terminal-black shadow-lg shadow-neon-green/50"
          : "border-neon-cyan bg-panel-black hover:bg-terminal-black hover:scale-105"
      }`}
      onClick={data.onClick}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-neon-cyan border-2 border-neon-cyan" />
      
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 border-2 flex items-center justify-center flex-shrink-0 ${
            isCompleted ? "border-neon-green bg-neon-green" : "border-neon-cyan"
          }`}
        >
          {isCompleted ? (
            <Check className="text-terminal-black w-6 h-6" />
          ) : Icon ? (
            <Icon className="text-neon-cyan w-6 h-6" />
          ) : (
            <span className="text-neon-cyan">📚</span>
          )}
        </div>

        <div className="flex-1">
          <h3
            className={`font-bold text-base mb-2 ${
              isCompleted ? "text-neon-green line-through" : "text-neon-cyan"
            }`}
          >
            {data.label}
          </h3>
          
          {data.description && (
            <p className="text-gray-300 text-sm mb-2">{data.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs">
            {data.duration && (
              <span className="text-neon-pink flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {data.duration}
              </span>
            )}
            {isCompleted && data.timestamp && (
              <span className="text-neon-green flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(data.timestamp).toLocaleDateString()}
              </span>
            )}
          </div>

          {data.category && (
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs border ${
                data.category === "prereq"
                  ? "border-neon-cyan text-neon-cyan"
                  : data.category === "core"
                    ? "border-neon-green text-neon-green"
                    : "border-neon-pink text-neon-pink"
              }`}
            >
              {data.category.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-neon-cyan border-2 border-neon-cyan" />
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

export default function EnhancedCanvas({ studyPlan, progress, onToggleProgress }: EnhancedCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#00e1ff" } }, eds)),
    [setEdges]
  )

  // Generate nodes and edges from study plan
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
      position: { x: 400, y: yPosition },
      data: {
        label: "START YOUR JOURNEY",
        completed: true,
        icon: null,
        category: "start",
      },
    })
    previousNodeId = startNodeId
    yPosition += 150

    // Prerequisites
    studyPlan.prerequisites.forEach((prereq, i) => {
      const key = `prereq-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: i % 2 === 0 ? 200 : 600, y: yPosition },
        data: {
          label: prereq.title,
          description: prereq.description,
          duration: prereq.duration,
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          icon: Lock,
          category: "prereq",
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: { stroke: progressEntry?.completed ? "#00ff41" : "#00e1ff", strokeWidth: 2 },
        })
      }

      previousNodeId = nodeId
      yPosition += 180
    })

    // Core topics
    studyPlan.coreTopics.forEach((topic, i) => {
      const key = `topic-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: i % 2 === 0 ? 600 : 200, y: yPosition },
        data: {
          label: topic.title,
          description: topic.description,
          duration: topic.duration,
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          category: "core",
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: { stroke: progressEntry?.completed ? "#00ff41" : "#00ff00", strokeWidth: 2 },
        })
      }

      previousNodeId = nodeId
      yPosition += 180
    })

    // Milestones
    studyPlan.progressSteps.forEach((step, i) => {
      const key = `step-${i}`
      const progressEntry = progress[key]
      const nodeId = `node-${key}`

      newNodes.push({
        id: nodeId,
        type: "custom",
        position: { x: 400, y: yPosition },
        data: {
          label: `Week ${step.week}`,
          description: step.milestones[0] || step.topics[0],
          completed: progressEntry?.completed || false,
          timestamp: progressEntry?.timestamp,
          category: "milestone",
          onClick: () => onToggleProgress(key),
        },
      })

      if (previousNodeId) {
        newEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: previousNodeId,
          target: nodeId,
          animated: !progressEntry?.completed,
          style: { stroke: progressEntry?.completed ? "#00ff41" : "#ff006e", strokeWidth: 2 },
        })
      }

      previousNodeId = nodeId
      yPosition += 180
    })

    // Finish node
    const finishNodeId = "finish"
    newNodes.push({
      id: finishNodeId,
      type: "custom",
      position: { x: 400, y: yPosition },
      data: {
        label: "🎉 COMPLETE!",
        completed: false,
        category: "finish",
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
    // Export as image functionality (would need additional library)
    alert("Export functionality - would integrate with html-to-image or similar library")
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`border-4 border-neon-cyan pixel-border bg-terminal-black relative ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[800px]"
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
      >
        <Background color="#00e1ff" gap={20} size={1} style={{ opacity: 0.1 }} />
        
        <Controls className="border-2 border-neon-cyan bg-panel-black" />

        <MiniMap
          className="border-2 border-neon-pink bg-panel-black"
          style={{ background: "#0f0f0f" }}
          nodeColor={(node) => {
            if (node.data.completed) return "#00ff41"
            if (node.data.category === "prereq") return "#00e1ff"
            if (node.data.category === "core") return "#00ff00"
            if (node.data.category === "milestone") return "#ff006e"
            return "#ffea00"
          }}
        />

        <Panel position="top-right" className="space-y-2">
          <button
            onClick={toggleFullscreen}
            className="border-2 border-neon-cyan bg-panel-black p-3 text-neon-cyan hover:bg-neon-cyan hover:text-terminal-black transition-all flex items-center gap-2 font-bold"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleExport}
            className="border-2 border-neon-green bg-panel-black p-3 text-neon-green hover:bg-neon-green hover:text-terminal-black transition-all flex items-center gap-2 font-bold"
            title="Export Canvas"
          >
            <Download className="w-5 h-5" />
          </button>
        </Panel>

        <Panel position="top-left">
          <div className="border-2 border-neon-pink bg-panel-black/90 backdrop-blur-sm p-4 max-w-xs">
            <h3 className="text-neon-pink font-bold mb-2">🗺️ INTERACTIVE ROADMAP</h3>
            <p className="text-gray-300 text-sm mb-3">
              Click nodes to mark complete. Drag to rearrange. Scroll to zoom.
            </p>
            <div className="space-y-1 text-xs">
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
    </div>
  )
}
