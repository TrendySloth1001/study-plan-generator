# Study Plan Generator

An AI-powered study plan generator with retro gaming aesthetics, featuring interactive progress tracking, visual roadmaps, and an intelligent chatbot assistant.

## Features

### AI-Powered Plan Generation
- Generate comprehensive study plans using Ollama and Llama2 (local AI)
- Customizable difficulty levels: beginner, intermediate, or advanced
- Flexible time commitment options
- Multiple learning formats: theory-heavy, project-heavy, or balanced

### Interactive Visual Map
- RPG-style journey map with visual progress tracking
- Dual view modes: Map view for visual learners, List view for checklist fans
- Click-to-complete functionality for all milestones
- Progress saved locally in browser

### Progress Tracking
- Mark prerequisites, topics, and milestones as complete
- Real-time completion percentage
- Visual progress bar with gradient effects
- Persistent storage across sessions

### AI Chatbot Assistant
- Intelligent message parsing
- Slash commands:
  - `/topics` - Browse available topics
  - `/plan <topic>` - Generate a study plan
- Natural language understanding
- Context-aware responses

### Study Plan Components
- Prerequisites: Skills needed before starting
- Core Topics: Main subjects to master
- Weekly Milestones: Week-by-week breakdown
- Resources: Curated learning materials
- Tips: Expert advice for success

### Export Options
- Export plans as PDF
- Export as formatted text
- Save and share your learning roadmap

### Retro Gaming Theme
- Neon cyberpunk aesthetics
- Pixel-perfect borders and effects
- CRT scanline overlay
- Animated glowing text
- Responsive grid background

## Getting Started

   ### Option 1: Local Development Setup

Run the application directly on your machine.

**Requirements:**
- Node.js version 18 or higher
- npm or pnpm package manager
- Ollama installed and running
- Llama2 model downloaded

**Steps to run:**

1. Install Ollama on your system:
   
   For macOS:
   ```bash
   brew install ollama
   ```
   
   For Linux:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
   
   For Windows:
   Download from https://ollama.ai/download/windows

2. Download the Llama2 model:
   ```bash
   ollama pull llama2
   ```

3. Start the Ollama service:
   ```bash
   ollama serve
   ```
   
   Note: On macOS, Ollama usually starts automatically after installation.

4. Clone this repository:
   ```bash
   git clone <repository-url>
   cd study-plan-generator
   ```

5. Install the dependencies:
   ```bash
   npm install
   ```

6. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit the .env.local file if needed:
   ```
   OLLAMA_HOST=http://localhost:11434
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

### Generating a Study Plan

There are two ways to create a study plan:

1. Using the Form:
   - Enter your topic (examples: "Data Science", "Web Development", "Python")
   - Select your difficulty level (beginner, intermediate, or advanced)
   - Choose how many hours per week you can dedicate
   - Pick your preferred learning format (theory-heavy, project-heavy, or balanced)
   - Click the "GENERATE PLAN" button

2. Using the AI Chatbot:
   - Click "AI CHAT ASSISTANT" in the sidebar
   - Type naturally, for example: "Create a plan for Python programming"
   - Or use slash commands like: `/plan Machine Learning`

### Tracking Your Progress

Map View:
- Follow the visual journey from start to finish
- Click on any item to mark it as complete
- Watch your progress bar grow as you complete more items

List View:
- Toggle to checklist mode for a compact view
- Click checkboxes to track completion
- Completed items will appear with strikethrough text

### Chatbot Slash Commands

Available commands:
- Type `/` in the chat to see all available commands
- `/topics` - View all available topics
- `/plan <topic>` - Generate a study plan for a specific topic

## Technology Stack

- Framework: Next.js 16 with App Router
- Language: TypeScript
- Styling: Tailwind CSS 4
- AI: Ollama with Llama2 (Local LLM)
- Icons: Lucide React
- PDF Export: jsPDF
- Storage: Browser LocalStorage for progress tracking

## Project Structure

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

## Customizing the Theme

You can customize the color scheme by editing the CSS custom properties in `app/globals.css`:

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

## Troubleshooting

### Ollama Connection Error

Problem: Getting "Failed to generate response" or connection refused errors

Solutions:
1. Check if Ollama is running by opening http://localhost:11434 in your browser
2. Start the Ollama service by running `ollama serve` in your terminal
3. Verify the llama2 model is installed by running `ollama list`
4. If the model is missing, install it with `ollama pull llama2`

### Slow AI Response Times

Problem: The AI takes a long time to generate study plans

Solutions:
1. Use a smaller model by running `ollama pull llama2:7b` (you'll need to update the model name in the API route files)
2. Make sure your computer has at least 8GB of RAM available
3. If you have a GPU, Ollama will automatically use it for faster processing
4. Keep the Ollama service running to avoid cold start delays

### Progress Not Being Saved

Problem: Your progress resets when you refresh the page

Solution: Make sure your browser's localStorage is enabled and you're not browsing in incognito or private mode

### Mobile Layout Issues

Problem: The layout looks broken or elements are misaligned on mobile devices

Solution: The app is designed for screens 320px and wider. Try adjusting your zoom level or clearing your browser cache

### Port Already in Use

Problem: Port 11434 (Ollama) or 3000 (app) is already being used by another service

Solution: Either stop the service using that port, or configure Ollama to use a different port and update the `OLLAMA_HOST` variable in your `.env.local` file

For more detailed setup instructions, refer to OLLAMA_SETUP.md

