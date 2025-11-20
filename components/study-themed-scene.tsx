"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text3D, OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei"
import * as THREE from "three"

// Floating Books
function FloatingBook({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Book pages */}
      <mesh position={[position[0] + 0.01, position[1], position[2] + 0.05]}>
        <boxGeometry args={[0.58, 0.78, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </Float>
  )
}

// Brain with particles
function BrainParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const positions = []
    const colors = []
    
    // Create brain-like particle cluster
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 1 + Math.random() * 0.5
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      
      positions.push(x, y, z)
      
      // Neon colors
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors.push(0, 1, 0.25) // Green
      } else if (colorChoice < 0.66) {
        colors.push(0, 0.88, 1) // Cyan
      } else {
        colors.push(1, 0, 0.9) // Pink
      }
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    }
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3))
    return geom
  }, [particles])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.03} vertexColors sizeAttenuation />
    </points>
  )
}

// Knowledge Network (connected nodes)
function KnowledgeNetwork() {
  const linesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const nodes = useMemo(() => {
    return [
      { pos: [2, 1, 0], color: "#00ff41" },
      { pos: [-2, 1, 0], color: "#ff00e6" },
      { pos: [0, -1.5, 1], color: "#00e1ff" },
      { pos: [1.5, 0, -1], color: "#ffea00" },
      { pos: [-1.5, -0.5, -1], color: "#00ff41" },
    ]
  }, [])

  return (
    <group ref={linesRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere args={[0.15, 16, 16]} position={node.pos as [number, number, number]}>
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
          </Sphere>
        </Float>
      ))}
      
      {/* Connection lines */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((otherNode, j) => {
          const points = [
            new THREE.Vector3(...node.pos),
            new THREE.Vector3(...otherNode.pos),
          ]
          const geom = new THREE.BufferGeometry().setFromPoints(points)
          
          return (
            <primitive
              key={`${i}-${j}`}
              object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#00ff41", opacity: 0.3, transparent: true }))}
            />
          )
        })
      )}
    </group>
  )
}

// Orbiting study icons
function OrbitingIcons() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const icons = [
    { angle: 0, color: "#00ff41", size: 0.3 },
    { angle: Math.PI / 2, color: "#ff00e6", size: 0.25 },
    { angle: Math.PI, color: "#00e1ff", size: 0.35 },
    { angle: (Math.PI * 3) / 2, color: "#ffea00", size: 0.28 },
  ]

  return (
    <group ref={groupRef}>
      {icons.map((icon, i) => {
        const x = Math.cos(icon.angle) * 3
        const z = Math.sin(icon.angle) * 3
        return (
          <mesh key={i} position={[x, 0, z]}>
            <octahedronGeometry args={[icon.size]} />
            <meshStandardMaterial color={icon.color} wireframe />
          </mesh>
        )
      })}
    </group>
  )
}

// Glowing Progress Ring
function ProgressRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.2
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial color="#00e1ff" emissive="#00e1ff" emissiveIntensity={0.5} wireframe />
    </mesh>
  )
}

export default function StudyThemedScene() {
  return (
    <div className="w-full h-[500px] md:h-[700px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ff41" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00e6" />
        <pointLight position={[0, 10, -10]} intensity={0.8} color="#00e1ff" />
        <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} color="#ffea00" />

        {/* Central Brain */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <BrainParticles />
        </Float>

        {/* Floating Books */}
        <FloatingBook position={[-3, 2, -2]} color="#00ff41" />
        <FloatingBook position={[3, -1, -1]} color="#ff00e6" />
        <FloatingBook position={[-2, -2, 1]} color="#00e1ff" />
        <FloatingBook position={[2.5, 1.5, 0]} color="#ffea00" />

        {/* Knowledge Network */}
        <KnowledgeNetwork />

        {/* Orbiting Icons */}
        <OrbitingIcons />

        {/* Progress Ring */}
        <ProgressRing />

        {/* Distorted sphere in background */}
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere args={[1.5, 64, 64]} position={[0, 0, -5]}>
            <MeshDistortMaterial
              color="#ffea00"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.3}
              metalness={0.8}
              opacity={0.3}
              transparent
            />
          </Sphere>
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
