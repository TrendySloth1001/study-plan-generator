# 🎮 Study Plan Generator

An AI-powered study plan generator with retro gaming aesthetics, featuring interactive progress tracking, visual roadmaps, and an intelligent chatbot assistant.

## ✨ Features

### 🤖 AI-Powered Plan Generation
- Generate comprehensive study plans using **Ollama + Llama2** (local AI)
- Customizable difficulty levels (beginner, intermediate, advanced)
- Flexible time commitment options
- Multiple learning formats (theory-heavy, project-heavy, balanced)

### 🗺️ Interactive Visual Map
- **RPG-style journey map** with visual progress tracking
- **Dual view modes**: Map view for visual learners, List view for checklist fans
- Click-to-complete functionality for all milestones
- Progress saved locally in browser

### ✅ Progress Tracking
- Mark prerequisites, topics, and milestones as complete
- Real-time completion percentage
- Visual progress bar with gradient effects
- Persistent storage across sessions

### 💬 AI Chatbot Assistant
- Intelligent message parsing
- **Slash commands**:
  - `/topics` - Browse available topics
  - `/plan <topic>` - Generate a study plan
- Natural language understanding
- Context-aware responses

### 📊 Study Plan Components
- **Prerequisites**: Skills needed before starting
- **Core Topics**: Main subjects to master
- **Weekly Milestones**: Week-by-week breakdown
- **Resources**: Curated learning materials
- **Tips**: Expert advice for success

### 📥 Export Options
- Export plans as PDF
- Export as formatted text
- Save and share your learning roadmap

### 🎨 Retro Gaming Theme
- Neon cyberpunk aesthetics
- Pixel-perfect borders and effects
- CRT scanline overlay
- Animated glowing text
- Responsive grid background

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or npm/pnpm
- **Ollama installed and running** ([Installation Guide](OLLAMA_SETUP.md))
- **Llama2 model downloaded** (`ollama pull llama2`)

### Installation

1. **Install Ollama** (if not already installed)
   
   **macOS:**
   ```bash
   brew install ollama
   ```
   
   **Linux:**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
   
   **Windows:** Download from [https://ollama.ai/download/windows](https://ollama.ai/download/windows)

2. **Pull Llama2 model**
   ```bash
   ollama pull llama2
   ```

3. **Start Ollama service**
   ```bash
   ollama serve
   ```
   (On macOS, it usually runs automatically after installation)

4. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-plan-generator
   ```

5. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

6. **Set up environment variables (Optional)**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if you need to customize Ollama host:
   ```
   OLLAMA_HOST=http://localhost:11434
   ```

7. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Generating a Study Plan

1. **Via Form**:
   - Enter your topic (e.g., "Data Science", "Web Development")
   - Select difficulty level
   - Choose hours per week
   - Pick learning format
   - Click "GENERATE PLAN"

2. **Via Chatbot**:
   - Click "AI CHAT ASSISTANT" in the sidebar
   - Type naturally: "Create a plan for Python programming"
   - Or use slash commands: `/plan Machine Learning`

### Tracking Progress

1. **Map View**:
   - Follow the visual journey from start to finish
   - Click on any item to mark it complete
   - Watch your progress bar grow

2. **List View**:
   - Toggle to checklist mode for compact view
   - Click checkboxes to track completion
   - Strikethrough completed items

### Using Slash Commands

- Type `/` in the chat to see available commands
- `/topics` - View all available topics
- `/plan <topic>` - Generate a study plan

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Ollama + Llama2 (Local LLM)
- **Icons**: Lucide React
- **PDF Export**: jsPDF
- **Storage**: LocalStorage for progress tracking

## 📁 Project Structure

```
study-plan-generator/
├── app/
│   ├── page.tsx              # Landing page
│   ├── app/
│   │   └── page.tsx          # Main app page
│   ├── api/
│   │   └── generate-plan/
│   │       └── route.ts      # API endpoint
│   └── globals.css           # Global styles & animations
├── components/
│   ├── chat-bot.tsx          # AI chatbot with slash commands
│   ├── enhanced-study-map.tsx # Visual map with tracking
│   ├── study-form.tsx        # Plan generation form
│   ├── loading-animation.tsx  # Loading states
│   └── export-buttons.tsx    # Export functionality
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🎨 Theme Customization

The app uses CSS custom properties for easy theme customization. Edit `app/globals.css`:

```css
:root {
  --neon-green: #00ff41;
  --neon-pink: #ff00e6;
  --neon-cyan: #00e1ff;
  --pixel-yellow: #ffea00;
  --terminal-black: #000000;
  --panel-black: #0f0f0f;
}
```

## 🐛 Troubleshooting

### Ollama Connection Error
**Problem**: "Failed to generate response" or connection refused

**Solutions**:
1. Verify Ollama is running: `curl http://localhost:11434`
2. Start Ollama service: `ollama serve`
3. Check if llama2 is installed: `ollama list`
4. If not installed: `ollama pull llama2`

### Slow AI Response Times
**Problem**: AI takes too long to generate plans

**Solutions**:
1. Use a smaller model: `ollama pull llama2:7b` (then update route files)
2. Ensure sufficient RAM (minimum 8GB recommended)
3. Use GPU acceleration if available (automatic with Ollama)
4. Keep Ollama service running to avoid cold starts

### Progress Not Saving
**Problem**: Progress resets on page refresh

**Solution**: Ensure browser localStorage is enabled and not in incognito mode

### Layout Issues on Mobile
**Problem**: Spacing or responsive issues

**Solution**: The app is optimized for screens 320px+. Try different zoom levels or clear cache.

### Port Conflict
**Problem**: Ollama port 11434 is already in use

**Solution**: Stop other services using the port, or configure Ollama to use a different port and update `OLLAMA_HOST` in `.env.local`

For detailed Ollama setup instructions, see [OLLAMA_SETUP.md](OLLAMA_SETUP.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Powered by Ollama + Llama2 (Local AI)
- Built with Next.js
- Retro gaming aesthetic inspired by classic terminal interfaces

## 🔗 Links

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Ollama Website](https://ollama.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Llama2 Model](https://ollama.ai/library/llama2)

---

Made with 💚 for continuous learners
