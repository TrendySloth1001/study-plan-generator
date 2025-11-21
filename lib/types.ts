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
  type: "book" | "course" | "article" | "video" | "project"
  url?: string
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
