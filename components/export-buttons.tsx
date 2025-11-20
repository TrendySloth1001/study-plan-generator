"use client"

import type { StudyPlan } from "@/lib/types"
import { generateMarkdown, generateJSON, downloadFile, generatePDF } from "@/lib/export-utils"
import { useState } from "react"

interface ExportButtonsProps {
  studyPlan: StudyPlan
}

export default function ExportButtons({ studyPlan }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<"json" | "markdown" | "pdf" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: "json" | "markdown" | "pdf") => {
    setExporting(format)
    setError(null)

    try {
      const timestamp = new Date().toISOString().split("T")[0]
      const baseFilename = `study-plan-${timestamp}`

      if (format === "json") {
        const content = generateJSON(studyPlan)
        downloadFile(content, `${baseFilename}.json`, "application/json")
      } else if (format === "markdown") {
        const content = generateMarkdown(studyPlan)
        downloadFile(content, `${baseFilename}.md`, "text/markdown")
      } else if (format === "pdf") {
        await generatePDF(studyPlan, `${baseFilename}.pdf`)
      }

      console.log(`[v0] Exported as ${format}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed"
      console.error("[v0] Export error:", message)
      setError(message)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="border-2 border-pixel-yellow p-3 bg-panel-black">
          <p className="text-pixel-yellow text-xs">ERROR: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleExport("json")}
          disabled={exporting !== null}
          className="bg-neon-cyan text-terminal-black border-2 border-neon-cyan px-4 py-2 text-xs font-bold hover:bg-neon-green hover:border-neon-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting === "json" ? "> EXPORTING..." : "> JSON FILE"}
        </button>

        <button
          onClick={() => handleExport("markdown")}
          disabled={exporting !== null}
          className="bg-neon-green text-terminal-black border-2 border-neon-green px-4 py-2 text-xs font-bold hover:bg-neon-cyan hover:border-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting === "markdown" ? "> EXPORTING..." : "> MARKDOWN FILE"}
        </button>

        <button
          onClick={() => handleExport("pdf")}
          disabled={exporting !== null}
          className="bg-neon-pink text-terminal-black border-2 border-neon-pink px-4 py-2 text-xs font-bold hover:bg-neon-cyan hover:border-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting === "pdf" ? "> EXPORTING..." : "> PDF FILE"}
        </button>
      </div>

      <p className="text-neon-green text-xs opacity-70">* files are generated in your browser, no data is stored</p>
    </div>
  )
}
