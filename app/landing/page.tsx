import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Landing() {
  return (
    <main className="min-h-screen grid-bg bg-terminal-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8 slide-in">
            {/* Title */}
            <div className="border-4 border-neon-cyan pixel-border p-8 bg-panel-black">
              <h1 className="text-neon-cyan neon-glow text-5xl sm:text-7xl font-bold leading-tight mb-4">STUDY PLAN</h1>
              <h2 className="text-neon-green neon-glow text-3xl sm:text-5xl font-bold leading-tight">GENERATOR</h2>
            </div>

            {/* Subtitle */}
            <div
              className="border-4 border-neon-pink pixel-border p-6 bg-panel-black slide-in"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-neon-pink text-xl sm:text-3xl font-bold">Powered by Gemini AI</p>
              <p className="text-pixel-yellow text-base sm:text-lg mt-4">
                Generate personalized study plans in seconds
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 slide-in" style={{ animationDelay: "0.4s" }}>
              <div className="border-2 border-neon-green p-4 bg-panel-black hover:shadow-[0_0_20px_#00ff41] transition-all">
                <p className="text-neon-green text-lg font-bold mb-2">AI-Powered</p>
                <p className="text-pixel-yellow text-sm">Gemini AI creates custom study plans tailored to your needs</p>
              </div>
              <div className="border-2 border-neon-cyan p-4 bg-panel-black hover:shadow-[0_0_20px_#00e1ff] transition-all">
                <p className="text-neon-cyan text-lg font-bold mb-2">RPG Map</p>
                <p className="text-pixel-yellow text-sm">Visualize your learning journey as an 8-bit skill tree</p>
              </div>
              <div className="border-2 border-neon-pink p-4 bg-panel-black hover:shadow-[0_0_20px_#ff00e6] transition-all">
                <p className="text-neon-pink text-lg font-bold mb-2">Download</p>
                <p className="text-pixel-yellow text-sm">Export as JSON, Markdown, or PDF for offline access</p>
              </div>
              <div className="border-2 border-pixel-yellow p-4 bg-panel-black hover:shadow-[0_0_20px_#ffea00] transition-all">
                <p className="text-pixel-yellow text-lg font-bold mb-2">Custom Settings</p>
                <p className="text-pixel-yellow text-sm">Choose difficulty, time commitment, and learning format</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="slide-in" style={{ animationDelay: "0.6s" }}>
              <Link href="/app">
                <button className="bg-neon-green text-terminal-black border-2 border-neon-green px-8 py-4 text-xl font-bold hover:shadow-[0_0_30px_#00ff41] transition-all">
                  START GENERATING <ArrowRight className="inline ml-2" size={24} />
                </button>
              </Link>
            </div>

            {/* Footer text */}
            <p className="text-neon-cyan text-xs sm:text-sm mt-8 opacity-70">
              &gt; No login required • No data stored • 100% client-side generation
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
