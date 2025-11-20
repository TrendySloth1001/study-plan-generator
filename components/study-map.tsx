"use client"

import type { StudyPlan } from "@/lib/types"

export default function StudyMap({ studyPlan }: { studyPlan: StudyPlan }) {
  return (
    <div className="w-full space-y-6 slide-in">
      {/* Prerequisites Section */}
      <div>
        <h3 className="text-2xl font-bold text-neon-cyan mb-4 pixel-border p-3 border-2 border-neon-cyan inline-block">
          PREREQUISITES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {studyPlan.prerequisites.map((prereq, i) => (
            <div
              key={i}
              className="border-2 border-neon-cyan p-4 bg-panel-black hover:bg-terminal-black transition-colors"
            >
              <p className="text-xl text-neon-cyan font-bold mb-2">{prereq.title}</p>
              {prereq.description && <p className="text-lg text-gray-300">{prereq.description}</p>}
              {prereq.duration && <p className="text-lg text-neon-cyan mt-2">Duration: {prereq.duration}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Core Topics Section */}
      <div>
        <h3 className="text-2xl font-bold text-neon-green mb-4 pixel-border p-3 border-2 border-neon-green inline-block">
          CORE TOPICS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {studyPlan.coreTopics.map((topic, i) => (
            <div
              key={i}
              className="border-2 border-neon-green p-4 bg-panel-black hover:bg-terminal-black transition-colors"
            >
              <p className="text-xl text-neon-green font-bold mb-2">{topic.title}</p>
              {topic.description && <p className="text-lg text-gray-300">{topic.description}</p>}
              {topic.duration && <p className="text-lg text-neon-green mt-2">Duration: {topic.duration}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Steps Section */}
      <div>
        <h3 className="text-2xl font-bold text-neon-pink mb-4 pixel-border p-3 border-2 border-neon-pink inline-block">
          WEEKLY MILESTONES
        </h3>
        <div className="space-y-4 mt-4">
          {studyPlan.progressSteps.map((step, i) => (
            <div key={i} className="border-2 border-neon-pink p-4 bg-panel-black">
              <p className="text-2xl text-neon-pink font-bold mb-3">Week {step.week}</p>
              <div className="mb-3">
                <p className="text-lg font-bold text-neon-yellow mb-2">Topics:</p>
                <ul className="list-disc list-inside space-y-1">
                  {step.topics.map((topic, j) => (
                    <li key={j} className="text-lg text-gray-300">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-lg font-bold text-neon-yellow mb-2">Milestones:</p>
                <ul className="list-disc list-inside space-y-1">
                  {step.milestones.map((milestone, j) => (
                    <li key={j} className="text-lg text-gray-300">
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="text-2xl font-bold text-neon-yellow mb-4 pixel-border p-3 border-2 border-neon-yellow inline-block">
          RESOURCES
        </h3>
        <div className="space-y-3 mt-4">
          {studyPlan.resources.map((resource, i) => (
            <div key={i} className="border-2 border-neon-yellow p-4 bg-panel-black flex justify-between items-center">
              <div>
                <p className="text-xl text-neon-yellow font-bold">{resource.title}</p>
                <p className="text-lg text-gray-300 uppercase tracking-wide">[{resource.type}]</p>
              </div>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan text-lg font-bold hover:text-neon-pink transition-colors"
                >
                  →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div>
        <h3 className="text-2xl font-bold text-neon-cyan mb-4 pixel-border p-3 border-2 border-neon-cyan inline-block">
          TIPS FOR SUCCESS
        </h3>
        <div className="space-y-3 mt-4">
          {studyPlan.tips.map((tip, i) => (
            <div key={i} className="border-l-4 border-neon-cyan pl-4 py-2 bg-panel-black p-4">
              <p className="text-lg text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
