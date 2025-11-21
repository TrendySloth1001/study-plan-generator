/**
 * Enhanced Storage Manager for Study Plan Generator
 * Provides structured JSON storage with proper formatting
 */

import type { StudyPlan, TrackedProgress, BranchStructure } from "./types"

export interface StorageData {
  version: string
  lastUpdated: string
  studyPlan: StudyPlan
  progress: {
    items: TrackedProgress
    statistics: {
      totalNodes: number
      completedNodes: number
      completionPercentage: number
      totalTimeSpent: number
      averageTimePerNode: number
      lastActivity: string | null
    }
  }
  branches?: BranchStructure
  aiData: {
    explanations: Record<string, string>
    lastFetched: Record<string, string>
  }
  userSettings: {
    theme: string
    autoSave: boolean
    notifications: boolean
    dailyGoal: number
  }
  metadata: {
    createdAt: string
    totalSessions: number
    lastSession: string
  }
}

/**
 * Calculate comprehensive progress statistics
 */
function calculateStatistics(
  studyPlan: StudyPlan,
  progress: TrackedProgress,
  branchStructure?: BranchStructure
): StorageData["progress"]["statistics"] {
  let totalNodes = 0
  let completedNodes = 0
  let totalTimeSpent = 0
  let lastActivity: string | null = null

  // Count nodes from study plan
  totalNodes += studyPlan.prerequisites.length
  totalNodes += studyPlan.coreTopics.length
  totalNodes += studyPlan.progressSteps.length

  // Count nodes from branches if they exist
  if (branchStructure && branchStructure.branches) {
    branchStructure.branches.forEach((branch) => {
      totalNodes += 1 // Branch itself
      branch.subtopics.forEach((subtopic) => {
        totalNodes += 1 // Subtopic
        totalNodes += subtopic.leafNodes.length // Leaf nodes
      })
    })
  }

  // Calculate from progress
  Object.values(progress).forEach((entry) => {
    if (entry.completed) {
      completedNodes++
    }
    if (entry.timeSpent) {
      totalTimeSpent += entry.timeSpent
    }
    if (entry.timestamp) {
      if (!lastActivity || new Date(entry.timestamp) > new Date(lastActivity)) {
        lastActivity = entry.timestamp
      }
    }
  })

  const completionPercentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
  const averageTimePerNode = completedNodes > 0 ? Math.round(totalTimeSpent / completedNodes) : 0

  return {
    totalNodes,
    completedNodes,
    completionPercentage,
    totalTimeSpent,
    averageTimePerNode,
    lastActivity,
  }
}

/**
 * Collect all AI explanations from localStorage
 */
function collectAIExplanations(studyPlanTitle: string): StorageData["aiData"] {
  const explanations: Record<string, string> = {}
  const lastFetched: Record<string, string> = {}

  // Scan localStorage for AI explanation keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith("ai-explanation-")) {
      const nodeKey = key.replace("ai-explanation-", "")
      const value = localStorage.getItem(key)
      if (value) {
        explanations[nodeKey] = value
        lastFetched[nodeKey] = new Date().toISOString()
      }
    }
  }

  return { explanations, lastFetched }
}

/**
 * Load settings from localStorage
 */
function loadSettings(studyPlanTitle: string): StorageData["userSettings"] {
  const settingsKey = `settings-${studyPlanTitle}`
  const savedSettings = localStorage.getItem(settingsKey)

  if (savedSettings) {
    try {
      return JSON.parse(savedSettings)
    } catch (e) {
      console.error("Failed to parse settings:", e)
    }
  }

  // Default settings
  return {
    theme: "dark",
    autoSave: true,
    notifications: true,
    dailyGoal: 2,
  }
}

/**
 * Load metadata from localStorage
 */
function loadMetadata(studyPlanTitle: string): StorageData["metadata"] {
  const metadataKey = `metadata-${studyPlanTitle}`
  const savedMetadata = localStorage.getItem(metadataKey)

  if (savedMetadata) {
    try {
      const metadata = JSON.parse(savedMetadata)
      // Increment session count
      metadata.totalSessions += 1
      metadata.lastSession = new Date().toISOString()
      localStorage.setItem(metadataKey, JSON.stringify(metadata))
      return metadata
    } catch (e) {
      console.error("Failed to parse metadata:", e)
    }
  }

  // Create new metadata
  const newMetadata: StorageData["metadata"] = {
    createdAt: new Date().toISOString(),
    totalSessions: 1,
    lastSession: new Date().toISOString(),
  }
  localStorage.setItem(metadataKey, JSON.stringify(newMetadata))
  return newMetadata
}

/**
 * Save all data to localStorage with proper structure
 */
export function saveAllData(
  studyPlan: StudyPlan,
  progress: TrackedProgress,
  branchStructure?: BranchStructure
): StorageData {
  const storageData: StorageData = {
    version: "2.0.0",
    lastUpdated: new Date().toISOString(),
    studyPlan,
    progress: {
      items: progress,
      statistics: calculateStatistics(studyPlan, progress, branchStructure),
    },
    branches: branchStructure,
    aiData: collectAIExplanations(studyPlan.title),
    userSettings: loadSettings(studyPlan.title),
    metadata: loadMetadata(studyPlan.title),
  }

  // Save to localStorage with proper key
  const storageKey = `study-data-${studyPlan.title}`
  localStorage.setItem(storageKey, JSON.stringify(storageData, null, 2))

  // Also save progress separately for backwards compatibility
  localStorage.setItem(`progress-${studyPlan.title}`, JSON.stringify(progress))

  if (branchStructure) {
    localStorage.setItem(`branches-${studyPlan.title}`, JSON.stringify(branchStructure))
  }

  return storageData
}

/**
 * Load all data from localStorage
 */
export function loadAllData(studyPlanTitle: string): StorageData | null {
  const storageKey = `study-data-${studyPlanTitle}`
  const savedData = localStorage.getItem(storageKey)

  if (savedData) {
    try {
      return JSON.parse(savedData)
    } catch (e) {
      console.error("Failed to parse storage data:", e)
      return null
    }
  }

  return null
}

/**
 * Export data as formatted JSON file
 */
export function exportDataAsJSON(storageData: StorageData, filename?: string): void {
  const jsonString = JSON.stringify(storageData, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename || `${storageData.studyPlan.title}-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import data from JSON file
 */
export function importDataFromJSON(jsonString: string): StorageData | null {
  try {
    const data: StorageData = JSON.parse(jsonString)

    // Validate structure
    if (!data.studyPlan || !data.progress) {
      throw new Error("Invalid data structure")
    }

    return data
  } catch (e) {
    console.error("Failed to import data:", e)
    return null
  }
}

/**
 * Restore data from StorageData object
 */
export function restoreData(storageData: StorageData): void {
  const { studyPlan, progress, branches, aiData, userSettings } = storageData

  // Save main data
  localStorage.setItem(`study-data-${studyPlan.title}`, JSON.stringify(storageData, null, 2))

  // Save individual pieces for backwards compatibility
  localStorage.setItem(`progress-${studyPlan.title}`, JSON.stringify(progress.items))

  if (branches) {
    localStorage.setItem(`branches-${studyPlan.title}`, JSON.stringify(branches))
  }

  if (userSettings) {
    localStorage.setItem(`settings-${studyPlan.title}`, JSON.stringify(userSettings))
  }

  // Restore AI explanations
  Object.entries(aiData.explanations).forEach(([nodeKey, explanation]) => {
    localStorage.setItem(`ai-explanation-${nodeKey}`, explanation)
  })
}

/**
 * Get progress summary for display
 */
export function getProgressSummary(storageData: StorageData): string {
  const { statistics } = storageData.progress
  const hours = Math.floor(statistics.totalTimeSpent / 60)
  const minutes = statistics.totalTimeSpent % 60

  return `
📊 Progress Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: ${statistics.completedNodes}/${statistics.totalNodes} nodes
📈 Progress: ${statistics.completionPercentage}%
⏱️  Time Spent: ${hours}h ${minutes}m
📚 Avg per Node: ${statistics.averageTimePerNode} min
🎯 Last Activity: ${statistics.lastActivity ? new Date(statistics.lastActivity).toLocaleString() : "Never"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
}

/**
 * Auto-save wrapper with debouncing
 */
let autoSaveTimeout: NodeJS.Timeout | null = null

export function autoSave(
  studyPlan: StudyPlan,
  progress: TrackedProgress,
  branchStructure?: BranchStructure,
  delay: number = 2000
): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }

  autoSaveTimeout = setTimeout(() => {
    saveAllData(studyPlan, progress, branchStructure)
    console.log("✅ Auto-saved at", new Date().toLocaleTimeString())
  }, delay)
}
