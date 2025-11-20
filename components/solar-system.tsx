"use client"

import React, { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useLoader, ThreeEvent } from "@react-three/fiber"
import { Sphere, OrbitControls, Stars, MeshDistortMaterial, Sparkles, useTexture, Torus, Html } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
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

      {/* Solar flares - more dramatic */}
      <Sparkles count={200} scale={4} size={4} speed={0.5} color="#ffea00" opacity={0.8} />
      
      {/* Additional flare bursts */}
      <Sparkles count={50} scale={2} size={6} speed={0.8} color="#ff6b00" opacity={0.6} />

      {/* Multi-layer lens flare halos */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Realistic inverse-square lighting */}
      <pointLight position={[0, 0, 0]} intensity={5} color="#ffea00" distance={50} decay={2} castShadow />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff6b00" distance={35} decay={2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffa500" distance={25} decay={2} />
    </group>
  )
}

// Planet information interface
interface PlanetInfo {
  name: string
  description: string
  stage: string
  facts: string[]
  color: string
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
  info: PlanetInfo
  onSelect: (info: PlanetInfo | null) => void
  mass?: number // For realistic gravity calculations
  axialTilt?: number // Tilt in degrees
  hasStripes?: boolean // For gas giants
  hasCraters?: boolean // For rocky planets
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
  emissiveIntensity = 0.3,
  info,
  onSelect,
  mass = 1,
  axialTilt = 0,
  hasStripes = false,
  hasCraters = false
}: PlanetProps) {
  const planetRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const trailPoints = useRef<THREE.Vector3[]>([])
  const trailRef = useRef<THREE.Line>(null)

  useFrame((state, delta) => {
    // Access time control from global state (will be set by TimeControl component)
    const timeScale = (window as any).__solarSystemTimeScale || 1
    const isPaused = (window as any).__solarSystemPaused || false
    
    if (!isPaused && planetRef.current) {
      // Realistic elliptical orbit using Kepler's laws
      // Closer planets orbit faster (inverse-square relationship)
      const time = state.clock.elapsedTime * orbitSpeed * timeScale
      const eccentricity = 0.08 // Realistic ellipse
      const a = orbitRadius // Semi-major axis
      const b = a * Math.sqrt(1 - eccentricity * eccentricity) // Semi-minor axis
      
      // Calculate position on ellipse
      const x = a * Math.cos(time) * (1 - eccentricity)
      const z = b * Math.sin(time)
      
      // Calculate distance from sun (at origin)
      const distance = Math.sqrt(x * x + z * z)
      
      // Kepler's law: speed ∝ 1/√distance (faster when closer)
      const speedMultiplier = Math.sqrt(orbitRadius / distance)
      
      planetRef.current.position.x = x
      planetRef.current.position.z = z
      
      // Record trail points (keep last 200 positions)
      if (state.clock.elapsedTime % 0.1 < delta) {
        trailPoints.current.push(new THREE.Vector3(x, 0, z))
        if (trailPoints.current.length > 200) {
          trailPoints.current.shift()
        }
        
        // Update trail geometry
        if (trailRef.current && trailPoints.current.length > 1) {
          const geometry = new THREE.BufferGeometry().setFromPoints(trailPoints.current)
          trailRef.current.geometry.dispose()
          trailRef.current.geometry = geometry
        }
      }
    }
    
    if (meshRef.current) {
      // Realistic rotation with axial tilt
      const timeScale = (window as any).__solarSystemTimeScale || 1
      const isPaused = (window as any).__solarSystemPaused || false
      
      if (!isPaused) {
        meshRef.current.rotation.y += rotationSpeed * delta * timeScale
      }
      
      if (axialTilt) {
        meshRef.current.rotation.z = (axialTilt * Math.PI) / 180
      }
    }
    if (cloudsRef.current) {
      const timeScale = (window as any).__solarSystemTimeScale || 1
      const isPaused = (window as any).__solarSystemPaused || false
      if (!isPaused) {
        cloudsRef.current.rotation.y += rotationSpeed * 1.08 * delta * timeScale
      }
    }
    if (atmosphereRef.current) {
      const timeScale = (window as any).__solarSystemTimeScale || 1
      const isPaused = (window as any).__solarSystemPaused || false
      if (!isPaused) {
        atmosphereRef.current.rotation.y += rotationSpeed * 0.5 * delta * timeScale
      }
    }
  })

  // Initialize trail geometry
  const initialTrailGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)])
  }, [])

  return (
    <>
      {/* Dynamic orbital trail */}
      <primitive 
        object={new THREE.Line(
          initialTrailGeometry, 
          new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
          })
        )} 
        ref={trailRef}
      />
      
      <group ref={planetRef}>
        {/* Data visualization particles when hovered */}
        {hovered && (
          <Sparkles
            count={50}
            scale={size * 3}
            size={2}
            speed={0.4}
            color={color}
            opacity={0.6}
          />
        )}
        
        <group>
        {/* Main planet with enhanced materials */}
        <mesh 
          ref={meshRef} 
          castShadow 
          receiveShadow
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onSelect(info)
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <Sphere args={[size, 128, 128]}>
            {hasCraters ? (
              // Rocky planet with craters (Mercury, Mars)
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? emissiveIntensity * 1.5 : emissiveIntensity}
                metalness={0.1}
                roughness={0.95}
              />
            ) : (
              // Gas giant or Earth-like with distortion
              <MeshDistortMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? emissiveIntensity * 1.5 : emissiveIntensity}
                metalness={0.2}
                roughness={0.8}
                distort={hasStripes ? 0.08 : 0.05}
                speed={hovered ? 1.2 : 0.6}
              />
            )}
          </Sphere>
        </mesh>
        
        {/* Gas giant stripe layer */}
        {hasStripes && (
          <mesh rotation={meshRef.current?.rotation}>
            <Sphere args={[size * 1.001, 128, 128]}>
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.3}
                roughness={0.9}
                metalness={0.0}
              />
            </Sphere>
          </mesh>
        )}
        
        {/* Crater bump layer for rocky planets */}
        {hasCraters && (
          <mesh rotation={meshRef.current?.rotation}>
            <Sphere args={[size * 1.003, 128, 128]}>
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.2}
                roughness={1.0}
                metalness={0.0}
              />
            </Sphere>
          </mesh>
        )}

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

        {/* Atmosphere with Rayleigh scattering effect */}
        {hasAtmosphere && (
          <>
            <mesh ref={atmosphereRef}>
              <Sphere args={[size * 1.12, 64, 64]}>
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.25}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                />
              </Sphere>
            </mesh>
            {/* Outer atmosphere layer */}
            <mesh>
              <Sphere args={[size * 1.18, 64, 64]}>
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.08}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                />
              </Sphere>
            </mesh>
          </>
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
    </>
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

// Enhanced orbit rings with glow effect and markers
function OrbitRing({ radius, opacity = 0.25 }: { radius: number; opacity?: number }) {
  const ringRef = useRef<THREE.Group>(null)
  
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

  useFrame((state) => {
    if (ringRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + opacity
      material.opacity = pulse
    }
  })

  return (
    <group ref={ringRef}>
      <primitive object={new THREE.Line(geometry, material)} />
      {/* Add subtle torus for better visibility */}
      <Torus args={[radius, 0.01, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00ff41" transparent opacity={opacity * 0.3} />
      </Torus>
      
      {/* Orbital markers at cardinal points */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="#00e1ff"
            transparent
            opacity={opacity * 2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Enhanced asteroid belt with varied shapes and sizes
function AsteroidBelt() {
  const asteroidRef = useRef<THREE.Group>(null)

  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 300; i++) {
      const angle = (i / 300) * Math.PI * 2
      const radius = 8 + Math.sin(i * 3) * 0.8 + (Math.random() - 0.5) * 0.4
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 0.4
      const size = 0.015 + Math.random() * 0.055
      const rotationSpeed = (Math.random() - 0.5) * 0.5
      const shape = Math.random() > 0.5 ? 'dodecahedron' : 'icosahedron'
      const colors = ['#888888', '#6b6b6b', '#9a9a9a', '#7d7d7d', '#b89968', '#8b7355']
      const color = colors[Math.floor(Math.random() * colors.length)]
      const metalness = Math.random() > 0.7 ? 0.6 : 0.1
      temp.push({ position: [x, y, z], size, rotationSpeed, shape, color, metalness })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const asteroidRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
    
    // Individual asteroid rotations
    asteroidRefs.current.forEach((mesh, i) => {
      if (mesh && asteroids[i]) {
        mesh.rotation.x += asteroids[i].rotationSpeed * 0.01
        mesh.rotation.y += asteroids[i].rotationSpeed * 0.015
      }
    })
  })

  return (
    <group ref={asteroidRef}>
      {asteroids.map((asteroid, i) => (
        <mesh 
          key={i}
          ref={(el) => {
            if (el) asteroidRefs.current[i] = el
          }}
          position={asteroid.position as [number, number, number]}
          castShadow
        >
          {asteroid.shape === 'dodecahedron' ? (
            <dodecahedronGeometry args={[asteroid.size, 0]} />
          ) : (
            <icosahedronGeometry args={[asteroid.size, 0]} />
          )}
          <meshStandardMaterial 
            color={asteroid.color} 
            roughness={0.95} 
            metalness={asteroid.metalness}
            emissive={asteroid.metalness > 0.5 ? '#4a4a4a' : '#000000'}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Shooting star/comet effect with spherical trail
function ShootingStar() {
  const cometRef = useRef<THREE.Group>(null)
  
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
    if (cometRef.current) {
      const speed = 15
      cometRef.current.position.addScaledVector(direction, speed * delta)
      
      // Reset if too far
      if (cometRef.current.position.length() > 50) {
        cometRef.current.position.copy(startPosition)
      }
    }
  })

  return (
    <group ref={cometRef} position={startPosition}>
      {/* Comet head */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight intensity={3} distance={8} color="#88ccff" />
      </mesh>
      
      {/* Trail spheres */}
      {Array.from({ length: 8 }).map((_, i) => {
        const offset = direction.clone().multiplyScalar(-i * 0.3)
        const size = 0.12 - i * 0.012
        const opacity = 0.8 - i * 0.09
        
        return (
          <mesh key={i} position={[offset.x, offset.y, offset.z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial
              color="#88ccff"
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Orbital trail visualization
function OrbitalTrail({ radius, color, segments = 512 }: { radius: number; color: string; segments?: number }) {
  const points = useMemo(() => {
    const pts = []
    const eccentricity = 0.08
    const a = radius
    const b = a * Math.sqrt(1 - eccentricity * eccentricity)
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = a * Math.cos(angle) * (1 - eccentricity)
      const z = b * Math.sin(angle)
      pts.push(new THREE.Vector3(x, 0, z))
    }
    return pts
  }, [radius, segments])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
    })
  }, [color])

  return <primitive object={new THREE.Line(geometry, lineMaterial)} />
}

// Holographic grid floor for tech aesthetic
function HolographicGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  const grid = useMemo(() => {
    return new THREE.GridHelper(60, 60, '#00ff41', '#00e1ff')
  }, [])

  useFrame(() => {
    if (grid.material) {
      const mat = grid.material as THREE.Material
      mat.transparent = true
      mat.opacity = 0.1
    }
  })

  return <primitive object={grid} position={[0, -0.5, 0]} />
}

// Space nebula background for added depth
function SpaceNebula() {
  const nebulaRef = useRef<THREE.Group>(null)

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

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = state.clock.elapsedTime * 0.001
    }
  })

  return (
    <group ref={nebulaRef}>
      {Array.from({ length: 300 }).map((_, i) => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 30 + Math.random() * 50
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)
        const colors = ['#6633cc', '#3366dd', '#cc3388', '#1a4d99']
        const color = colors[Math.floor(Math.random() * colors.length)]
        const size = 0.3 + Math.random() * 0.8
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
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

// Time control UI component
function TimeControl() {
  const [timeScale, setTimeScale] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  
  const handleTimeChange = (scale: number) => {
    setTimeScale(scale)
    ;(window as any).__solarSystemTimeScale = scale
  }
  
  const togglePause = () => {
    const newPaused = !isPaused
    setIsPaused(newPaused)
    ;(window as any).__solarSystemPaused = newPaused
  }
  
  return (
    <div className="absolute top-4 left-4 bg-terminal-black/90 border-2 border-neon-cyan backdrop-blur-sm transition-all duration-300" style={{ zIndex: 40 }}>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <h4 className="text-neon-cyan text-sm font-bold neon-glow">TIME CONTROL</h4>
        <button className="text-neon-cyan text-xs hover:text-white transition-colors ml-2">
          {isMinimized ? '▼' : '▲'}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 mb-2">
          <button
            onClick={(e) => { e.stopPropagation(); togglePause(); }}
            className="px-3 py-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan text-neon-cyan text-xs font-bold transition-colors"
          >
            {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
          </button>
        </div>
        
        <div className="space-y-1">
          <p className="text-gray-400 text-xs mb-1">Speed: {timeScale}x</p>
          <div className="flex gap-1 flex-wrap">
            {[0.25, 0.5, 1, 2, 5, 10].map(speed => (
              <button
                key={speed}
                onClick={(e) => { e.stopPropagation(); handleTimeChange(speed); }}
              className={`px-2 py-0.5 text-xs font-bold transition-colors ${
                timeScale === speed
                  ? 'bg-neon-cyan text-terminal-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
        
          <button
            onClick={(e) => { e.stopPropagation(); handleTimeChange(-1); }}
            className="w-full mt-2 px-2 py-1 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink text-xs font-bold transition-colors"
          >
            ⏪ REVERSE
          </button>
        </div>
        </div>
      )}
    </div>
  )
}

export default function SolarSystemScene() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null)
  const [showTrails, setShowTrails] = useState(true)

  const planetData: { [key: string]: PlanetInfo } = {
    mercury: {
      name: "Mercury - Beginner Stage",
      description: "The starting point of your learning journey. Quick to orbit, representing rapid initial progress.",
      stage: "Foundation Building",
      facts: [
        "Fastest orbital period - like quick early wins in learning",
        "Closest to the knowledge source (Sun)",
        "Small but mighty - basic concepts that pack a punch",
        "No atmosphere - pure, unfiltered learning"
      ],
      color: "#00e1ff"
    },
    venus: {
      name: "Venus - Foundation Stage",
      description: "Building your knowledge base with thick layers of understanding.",
      stage: "Core Concepts",
      facts: [
        "Dense atmosphere - deep conceptual layers",
        "Brightest planet - clarity in fundamentals",
        "Rotates backwards - challenging conventional thinking",
        "Similar to Earth - relatable learning material"
      ],
      color: "#ff00e6"
    },
    earth: {
      name: "Earth - Core Learning",
      description: "The perfect conditions for knowledge to flourish and grow.",
      stage: "Active Learning",
      facts: [
        "Goldilocks zone - optimal learning conditions",
        "Life thrives here - your skills come alive",
        "Has a moon - guidance and reflection",
        "Dynamic weather - diverse learning experiences"
      ],
      color: "#00ff41"
    },
    mars: {
      name: "Mars - Practice Stage",
      description: "The red planet of challenge and practical application.",
      stage: "Hands-On Experience",
      facts: [
        "Red from iron - building strong foundations",
        "Thin atmosphere - direct exposure to problems",
        "Polar ice caps - cool problem-solving",
        "Potential for life - your skills developing"
      ],
      color: "#ff4444"
    },
    jupiter: {
      name: "Jupiter - Advanced Topics",
      description: "The giant leap into complex, interconnected concepts.",
      stage: "Advanced Mastery",
      facts: [
        "Largest planet - vast knowledge domains",
        "Many moons - multiple perspectives",
        "Great Red Spot - tackling major challenges",
        "Protects inner planets - mentor to others"
      ],
      color: "#ffaa00"
    },
    saturn: {
      name: "Saturn - Mastery Stage",
      description: "Distinguished by your unique skill rings and accomplishments.",
      stage: "Expert Level",
      facts: [
        "Iconic rings - your distinctive expertise",
        "Second largest - commanding presence",
        "Many moons - leading others",
        "Beautiful structure - elegant solutions"
      ],
      color: "#ffea00"
    },
    uranus: {
      name: "Uranus - Specialization",
      description: "Tilted perspective bringing unique insights and innovation.",
      stage: "Unique Expertise",
      facts: [
        "Tilted 98° - unconventional approaches",
        "Ice giant - cool innovative solutions",
        "Faint rings - subtle but significant impact",
        "Distinct blue - standing out in your field"
      ],
      color: "#00ffff"
    },
    neptune: {
      name: "Neptune - Expertise Stage",
      description: "The deepest level of mastery in your learning journey.",
      stage: "Ultimate Mastery",
      facts: [
        "Farthest planet - ultimate achievement",
        "Strongest winds - powerful influence",
        "Deep blue - profound knowledge",
        "Takes 165 years to orbit - lifetime of learning"
      ],
      color: "#4444ff"
    }
  }

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
        <HolographicGrid />
        
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
        {/* Mercury - Beginner (no atmosphere, rocky with craters) */}
        <Planet 
          size={0.15} 
          color="#00e1ff" 
          orbitRadius={2.5} 
          orbitSpeed={0.8} 
          rotationSpeed={1.5}
          emissiveIntensity={0.3}
          info={planetData.mercury}
          onSelect={setSelectedPlanet}
          hasCraters={true}
          axialTilt={0.03}
          mass={0.055}
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
          info={planetData.venus}
          onSelect={setSelectedPlanet}
          axialTilt={177.4}
          mass={0.815}
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
          info={planetData.earth}
          onSelect={setSelectedPlanet}
          axialTilt={23.5}
          mass={1.0}
        />

        {/* Mars - Practice (thin atmosphere, rocky with craters) */}
        <Planet 
          size={0.2} 
          color="#ff4444" 
          orbitRadius={7} 
          orbitSpeed={0.4} 
          rotationSpeed={0.9}
          hasAtmosphere={true}
          emissiveIntensity={0.2}
          info={planetData.mars}
          onSelect={setSelectedPlanet}
          hasCraters={true}
          axialTilt={25.2}
          mass={0.107}
        />

        {/* Asteroid Belt - Challenges */}
        <AsteroidBelt />

        {/* Jupiter - Advanced Topics (gas giant with stripes) */}
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
          info={planetData.jupiter}
          onSelect={setSelectedPlanet}
          hasStripes={true}
          axialTilt={3.1}
          mass={317.8}
        />

        {/* Saturn - Mastery (gas giant with rings and stripes) */}
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
          info={planetData.saturn}
          onSelect={setSelectedPlanet}
          hasStripes={true}
          axialTilt={26.7}
          mass={95.2}
        />

        {/* Uranus - Specialization (ice giant, extreme tilt) */}
        <Planet 
          size={0.35} 
          color="#00ffff" 
          orbitRadius={14} 
          orbitSpeed={0.15} 
          rotationSpeed={0.8}
          hasAtmosphere={true}
          emissiveIntensity={0.4}
          info={planetData.uranus}
          onSelect={setSelectedPlanet}
          axialTilt={97.8}
          mass={14.5}
        />

        {/* Neptune - Expertise (ice giant with storms) */}
        <Planet 
          size={0.35} 
          color="#4444ff" 
          orbitRadius={16} 
          orbitSpeed={0.1} 
          rotationSpeed={0.75}
          hasAtmosphere={true}
          emissiveIntensity={0.4}
          info={planetData.neptune}
          onSelect={setSelectedPlanet}
          hasStripes={true}
          axialTilt={28.3}
          mass={17.1}
        />

        {/* Static orbital trail paths */}
        {showTrails && (
          <>
            <OrbitalTrail radius={2.5} color="#00e1ff" />
            <OrbitalTrail radius={4} color="#ff00e6" />
            <OrbitalTrail radius={5.5} color="#00ff41" />
            <OrbitalTrail radius={7} color="#ff4444" />
            <OrbitalTrail radius={10} color="#ffaa00" />
            <OrbitalTrail radius={12} color="#ffea00" />
            <OrbitalTrail radius={14} color="#00ffff" />
            <OrbitalTrail radius={16} color="#4444ff" />
          </>
        )}

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
        
        {/* Bloom Post-Processing */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
          <ChromaticAberration
            offset={[0.0005, 0.0005] as [number, number]}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Time Control UI */}
      <TimeControl />

      {/* Tech overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)',
          animation: 'scan 8s linear infinite'
        }}></div>
        
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-neon-cyan opacity-50"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-cyan opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-cyan opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-neon-cyan opacity-50"></div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div 
          className="absolute top-4 right-4 md:top-8 md:right-8 w-full max-w-[calc(100vw-2rem)] md:w-96 bg-terminal-black/95 border-2 border-neon-cyan p-4 md:p-6 backdrop-blur-sm animate-in slide-in-from-right duration-300 max-h-[calc(100vh-10rem)] overflow-y-auto"
          style={{
            boxShadow: `0 0 20px ${selectedPlanet.color}40`,
            borderColor: selectedPlanet.color,
            zIndex: 50
          }}
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-2 right-2 md:top-3 md:right-3 text-gray-400 hover:text-white transition-colors z-10 p-0.5 rounded hover:bg-gray-800"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 mb-4 pr-8">
            <div 
              className="w-4 h-4 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: selectedPlanet.color }}
            ></div>
            <h3 
              className="text-lg md:text-2xl font-bold"
              style={{ color: selectedPlanet.color }}
            >
              {selectedPlanet.name}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Learning Stage</p>
              <p className="text-lg text-white font-semibold">{selectedPlanet.stage}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Description</p>
              <p className="text-gray-200 leading-relaxed">{selectedPlanet.description}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Key Insights</p>
              <ul className="space-y-2">
                {selectedPlanet.facts.map((fact, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2 text-gray-300 animate-in fade-in duration-300"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span 
                      className="text-lg mt-0.5"
                      style={{ color: selectedPlanet.color }}
                    >
                      •
                    </span>
                    <span className="text-sm">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 italic">Click on other planets to explore different stages of your learning journey</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-terminal-black/80 border-2 border-neon-cyan p-3 md:p-4 backdrop-blur-sm" style={{ zIndex: 10 }}>
        <h3 className="text-neon-cyan text-base md:text-xl font-bold mb-2 md:mb-3 neon-glow">YOUR LEARNING JOURNEY - Click Planets to Learn More</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
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
