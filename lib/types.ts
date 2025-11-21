export interface StudyTopic {
  id: string
  title: string
  description?: string
  duration?: string
}

export interface ProgressStep {
  week: number
  topics: string[]
  milestones: string[]
}

export interface Resource {
  title: string
  type: "book" | "course" | "article" | "video" | "project" | "documentation"
  url?: string
}

export interface LeafNode {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  completed?: boolean
}

export interface Subtopic {
  id: string
  title: string
  description: string
  duration: string
  resources: Resource[]
  leafNodes: LeafNode[]
  completed?: boolean
}

export interface Branch {
  id: string
  title: string
  description: string
  subtopics: Subtopic[]
  completed?: boolean
}

export interface BranchStructure {
  mainTopic: string
  branches: Branch[]
  prerequisites: string[]
  estimatedTime: string
  skillLevel: "beginner" | "intermediate" | "advanced"
}

export interface ProgressEntry {
  completed: boolean
  timestamp?: string
  notes?: string
  timeSpent?: number // in minutes
}

export interface TrackedProgress {
  [key: string]: ProgressEntry
}

export interface StudyPlanSettings {
  theme?: "dark" | "light" | "neon"
  notificationsEnabled?: boolean
  dailyGoal?: number // minutes
  reminderTime?: string
  autoSave?: boolean
}

export interface StudyPlan {
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  timePerWeek: number
  timeUnit: "hours" | "days" | "weeks" | "months"
  format: "theory-heavy" | "project-heavy" | "balanced"
  prerequisites: StudyTopic[]
  coreTopics: StudyTopic[]
  progressSteps: ProgressStep[]
  resources: Resource[]
  timeline: string
  estimatedDuration: string
  tips: string[]
  settings?: StudyPlanSettings
}
