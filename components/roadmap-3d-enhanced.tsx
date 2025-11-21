"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Float, Line, Sphere, Box, Html, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import type { StudyPlan } from "@/lib/types"
import { Check, Lock, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface RoadmapNode {
  id: string
  title: string
  position: [number, number, number]
  color: string
  type: "start" | "prereq" | "core" | "milestone" | "finish"
  completed: boolean
  description?: string
  onClick: () => void
}

function RoadNode({ node, scale = 1 }: { node: RoadmapNode; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const emissiveColor = useMemo(() => {
    switch (node.color) {
      case "cyan": return "#00ffff"
      case "green": return "#00ff00"
      case "pink": return "#ff006e"
      case "yellow": return "#ffff00"
      default: return "#00ffff"
    }
  }, [node.color])

  const nodeSize = useMemo(() => {
    return node.type === "milestone" ? 0.7 : node.type === "start" || node.type === "finish" ? 0.8 : 0.5
  }, [node.type])

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={node.position} scale={scale}>
        {/* Main Node Sphere */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            node.onClick()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
            document.body.style.cursor = "auto"
          }}
          onDoubleClick={(e) => {
            e.stopPropagation()
            setShowDetails(!showDetails)
          }}
        >
          <sphereGeometry args={[nodeSize, 32, 32]} />
          <meshStandardMaterial
            color={node.completed ? emissiveColor : "#1a1a1a"}
            emissive={emissiveColor}
            emissiveIntensity={node.completed ? 2.0 : 0.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={node.completed ? 1 : 0.7}
          />
        </mesh>

        {/* Outer Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[nodeSize + 0.3, 0.08, 16, 100]} />
          <meshBasicMaterial 
            color={emissiveColor} 
            transparent 
            opacity={hovered ? 0.9 : 0.5}
            toneMapped={false}
          />
        </mesh>

        {/* Secondary Ring for Milestones */}
        {node.type === "milestone" && (
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
            <torusGeometry args={[nodeSize + 0.5, 0.05, 16, 100]} />
            <meshBasicMaterial 
              color={emissiveColor} 
              transparent 
              opacity={0.3}
            />
          </mesh>
        )}

        {/* Completion Check or Lock Icon */}
        {node.completed ? (
          <Sphere args={[0.25, 16, 16]} position={[0, 0, nodeSize + 0.2]}>
            <meshBasicMaterial color="#00ff00" toneMapped={false} />
          </Sphere>
        ) : node.type === "prereq" && (
          <Box args={[0.25, 0.25, 0.25]} position={[0, 0, nodeSize + 0.2]}>
            <meshBasicMaterial color="#ff006e" />
          </Box>
        )}

        {/* Pulsing Glow Effect */}
        <pointLight 
          position={[0, 0, 0]} 
          color={emissiveColor} 
          intensity={node.completed ? 3 : 1} 
          distance={3}
        />

        {/* Compact Label - Always Visible */}
        <Html
          position={[0, nodeSize + 0.8, 0]}
          center
          distanceFactor={6}
          style={{
            transition: "all 0.3s",
            opacity: 1,
            transform: hovered ? "scale(1.3)" : "scale(1)",
            pointerEvents: "none",
          }}
        >
          <div
            className="px-4 py-2 border-2 font-mono text-sm font-bold whitespace-nowrap backdrop-blur-md"
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              borderColor: emissiveColor,
              color: emissiveColor,
              boxShadow: `0 0 ${hovered ? "30px" : "15px"} ${emissiveColor}`,
              fontSize: hovered ? "14px" : "11px",
            }}
          >
            {node.title.length > 30 ? node.title.substring(0, 30) + "..." : node.title}
          </div>
        </Html>

        {/* Detailed Info Box - Show on Hover */}
        {(hovered || showDetails) && node.description && (
          <Html 
            position={[0, -nodeSize - 1.2, 0]} 
            center 
            distanceFactor={8}
            style={{
              pointerEvents: "none",
            }}
          >
            <div
              className="px-5 py-3 border-2 font-mono text-xs max-w-sm backdrop-blur-md animate-in fade-in"
              style={{
                background: "rgba(0, 0, 0, 0.98)",
                borderColor: emissiveColor,
                color: "#fff",
                boxShadow: `0 0 25px ${emissiveColor}`,
              }}
            >
              <div className="font-bold mb-2" style={{ color: emissiveColor }}>
                📖 {node.type.toUpperCase()}
              </div>
              <p className="text-gray-200 leading-relaxed">{node.description}</p>
              {node.completed && (
                <div className="mt-2 pt-2 border-t border-neon-green/30 text-neon-green text-xs">
                  ✓ Completed
                </div>
              )}
              <div className="mt-2 text-gray-500 text-xs italic">
                Double-click to pin details
              </div>
            </div>
          </Html>
        )}

        {/* Particle Effect for Completed Nodes */}
        {node.completed && (
          <>
            <Sphere args={[nodeSize + 0.5, 16, 16]} position={[0, 0, 0]}>
              <meshBasicMaterial 
                color={emissiveColor} 
                transparent 
                opacity={0.1} 
                side={THREE.BackSide}
              />
            </Sphere>
          </>
        )}
      </group>
    </Float>
  )
}

function RoadPath({ start, end, color, completed }: { start: [number, number, number]; end: [number, number, number]; color: string; completed?: boolean }) {
  const points = useMemo(() => {
    const midPoint = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 1.5,
      (start[2] + end[2]) / 2
    )
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      midPoint,
      new THREE.Vector3(...end),
    ])
    return curve.getPoints(50)
  }, [start, end])

  const lineColor = useMemo(() => {
    switch (color) {
      case "cyan": return "#00ffff"
      case "green": return "#00ff00"
      case "pink": return "#ff006e"
      case "yellow": return "#ffff00"
      default: return "#00ffff"
    }
  }, [color])

  return (
    <>
      <Line 
        points={points} 
        color={completed ? "#00ff41" : lineColor} 
        lineWidth={completed ? 3 : 1.5}
        transparent
        opacity={completed ? 1 : 0.6}
      />
      {completed && (
        <Line 
          points={points} 
          color={lineColor} 
          lineWidth={5}
          transparent
          opacity={0.2}
        />
      )}
    </>
  )
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150
      positions[i * 3 + 1] = (Math.random() - 0.5) * 150
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150
    }
    return positions
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2000} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

interface Roadmap3DEnhancedProps {
  studyPlan: StudyPlan
  progress: { [key: string]: boolean }
  onToggleProgress: (key: string) => void
}

export default function Roadmap3DEnhanced({ studyPlan, progress, onToggleProgress }: Roadmap3DEnhancedProps) {
  const [nodes, setNodes] = useState<RoadmapNode[]>([])
  const [paths, setPaths] = useState<Array<{ start: [number, number, number]; end: [number, number, number]; color: string; completed: boolean }>>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cameraZoom, setCameraZoom] = useState(15)
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useEffect(() => {
    // Generate node positions in an improved spiral/helix pattern
    const newNodes: RoadmapNode[] = []
    const newPaths: Array<{ start: [number, number, number]; end: [number, number, number]; color: string; completed: boolean }> = []
    let currentY = 0
    let currentAngle = 0
    const radius = 6
    const yStep = 2.5
    const angleStep = Math.PI / 2.5

    // Start node
    newNodes.push({
      id: "start",
      title: "🚀 START",
      position: [0, currentY, 0],
      color: "yellow",
      type: "start",
      completed: true,
      description: "Begin your learning journey! Click nodes to mark them complete.",
      onClick: () => {},
    })

    let lastPos: [number, number, number] = [0, currentY, 0]
    let lastCompleted = true

    // Prerequisites
    studyPlan.prerequisites.forEach((prereq, i) => {
      currentAngle += angleStep
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `prereq-${i}`
      const completed = progress[key] || false

      newNodes.push({
        id: key,
        title: prereq.title,
        position: pos,
        color: "cyan",
        type: "prereq",
        completed,
        description: `${prereq.description} | Duration: ${prereq.duration}`,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "cyan", completed: lastCompleted && completed })
      lastPos = pos
      lastCompleted = completed
    })

    // Core topics
    studyPlan.coreTopics.forEach((topic, i) => {
      currentAngle += angleStep
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `topic-${i}`
      const completed = progress[key] || false

      newNodes.push({
        id: key,
        title: topic.title,
        position: pos,
        color: "green",
        type: "core",
        completed,
        description: `${topic.description} | Duration: ${topic.duration}`,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "green", completed: lastCompleted && completed })
      lastPos = pos
      lastCompleted = completed
    })

    // Milestones
    studyPlan.progressSteps.forEach((step, i) => {
      currentAngle += angleStep
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `step-${i}`
      const completed = progress[key] || false

      newNodes.push({
        id: key,
        title: `Week ${step.week}`,
        position: pos,
        color: "pink",
        type: "milestone",
        completed,
        description: `${step.milestones[0] || step.topics[0]}`,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "pink", completed: lastCompleted && completed })
      lastPos = pos
      lastCompleted = completed
    })

    // Finish node
    currentAngle += angleStep
    currentY += yStep
    const finishPos: [number, number, number] = [0, currentY, 0]
    newNodes.push({
      id: "finish",
      title: "🎉 COMPLETE!",
      position: finishPos,
      color: "yellow",
      type: "finish",
      completed: false,
      description: "Congratulations! You've mastered the subject!",
      onClick: () => {},
    })
    newPaths.push({ start: lastPos, end: finishPos, color: "yellow", completed: lastCompleted })

    setNodes(newNodes)
    setPaths(newPaths)
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

  const resetCamera = () => {
    setCameraZoom(15)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const completedCount = nodes.filter((n) => n.completed).length
  const totalCount = nodes.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div
      ref={containerRef}
      className={`border-4 border-neon-cyan pixel-border bg-terminal-black relative overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[800px]"
      }`}
    >
      {/* Enhanced Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 border-2 border-neon-cyan bg-terminal-black/95 backdrop-blur-sm p-4 font-mono text-xs text-neon-cyan max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-neon-cyan animate-pulse"></div>
          <p className="font-bold text-base">🎮 3D CONTROLS</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-neon-green">🖱️</span>
            <div>
              <p className="font-bold">DRAG</p>
              <p className="text-gray-400">Rotate view</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-neon-green">🔍</span>
            <div>
              <p className="font-bold">SCROLL</p>
              <p className="text-gray-400">Zoom in/out</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-neon-green">👆</span>
            <div>
              <p className="font-bold">CLICK</p>
              <p className="text-gray-400">Mark complete</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-neon-green">👆👆</span>
            <div>
              <p className="font-bold">DOUBLE-CLICK</p>
              <p className="text-gray-400">Pin details</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-neon-green">⌨️</span>
            <div>
              <p className="font-bold">RIGHT DRAG</p>
              <p className="text-gray-400">Pan view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overlay */}
      <div className="absolute top-4 right-4 z-10 border-2 border-neon-green bg-terminal-black/95 backdrop-blur-sm p-4 font-mono text-xs min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-neon-green animate-pulse"></div>
          <p className="font-bold text-base text-neon-green">📊 PROGRESS</p>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Completion</span>
              <span className="text-neon-green font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 border border-neon-green/30">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-neon-cyan">
            <span className="font-bold text-lg">{completedCount}</span>
            <span className="text-gray-400"> / {totalCount}</span>
            <span className="text-gray-400 ml-1">Nodes</span>
          </div>
          <div className="pt-2 border-t border-neon-green/30 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Prerequisites</span>
              <span className="text-neon-cyan">
                {studyPlan.prerequisites.filter((_, i) => progress[`prereq-${i}`]).length}/{studyPlan.prerequisites.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Core Topics</span>
              <span className="text-neon-green">
                {studyPlan.coreTopics.filter((_, i) => progress[`topic-${i}`]).length}/{studyPlan.coreTopics.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Milestones</span>
              <span className="text-neon-pink">
                {studyPlan.progressSteps.filter((_, i) => progress[`step-${i}`]).length}/{studyPlan.progressSteps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end gap-2" style={{ marginTop: isFullscreen ? "0" : "220px" }}>
        <button
          onClick={toggleFullscreen}
          className="border-2 border-neon-pink bg-terminal-black/95 backdrop-blur-sm p-3 text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all font-bold flex items-center gap-2"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <button
          onClick={resetCamera}
          className="border-2 border-neon-yellow bg-terminal-black/95 backdrop-blur-sm p-3 text-pixel-yellow hover:bg-pixel-yellow hover:text-terminal-black transition-all font-bold flex items-center gap-2"
          title="Reset Camera"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <Canvas camera={{ position: [cameraZoom, cameraZoom, cameraZoom], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 20, 60]} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-15, -15, -15]} intensity={0.8} color="#ff006e" />
        <pointLight position={[0, 25, 0]} intensity={1} color="#00ffff" />
        <pointLight position={[15, 0, -15]} intensity={0.8} color="#00ff00" />

        <Stars />

        {/* Render paths */}
        {paths.map((path, i) => (
          <RoadPath key={i} start={path.start} end={path.end} color={path.color} completed={path.completed} />
        ))}

        {/* Render nodes */}
        {nodes.map((node) => (
          <RoadNode key={node.id} node={node} />
        ))}

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          maxDistance={100} 
          minDistance={2}
          autoRotate={false}
          autoRotateSpeed={0.5}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          enableDamping={true}
          dampingFactor={0.15}
        />
      </Canvas>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 z-10 border-2 border-neon-pink bg-terminal-black/95 backdrop-blur-sm p-4 font-mono text-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-neon-pink animate-pulse"></div>
          <p className="font-bold text-base text-neon-pink">🗺️ LEGEND</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-neon-cyan border-2 border-neon-cyan shadow-lg shadow-neon-cyan/50"></div>
            <span className="text-neon-cyan font-bold">Prerequisites</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-neon-green border-2 border-neon-green shadow-lg shadow-neon-green/50"></div>
            <span className="text-neon-green font-bold">Core Topics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-neon-pink border-2 border-neon-pink shadow-lg shadow-neon-pink/50"></div>
            <span className="text-neon-pink font-bold">Milestones</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-pixel-yellow border-2 border-pixel-yellow shadow-lg shadow-pixel-yellow/50"></div>
            <span className="text-pixel-yellow font-bold">Start/Finish</span>
          </div>
        </div>
      </div>

      {/* Completion Celebration */}
      {progressPercentage === 100 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          <div className="text-6xl font-bold text-neon-green animate-pulse">
            🎉 COMPLETED! 🎉
          </div>
        </div>
      )}
    </div>
  )
}
