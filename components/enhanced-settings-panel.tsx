"use client"

import { useState, useEffect } from "react"
import { Settings, X, Bell, Moon, Sun, Volume2, VolumeX, Save, Check, Palette, Zap, Info } from "lucide-react"
import type { StudyPlanSettings } from "@/lib/types"

interface SettingsPanelProps {
  studyPlanTitle: string
  onClose: () => void
  onSettingsChange?: (settings: StudyPlanSettings) => void
}

export default function EnhancedSettingsPanel({ studyPlanTitle, onClose, onSettingsChange }: SettingsPanelProps) {
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

  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sound-enabled")
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  const [saved, setSaved] = useState(false)

  // Apply theme changes in real-time
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement
      
      if (settings.theme === "dark") {
        root.style.setProperty("--neon-cyan", "#64748b")
        root.style.setProperty("--neon-green", "#84cc16")
        root.style.setProperty("--neon-pink", "#f97316")
        root.style.setProperty("--terminal-black", "#0f172a")
        root.style.setProperty("--panel-black", "#1e293b")
      } else if (settings.theme === "light") {
        root.style.setProperty("--neon-cyan", "#0891b2")
        root.style.setProperty("--neon-green", "#16a34a")
        root.style.setProperty("--neon-pink", "#dc2626")
        root.style.setProperty("--terminal-black", "#f8fafc")
        root.style.setProperty("--panel-black", "#e2e8f0")
      } else {
        // Neon theme (default)
        root.style.setProperty("--neon-cyan", "#00e1ff")
        root.style.setProperty("--neon-green", "#00ff41")
        root.style.setProperty("--neon-pink", "#ff006e")
        root.style.setProperty("--terminal-black", "#0a0a0a")
        root.style.setProperty("--panel-black", "#0f0f0f")
      }
    }
  }, [settings.theme])

  // Setup notification scheduling
  useEffect(() => {
    if (settings.notificationsEnabled && settings.reminderTime) {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }

      // Schedule daily notification
      const scheduleNotification = () => {
        const [hours, minutes] = settings.reminderTime!.split(":")
        const now = new Date()
        const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes))

        if (scheduledTime < now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1)
        }

        const timeUntilNotification = scheduledTime.getTime() - now.getTime()

        const timeoutId = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Study Reminder 📚", {
              body: `Time to work on your ${studyPlanTitle} learning plan!`,
              icon: "/icon.png",
              badge: "/badge.png",
            })
          }
          scheduleNotification() // Reschedule for tomorrow
        }, timeUntilNotification)

        return timeoutId
      }

      const timeoutId = scheduleNotification()
      return () => clearTimeout(timeoutId)
    }
  }, [settings.notificationsEnabled, settings.reminderTime, studyPlanTitle])

  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave) {
      const interval = setInterval(() => {
        localStorage.setItem(`settings-${studyPlanTitle}`, JSON.stringify(settings))
      }, 5000) // Auto-save every 5 seconds

      return () => clearInterval(interval)
    }
  }, [settings, studyPlanTitle])

  const handleSave = () => {
    localStorage.setItem(`settings-${studyPlanTitle}`, JSON.stringify(settings))
    localStorage.setItem("sound-enabled", JSON.stringify(soundEnabled))
    
    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(settings)
    }
    
    // Show success feedback
    setSaved(true)
    
    if (soundEnabled) {
      // Simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = "sine"
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (error) {
        console.log("Audio not supported")
      }
    }
    
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  const updateSettings = (key: keyof StudyPlanSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        new Notification("Notifications Enabled! 🔔", {
          body: "You'll receive daily reminders for your study plan.",
        })
      }
    }
  }

  const themePreview = {
    neon: {
      bg: "bg-terminal-black",
      border: "border-neon-cyan",
      text: "text-neon-cyan",
      accent: "bg-gradient-to-r from-neon-cyan via-neon-green to-neon-pink",
    },
    dark: {
      bg: "bg-slate-900",
      border: "border-slate-600",
      text: "text-slate-400",
      accent: "bg-gradient-to-r from-slate-600 via-lime-500 to-orange-500",
    },
    light: {
      bg: "bg-slate-50",
      border: "border-cyan-600",
      text: "text-cyan-900",
      accent: "bg-gradient-to-r from-cyan-600 via-green-600 to-red-600",
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-terminal-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl border-4 border-neon-cyan pixel-border bg-panel-black slide-in relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-neon-cyan blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-pink blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Header */}
        <div className="border-b-2 border-neon-cyan p-5 flex items-center justify-between bg-terminal-black relative">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-neon-cyan animate-spin-slow" />
            <div>
              <h2 className="text-neon-cyan text-2xl font-bold neon-glow">SETTINGS</h2>
              <p className="text-gray-400 text-xs mt-1">Customize your learning experience</p>
            </div>
          </div>
          {saved && (
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 border-2 border-neon-green bg-terminal-black text-neon-green font-bold animate-in slide-in-from-top">
              <Check className="w-5 h-5" />
              SAVED!
            </div>
          )}
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-terminal-black transition-all flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar relative">
          {/* Theme Selection */}
          <div className="border-2 border-neon-cyan p-5 bg-terminal-black/80 backdrop-blur-sm">
            <label className="text-neon-cyan text-lg font-bold mb-4 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              THEME
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["dark", "light", "neon"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettings("theme", theme)}
                  className={`p-4 border-2 font-bold text-sm transition-all group ${
                    settings.theme === theme
                      ? "border-neon-green bg-neon-green text-terminal-black scale-105"
                      : "border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan hover:scale-105"
                  }`}
                >
                  <div className={`h-12 mb-2 ${themePreview[theme].accent} rounded`}></div>
                  <div className="flex items-center justify-center gap-2">
                    {theme === "dark" ? <Moon className="w-4 h-4" /> : theme === "light" ? <Sun className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    <span>{theme.toUpperCase()}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-3 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Theme changes apply immediately and affect all views
            </p>
          </div>

          {/* Notifications */}
          <div className="border-2 border-neon-green p-5 bg-terminal-black/80 backdrop-blur-sm">
            <label className="text-neon-green text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              NOTIFICATIONS
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex-1">
                  <span className="text-gray-300 font-bold">Enable Daily Reminders</span>
                  <p className="text-gray-500 text-xs mt-1">Get notified to stay on track</p>
                </div>
                <div
                  onClick={() => {
                    updateSettings("notificationsEnabled", !settings.notificationsEnabled)
                    if (!settings.notificationsEnabled) {
                      requestNotificationPermission()
                    }
                  }}
                  className={`w-14 h-7 border-2 rounded-full transition-all ${
                    settings.notificationsEnabled
                      ? "border-neon-green bg-neon-green"
                      : "border-gray-600 bg-terminal-black group-hover:border-neon-green"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-terminal-black rounded-full transform transition-transform ${
                      settings.notificationsEnabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              {settings.notificationsEnabled && (
                <div className="slide-in pl-4 border-l-2 border-neon-green/30">
                  <label className="text-gray-300 text-sm font-bold block mb-2">Reminder Time</label>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => updateSettings("reminderTime", e.target.value)}
                    className="w-full bg-terminal-black border-2 border-neon-green text-neon-green p-3 focus:outline-none focus:border-neon-cyan text-lg font-mono"
                  />
                  <p className="text-gray-500 text-xs mt-2">Browser notifications must be enabled</p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="border-2 border-neon-pink p-5 bg-terminal-black/80 backdrop-blur-sm">
            <label className="text-neon-pink text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              DAILY GOAL
            </label>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-neon-pink mb-2">
                  {settings.dailyGoal} <span className="text-2xl text-gray-400">min</span>
                </div>
                <p className="text-gray-400 text-sm">
                  ≈ {Math.floor(settings.dailyGoal! / 60)} hours {settings.dailyGoal! % 60} minutes
                </p>
              </div>
              <input
                type="range"
                min="15"
                max="480"
                step="15"
                value={settings.dailyGoal}
                onChange={(e) => updateSettings("dailyGoal", Number(e.target.value))}
                className="w-full h-3 bg-gray-800 border-2 border-neon-pink appearance-none cursor-pointer rounded-full"
                style={{
                  background: `linear-gradient(to right, var(--neon-pink) 0%, var(--neon-pink) ${(settings.dailyGoal! / 480) * 100}%, #1a1a1a ${(settings.dailyGoal! / 480) * 100}%, #1a1a1a 100%)`,
                }}
              />
              <div className="flex justify-between text-gray-400 text-xs">
                <span>15 min</span>
                <span>2 hrs</span>
                <span>4 hrs</span>
                <span>8 hrs</span>
              </div>
            </div>
          </div>

          {/* Auto Save */}
          <div className="border-2 border-pixel-yellow p-5 bg-terminal-black/80 backdrop-blur-sm">
            <label className="text-pixel-yellow text-lg font-bold mb-4 flex items-center gap-2">
              <Save className="w-6 h-6" />
              AUTO SAVE
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex-1">
                <span className="text-gray-300 font-bold">Automatically Save Progress</span>
                <p className="text-gray-500 text-xs mt-1">Saves every 5 seconds</p>
              </div>
              <div
                onClick={() => updateSettings("autoSave", !settings.autoSave)}
                className={`w-14 h-7 border-2 rounded-full transition-all ${
                  settings.autoSave
                    ? "border-pixel-yellow bg-pixel-yellow"
                    : "border-gray-600 bg-terminal-black group-hover:border-pixel-yellow"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-terminal-black rounded-full transform transition-transform ${
                    settings.autoSave ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Sound */}
          <div className="border-2 border-neon-cyan p-5 bg-terminal-black/80 backdrop-blur-sm">
            <label className="text-neon-cyan text-lg font-bold mb-4 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              SOUND EFFECTS
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex-1">
                <span className="text-gray-300 font-bold">Enable Audio Feedback</span>
                <p className="text-gray-500 text-xs mt-1">Play sounds for actions and notifications</p>
              </div>
              <div
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-7 border-2 rounded-full transition-all ${
                  soundEnabled
                    ? "border-neon-cyan bg-neon-cyan"
                    : "border-gray-600 bg-terminal-black group-hover:border-neon-cyan"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-terminal-black rounded-full transform transition-transform ${
                    soundEnabled ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neon-cyan p-5 bg-terminal-black flex justify-between items-center relative">
          <p className="text-gray-500 text-xs">
            {settings.autoSave && <span className="text-neon-green">● Auto-saving enabled</span>}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="border-2 border-gray-600 px-6 py-3 text-gray-400 hover:border-neon-pink hover:text-neon-pink transition-all font-bold"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="border-2 border-neon-green bg-neon-green px-8 py-3 text-terminal-black hover:bg-transparent hover:text-neon-green transition-all font-bold flex items-center gap-2 shadow-lg shadow-neon-green/30"
            >
              <Save className="w-5 h-5" />
              SAVE SETTINGS
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
          border: 1px solid #333;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--neon-cyan);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--neon-green);
        }
      `}</style>
    </div>
  )
}
