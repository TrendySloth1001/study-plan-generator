# Security Guidelines

## 🔒 API Key Security

### Setting Up Your API Key

1. **Get Your API Key**
   - Visit https://ai.google.dev/
   - Create or select a project
   - Generate a new API key

2. **Create Your .env File**
   ```bash
   cp .env.example .env
   ```

3. **Add Your Key to .env**
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

### ⚠️ CRITICAL: Never Commit Your API Key!

- **NEVER** commit `.env` files to git
- **NEVER** share your API key publicly
- **NEVER** hardcode API keys in your code
- **ALWAYS** use environment variables

### What to Do If Your Key Is Leaked

If your API key is exposed:

1. **Immediately Revoke the Key**
   - Go to Google AI Studio: https://aistudio.google.com/
   - Navigate to API Keys section
   - Delete the compromised key

2. **Generate a New Key**
   - Create a new API key
   - Update your `.env` file with the new key
   - **DO NOT** commit the new key

3. **Check Git History**
   ```bash
   # Check if the key was committed
   git log --all --full-history --source -- .env
   
   # If found, you need to remove it from history
   # Consider using tools like git-filter-repo or BFG Repo-Cleaner
   ```

4. **Update Your Repository**
   - If the key was pushed to GitHub, the repository may need to be deleted
   - Create a fresh repository without the sensitive data
   - Push clean code only

### Monitoring Your API Usage

- Regularly check your API usage at: https://aistudio.google.com/
- Set up usage alerts if available
- Monitor for unusual activity
- Consider implementing rate limiting in your application

### Best Practices

1. **Use Environment Variables**
   - Always load keys from `process.env`
   - Never hardcode them in source files

2. **Restrict API Key Permissions**
   - In Google Cloud Console, restrict your API key to specific APIs
   - Set HTTP referrer restrictions for web apps
   - Set IP restrictions for server-side apps

3. **Rotate Keys Regularly**
   - Change your API keys periodically
   - Use different keys for development and production

4. **Add Pre-commit Hooks**
   - Install tools to scan for secrets before committing
   - Example: `git-secrets`, `detect-secrets`

### Development vs Production

- Use separate API keys for development and production
- Never use production keys in development
- Consider using different Google Cloud projects

## 🚨 Emergency Response

If you've accidentally committed an API key:

1. **Stop immediately** - Don't push if you haven't already
2. **Revoke the key** - Go to Google AI Studio and delete it
3. **Remove from git history** - Use `git reset` or history rewriting tools
4. **Generate new key** - Create a fresh key for continued work
5. **Update .env** - Add the new key to your local .env file only

## Additional Resources

- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
