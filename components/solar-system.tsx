"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Sphere, OrbitControls, Stars, MeshDistortMaterial, Sparkles, useTexture, Torus } from "@react-three/drei"
import * as THREE from "three"

// Sun with corona and surface details
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = -state.clock.elapsedTime * 0.03
      coronaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Main sun body with distortion for realistic surface */}
      <mesh ref={sunRef}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#ffa500"
            emissive="#ff6b00"
            emissiveIntensity={3}
            distort={0.15}
            speed={1}
            roughness={0.8}
            toneMapped={false}
          />
        </Sphere>
      </mesh>

      {/* Corona layer */}
      <mesh ref={coronaRef}>
        <Sphere args={[1.4, 32, 32]}>
          <meshBasicMaterial
            color="#ffea00"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <Sphere args={[1.8, 32, 32]}>
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
      </mesh>

      {/* Sun particles/flares */}
      <Sparkles count={100} scale={3} size={3} speed={0.3} color="#ffea00" />

      {/* Lens flare halos */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Powerful sun light */}
      <pointLight position={[0, 0, 0]} intensity={4} color="#ffea00" distance={50} decay={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ff6b00" distance={30} />
    </group>
  )
}

// Enhanced Planet component with atmosphere and better textures
interface PlanetProps {
  size: number
  color: string
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  hasRing?: boolean
  moons?: number
  hasAtmosphere?: boolean
  hasClouds?: boolean
  emissiveIntensity?: number
}

function Planet({ 
  size, 
  color, 
  orbitRadius, 
  orbitSpeed, 
  rotationSpeed, 
  hasRing, 
  moons,
  hasAtmosphere = false,
  hasClouds = false,
  emissiveIntensity = 0.3
}: PlanetProps) {
  const planetRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * orbitSpeed
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 1.05
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.5
    }
  })

  return (
    <group ref={planetRef}>
      <group position={[orbitRadius, 0, 0]}>
        {/* Main planet with enhanced materials */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <Sphere args={[size, 64, 64]}>
            <MeshDistortMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              metalness={0.3}
              roughness={0.7}
              distort={0.05}
              speed={0.5}
            />
          </Sphere>
        </mesh>

        {/* Clouds layer */}
        {hasClouds && (
          <mesh ref={cloudsRef}>
            <Sphere args={[size * 1.01, 32, 32]}>
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.4}
                roughness={0.9}
              />
            </Sphere>
          </mesh>
        )}

        {/* Atmosphere glow */}
        {hasAtmosphere && (
          <mesh ref={atmosphereRef}>
            <Sphere args={[size * 1.15, 32, 32]}>
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                side={THREE.BackSide}
              />
            </Sphere>
          </mesh>
        )}

        {/* Enhanced ring system with multiple layers */}
        {hasRing && (
          <group rotation={[Math.PI / 2.2, 0, 0.1]}>
            {/* Main ring */}
            <mesh castShadow receiveShadow>
              <ringGeometry args={[size * 1.5, size * 2.2, 128]} />
              <meshStandardMaterial
                color={color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
            {/* Inner ring */}
            <mesh>
              <ringGeometry args={[size * 1.3, size * 1.48, 128]} />
              <meshStandardMaterial
                color={color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
                roughness={0.8}
              />
            </mesh>
            {/* Outer ring */}
            <mesh>
              <ringGeometry args={[size * 2.25, size * 2.5, 128]} />
              <meshStandardMaterial
                color={color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.3}
                roughness={0.9}
              />
            </mesh>
          </group>
        )}

        {/* Planet glow */}
        <pointLight position={[0, 0, 0]} intensity={emissiveIntensity * 0.5} color={color} distance={size * 3} />

        {/* Moons */}
        {moons && moons > 0 && (
          <>
            <Moon parentRadius={size} speed={orbitSpeed * 3} distance={size * 2.5} index={0} />
            {moons > 1 && <Moon parentRadius={size} speed={orbitSpeed * 2.5} distance={size * 3} index={1} />}
          </>
        )}
      </group>
    </group>
  )
}

// Enhanced Moon component
function Moon({ 
  parentRadius, 
  speed, 
  distance, 
  index = 0 
}: { 
  parentRadius: number
  speed: number
  distance: number
  index?: number
}) {
  const moonRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * speed + (index * Math.PI)
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  const moonSize = parentRadius * 0.25
  const moonColor = index === 0 ? "#d4d4d4" : "#b8b8b8"

  return (
    <group ref={moonRef}>
      <mesh ref={meshRef} position={[distance, 0, 0]} castShadow>
        <Sphere args={[moonSize, 32, 32]}>
          <meshStandardMaterial
            color={moonColor}
            roughness={0.9}
            metalness={0.1}
          />
        </Sphere>
      </mesh>
    </group>
  )
}

// Enhanced orbit rings with glow effect
function OrbitRing({ radius, opacity = 0.25 }: { radius: number; opacity?: number }) {
  const points = []
  for (let i = 0; i <= 256; i++) {
    const angle = (i / 256) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ 
    color: "#00ff41", 
    opacity: opacity, 
    transparent: true,
    linewidth: 2
  })

  return (
    <group>
      <primitive object={new THREE.Line(geometry, material)} />
      {/* Add subtle torus for better visibility */}
      <Torus args={[radius, 0.01, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00ff41" transparent opacity={opacity * 0.3} />
      </Torus>
    </group>
  )
}

// Enhanced asteroid belt with varied shapes and sizes
function AsteroidBelt() {
  const asteroidRef = useRef<THREE.Group>(null)

  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const radius = 8 + Math.sin(i * 3) * 0.8 + (Math.random() - 0.5) * 0.4
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 0.4
      const size = 0.015 + Math.random() * 0.055
      const rotationSpeed = (Math.random() - 0.5) * 0.5
      const shape = Math.random() > 0.5 ? 'dodecahedron' : 'icosahedron'
      const color = ['#888888', '#6b6b6b', '#9a9a9a', '#7d7d7d'][Math.floor(Math.random() * 4)]
      temp.push({ position: [x, y, z], size, rotationSpeed, shape, color })
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
        <mesh 
          key={i} 
          position={asteroid.position as [number, number, number]}
          rotation={[
            Math.sin(i) * Math.PI, 
            Math.cos(i) * Math.PI, 
            i * 0.1
          ]}
        >
          {asteroid.shape === 'dodecahedron' ? (
            <dodecahedronGeometry args={[asteroid.size, 0]} />
          ) : (
            <icosahedronGeometry args={[asteroid.size, 0]} />
          )}
          <meshStandardMaterial 
            color={asteroid.color} 
            roughness={0.95} 
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Shooting star/comet effect
function ShootingStar() {
  const cometRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Line>(null)
  
  const startPosition = useMemo(() => {
    return new THREE.Vector3(
      Math.random() * 40 - 20,
      Math.random() * 20 + 10,
      Math.random() * 40 - 20
    )
  }, [])

  const direction = useMemo(() => {
    return new THREE.Vector3(
      Math.random() - 0.5,
      -(Math.random() * 0.3 + 0.5),
      Math.random() - 0.5
    ).normalize()
  }, [])

  useFrame((state, delta) => {
    if (cometRef.current && trailRef.current) {
      const speed = 15
      cometRef.current.position.addScaledVector(direction, speed * delta)
      
      // Reset if too far
      if (cometRef.current.position.length() > 50) {
        cometRef.current.position.copy(startPosition)
      }

      // Update trail
      const positions = trailRef.current.geometry.attributes.position
      const trailLength = 20
      for (let i = 0; i < trailLength; i++) {
        const idx = i * 3
        const offset = direction.clone().multiplyScalar(-i * 0.2)
        const trailPos = cometRef.current.position.clone().add(offset)
        positions.array[idx] = trailPos.x
        positions.array[idx + 1] = trailPos.y
        positions.array[idx + 2] = trailPos.z
      }
      positions.needsUpdate = true
    }
  })

  const trailGeometry = useMemo(() => {
    const positions = new Float32Array(20 * 3)
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [])

  return (
    <group>
      <mesh ref={cometRef} position={startPosition}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight intensity={2} distance={5} color="#ffffff" />
      </mesh>
      <primitive object={new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({
        color: '#88ccff',
        transparent: true,
        opacity: 0.6,
      }))} ref={trailRef} />
    </group>
  )
}

// Space nebula background for added depth
function SpaceNebula() {
  const nebulaRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3)
    const colors = new Float32Array(500 * 3)
    const nebulaColors = [
      [0.4, 0.2, 0.8], // Purple
      [0.2, 0.5, 0.9], // Blue
      [0.8, 0.3, 0.5], // Pink
      [0.1, 0.3, 0.6], // Deep blue
    ]

    for (let i = 0; i < 500; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 30 + Math.random() * 50
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      const colorIndex = Math.floor(Math.random() * nebulaColors.length)
      const color = nebulaColors[colorIndex]
      colors[i3] = color[0]
      colors[i3 + 1] = color[1]
      colors[i3 + 2] = color[2]
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = state.clock.elapsedTime * 0.001
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3))
    return geom
  }, [particles])

  return (
    <points ref={nebulaRef} geometry={geometry}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Learning-themed labels
function PlanetLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[2, 0.5]} />
      <meshBasicMaterial color="#00ff41" transparent opacity={0.8} />
    </mesh>
  )
}

export default function SolarSystemScene() {
  return (
    <div className="w-full h-[600px] md:h-[800px] relative">
      <Canvas 
        camera={{ position: [0, 15, 15], fov: 60 }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[0, 5, 0]} 
          intensity={0.5} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <SpaceNebula />
        
        {/* Shooting stars for dynamic effect */}
        <ShootingStar />
        <ShootingStar />
        <ShootingStar />

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
        {/* Mercury - Beginner (no atmosphere) */}
        <Planet 
          size={0.15} 
          color="#00e1ff" 
          orbitRadius={2.5} 
          orbitSpeed={0.8} 
          rotationSpeed={1.5}
          emissiveIntensity={0.3}
        />

        {/* Venus - Foundation (thick atmosphere) */}
        <Planet 
          size={0.25} 
          color="#ff00e6" 
          orbitRadius={4} 
          orbitSpeed={0.6} 
          rotationSpeed={1.2}
          hasAtmosphere={true}
          hasClouds={true}
          emissiveIntensity={0.4}
        />

        {/* Earth - Core Learning (atmosphere + clouds) */}
        <Planet 
          size={0.3} 
          color="#00ff41" 
          orbitRadius={5.5} 
          orbitSpeed={0.5} 
          rotationSpeed={1} 
          moons={1}
          hasAtmosphere={true}
          hasClouds={true}
          emissiveIntensity={0.3}
        />

        {/* Mars - Practice (thin atmosphere) */}
        <Planet 
          size={0.2} 
          color="#ff4444" 
          orbitRadius={7} 
          orbitSpeed={0.4} 
          rotationSpeed={0.9}
          hasAtmosphere={true}
          emissiveIntensity={0.2}
        />

        {/* Asteroid Belt - Challenges */}
        <AsteroidBelt />

        {/* Jupiter - Advanced Topics (gas giant) */}
        <Planet 
          size={0.6} 
          color="#ffaa00" 
          orbitRadius={10} 
          orbitSpeed={0.25} 
          rotationSpeed={0.7} 
          moons={2}
          hasAtmosphere={true}
          hasClouds={true}
          emissiveIntensity={0.5}
        />

        {/* Saturn - Mastery (gas giant with rings) */}
        <Planet 
          size={0.5} 
          color="#ffea00" 
          orbitRadius={12} 
          orbitSpeed={0.2} 
          rotationSpeed={0.6} 
          hasRing 
          moons={1}
          hasAtmosphere={true}
          hasClouds={true}
          emissiveIntensity={0.5}
        />

        {/* Uranus - Specialization (ice giant) */}
        <Planet 
          size={0.35} 
          color="#00ffff" 
          orbitRadius={14} 
          orbitSpeed={0.15} 
          rotationSpeed={0.8}
          hasAtmosphere={true}
          emissiveIntensity={0.4}
        />

        {/* Neptune - Expertise (ice giant) */}
        <Planet 
          size={0.35} 
          color="#4444ff" 
          orbitRadius={16} 
          orbitSpeed={0.1} 
          rotationSpeed={0.75}
          hasAtmosphere={true}
          emissiveIntensity={0.4}
        />

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
