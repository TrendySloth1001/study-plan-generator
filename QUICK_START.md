# 🚀 Quick Setup Guide

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

## Step 2: Configure Environment

```bash
# Create environment file
cp .env.local.example .env.local

# Edit the file and add your key
# Replace 'your_gemini_api_key_here' with your actual key
```

## Step 3: Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Step 4: Use the App

1. Open http://localhost:3000/app
2. Fill in the study form (topic, hours per week)
3. Click "Generate Plan"
4. Explore your personalized roadmap!

## 🎯 Main Features

### Canvas View (Default)
- Expand cards with the chevron button
- Get AI explanations with 💡 📝 🚀 buttons
- Add personal notes (edit icon)
- Add comments (message icon)
- Drag nodes to rearrange
- Click headers to mark complete

### 3D View
- Drag to rotate
- Scroll to zoom
- Click nodes to complete
- Double-click to pin details
- Fullscreen button for immersion

### Settings
- Theme switching (Neon/Dark/Light)
- Daily reminders
- Goal tracking
- Auto-save
- Sound effects

## 🔧 Troubleshooting

### AI features not working?
- Check your GEMINI_API_KEY in .env.local
- Restart the dev server after adding the key
- Check browser console for errors

### Can't see notifications?
- Allow notifications in browser settings
- Must be on HTTPS or localhost
- Grant permission when prompted

### Theme not changing?
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check browser console for CSS errors

## 📚 Learn More

See [ENHANCED_FEATURES.md](./ENHANCED_FEATURES.md) for detailed documentation.

## 🎉 You're Ready!

Start creating amazing study plans with AI-powered insights! 🚀
