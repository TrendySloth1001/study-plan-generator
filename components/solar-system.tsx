"use client"

import React, { useRef, useMemo, useState } from "react"
import Link from "next/link"
import { Canvas, useFrame, useLoader, ThreeEvent } from "@react-three/fiber"
import { Sphere, OrbitControls, Stars, MeshDistortMaterial, Sparkles, useTexture, Torus, Html } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"
import { detailedPlanetData } from "@/lib/planet-data"
import { extendedPlanetData } from "@/lib/planet-data-extended"

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
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

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
      
      // Calculate velocity and other physics values
      const velocity = orbitSpeed * speedMultiplier * timeScale
      const angularVelocity = velocity / distance
      const G = 6.674e-11 // Gravitational constant
      const sunMass = 1.989e30 // kg
      const gravitationalForce = (G * sunMass * mass) / (distance * distance)
      const orbitalPeriod = 2 * Math.PI / orbitSpeed
      
      // Export calculations to global state for display
      ;(window as any).__physicsCalculations = {
        planet: info.name.split(' - ')[0],
        orbitRadius: orbitRadius,
        distance: distance,
        velocity: velocity,
        angularVelocity: angularVelocity,
        gravitationalForce: gravitationalForce,
        orbitalPeriod: orbitalPeriod,
        mass: mass,
        eccentricity: eccentricity,
        time: time,
        position: { x, y: 0, z }
      }
      
      planetRef.current.position.x = x
      planetRef.current.position.z = z
      
      // Trail recording removed for cleaner visualization
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

  return (
    <>
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
            setTooltipPos({ x: e.clientX, y: e.clientY })
            document.body.style.cursor = 'pointer'
          }}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            if (hovered) {
              setTooltipPos({ x: e.clientX, y: e.clientY })
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            setTooltipPos(null)
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
      
      {/* HTML Tooltip */}
      {hovered && tooltipPos && typeof window !== 'undefined' && (
        <Html position={[planetRef.current?.position.x || 0, planetRef.current?.position.y || 0, planetRef.current?.position.z || 0]}>
          <div 
            className="pointer-events-none whitespace-nowrap"
            style={{
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div 
              className="px-3 py-1 rounded-full border-2 font-bold text-sm backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: color,
                color: color,
                boxShadow: `0 0 10px ${color}60`
              }}
            >
              {info.name.split(' - ')[0]}
            </div>
            <div 
              className="w-0.5 h-4 mx-auto"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 5px ${color}`
              }}
            ></div>
          </div>
        </Html>
      )}
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
function TimeControl({ isFullscreen = false }: { isFullscreen?: boolean }) {
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
    <div className={`absolute top-4 ${isFullscreen ? 'right-4' : 'left-4'} bg-terminal-black/90 border-2 border-neon-cyan backdrop-blur-sm transition-all duration-300`} style={{ zIndex: 40 }}>
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

export default function SolarSystemScene({ isFullscreen = false }: { isFullscreen?: boolean }) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null)
  const [showTrails, setShowTrails] = useState(false)
  const [livePhysics, setLivePhysics] = useState({
    planet: 'Earth',
    orbitRadius: 0,
    distance: 0,
    velocity: 0,
    angularVelocity: 0,
    gravitationalForce: 0,
    orbitalPeriod: 0,
    mass: 1,
    eccentricity: 0.08,
    time: 0,
    position: { x: 0, y: 0, z: 0 }
  })
  
  // Update live physics from global state
  React.useEffect(() => {
    const interval = setInterval(() => {
      const calc = (window as any).__physicsCalculations
      if (calc) {
        setLivePhysics(calc)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Merge comprehensive planet data from both files
  const allPlanetData = { ...detailedPlanetData, ...extendedPlanetData }
  
  // Extract mission data from comprehensive planet information
  const getMissionData = (planetKey: string) => {
    const planet = allPlanetData[planetKey]
    if (!planet) return null
    
    return {
      missions: planet.missions.map(m => ({
        name: m.name,
        year: m.year,
        status: m.status,
        achievement: m.achievement,
        agency: m.agency,
        type: m.type
      })),
      discoveries: planet.discoveries.map(d => `${d.discovery} (${d.year}): ${d.significance}`),
      nextMission: planet.futureExploration.plannedMissions[0] || "Future missions under consideration",
      physicalData: planet.physicalData,
      orbitalData: planet.orbitalData,
      atmosphere: planet.atmosphere,
      structure: planet.structure,
      satellites: planet.satellites,
      scientificImportance: planet.scientificImportance,
      interestingFacts: planet.interestingFacts,
      earthComparison: planet.earthComparison
    }
  }

  const planetData: { [key: string]: PlanetInfo } = {
    mercury: {
      name: "Mercury - Beginner Stage",
      description: "The starting point of your learning journey. Quick to orbit, representing rapid initial progress. Like a speed demon, Mercury zips around the Sun in just 88 Earth days!",
      stage: "Foundation Building",
      facts: [
        "🏃 Fastest orbital speed at 47 km/s - blaze through basics!",
        "🌡️ Temperature swings from 430°C (day) to -180°C (night)",
        "🪨 Heavily cratered surface - marks of countless learning impacts",
        "💫 No atmosphere - pure, unfiltered knowledge exposure",
        "🌅 One day = 176 Earth days (but year is only 88 days!)",
        "🎯 Smallest planet but closest to success (the Sun)"
      ],
      color: "#00e1ff"
    },
    venus: {
      name: "Venus - Foundation Stage",
      description: "Building your knowledge base with thick layers of understanding. The rebel planet that spins backwards and shines brighter than any star!",
      stage: "Core Concepts",
      facts: [
        "🔥 Hottest planet at 462°C - things are heating up!",
        "⭐ Brightest object in night sky after the Moon",
        "🔄 Spins clockwise (retrograde) - think differently!",
        "🌋 Over 1,600 volcanoes - explosive learning potential",
        "☁️ Clouds of sulfuric acid - intense study environment",
        "🌍 Earth's twin in size but totally different in character"
      ],
      color: "#ff00e6"
    },
    earth: {
      name: "Earth - Core Learning",
      description: "The perfect conditions for knowledge to flourish and grow. The only known planet with life - where your skills truly come alive!",
      stage: "Active Learning",
      facts: [
        "🌍 Only planet with liquid water - fluid thinking!",
        "🧬 Home to 8.7 million species - diverse skill sets",
        "🌙 Perfect Moon size for tides and stability",
        "🌊 70% ocean coverage - depth of knowledge",
        "🛡️ Magnetic field protects from solar winds",
        "🌀 Spins at 1,670 km/h at equator - always in motion!"
      ],
      color: "#00ff41"
    },
    mars: {
      name: "Mars - Practice Stage",
      description: "The red planet of challenge and practical application. Home to the largest volcano and canyon in the solar system!",
      stage: "Hands-On Experience",
      facts: [
        "🏔️ Olympus Mons: 21 km tall - 3x Mt. Everest!",
        "🌋 Valles Marineris: 4,000 km long canyon system",
        "❄️ Polar ice caps contain frozen water and CO2",
        "🤖 Host to multiple rovers - hands-on exploration",
        "🌅 Sunsets appear blue due to dust particles",
        "⚡ Massive dust storms can cover entire planet"
      ],
      color: "#ff4444"
    },
    jupiter: {
      name: "Jupiter - Advanced Topics",
      description: "The giant leap into complex, interconnected concepts. So massive it could contain 1,300 Earths!",
      stage: "Advanced Mastery",
      facts: [
        "🌪️ Great Red Spot: 400-year-old storm bigger than Earth",
        "🌙 95 known moons - endless perspectives to explore",
        "⚡ Lightning 1,000x more powerful than Earth's",
        "🛡️ Protects inner planets by deflecting asteroids",
        "🌀 Spins fastest: 1 day = 10 hours!",
        "💍 Has faint rings made of dust from meteor impacts"
      ],
      color: "#ffaa00"
    },
    saturn: {
      name: "Saturn - Mastery Stage",
      description: "Distinguished by your unique skill rings and accomplishments. The most beautiful planet with spectacular ring system visible from Earth!",
      stage: "Expert Level",
      facts: [
        "💍 7 main rings spanning 282,000 km across",
        "🪨 Rings made of ice chunks, rocks, and dust",
        "🌊 Could float in water - least dense planet!",
        "🌙 146 known moons - Titan is larger than Mercury",
        "🌬️ Wind speeds up to 1,800 km/h at equator",
        "⬡ Hexagon-shaped storm at north pole!"
      ],
      color: "#ffea00"
    },
    uranus: {
      name: "Uranus - Specialization",
      description: "Tilted perspective bringing unique insights and innovation. The sideways planet that literally rolls around the Sun!",
      stage: "Unique Expertise",
      facts: [
        "🔄 Tilted 98° - spins on its side like a rolling ball",
        "❄️ Coldest planet at -224°C despite not being farthest",
        "💎 Rains diamonds due to extreme pressure!",
        "💍 13 faint rings discovered in 1977",
        "🌙 27 moons named after Shakespeare & Pope characters",
        "🔵 Blue color from methane in atmosphere"
      ],
      color: "#00ffff"
    },
    neptune: {
      name: "Neptune - Expertise Stage",
      description: "The deepest level of mastery in your learning journey. The windiest planet with supersonic storms!",
      stage: "Ultimate Mastery",
      facts: [
        "🌬️ Fastest winds at 2,100 km/h - 5x speed of sound!",
        "🔭 Discovered by math before being seen (1846)",
        "💙 Deep blue from methane - profound mastery",
        "⏰ 1 year = 165 Earth years - epic journey!",
        "🌑 14 known moons - Triton orbits backwards",
        "💍 5 main rings named after Neptune discoverers"
      ],
      color: "#4444ff"
    }
  }

  return (
    <div className={isFullscreen ? 'w-screen h-screen fixed inset-0' : 'w-full h-[600px] md:h-[800px] relative'}>
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
        <HolographicGrid />

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
      <TimeControl isFullscreen={isFullscreen} />
      
      {/* Fullscreen Button - Only show when not in fullscreen mode */}
      {!isFullscreen && (
        <Link href="/solar-system-fullscreen">
          <button className="absolute bottom-4 right-4 bg-terminal-black/90 border-2 border-neon-cyan px-4 py-2 backdrop-blur-sm hover:bg-neon-cyan/20 transition-all duration-300 group" style={{ zIndex: 40 }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="text-neon-cyan text-sm font-bold neon-glow">FULLSCREEN</span>
            </div>
          </button>
        </Link>
      )}

      {/* Tech overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-neon-cyan opacity-50"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-cyan opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-cyan opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-neon-cyan opacity-50"></div>
      </div>

      {/* Planet Info Panel - Different for fullscreen */}
      {selectedPlanet && !isFullscreen && (
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
      
      {/* Enhanced Fullscreen Planet Info Panel - Nerdy Playground */}
      {selectedPlanet && isFullscreen && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-lg z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="w-full max-w-7xl h-[95vh] bg-black/95 border-2 p-8 rounded-none overflow-y-auto font-mono"
            style={{
              boxShadow: `0 0 60px ${selectedPlanet.color}80, inset 0 0 100px ${selectedPlanet.color}10`,
              borderColor: selectedPlanet.color,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 rounded hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header - Terminal Style */}
            <div className="mb-6 pb-4 border-b-2 border-dashed" style={{ borderColor: `${selectedPlanet.color}60` }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 text-sm">&gt;&gt;&gt;</span>
                    <h2 
                      className="text-5xl font-bold tracking-wider uppercase glitch"
                      style={{ 
                        color: selectedPlanet.color,
                        textShadow: `0 0 10px ${selectedPlanet.color}, 0 0 20px ${selectedPlanet.color}40`
                      }}
                    >
                      {selectedPlanet.name.split(' - ')[0]}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">CLASSIFICATION:</span>
                    <span className="text-neon-cyan">{selectedPlanet.stage}</span>
                    <span className="text-gray-600 mx-2">|</span>
                    <span className="text-gray-600">STATUS:</span>
                    <span className="text-neon-green">ACTIVE</span>
                    <span className="text-gray-600 mx-2">|</span>
                    <span className="text-gray-500">MASS:</span>
                    <span className="text-neon-green font-bold">{livePhysics.mass.toFixed(3)} M⊕</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-600 space-y-1">
                  <div>SYSTEM: SOLAR-EDU-01</div>
                  <div>COORDS: [{livePhysics.position.x.toFixed(2)}, {livePhysics.position.z.toFixed(2)}]</div>
                  <div>TIME: {livePhysics.time.toFixed(1)}s</div>
                </div>
              </div>
            </div>
            
            {/* Content Grid - Enhanced with Missions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Column 1 - System Info */}
              <div className="space-y-4">
                {/* Terminal Output */}
                <div className="bg-black border border-neon-green/30 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-green/20">
                    <span className="text-neon-green text-xs">●</span>
                    <span className="text-neon-green text-xs font-bold">SYSTEM_LOG.txt</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-gray-500">&gt; Initiating planetary scan...</div>
                    <div className="text-neon-cyan">&gt; Object: {selectedPlanet.name.split(' - ')[0]}</div>
                    <div className="text-gray-400">&gt; Stage: {selectedPlanet.stage}</div>
                    <div className="text-gray-500">---</div>
                    {selectedPlanet.facts.map((fact, idx) => (
                      <div key={idx} className="text-gray-300 pl-4">
                        <span className="text-neon-yellow">→</span> {fact}
                      </div>
                    ))}
                    <div className="text-gray-500 mt-2">---</div>
                    <div className="text-neon-green">&gt; Scan complete ✓</div>
                  </div>
                </div>

                {/* Hex Color Code */}
                <div className="bg-black border p-4" style={{ borderColor: `${selectedPlanet.color}40` }}>
                  <div className="text-xs text-gray-500 mb-2">COLOR_SIGNATURE</div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-16 border-2" 
                      style={{ 
                        backgroundColor: selectedPlanet.color,
                        borderColor: selectedPlanet.color,
                        boxShadow: `0 0 20px ${selectedPlanet.color}`
                      }}
                    ></div>
                    <div>
                      <code className="text-2xl font-bold" style={{ color: selectedPlanet.color }}>
                        {selectedPlanet.color}
                      </code>
                      <div className="text-xs text-gray-500 mt-1">
                        RGB({parseInt(selectedPlanet.color.slice(1,3), 16)}, {parseInt(selectedPlanet.color.slice(3,5), 16)}, {parseInt(selectedPlanet.color.slice(5,7), 16)})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-black border border-gray-700 p-4">
                  <div className="text-xs text-gray-500 mb-2">DESCRIPTION</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedPlanet.description}</p>
                </div>
              </div>
              
              {/* Column 2 - Live Physics Telemetry */}
              <div className="space-y-4">
                {/* Real-time Telemetry */}
                <div className="bg-black border border-neon-green p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-green/20">
                    <span className="text-neon-green animate-pulse">◉</span>
                    <span className="text-neon-green text-xs font-bold">LIVE_TELEMETRY</span>
                    <span className="text-xs text-gray-600 ml-auto">100Hz</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-gray-600">r_orbit</div>
                        <div className="text-neon-cyan text-xl font-bold">{livePhysics.orbitRadius.toFixed(3)}</div>
                        <div className="text-gray-600 text-[10px]">AU</div>
                      </div>
                      <div>
                        <div className="text-gray-600">d_current</div>
                        <div className="text-neon-cyan text-xl font-bold">{livePhysics.distance.toFixed(3)}</div>
                        <div className="text-gray-600 text-[10px]">AU</div>
                      </div>
                      <div>
                        <div className="text-gray-500">v_orbital</div>
                        <div className="text-neon-green font-bold text-xl font-bold tracking-wider">{livePhysics.velocity.toFixed(5)}</div>
                        <div className="text-gray-500 text-[10px]">AU/s</div>
                      </div>
                      <div>
                        <div className="text-gray-500">ω_angular</div>
                        <div className="text-neon-green font-bold text-xl font-bold tracking-wider">{livePhysics.angularVelocity.toFixed(5)}</div>
                        <div className="text-gray-500 text-[10px]">rad/s</div>
                      </div>
                      <div>
                        <div className="text-gray-500">m_relative</div>
                        <div className="text-neon-pink text-xl font-bold tracking-wider">{livePhysics.mass.toFixed(4)}</div>
                        <div className="text-gray-500 text-[10px]">M⊕</div>
                      </div>
                      <div>
                        <div className="text-gray-600">F_gravity</div>
                        <div className="text-neon-pink text-xl font-bold">{livePhysics.gravitationalForce.toExponential(2)}</div>
                        <div className="text-gray-600 text-[10px]">N</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-2 mt-2">
                      <div className="text-gray-600 mb-1">POSITION_VECTOR</div>
                      <div className="bg-gray-900/50 p-2 font-mono">
                        <span className="text-gray-500">[</span>
                        <span className="text-neon-cyan">{livePhysics.position.x.toFixed(3)}</span>
                        <span className="text-gray-500">, </span>
                        <span className="text-neon-cyan">{livePhysics.position.y.toFixed(3)}</span>
                        <span className="text-gray-500">, </span>
                        <span className="text-neon-cyan">{livePhysics.position.z.toFixed(3)}</span>
                        <span className="text-gray-500">]</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbital Visualization */}
                <div className="bg-black border p-4" style={{ borderColor: `${selectedPlanet.color}40` }}>
                  <div className="text-xs text-gray-500 mb-3">ORBITAL_PATH</div>
                  <div className="relative w-full aspect-square bg-gray-950 border border-gray-800">
                    <div className="absolute w-3/4 h-3/4 border border-dashed border-gray-700 rounded-full" style={{ left: '12.5%', top: '12.5%' }}></div>
                    <div className="absolute w-2 h-2 bg-yellow-500 rounded-full" style={{ left: 'calc(50% - 4px)', top: 'calc(50% - 4px)', boxShadow: '0 0 10px #ffd700' }}></div>
                    <div 
                      className="absolute w-2 h-2 rounded-full transition-all duration-100"
                      style={{ 
                        backgroundColor: selectedPlanet.color,
                        left: `calc(50% + ${(livePhysics.position.x / livePhysics.orbitRadius) * 37.5}% - 4px)`,
                        top: `calc(50% + ${(livePhysics.position.z / livePhysics.orbitRadius) * 37.5}% - 4px)`,
                        boxShadow: `0 0 8px ${selectedPlanet.color}`
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-600 text-center">REAL-TIME TRACKING</div>
                </div>
              </div>
                
              {/* Column 3 - Equations & Constants */}
              <div className="space-y-4">
                {/* Code-style Equations */}
                <div className="bg-black border border-neon-yellow/30 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-yellow/20">
                    <span className="text-neon-yellow">λ</span>
                    <span className="text-neon-yellow text-xs font-bold">ORBITAL_MECHANICS.py</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="bg-gray-950 p-2 border-l-2 border-neon-green">
                      <div className="text-gray-600 mb-1"># Gravitational Force</div>
                      <code className="text-gray-400">F = <span className="text-neon-green">G</span> * (<span className="text-neon-cyan">M</span> * <span className="text-neon-cyan">m</span>) / <span className="text-neon-yellow">r</span>²</code>
                      <div className="text-gray-600 mt-1 text-[10px]">&gt; {livePhysics.gravitationalForce.toExponential(3)} N</div>
                    </div>
                    
                    <div className="bg-gray-950 p-2 border-l-2 border-neon-cyan">
                      <div className="text-gray-600 mb-1"># Kepler&apos;s 3rd Law</div>
                      <code className="text-gray-400">T² ∝ <span className="text-neon-yellow">r</span>³</code>
                      <div className="text-gray-600 mt-1 text-[10px]">&gt; T = {livePhysics.orbitalPeriod.toFixed(2)} s</div>
                    </div>
                    
                    <div className="bg-gray-950 p-2 border-l-2 border-neon-pink">
                      <div className="text-gray-600 mb-1"># Orbital Velocity</div>
                      <code className="text-gray-400">v = √(<span className="text-neon-green">G</span> * <span className="text-neon-cyan">M</span> / <span className="text-neon-yellow">r</span>)</code>
                      <div className="text-gray-600 mt-1 text-[10px]">&gt; v ∝ 1/√r</div>
                    </div>
                    
                    <div className="bg-gray-950 p-2 border-l-2 border-neon-yellow">
                      <div className="text-gray-600 mb-1"># Elliptical Path</div>
                      <code className="text-gray-400 text-[10px]">
                        x = a * cos(t) * (1 - e)<br/>
                        z = b * sin(t)<br/>
                        b = a * √(1 - e²)
                      </code>
                      <div className="text-gray-600 mt-1 text-[10px]">&gt; e = {livePhysics.eccentricity}</div>
                    </div>
                  </div>
                </div>

                {/* Constants Table */}
                <div className="bg-black border border-gray-700 p-4">
                  <div className="text-xs text-gray-500 mb-3">PHYSICAL_CONSTANTS</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-600">G</span>
                      <span className="text-gray-400">6.674e-11 m³/kg·s²</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-600">M☉</span>
                      <span className="text-gray-400">1.989e30 kg</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-600">1 AU</span>
                      <span className="text-gray-400">1.496e8 km</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-600">M⊕</span>
                      <span className="text-gray-400">5.972e24 kg</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-600">e</span>
                      <span className="text-gray-400">{livePhysics.eccentricity}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Playground Section */}
                <div className="bg-black border border-neon-pink/30 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-pink/20">
                    <span className="text-neon-pink">⚙</span>
                    <span className="text-neon-pink text-xs font-bold">PLAYGROUND</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-gray-500 mb-2">// Interactive calculations</div>
                    <div className="bg-gray-950 p-2">
                      <div className="text-gray-400 mb-1">Escape Velocity:</div>
                      <code className="text-neon-cyan font-bold">v_esc = {(Math.sqrt(2 * 6.674e-11 * 1.989e30 * livePhysics.mass / (livePhysics.distance * 1.496e11)) / 1000).toFixed(2)} km/s</code>
                    </div>
                    <div className="bg-gray-950 p-2">
                      <div className="text-gray-400 mb-1">Orbital Energy:</div>
                      <code className="text-neon-green font-bold">E = -{livePhysics.gravitationalForce.toExponential(2)} J</code>
                    </div>
                    <div className="bg-gray-950 p-2">
                      <div className="text-gray-400 mb-1">Period Ratio:</div>
                      <code className="text-neon-green font-bold">T/T⊕ = {(livePhysics.orbitalPeriod / 31557600).toFixed(3)}</code>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column 4 - Missions & Discoveries */}
              <div className="space-y-4">
                {/* Space Missions - Enhanced Timeline */}
                <div className="bg-gradient-to-br from-black via-purple-950/10 to-black border border-purple-400/30 p-4 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/20 relative z-10">
                    <span className="text-purple-400 text-lg animate-pulse">🚀</span>
                    <span className="text-purple-400 text-xs font-bold tracking-wider">SPACE_MISSIONS_TIMELINE</span>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      <span className="text-purple-400 text-[8px]">LIVE</span>
                    </div>
                  </div>
                  
                  <div className="relative max-h-80 overflow-y-auto custom-scrollbar">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-purple-500 to-transparent"></div>
                    
                    <div className="space-y-4 text-xs pl-8 relative z-10">
                      {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.missions.map((mission: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="relative group animate-in slide-in-from-left"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[18px] top-2 w-3 h-3 bg-purple-400 rounded-full border-2 border-black animate-pulse group-hover:scale-150 transition-transform duration-300"
                            style={{ animationDelay: `${idx * 200}ms` }}
                          ></div>
                          
                          <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-3 border border-purple-400/30 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-purple-400 font-bold flex items-center gap-1">
                                <span className="text-purple-400/50">▸</span>
                                {mission.name}
                              </span>
                              <span className="text-gray-600 text-[10px] bg-gray-800 px-2 py-0.5 rounded">{mission.year}</span>
                            </div>
                            <div className="text-gray-400 text-[10px] mb-1 flex items-center gap-2">
                              <span className="text-purple-400/70">●</span>
                              {mission.agency ? `${mission.status} - ${mission.agency}` : mission.status}
                            </div>
                            <div className="text-gray-300 text-[10px] flex items-start gap-1 bg-black/30 p-2 rounded">
                              <span className="text-neon-green">✓</span>
                              <span>{mission.achievement}</span>
                            </div>
                            {mission.type && (
                              <div className="text-gray-600 text-[9px] mt-2 flex items-center gap-1">
                                <div className="w-full h-px bg-gradient-to-r from-purple-400/20 to-transparent"></div>
                                <span className="text-purple-400/50 whitespace-nowrap">Type: {mission.type}</span>
                              </div>
                            )}
                            {/* Progress indicator */}
                            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                                style={{ 
                                  width: `${Math.min(100, (idx + 1) * 15)}%`,
                                  animation: 'shimmer 2s infinite'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Major Discoveries */}
                <div className="bg-black border border-neon-cyan/30 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-cyan/20">
                    <span className="text-neon-cyan">🔬</span>
                    <span className="text-neon-cyan text-xs font-bold">DISCOVERIES</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.discoveries.map((discovery: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-gray-950 p-2 flex items-start gap-2 animate-in fade-in"
                        style={{ animationDelay: `${idx * 150}ms` }}
                      >
                        <span className="text-neon-cyan">▸</span>
                        <span className="text-gray-300">{discovery}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Mission */}
                <div className="bg-black border border-neon-yellow/30 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-yellow/20">
                    <span className="text-neon-yellow animate-pulse">🛸</span>
                    <span className="text-neon-green font-bold">NEXT_MISSION</span>
                  </div>
                  <div className="text-xs">
                    <div className="bg-gray-950 p-3 border-l-2 border-neon-yellow">
                      <div className="text-xs text-gray-300">
                        {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.nextMission}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Stats Animation */}
                <div className="bg-black border p-4" style={{ borderColor: `${selectedPlanet.color}40` }}>
                  <div className="text-xs text-gray-500 mb-3">LIVE_STATS</div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">Rotation Speed</span>
                        <span className="text-neon-cyan">{(Math.random() * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-neon-cyan to-neon-green animate-pulse"
                          style={{ 
                            width: `${Math.random() * 100}%`,
                            boxShadow: '0 0 10px currentColor'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">Orbital Progress</span>
                        <span className="text-neon-yellow">{((livePhysics.time % livePhysics.orbitalPeriod) / livePhysics.orbitalPeriod * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-neon-yellow to-neon-pink transition-all duration-1000"
                          style={{ 
                            width: `${(livePhysics.time % livePhysics.orbitalPeriod) / livePhysics.orbitalPeriod * 100}%`,
                            boxShadow: '0 0 10px currentColor'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">Energy Level</span>
                        <span className="text-neon-green">{(livePhysics.velocity * 1000).toFixed(0)} kJ</span>
                      </div>
                      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-neon-green to-neon-cyan animate-pulse"
                          style={{ 
                            width: `${(livePhysics.velocity / 0.02) * 100}%`,
                            boxShadow: '0 0 10px currentColor'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Comprehensive Data Sections */}
            <div className="mt-6 space-y-4">
              {/* Physical & Orbital Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Physical Characteristics - Enhanced with Animations */}
                <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-neon-cyan/30 p-6 hover:border-neon-cyan/60 transition-all duration-500 group">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-cyan/20">
                    <span className="text-neon-cyan text-xl animate-pulse">⚛️</span>
                    <span className="text-neon-cyan text-sm font-bold tracking-wider glitch">PHYSICAL_CHARACTERISTICS</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.physicalData && (
                      <>
                        {Object.entries(getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.physicalData).map(([key, value], idx) => (
                          <div 
                            key={idx} 
                            className="bg-gradient-to-r from-gray-950 to-gray-900 p-3 border-l-2 border-neon-cyan/50 hover:border-neon-cyan hover:scale-105 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom"
                            style={{ 
                              animationDelay: `${idx * 80}ms`,
                              boxShadow: '0 0 15px rgba(0, 225, 255, 0.1)'
                            }}
                          >
                            <div className="text-gray-500 mb-1 capitalize text-[10px] flex items-center gap-1">
                              <span className="text-neon-cyan">▸</span>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-neon-cyan font-bold text-sm flex items-center justify-between">
                              <span>{value}</span>
                              <span className="text-neon-cyan/30 text-xs">◆</span>
                            </div>
                            {/* Progress bar animation */}
                            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
                                style={{ 
                                  width: `${(idx + 1) * 10}%`,
                                  animation: 'shimmer 2s infinite'
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Orbital Characteristics - Enhanced with Orbit Visualization */}
                <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-neon-yellow/30 p-6 hover:border-neon-yellow/60 transition-all duration-500 group relative overflow-hidden">
                  {/* Animated background orbits */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-neon-yellow rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-neon-yellow/60 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-yellow/20 relative z-10">
                    <span className="text-neon-yellow text-xl animate-spin" style={{ animationDuration: '3s' }}>🌐</span>
                    <span className="text-sm text-neon-green text-sm font-bold tracking-wider">ORBITAL_CHARACTERISTICS</span>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-neon-yellow animate-pulse"></div>
                        <div className="w-1 h-6 bg-neon-yellow animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-5 bg-neon-yellow animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-7 bg-neon-yellow animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
                    {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.orbitalData && (
                      <>
                        {Object.entries(getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.orbitalData).map(([key, value], idx) => (
                          <div 
                            key={idx} 
                            className="bg-gradient-to-br from-gray-950 to-gray-900/80 p-3 border-l-2 border-neon-yellow/50 hover:border-neon-yellow hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm animate-in slide-in-from-right"
                            style={{ 
                              animationDelay: `${idx * 80}ms`,
                              boxShadow: '0 0 15px rgba(255, 234, 0, 0.1)'
                            }}
                          >
                            <div className="text-gray-500 mb-1 capitalize text-[10px] flex items-center gap-1">
                              <span className="text-neon-yellow">◉</span>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-neon-yellow font-bold text-sm">{value}</div>
                            {/* Circular progress indicator */}
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-yellow"
                                  style={{ 
                                    width: `${Math.min(100, (idx + 1) * 15)}%`,
                                    animation: 'shimmer 3s infinite'
                                  }}
                                ></div>
                              </div>
                              <span className="text-neon-yellow text-[8px]">●</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Atmosphere & Structure */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Atmosphere - Enhanced with Gas Visualization */}
                <div className="bg-gradient-to-br from-black via-pink-950/10 to-black border border-neon-pink/30 p-6 hover:border-neon-pink/60 transition-all duration-500 relative overflow-hidden group">
                  {/* Floating particles animation */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-neon-pink rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-pink/20 relative z-10">
                    <span className="text-neon-pink text-xl animate-bounce" style={{ animationDuration: '2s' }}>☁️</span>
                    <span className="text-neon-pink text-sm font-bold tracking-wider">ATMOSPHERE</span>
                    <div className="ml-auto flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-1 bg-neon-pink/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-neon-pink"
                            style={{ 
                              width: '40%',
                              animation: 'slide 1.5s infinite ease-in-out',
                              animationDelay: `${i * 0.2}s`
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.atmosphere && (
                    <div className="space-y-3 text-xs relative z-10">
                      <div>
                        <div className="text-gray-500 mb-2 flex items-center gap-2">
                          <span>Composition</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-neon-pink to-transparent"></div>
                        </div>
                        <div className="space-y-2">
                          {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.atmosphere.composition.map((comp: string, idx: number) => {
                            const percentage = parseInt(comp.match(/\d+/)?.[0] || '0')
                            return (
                              <div 
                                key={idx} 
                                className="bg-gradient-to-r from-gray-950 to-gray-900 p-3 border-l-2 border-neon-pink/50 hover:border-neon-pink transition-all duration-300 animate-in fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-neon-pink font-bold">{comp}</span>
                                  <span className="text-neon-pink/60 text-[10px]">●●●</span>
                                </div>
                                {/* Visual percentage bar */}
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-neon-pink via-pink-400 to-neon-pink transition-all duration-1000"
                                    style={{ 
                                      width: `${percentage || (100 - idx * 10)}%`,
                                      boxShadow: '0 0 10px rgba(255, 0, 230, 0.5)',
                                      animation: 'pulse-glow 2s infinite'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-950 p-3">
                          <div className="text-gray-500 mb-1">Pressure</div>
                          <div className="text-neon-pink font-bold">{getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.atmosphere.pressure}</div>
                        </div>
                        <div className="bg-gray-950 p-3">
                          <div className="text-gray-500 mb-1">Temperature</div>
                          <div className="text-neon-pink font-bold">{getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.atmosphere.temperature}</div>
                        </div>
                      </div>
                      {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.atmosphere.weatherPatterns && (
                        <div>
                          <div className="text-gray-500 mb-2">Weather Patterns</div>
                          <div className="space-y-1">
                            {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.atmosphere.weatherPatterns?.map((pattern: string, idx: number) => (
                              <div key={idx} className="bg-gray-950 p-2 text-gray-300 text-[11px]">▸ {pattern}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Structure - Enhanced with Layer Visualization */}
                <div className="bg-gradient-to-br from-black via-green-950/10 to-black border border-neon-green/30 p-6 relative overflow-hidden group">
                  {/* Animated concentric circles for layers */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-neon-green rounded-full"
                        style={{
                          width: `${(i + 1) * 60}px`,
                          height: `${(i + 1) * 60}px`,
                          animation: `pulse ${2 + i * 0.5}s infinite ease-in-out`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-green/20 relative z-10">
                    <span className="text-neon-green text-xl animate-pulse">🏔️</span>
                    <span className="text-neon-green text-sm font-bold tracking-wider">STRUCTURE_&_COMPOSITION</span>
                    <div className="ml-auto">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-6 bg-neon-green/30 rounded-full"
                            style={{
                              animation: 'pulse 1.5s infinite',
                              animationDelay: `${i * 0.2}s`,
                              opacity: 0.3 + (i * 0.2)
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.structure && (
                    <div className="space-y-4 text-xs relative z-10">
                      {/* Surface Features with Cards */}
                      <div>
                        <div className="text-gray-500 mb-3 flex items-center gap-2">
                          <span className="text-neon-green">▸</span>
                          <span className="font-bold">Surface Features</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.structure.surfaceFeatures.map((feature: string, idx: number) => (
                            <div 
                              key={idx} 
                              className="bg-gradient-to-r from-gray-950 to-gray-900 p-3 border-l-2 border-neon-green/50 hover:border-neon-green transition-all duration-300 hover:translate-x-1 cursor-pointer animate-in slide-in-from-left group"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-neon-green mt-0.5">•</span>
                                <span className="text-gray-300 text-[11px] flex-1">{feature}</span>
                                <div className="w-1 h-1 bg-neon-green rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interior Layers with Depth Visualization */}
                      <div>
                        <div className="text-gray-500 mb-3 flex items-center gap-2">
                          <span className="text-neon-green">▸</span>
                          <span className="font-bold">Interior Layers</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
                        </div>
                        <div className="space-y-2">
                          {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.structure.interiorLayers.map((layer: string, idx: number) => (
                            <div 
                              key={idx} 
                              className="relative bg-gradient-to-r from-gray-950 to-gray-900 p-3 border border-neon-green/30 hover:border-neon-green transition-all duration-300 animate-in fade-in"
                              style={{ 
                                animationDelay: `${idx * 100}ms`,
                                marginLeft: `${idx * 8}px`,
                                boxShadow: `0 0 ${(idx + 1) * 5}px rgba(0, 255, 65, ${0.1 + idx * 0.05})`
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center border border-neon-green/50 animate-pulse"
                                  style={{ animationDelay: `${idx * 0.2}s` }}
                                >
                                  <span className="text-neon-green font-bold text-xs">{idx + 1}</span>
                                </div>
                                <span className="text-neon-green text-[11px] flex-1">{layer}</span>
                                {/* Depth indicator */}
                                <div className="flex flex-col gap-0.5">
                                  {[...Array(idx + 1)].map((_, i) => (
                                    <div key={i} className="w-4 h-0.5 bg-neon-green/50"></div>
                                  ))}
                                </div>
                              </div>
                              {/* Progress bar showing depth */}
                              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                                  style={{ 
                                    width: `${25 + idx * 25}%`,
                                    animation: 'shimmer 3s infinite'
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Magnetic Field with Field Lines */}
                      <div className="relative bg-gradient-to-br from-gray-950 to-gray-900 p-4 border-2 border-neon-green/30 hover:border-neon-green transition-all duration-500">
                        <div className="text-gray-500 mb-2 flex items-center gap-2">
                          <span className="text-neon-green text-lg">⚡</span>
                          <span className="font-bold">Magnetic Field</span>
                        </div>
                        <div className="text-neon-green font-bold text-sm animate-neon-pulse">
                          {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.structure.magneticField}
                        </div>
                        {/* Field strength indicator */}
                        <div className="mt-3 flex gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div 
                              key={i}
                              className="flex-1 h-8 bg-neon-green/20 rounded-full relative overflow-hidden"
                              style={{
                                animation: 'pulse 2s infinite',
                                animationDelay: `${i * 0.1}s`
                              }}
                            >
                              <div 
                                className="absolute bottom-0 left-0 right-0 bg-neon-green"
                                style={{ 
                                  height: `${Math.random() * 100}%`,
                                  animation: 'pulse-glow 1.5s infinite',
                                  animationDelay: `${i * 0.15}s`
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Moons & Satellites - Enhanced with Orbital Animation */}
              {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.satellites && getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.satellites.moonCount > 0 && (
                <div className="bg-gradient-to-br from-black via-purple-950/10 to-black border border-purple-400/30 p-6 relative overflow-hidden">
                  {/* Animated orbital rings */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-400 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-400/60 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-purple-400/20 relative z-10">
                    <span className="text-purple-400 text-xl animate-bounce" style={{ animationDuration: '3s' }}>🌙</span>
                    <span className="text-purple-400 text-sm font-bold tracking-wider">MOONS_&_SATELLITES</span>
                    <div className="ml-auto flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                        <span className="text-purple-400 text-xs font-bold">{getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.satellites.moonCount}</span>
                      </div>
                      <span className="text-gray-600 text-xs">satellites detected</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs relative z-10">
                    {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.satellites.majorMoons?.map((moon: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="group relative bg-gradient-to-br from-gray-950 to-gray-900 p-4 border border-purple-400/30 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer animate-in fade-in"
                        style={{ 
                          animationDelay: `${idx * 150}ms`,
                          transform: 'translateZ(0)'
                        }}
                      >
                        {/* Holographic shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)',
                            backgroundSize: '200% 200%',
                            animation: 'shimmer 2s infinite'
                          }}
                        ></div>

                        {/* Moon icon with orbit */}
                        <div className="relative mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center border border-purple-400/50 animate-pulse">
                                <span className="text-lg">🌙</span>
                              </div>
                              <div className="absolute inset-0 border border-purple-400/30 rounded-full animate-ping"></div>
                            </div>
                            <div className="text-purple-400 font-bold text-sm">{moon.name}</div>
                          </div>
                          <div className="text-[8px] text-gray-600 bg-gray-800 px-2 py-1 rounded">#{idx + 1}</div>
                        </div>

                        {/* Data bars */}
                        <div className="space-y-3 mb-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500 text-[10px]">Diameter</span>
                              <span className="text-neon-cyan text-[10px] font-bold">{moon.diameter}</span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-neon-cyan to-purple-400"
                                style={{ 
                                  width: `${50 + idx * 10}%`,
                                  animation: 'shimmer 3s infinite'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Description with scan effect */}
                        <div className="relative bg-black/30 p-3 rounded border border-purple-400/10">
                          <div className="text-gray-300 text-[11px] leading-relaxed relative z-10">{moon.description}</div>
                          {/* Scan line */}
                          <div 
                            className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100"
                            style={{ animation: 'scan-line 2s infinite' }}
                          ></div>
                        </div>

                        {/* Bottom status bar */}
                        <div className="mt-3 pt-2 border-t border-purple-400/10 flex items-center justify-between">
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div 
                                key={i}
                                className="w-1 h-3 bg-purple-400/30 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                          <span className="text-[8px] text-purple-400/50">ACTIVE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.satellites.rings && (
                    <div className="mt-4 bg-gray-950 p-4 border-l-2 border-purple-400">
                      <div className="text-purple-400 font-bold mb-2">Ring System</div>
                      <div className="text-gray-300 text-[11px]">{getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.satellites.rings?.description}</div>
                      <div className="text-gray-500 text-[11px] mt-1">Composition: {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.satellites.rings?.composition}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Scientific Importance - Enhanced with Hexagonal Grid */}
              <div className="bg-gradient-to-br from-black via-cyan-950/10 to-black border border-neon-cyan/30 p-6 relative overflow-hidden">
                {/* Animated data streams */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-px h-20 bg-gradient-to-b from-neon-cyan to-transparent"
                      style={{
                        left: `${20 + i * 20}%`,
                        animation: `data-stream ${2 + i * 0.5}s infinite ease-in-out`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-cyan/20 relative z-10">
                  <span className="text-neon-cyan text-xl animate-pulse">🔬</span>
                  <span className="text-neon-cyan text-sm font-bold tracking-wider">SCIENTIFIC_IMPORTANCE</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="text-[8px] text-neon-cyan font-mono bg-cyan-950/30 px-2 py-1 rounded border border-neon-cyan/30">
                      HIGH PRIORITY
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-1 h-4 bg-neon-cyan rounded-full"
                          style={{ 
                            opacity: 0.2 + (i * 0.2),
                            animation: 'pulse 1s infinite',
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
                  {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.scientificImportance.map((item: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="group relative"
                    >
                      <div className="relative bg-gradient-to-r from-gray-950 to-gray-900 p-4 border-l-4 border-neon-cyan/50 hover:border-neon-cyan transition-all duration-500 cursor-pointer animate-in slide-in-from-left hover:translate-x-2"
                        style={{ 
                          animationDelay: `${idx * 100}ms`,
                          boxShadow: '0 0 20px rgba(0, 225, 255, 0.1)'
                        }}
                      >
                        {/* Hexagonal badge */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
                            <polygon 
                              points="50 1 95 25 95 75 50 99 5 75 5 25" 
                              fill="rgba(0, 225, 255, 0.1)" 
                              stroke="rgb(0, 225, 255)" 
                              strokeWidth="2"
                            />
                          </svg>
                          <span className="absolute text-neon-cyan font-bold text-xs">{idx + 1}</span>
                        </div>

                        {/* Priority indicator bars */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-8 h-0.5 bg-neon-cyan/30 rounded-full overflow-hidden"
                            >
                              <div 
                                className="h-full bg-neon-cyan animate-pulse"
                                style={{ 
                                  width: `${100 - i * 20}%`,
                                  animationDelay: `${i * 0.2}s`
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-start gap-3 pt-6">
                          {/* Animated icon */}
                          <div className="relative mt-1">
                            <span className="text-neon-cyan text-2xl animate-pulse">✦</span>
                            <div className="absolute inset-0 animate-ping opacity-20">
                              <span className="text-neon-cyan text-2xl">✦</span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <span className="text-gray-300 leading-relaxed">{item}</span>
                            
                            {/* Progress bar */}
                            <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan"
                                style={{ 
                                  width: `${60 + idx * 5}%`,
                                  animation: 'shimmer 3s infinite'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0, 225, 255, 0.05), transparent)',
                            animation: 'slide 2s infinite'
                          }}
                        ></div>

                        {/* Corner decorations */}
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-neon-cyan/30 group-hover:border-neon-cyan transition-colors"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interesting Facts - Enhanced with Card Animations */}
              <div className="bg-gradient-to-br from-black via-gray-900 to-black border p-6 relative overflow-hidden" style={{ borderColor: `${selectedPlanet.color}60` }}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full" 
                    style={{ 
                      backgroundImage: `radial-gradient(circle at 50% 50%, ${selectedPlanet.color} 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                      animation: 'float 20s infinite ease-in-out'
                    }}
                  ></div>
                </div>

                <div className="flex items-center gap-2 mb-4 pb-3 border-b relative z-10" style={{ borderColor: `${selectedPlanet.color}40` }}>
                  <span style={{ color: selectedPlanet.color, animationDuration: '10s' }} className="text-xl animate-spin">💫</span>
                  <span style={{ color: selectedPlanet.color }} className="text-sm font-bold tracking-wider animate-neon-pulse">FASCINATING_FACTS</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.interestingFacts.length} facts
                    </div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ 
                            backgroundColor: selectedPlanet.color,
                            animationDelay: `${i * 0.3}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs relative z-10">
                  {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.interestingFacts.map((fact: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="group relative perspective-1000"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative bg-gradient-to-br from-gray-950 to-gray-900 p-4 border-l-2 rounded-r-lg transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-2xl cursor-pointer animate-in slide-in-from-bottom"
                        style={{ 
                          borderColor: selectedPlanet.color,
                          boxShadow: `0 0 20px ${selectedPlanet.color}20`,
                          animationDelay: `${idx * 80}ms`
                        }}
                      >
                        {/* Glowing corner */}
                        <div 
                          className="absolute top-0 right-0 w-8 h-8 opacity-20 animate-pulse"
                          style={{ 
                            background: `radial-gradient(circle at top right, ${selectedPlanet.color}, transparent)`,
                            animationDelay: `${idx * 0.1}s`
                          }}
                        ></div>

                        {/* Fact number badge */}
                        <div 
                          className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black animate-pulse"
                          style={{ 
                            backgroundColor: selectedPlanet.color,
                            color: '#000'
                          }}
                        >
                          {idx + 1}
                        </div>

                        {/* Scan line effect */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(to bottom, transparent 0%, ${selectedPlanet.color}10 50%, transparent 100%)`,
                            animation: 'scan-line 2s infinite'
                          }}
                        ></div>

                        <span className="text-gray-300 relative z-10 leading-relaxed">{fact}</span>

                        {/* Bottom accent bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                          <div 
                            className="h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"
                            style={{ 
                              background: `linear-gradient(90deg, transparent, ${selectedPlanet.color}, transparent)`
                            }}
                          ></div>
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l opacity-30" style={{ borderColor: selectedPlanet.color }}></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r opacity-30" style={{ borderColor: selectedPlanet.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earth Comparison - Enhanced with Circular Gauges */}
              <div className="bg-gradient-to-br from-black via-green-950/10 to-black border border-neon-green/30 p-6 relative overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.2) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    animation: 'float 15s infinite ease-in-out'
                  }}
                ></div>

                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neon-green/20 relative z-10">
                  <div className="relative">
                    <span className="text-neon-green text-xl">🌍</span>
                    <div className="absolute inset-0 animate-ping opacity-30">
                      <span className="text-neon-green text-xl">🌍</span>
                    </div>
                  </div>
                  <span className="text-neon-green text-sm font-bold tracking-wider">EARTH_COMPARISON_ANALYSIS</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="text-[8px] text-neon-green font-mono bg-green-950/30 px-2 py-1 rounded border border-neon-green/30 animate-pulse">
                      BASELINE: 1.0 EARTH
                    </div>
                  </div>
                </div>
                
                {getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())?.earthComparison && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs relative z-10">
                    {Object.entries(getMissionData(selectedPlanet.name.split(' - ')[0].toLowerCase())!.earthComparison).map(([key, value], idx) => (
                      <div 
                        key={idx} 
                        className="group relative"
                      >
                        <div className="bg-gradient-to-br from-gray-950 to-gray-900 p-5 text-center border border-neon-green/20 hover:border-neon-green transition-all duration-500 hover:scale-110 cursor-pointer animate-in zoom-in"
                          style={{ 
                            animationDelay: `${idx * 100}ms`,
                            boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)'
                          }}
                        >
                          {/* Circular gauge */}
                          <div className="relative w-20 h-20 mx-auto mb-3">
                            {/* Outer ring */}
                            <svg className="w-full h-full transform -rotate-90">
                              <circle 
                                cx="40" 
                                cy="40" 
                                r="35" 
                                fill="none" 
                                stroke="rgba(0, 255, 65, 0.1)" 
                                strokeWidth="4"
                              />
                              <circle 
                                cx="40" 
                                cy="40" 
                                r="35" 
                                fill="none" 
                                stroke="rgb(0, 255, 65)" 
                                strokeWidth="4"
                                strokeDasharray={`${(idx + 1) * 40} 220`}
                                className="transition-all duration-1000"
                                style={{ 
                                  animation: 'pulse-glow 2s infinite',
                                  animationDelay: `${idx * 0.2}s`
                                }}
                              />
                            </svg>
                            
                            {/* Center icon/number */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-neon-green text-2xl font-bold animate-pulse">{idx + 1}</div>
                              </div>
                            </div>

                            {/* Rotating ring effect */}
                            <div className="absolute inset-0 border-2 border-neon-green/20 rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ animationDuration: '3s' }}
                            ></div>
                          </div>

                          {/* Label */}
                          <div className="text-gray-500 mb-2 capitalize text-[10px] uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          
                          {/* Value with glow */}
                          <div className="relative">
                            <div className="text-neon-green font-bold text-sm leading-tight px-2 py-1 rounded"
                              style={{ 
                                textShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
                                animation: 'neon-pulse 2s infinite',
                                animationDelay: `${idx * 0.3}s`
                              }}
                            >
                              {value}
                            </div>
                          </div>

                          {/* Data bars */}
                          <div className="mt-3 space-y-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                                  style={{ 
                                    width: `${100 - i * 20}%`,
                                    animation: 'shimmer 3s infinite',
                                    animationDelay: `${i * 0.3}s`
                                  }}
                                ></div>
                              </div>
                            ))}
                          </div>

                          {/* Corner accents */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-neon-green/30 group-hover:border-neon-green transition-colors"></div>
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-neon-green/30 group-hover:border-neon-green transition-colors"></div>

                          {/* Scan effect */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{
                              background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 65, 0.1), transparent)',
                              animation: 'scan-line 2s infinite'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
