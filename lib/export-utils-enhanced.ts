import type { StudyPlan, TrackedProgress, BranchStructure } from "./types"

export interface ComprehensiveExport {
  exportDate: string
  studyPlan: StudyPlan
  progress: {
    entries: TrackedProgress
    statistics: {
      totalItems: number
      completedItems: number
      completionPercentage: number
      timeSpent: number
      lastUpdated?: string
    }
  }
  branches?: BranchStructure
  customNotes: {
    [nodeKey: string]: string
  }
  comments: {
    [nodeKey: string]: Array<{
      id: string
      text: string
      timestamp: string
      author: string
    }>
  }
  aiExplanations: {
    [nodeKey: string]: string
  }
  settings?: {
    theme: string
    dailyGoal: number
    notificationsEnabled: boolean
    autoSave: boolean
  }
}

export function exportAllData(studyPlan: StudyPlan, progress: TrackedProgress): ComprehensiveExport {
  const exportData: ComprehensiveExport = {
    exportDate: new Date().toISOString(),
    studyPlan,
    progress: {
      entries: progress,
      statistics: calculateStatistics(studyPlan, progress)
    },
    customNotes: {},
    comments: {},
    aiExplanations: {},
  }

  // Collect all localStorage data
  if (typeof window !== "undefined") {
    const allKeys = Object.keys(localStorage)

    // Custom notes
    allKeys
      .filter(key => key.startsWith("custom-notes-"))
      .forEach(key => {
        const nodeKey = key.replace("custom-notes-", "")
        exportData.customNotes[nodeKey] = localStorage.getItem(key) || ""
      })

    // Comments
    allKeys
      .filter(key => key.startsWith("comments-"))
      .forEach(key => {
        const nodeKey = key.replace("comments-", "")
        const commentsData = localStorage.getItem(key)
        if (commentsData) {
          try {
            exportData.comments[nodeKey] = JSON.parse(commentsData)
          } catch (e) {
            console.error("Failed to parse comments:", e)
          }
        }
      })

    // AI Explanations
    allKeys
      .filter(key => key.startsWith("ai-explanation-"))
      .forEach(key => {
        const nodeKey = key.replace("ai-explanation-", "")
        exportData.aiExplanations[nodeKey] = localStorage.getItem(key) || ""
      })

    // Settings
    const settingsKey = `settings-${studyPlan.title}`
    const settingsData = localStorage.getItem(settingsKey)
    if (settingsData) {
      try {
        exportData.settings = JSON.parse(settingsData)
      } catch (e) {
        console.error("Failed to parse settings:", e)
      }
    }

    // Branches
    const branchesKey = `branches-${studyPlan.title}`
    const branchesData = localStorage.getItem(branchesKey)
    if (branchesData) {
      try {
        exportData.branches = JSON.parse(branchesData)
      } catch (e) {
        console.error("Failed to parse branches:", e)
      }
    }
  }

  return exportData
}

function calculateStatistics(studyPlan: StudyPlan, progress: TrackedProgress) {
  const totalItems =
    studyPlan.prerequisites.length +
    studyPlan.coreTopics.length +
    studyPlan.progressSteps.reduce((sum, step) => sum + step.topics.length + step.milestones.length, 0)

  const completedItems = Object.values(progress).filter(p => p?.completed).length
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const timeSpent = Object.values(progress).reduce((sum, p) => sum + (p?.timeSpent || 0), 0)

  const timestamps = Object.values(progress)
    .map(p => p?.timestamp)
    .filter(Boolean) as string[]
  
  const lastUpdated = timestamps.length > 0
    ? new Date(Math.max(...timestamps.map(t => new Date(t).getTime()))).toISOString()
    : undefined

  return {
    totalItems,
    completedItems,
    completionPercentage,
    timeSpent,
    lastUpdated,
  }
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importJSON(jsonString: string): ComprehensiveExport | null {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error("Failed to parse JSON:", e)
    return null
  }
}

export function restoreFromExport(exportData: ComprehensiveExport) {
  if (typeof window === "undefined") return

  const { studyPlan, progress, customNotes, comments, aiExplanations, settings, branches } = exportData

  // Restore progress
  localStorage.setItem(`progress-${studyPlan.title}`, JSON.stringify(progress.entries))

  // Restore custom notes
  Object.entries(customNotes).forEach(([nodeKey, note]) => {
    localStorage.setItem(`custom-notes-${nodeKey}`, note)
  })

  // Restore comments
  Object.entries(comments).forEach(([nodeKey, commentList]) => {
    localStorage.setItem(`comments-${nodeKey}`, JSON.stringify(commentList))
  })

  // Restore AI explanations
  Object.entries(aiExplanations).forEach(([nodeKey, explanation]) => {
    localStorage.setItem(`ai-explanation-${nodeKey}`, explanation)
  })

  // Restore settings
  if (settings) {
    localStorage.setItem(`settings-${studyPlan.title}`, JSON.stringify(settings))
  }

  // Restore branches
  if (branches) {
    localStorage.setItem(`branches-${studyPlan.title}`, JSON.stringify(branches))
  }
}
