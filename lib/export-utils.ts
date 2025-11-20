import type { StudyPlan } from "./types"

export function generateMarkdown(plan: StudyPlan): string {
  let markdown = `# ${plan.title}\n\n`

  markdown += `**Difficulty:** ${plan.difficulty}  \n`
  markdown += `**Time Per Week:** ${plan.timePerWeek} hours  \n`
  markdown += `**Format:** ${plan.format}  \n`
  markdown += `**Estimated Duration:** ${plan.estimatedDuration}  \n\n`

  markdown += `## Prerequisites\n\n`
  plan.prerequisites.forEach((topic) => {
    markdown += `- ${topic.title}`
    if (topic.duration) markdown += ` (${topic.duration})`
    markdown += `\n`
  })

  markdown += `\n## Core Topics\n\n`
  plan.coreTopics.forEach((topic) => {
    markdown += `- ${topic.title}`
    if (topic.description) markdown += `: ${topic.description}`
    if (topic.duration) markdown += ` (${topic.duration})`
    markdown += `\n`
  })

  markdown += `\n## Progress Steps\n\n`
  plan.progressSteps.forEach((step) => {
    markdown += `### Week ${step.week}\n`
    markdown += `**Topics:**\n`
    step.topics.forEach((topic) => {
      markdown += `- ${topic}\n`
    })
    markdown += `\n**Milestones:**\n`
    step.milestones.forEach((milestone) => {
      markdown += `- ${milestone}\n`
    })
    markdown += `\n`
  })

  markdown += `## Resources\n\n`
  plan.resources.forEach((resource) => {
    markdown += `- **${resource.title}** (${resource.type})`
    if (resource.url) markdown += ` - [Link](${resource.url})`
    markdown += `\n`
  })

  markdown += `\n## Timeline\n\n${plan.timeline}\n\n`

  markdown += `## Tips for Success\n\n`
  plan.tips.forEach((tip) => {
    markdown += `- ${tip}\n`
  })

  return markdown
}

export function generateJSON(plan: StudyPlan): string {
  return JSON.stringify(plan, null, 2)
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function generatePDF(plan: StudyPlan, filename: string) {
  try {
    // Dynamic import to avoid adding jsPDF as required dependency
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    doc.setFont("courier", "bold")
    doc.setFontSize(16)
    doc.text(plan.title, pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    doc.setFont("courier", "normal")
    doc.setFontSize(10)
    doc.text(`Difficulty: ${plan.difficulty}`, 20, yPosition)
    yPosition += 7
    doc.text(`Time Per Week: ${plan.timePerWeek} hours`, 20, yPosition)
    yPosition += 7
    doc.text(`Estimated Duration: ${plan.estimatedDuration}`, 20, yPosition)
    yPosition += 15

    doc.setFont("courier", "bold")
    doc.setFontSize(12)
    doc.text("Prerequisites", 20, yPosition)
    yPosition += 10

    doc.setFont("courier", "normal")
    doc.setFontSize(9)
    plan.prerequisites.forEach((topic) => {
      doc.text(`• ${topic.title}`, 25, yPosition)
      yPosition += 6
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
    })

    yPosition += 5
    doc.setFont("courier", "bold")
    doc.setFontSize(12)
    doc.text("Core Topics", 20, yPosition)
    yPosition += 10

    doc.setFont("courier", "normal")
    doc.setFontSize(9)
    plan.coreTopics.forEach((topic) => {
      const text = `• ${topic.title}`
      doc.text(text, 25, yPosition)
      yPosition += 6
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
    })

    doc.save(filename)
  } catch (error) {
    console.error("[v0] PDF generation failed:", error)
    throw new Error("PDF generation requires jsPDF package")
  }
}
