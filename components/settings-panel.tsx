"use client"

import { useState } from "react"
import { Settings, X, Bell, Moon, Sun, Volume2, VolumeX, Save } from "lucide-react"
import type { StudyPlanSettings } from "@/lib/types"

interface SettingsPanelProps {
  studyPlanTitle: string
  onClose: () => void
}

export default function SettingsPanel({ studyPlanTitle, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<StudyPlanSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`settings-${studyPlanTitle}`)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      theme: "neon" as const,
      notificationsEnabled: false,
      dailyGoal: 60,
      reminderTime: "09:00",
      autoSave: true,
    }
  })

  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleSave = () => {
    localStorage.setItem(`settings-${studyPlanTitle}`, JSON.stringify(settings))
    
    // Show success feedback
    const successSound = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2V1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMeywGJHfH8NyQQAoVXrTp66hVFApGn+DyvmwhBjyU1vLMey")
    
    if (soundEnabled) {
      successSound.play().catch(() => {})
    }
    
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-terminal-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl border-4 border-neon-cyan pixel-border bg-panel-black slide-in relative">
        {/* Header */}
        <div className="border-b-2 border-neon-cyan p-4 flex items-center justify-between bg-terminal-black">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-neon-cyan animate-spin-slow" />
            <h2 className="text-neon-cyan text-xl font-bold neon-glow">SETTINGS</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Theme Selection */}
          <div className="border-2 border-neon-cyan p-4 bg-terminal-black">
            <label className="text-neon-cyan text-base font-bold mb-3 flex items-center gap-2">
              {settings.theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              THEME
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["dark", "light", "neon"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`p-3 border-2 font-bold text-sm transition-all ${
                    settings.theme === theme
                      ? "border-neon-green bg-neon-green text-terminal-black"
                      : "border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan"
                  }`}
                >
                  {theme.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="border-2 border-neon-green p-4 bg-terminal-black">
            <label className="text-neon-green text-base font-bold mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              NOTIFICATIONS
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Enable Notifications</span>
                <div
                  onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-12 h-6 border-2 rounded-full transition-all ${
                    settings.notificationsEnabled
                      ? "border-neon-green bg-neon-green"
                      : "border-gray-600 bg-terminal-black"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-terminal-black rounded-full transform transition-transform ${
                      settings.notificationsEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              {settings.notificationsEnabled && (
                <div className="slide-in">
                  <label className="text-gray-300 text-sm block mb-2">Daily Reminder Time</label>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                    className="w-full bg-terminal-black border-2 border-neon-green text-neon-green p-2 focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="border-2 border-neon-pink p-4 bg-terminal-black">
            <label className="text-neon-pink text-base font-bold mb-3 block">DAILY GOAL (MINUTES)</label>
            <div className="space-y-3">
              <input
                type="range"
                min="15"
                max="480"
                step="15"
                value={settings.dailyGoal}
                onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })}
                className="w-full h-2 bg-terminal-black border-2 border-neon-pink appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--neon-pink) 0%, var(--neon-pink) ${(settings.dailyGoal! / 480) * 100}%, var(--terminal-black) ${(settings.dailyGoal! / 480) * 100}%, var(--terminal-black) 100%)`,
                }}
              />
              <div className="flex justify-between text-neon-pink">
                <span className="text-sm">15 min</span>
                <span className="text-2xl font-bold">{settings.dailyGoal} min</span>
                <span className="text-sm">8 hrs</span>
              </div>
            </div>
          </div>

          {/* Auto Save */}
          <div className="border-2 border-pixel-yellow p-4 bg-terminal-black">
            <label className="text-pixel-yellow text-base font-bold mb-3 flex items-center gap-2">
              <Save className="w-5 h-5" />
              AUTO SAVE
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Automatically save progress</span>
              <div
                onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                className={`w-12 h-6 border-2 rounded-full transition-all ${
                  settings.autoSave ? "border-pixel-yellow bg-pixel-yellow" : "border-gray-600 bg-terminal-black"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-terminal-black rounded-full transform transition-transform ${
                    settings.autoSave ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Sound */}
          <div className="border-2 border-neon-cyan p-4 bg-terminal-black">
            <label className="text-neon-cyan text-base font-bold mb-3 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              SOUND EFFECTS
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Enable sound effects</span>
              <div
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 border-2 rounded-full transition-all ${
                  soundEnabled ? "border-neon-cyan bg-neon-cyan" : "border-gray-600 bg-terminal-black"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-terminal-black rounded-full transform transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neon-cyan p-4 bg-terminal-black flex justify-end gap-4">
          <button
            onClick={onClose}
            className="border-2 border-gray-600 px-6 py-2 text-gray-400 hover:border-neon-pink hover:text-neon-pink transition-all font-bold"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="border-2 border-neon-green bg-neon-green px-6 py-2 text-terminal-black hover:bg-transparent hover:text-neon-green transition-all font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            SAVE SETTINGS
          </button>
        </div>
      </div>
    </div>
  )
}
