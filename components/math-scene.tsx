"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function FibonacciSpiral() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = []
    const colors = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // 137.5 degrees

    for (let i = 0; i < 1000; i++) {
      const theta = i * goldenAngle
      const r = Math.sqrt(i) * 0.1
      const x = r * Math.cos(theta)
      const y = r * Math.sin(theta)
      const z = Math.sin(i * 0.1) * 0.5

      positions.push(x, y, z)

      // Color gradient from cyan to pink
      const t = i / 1000
      colors.push(t, 1 - t, 1)
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.1
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [positions, colors])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.05} vertexColors sizeAttenuation />
    </points>
  )
}

function MandelbrotPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Simplified Mandelbrot-inspired pattern
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")!

    const imageData = ctx.createImageData(256, 256)

    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const cx = (x - 128) / 64
        const cy = (y - 128) / 64

        let zx = 0
        let zy = 0
        let i = 0

        while (i < 50 && zx * zx + zy * zy < 4) {
          const tmp = zx * zx - zy * zy + cx
          zy = 2 * zx * zy + cy
          zx = tmp
          i++
        }

        const idx = (y * 256 + x) * 4
        const color = i / 50

        // Neon colors
        imageData.data[idx] = color * 255 * (x % 2 ? 1 : 0.5) // R - cyan/pink
        imageData.data[idx + 1] = color * 255 // G - green
        imageData.data[idx + 2] = color * 255 * (y % 2 ? 1 : 0.3) // B
        imageData.data[idx + 3] = 255 // A
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[8, 8, 1, 1]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.6} />
    </mesh>
  )
}

function WaveFunction() {
  const lineRef = useRef<THREE.Line>(null)

  useFrame((state) => {
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.getElapsedTime()

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        positions[i + 1] = Math.sin(x * 2 + time) * 0.5 + Math.cos(x * 3 - time * 0.5) * 0.3
      }

      lineRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const geometry = useMemo(() => {
    const pts = []
    for (let i = 0; i < 200; i++) {
      const x = (i - 100) * 0.05
      pts.push(new THREE.Vector3(x, 0, 0))
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    return geom
  }, [])

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#00ff41" }))} ref={lineRef} />
  )
}

export default function MathScene() {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative opacity-70">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="bg-transparent">
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00e1ff" />

        {/* Fibonacci spiral */}
        <FibonacciSpiral />

        {/* Mandelbrot-inspired plane */}
        <MandelbrotPlane />

        {/* Wave function */}
        <WaveFunction />
      </Canvas>
    </div>
  )
}
