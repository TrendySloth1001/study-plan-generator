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
}
