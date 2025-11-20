"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls, Stars, Trail } from "@react-three/drei"
import * as THREE from "three"

// Sun
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <mesh ref={sunRef}>
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#ffea00"
          emissive="#ffea00"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>
      {/* Sun glow */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffea00" distance={30} />
    </mesh>
  )
}

// Planet component
interface PlanetProps {
  size: number
  color: string
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  hasRing?: boolean
  moons?: number
}

function Planet({ size, color, orbitRadius, orbitSpeed, rotationSpeed, hasRing, moons }: PlanetProps) {
  const planetRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * orbitSpeed
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
    }
  })

  return (
    <group ref={planetRef}>
      <group position={[orbitRadius, 0, 0]}>
        <mesh ref={meshRef}>
          <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
              metalness={0.5}
              roughness={0.5}
            />
          </Sphere>
        </mesh>

        {/* Ring for Saturn-like planet */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 2, 64]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}

        {/* Moons */}
        {moons && moons > 0 && (
          <Moon parentRadius={size} speed={orbitSpeed * 3} distance={size * 2} />
        )}
      </group>
    </group>
  )
}

// Moon component
function Moon({ parentRadius, speed, distance }: { parentRadius: number; speed: number; distance: number }) {
  const moonRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  return (
    <group ref={moonRef}>
      <mesh position={[distance, 0, 0]}>
        <Sphere args={[parentRadius * 0.3, 16, 16]}>
          <meshStandardMaterial color="#cccccc" />
        </Sphere>
      </mesh>
    </group>
  )
}

// Orbit rings
function OrbitRing({ radius }: { radius: number }) {
  const points = []
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: "#00ff41", opacity: 0.2, transparent: true })

  return <primitive object={new THREE.Line(geometry, material)} />
}

// Asteroid belt
function AsteroidBelt() {
  const asteroidRef = useRef<THREE.Group>(null)

  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2
      const radius = 8 + Math.sin(i) * 0.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 0.3
      const size = 0.02 + Math.random() * 0.04
      temp.push({ position: [x, y, z], size })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={asteroidRef}>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position as [number, number, number]}>
          <dodecahedronGeometry args={[asteroid.size, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Learning-themed labels
function PlanetLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[1, 0.3]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.7} />
    </mesh>
  )
}

export default function SolarSystemScene() {
  return (
    <div className="w-full h-[600px] md:h-[800px] relative">
      <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Sun */}
        <Sun />

        {/* Orbit rings */}
        <OrbitRing radius={2.5} />
        <OrbitRing radius={4} />
        <OrbitRing radius={5.5} />
        <OrbitRing radius={7} />
        <OrbitRing radius={10} />
        <OrbitRing radius={12} />
        <OrbitRing radius={14} />

        {/* Planets - representing learning journey stages */}
        {/* Mercury - Beginner */}
        <Planet size={0.15} color="#00e1ff" orbitRadius={2.5} orbitSpeed={0.8} rotationSpeed={1.5} />

        {/* Venus - Foundation */}
        <Planet size={0.25} color="#ff00e6" orbitRadius={4} orbitSpeed={0.6} rotationSpeed={1.2} />

        {/* Earth - Core Learning */}
        <Planet size={0.3} color="#00ff41" orbitRadius={5.5} orbitSpeed={0.5} rotationSpeed={1} moons={1} />

        {/* Mars - Practice */}
        <Planet size={0.2} color="#ff4444" orbitRadius={7} orbitSpeed={0.4} rotationSpeed={0.9} />

        {/* Asteroid Belt - Challenges */}
        <AsteroidBelt />

        {/* Jupiter - Advanced Topics */}
        <Planet size={0.6} color="#ffaa00" orbitRadius={10} orbitSpeed={0.25} rotationSpeed={0.7} moons={2} />

        {/* Saturn - Mastery */}
        <Planet size={0.5} color="#ffea00" orbitRadius={12} orbitSpeed={0.2} rotationSpeed={0.6} hasRing moons={1} />

        {/* Uranus - Specialization */}
        <Planet size={0.35} color="#00ffff" orbitRadius={14} orbitSpeed={0.15} rotationSpeed={0.8} />

        {/* Neptune - Expertise */}
        <Planet size={0.35} color="#4444ff" orbitRadius={16} orbitSpeed={0.1} rotationSpeed={0.75} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 right-8 bg-terminal-black/80 border-2 border-neon-cyan p-4 backdrop-blur-sm">
        <h3 className="text-neon-cyan text-xl font-bold mb-3 neon-glow">YOUR LEARNING JOURNEY</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00e1ff]"></div>
            <span className="text-gray-300">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff00e6]"></div>
            <span className="text-gray-300">Foundation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff41]"></div>
            <span className="text-gray-300">Core Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff4444]"></div>
            <span className="text-gray-300">Practice</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>
            <span className="text-gray-300">Advanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffea00]"></div>
            <span className="text-gray-300">Mastery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ffff]"></div>
            <span className="text-gray-300">Specialization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4444ff]"></div>
            <span className="text-gray-300">Expertise</span>
          </div>
        </div>
      </div>
    </div>
  )
}
