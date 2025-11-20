# 🎮 Study Plan Generator

An AI-powered study plan generator with retro gaming aesthetics, featuring interactive progress tracking, visual roadmaps, and an intelligent chatbot assistant.

## ✨ Features

### 🤖 AI-Powered Plan Generation
- Generate comprehensive study plans using Google Gemini AI
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
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-plan-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Gemini API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
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
- **AI**: Google Gemini 2.5 Flash via Vercel AI SDK
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

### API Quota Exceeded Error
**Problem**: "You exceeded your current quota" error

**Solutions**:
1. Get a new API key from [Google AI Studio](https://ai.google.dev/)
2. Check your usage at [Google AI Usage Dashboard](https://ai.dev/usage?tab=rate-limit)
3. Wait for quota reset or upgrade your plan

### Progress Not Saving
**Problem**: Progress resets on page refresh

**Solution**: Ensure browser localStorage is enabled and not in incognito mode

### Layout Issues on Mobile
**Problem**: Spacing or responsive issues

**Solution**: The app is optimized for screens 320px+. Try different zoom levels or clear cache.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Powered by Google Gemini AI
- Built with Next.js and Vercel AI SDK
- Retro gaming aesthetic inspired by classic terminal interfaces

## 🔗 Links

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

Made with 💚 for continuous learners
