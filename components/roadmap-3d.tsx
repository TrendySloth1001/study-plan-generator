"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Float, Line, Sphere, Box, Html } from "@react-three/drei"
import * as THREE from "three"
import type { StudyPlan } from "@/lib/types"
import { Check, Lock } from "lucide-react"

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

function RoadNode({ node }: { node: RoadmapNode }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
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

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={node.position}>
        {/* Main Node Sphere */}
        <mesh
          ref={meshRef}
          onClick={node.onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={node.completed ? emissiveColor : "#333333"}
            emissive={emissiveColor}
            emissiveIntensity={node.completed ? 1.5 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Outer Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.05, 16, 100]} />
          <meshBasicMaterial color={emissiveColor} transparent opacity={0.6} />
        </mesh>

        {/* Completion Check or Lock Icon */}
        {node.completed ? (
          <Sphere args={[0.3, 16, 16]} position={[0, 0, 0.6]}>
            <meshBasicMaterial color="#00ff00" />
          </Sphere>
        ) : node.type === "prereq" && (
          <Box args={[0.3, 0.3, 0.3]} position={[0, 0, 0.6]}>
            <meshBasicMaterial color="#ff006e" />
          </Box>
        )}

        {/* Label */}
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={8}
          style={{
            transition: "all 0.2s",
            opacity: hovered ? 1 : 0.8,
            transform: hovered ? "scale(1.2)" : "scale(1)",
          }}
        >
          <div
            className="px-3 py-2 border-2 font-mono text-xs font-bold whitespace-nowrap pointer-events-none"
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              borderColor: emissiveColor,
              color: emissiveColor,
              boxShadow: `0 0 20px ${emissiveColor}`,
            }}
          >
            {node.title}
          </div>
        </Html>

        {/* Hover Info Box */}
        {hovered && node.description && (
          <Html position={[0, -1.5, 0]} center distanceFactor={10}>
            <div
              className="px-4 py-2 border-2 font-mono text-xs max-w-xs"
              style={{
                background: "rgba(0, 0, 0, 0.95)",
                borderColor: emissiveColor,
                color: "#fff",
              }}
            >
              {node.description}
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

function RoadPath({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1, (start[2] + end[2]) / 2),
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

  return <Line points={points} color={lineColor} lineWidth={2} />
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

interface Roadmap3DProps {
  studyPlan: StudyPlan
  progress: { [key: string]: boolean }
  onToggleProgress: (key: string) => void
}

export default function Roadmap3D({ studyPlan, progress, onToggleProgress }: Roadmap3DProps) {
  const [nodes, setNodes] = useState<RoadmapNode[]>([])
  const [paths, setPaths] = useState<Array<{ start: [number, number, number]; end: [number, number, number]; color: string }>>([])

  useEffect(() => {
    // Generate node positions in a spiral/helix pattern
    const newNodes: RoadmapNode[] = []
    const newPaths: Array<{ start: [number, number, number]; end: [number, number, number]; color: string }> = []
    let currentY = 0
    let currentAngle = 0
    const radius = 5
    const yStep = 2

    // Start node
    newNodes.push({
      id: "start",
      title: "START",
      position: [0, currentY, 0],
      color: "yellow",
      type: "start",
      completed: true,
      description: "Begin your learning journey!",
      onClick: () => {},
    })

    let lastPos: [number, number, number] = [0, currentY, 0]

    // Prerequisites
    studyPlan.prerequisites.forEach((prereq, i) => {
      currentAngle += Math.PI / 3
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `prereq-${i}`

      newNodes.push({
        id: key,
        title: prereq.title,
        position: pos,
        color: "cyan",
        type: "prereq",
        completed: progress[key] || false,
        description: prereq.description,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "cyan" })
      lastPos = pos
    })

    // Core topics
    studyPlan.coreTopics.forEach((topic, i) => {
      currentAngle += Math.PI / 3
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `topic-${i}`

      newNodes.push({
        id: key,
        title: topic.title,
        position: pos,
        color: "green",
        type: "core",
        completed: progress[key] || false,
        description: topic.description,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "green" })
      lastPos = pos
    })

    // Milestones
    studyPlan.progressSteps.forEach((step, i) => {
      currentAngle += Math.PI / 3
      currentY += yStep
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const pos: [number, number, number] = [x, currentY, z]
      const key = `step-${i}`

      newNodes.push({
        id: key,
        title: `Week ${step.week}`,
        position: pos,
        color: "pink",
        type: "milestone",
        completed: progress[key] || false,
        description: step.milestones[0] || `Week ${step.week} milestone`,
        onClick: () => onToggleProgress(key),
      })

      newPaths.push({ start: lastPos, end: pos, color: "pink" })
      lastPos = pos
    })

    // Finish node
    currentAngle += Math.PI / 3
    currentY += yStep
    const finishPos: [number, number, number] = [0, currentY, 0]
    newNodes.push({
      id: "finish",
      title: "COMPLETE!",
      position: finishPos,
      color: "yellow",
      type: "finish",
      completed: false,
      description: "You've mastered the subject!",
      onClick: () => {},
    })
    newPaths.push({ start: lastPos, end: finishPos, color: "yellow" })

    setNodes(newNodes)
    setPaths(newPaths)
  }, [studyPlan, progress, onToggleProgress])

  return (
    <div className="w-full h-[800px] border-4 border-neon-cyan pixel-border bg-terminal-black relative overflow-hidden">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 border-2 border-neon-cyan bg-terminal-black/90 p-3 font-mono text-xs text-neon-cyan">
        <p className="font-bold mb-2">🎮 CONTROLS</p>
        <p>🖱️ Drag: Rotate</p>
        <p>🔍 Scroll: Zoom</p>
        <p>👆 Click: Mark Complete</p>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 z-10 border-2 border-neon-green bg-terminal-black/90 p-3 font-mono text-xs text-neon-green">
        <p className="font-bold mb-2">📊 PROGRESS</p>
        <p>
          {nodes.filter((n) => n.completed).length} / {nodes.length} Nodes
        </p>
        <p>
          {Math.round((nodes.filter((n) => n.completed).length / nodes.length) * 100)}% Complete
        </p>
      </div>

      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff006e" />
        <pointLight position={[0, 20, 0]} intensity={0.5} color="#00ffff" />

        <Stars />

        {/* Render paths */}
        {paths.map((path, i) => (
          <RoadPath key={i} start={path.start} end={path.end} color={path.color} />
        ))}

        {/* Render nodes */}
        {nodes.map((node) => (
          <RoadNode key={node.id} node={node} />
        ))}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={30} minDistance={5} />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 border-2 border-neon-pink bg-terminal-black/90 p-3 font-mono text-xs">
        <p className="font-bold mb-2 text-neon-pink">🗺️ LEGEND</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-neon-cyan"></div>
          <span className="text-neon-cyan">Prerequisites</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-neon-green"></div>
          <span className="text-neon-green">Core Topics</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-neon-pink"></div>
          <span className="text-neon-pink">Milestones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pixel-yellow"></div>
          <span className="text-pixel-yellow">Start/Finish</span>
        </div>
      </div>
    </div>
  )
}
