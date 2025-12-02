# Ollama Setup Guide

This project now uses **Ollama** with the **Llama2** model for local AI generation.

## Prerequisites

### 1. Install Ollama

Download and install Ollama from: [https://ollama.ai](https://ollama.ai)

**macOS:**
```bash
# Download from https://ollama.ai/download/mac
# Or use brew
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from: https://ollama.ai/download/windows

### 2. Start Ollama Service

**macOS/Linux:**
```bash
ollama serve
```

The service should start on `http://localhost:11434`

**Note:** On macOS, Ollama usually runs automatically after installation.

### 3. Pull Llama2 Model

Open a new terminal and run:
```bash
ollama pull llama2
```

This will download the Llama2 model (~4GB). Wait for the download to complete.

### 4. Verify Installation

Check if Ollama is running and llama2 is available:
```bash
ollama list
```

You should see `llama2` in the list of models.

Test the model:
```bash
ollama run llama2 "Hello, how are you?"
```

## Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the project root:

```bash
# Ollama host (default: http://localhost:11434)
OLLAMA_HOST=http://localhost:11434
```

If you're running Ollama on a different host or port, update the `OLLAMA_HOST` variable.

## Running the Project

1. Make sure Ollama is running with llama2 model installed
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### "Failed to generate response" Error

**Cause:** Ollama is not running or llama2 model is not installed.

**Solutions:**
1. Check if Ollama is running: `curl http://localhost:11434`
2. Verify llama2 is installed: `ollama list`
3. If not installed, run: `ollama pull llama2`
4. Restart Ollama service: `ollama serve`

### Slow Response Times

**Cause:** Llama2 runs locally and depends on your hardware.

**Solutions:**
1. Use a smaller model: `ollama pull llama2:7b`
2. Upgrade your hardware (GPU recommended)
3. Consider using llama2:13b or llama2:70b for better quality (slower)

### Port Already in Use

**Cause:** Another service is using port 11434.

**Solution:**
1. Stop other services on port 11434
2. Or run Ollama on a different port and update `OLLAMA_HOST` in `.env.local`

## Alternative Models

You can use different Ollama models by updating the API routes:

- `llama2` - Default, balanced performance
- `llama2:7b` - Faster, lower quality
- `llama2:13b` - Slower, better quality
- `mistral` - Alternative model
- `codellama` - Optimized for code

Edit the model in:
- `app/api/generate-plan/route.ts`
- `app/api/chat/route.ts`
- `app/api/ai-explain/route.ts`

Change `model: 'llama2'` to your preferred model.

## Performance Tips

1. **GPU Acceleration:** Ollama automatically uses GPU if available
2. **RAM:** Ensure you have at least 8GB RAM for llama2
3. **Keep Ollama Running:** The first request after startup may be slow
4. **Model Selection:** Smaller models (7b) are faster but less accurate

## Additional Resources

- Ollama Documentation: https://github.com/ollama/ollama
- Llama2 Model Card: https://ollama.ai/library/llama2
- Ollama API Reference: https://github.com/ollama/ollama/blob/main/docs/api.md
