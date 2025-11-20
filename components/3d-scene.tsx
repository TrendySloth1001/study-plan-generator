"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus } from "@react-three/drei"
import { useRef } from "react"
import type { Mesh } from "three"

function FloatingGeometry({ position, geometry, color }: any) {
  const meshRef = useRef<Mesh>(null)

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {geometry === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
        {geometry === "box" && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        {geometry === "torus" && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function WireframeBox({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Box args={[1, 1, 1]} position={position}>
        <meshBasicMaterial color="#00ff41" wireframe />
      </Box>
    </Float>
  )
}

function ParticleField() {
  const particlesRef = useRef<any>(null)

  // Create a grid of particles
  const particles = []
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 20
    const y = (Math.random() - 0.5) * 20
    const z = (Math.random() - 0.5) * 20
    particles.push({ x, y, z })
  }

  return (
    <group ref={particlesRef}>
      {particles.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#00e1ff" : i % 3 === 1 ? "#00ff41" : "#ff00e6"} />
        </mesh>
      ))}
    </group>
  )
}

export default function ThreeDScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="bg-transparent"
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ff41" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00e6" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#00e1ff" />

        {/* Floating geometries */}
        <FloatingGeometry position={[-2, 1, 0]} geometry="sphere" color="#00e1ff" />
        <FloatingGeometry position={[2, -1, 0]} geometry="torus" color="#ff00e6" />
        <FloatingGeometry position={[0, 2, -2]} geometry="box" color="#00ff41" />
        
        {/* Wireframe boxes */}
        <WireframeBox position={[-3, -2, -1]} />
        <WireframeBox position={[3, 2, -1]} />

        {/* Particle field */}
        <ParticleField />

        {/* Central distorted sphere */}
        <Float speed={1} rotationIntensity={1} floatIntensity={0.5}>
          <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
            <MeshDistortMaterial
              color="#ffea00"
              attach="material"
              distort={0.5}
              speed={3}
              roughness={0}
              metalness={1}
            />
          </Sphere>
        </Float>

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
