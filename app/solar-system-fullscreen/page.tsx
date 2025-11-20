"use client"

import Link from "next/link"
import SolarSystemScene from "@/components/solar-system"

export default function FullscreenSolarSystem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-terminal-black">
      {/* Back Button */}
      <Link href="/">
        <button className="absolute top-4 left-4 z-[100] bg-terminal-black/90 border-2 border-neon-cyan px-4 py-2 backdrop-blur-sm hover:bg-neon-cyan/20 transition-all duration-300 group">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-neon-cyan text-sm font-bold neon-glow">BACK</span>
          </div>
        </button>
      </Link>
      
      {/* Solar System in Fullscreen */}
      <SolarSystemScene isFullscreen={true} />
    </div>
  )
}
