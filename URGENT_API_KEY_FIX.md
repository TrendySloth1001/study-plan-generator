# 🚨 IMMEDIATE ACTION REQUIRED

## Your API Key Was Leaked!

The API key in your `.env.example` file has been exposed and is now compromised. Follow these steps immediately:

### Step 1: Revoke the Compromised Key ❌

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey
2. Find this key: `AIzaSyBJd4HiU_PYb298pVClcutu8M4j01tM4hY`
3. **DELETE IT IMMEDIATELY**

### Step 2: Generate a New API Key ✅

1. Still in Google AI Studio, click "Create API Key"
2. Copy the new key (it will look like: `AIzaSy...`)
3. Keep this window open for now

### Step 3: Create Your .env File 📝

```bash
# In your project directory, run:
cp .env.example .env
```

### Step 4: Add Your NEW Key to .env ⚙️

Open the `.env` file and replace the placeholder:

```
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_NEW_KEY_HERE
```

### Step 5: Verify .env is Ignored 🔒

Run this command to make sure `.env` won't be committed:

```bash
git status
```

You should **NOT** see `.env` in the list. If you do, it means it's not properly ignored!

### Step 6: Test Your Application 🧪

```bash
npm run dev
```

Try generating a study plan to confirm the new key works.

---

## ✅ Prevention Checklist

- [x] `.env` file is in `.gitignore`
- [x] `.env.example` contains only placeholder values
- [x] `SECURITY.md` has been added with guidelines
- [ ] Old API key has been revoked
- [ ] New API key has been generated
- [ ] New key is in `.env` file (NOT `.env.example`)
- [ ] Application tested with new key

---

## 🎯 What Changed

1. **`.env.example`** - Removed the actual API key, added placeholder
2. **`.gitignore`** - Enhanced to ignore all environment files
3. **`SECURITY.md`** - Created comprehensive security guide
4. **This file** - Step-by-step recovery instructions

---

## ⚠️ REMEMBER

- **NEVER** commit `.env` files
- **NEVER** put real API keys in `.env.example`
- **ALWAYS** use placeholders in example files
- **IMMEDIATELY** revoke any exposed keys

---

## Need Help?

If you have questions about:
- Revoking keys: https://aistudio.google.com/app/apikey
- API security: See `SECURITY.md`
- Git security: https://docs.github.com/en/code-security

Once you've completed all steps, you can delete this file.
