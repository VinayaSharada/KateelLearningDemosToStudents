# How to Get API Keys for CFOPackV001

**Step-by-step guide for obtaining free API keys for the treasury workshop**

---

## Quick Summary

| Provider | Cost | Time | Link | Limit |
|----------|------|------|------|-------|
| **Groq** (RECOMMENDED) | FREE | 3 min | https://console.groq.com | 9K/day |
| **Claude** | Pay-as-you-go | 5 min | https://console.anthropic.com | Depends |
| **Together.ai** | FREE | 3 min | https://www.together.ai | High |
| **Ollama** | FREE | Local only | https://ollama.ai | Unlimited |
| **HuggingFace** | FREE | 3 min | https://huggingface.co | High |

---

## Option 1: Groq API (RECOMMENDED) ⭐

**Why Groq?**
- Completely free (no credit card required)
- 9,000 API calls per day (enough for 12 students × 10 runs)
- Very fast (1-2 seconds per response)
- Easy setup (just API key)
- Generous free tier

### Step 1: Sign Up

```
1. Go to: https://console.groq.com/signup
2. Click "Sign Up"
3. Enter email address
4. Verify email (check inbox for verification link)
5. Create password
6. Accept terms
7. Complete signup
```

### Step 2: Create API Key

```
1. After signup, click "API Keys" in left menu
2. Click "Create New API Key"
3. Name it: "CFOPackV001"
4. Click "Create"
5. Copy the key (starts with "gsk_")
6. SAVE IT - you won't see it again
```

### Step 3: Use in Notebooks

```python
# In your notebook or terminal:
import os
os.environ['GROQ_API_KEY'] = 'gsk_your_key_here'

# Or set as environment variable:
export GROQ_API_KEY='gsk_your_key_here'

# Notebooks auto-detect and use it
```

### Step 4: Verify It Works

```bash
python -c "
from groq import Groq
import os

key = os.getenv('GROQ_API_KEY')
if key:
    print(f'✅ API Key found (first 10 chars: {key[:10]})')
else:
    print('❌ API Key not set')
"
```

### Limits & FAQ

**Q: Will it cost money?**
A: No. The free tier has 9,000 requests per day. Your workshop uses ~700 total.

**Q: What if I exceed the limit?**
A: Groq will reject requests and notebooks will auto-fallback to demo mode.

**Q: Can I use it after the workshop?**
A: Yes, free tier is permanent (as long as you're using it).

**Q: What's the speed?**
A: ~1-2 seconds per response (very fast for an LLM).

---

## Option 2: Claude API

**When to use this:**
- You already have Claude API credits
- You need the highest quality
- Cost is not a concern

### Step 1: Create Anthropic Account

```
1. Go to: https://console.anthropic.com
2. Sign up with email
3. Verify email
4. Add payment method (required for API)
```

### Step 2: Get API Key

```
1. Click "API Keys" in settings
2. Click "Create New Secret Key"
3. Name it: "CFOPackV001"
4. Copy the key (starts with "sk-ant-")
5. Store securely
```

### Step 3: Set in Notebooks

```python
import os
os.environ['ANTHROPIC_API_KEY'] = 'sk-ant-your_key_here'

# Or:
export ANTHROPIC_API_KEY='sk-ant-your_key_here'
```

### Pricing

```
Model: Claude 3.5 Sonnet (recommended)
Input:  $3 per million tokens
Output: $15 per million tokens

Estimate for workshop:
- 12 students × 10 runs
- ~50K tokens total
- Cost: ~$0.50-$2.00

Compared to Groq: Free, so only use if you have credits.
```

**Q: How much will this cost?**
A: For a workshop: $0.50-$5 depending on usage.

---

## Option 3: Together.ai

**When to use:**
- Alternative to Groq
- Want different model options
- Extra redundancy

### Step 1: Sign Up

```
1. Go to: https://www.together.ai
2. Click "Sign In"
3. Click "Sign up for free"
4. Enter email
5. Verify and set password
```

### Step 2: Get API Key

```
1. Click your profile (top right)
2. Click "API Keys"
3. Click "Create New API Key"
4. Copy the key
5. Store securely
```

### Step 3: Set in Notebooks

```python
import os
os.environ['TOGETHER_API_KEY'] = 'your_key_here'

# Notebooks will auto-detect
```

### Free Tier

- Many free model requests per month
- Good for workshops
- Less generous than Groq

---

## Option 4: NVIDIA NIM (For Students/Educators)

**When to use:**
- You're at an educational institution
- You have .edu email
- You want credits

### Step 1: Register

```
1. Go to: https://build.nvidia.com/
2. Click "Sign Up"
3. Use your .edu email address
4. Verify email
```

### Step 2: Request Educational Credits

```
1. In dashboard, click "Billing"
2. Request educational credit
3. Provide institution name
4. Wait for approval (usually <24 hours)
```

### Step 3: Get API Key

```
1. Click "Integrations"
2. Create API key
3. Copy the key
```

### Educational Credits

- Student: $50-$100 free
- Instructor: $500-$1000 free
- Usually resets monthly

---

## Option 5: HuggingFace Inference API

**When to use:**
- Want variety of models
- Free tier available
- Research/academic use

### Step 1: Sign Up

```
1. Go to: https://huggingface.co
2. Click "Sign Up"
3. Verify email
```

### Step 2: Get API Token

```
1. Click profile (top right)
2. Click "Settings"
3. Click "Access Tokens"
4. Click "New token"
5. Name: "CFOPackV001"
6. Copy token
```

### Step 3: Use

```python
import os
os.environ['HUGGINGFACE_API_KEY'] = 'hf_your_token'

# Notebooks auto-detect
```

---

## Option 6: Local Ollama (No API Key Needed!)

**When to use:**
- Want zero cost
- Need complete privacy
- Don't want external API calls

### For Colab:

```python
# In notebook:
!curl -fsSL https://ollama.ai/install.sh | sh
!ollama pull mixtral
!ollama serve &

# Notebooks auto-detect locally running Ollama
```

### For Local Machine:

```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Download model
ollama pull mixtral

# Start server
ollama serve

# In another terminal, run notebooks
jupyter notebook
```

### Why Local?

- ✅ No API key needed
- ✅ Completely private (data stays on your machine)
- ✅ No cost
- ❌ Slower (5-15 seconds per response)
- ❌ Requires decent hardware (GPU helpful)

---

## Which One Should I Choose?

### If you want the EASIEST setup:
**→ Groq (3 minutes, free, fast)**

```bash
1. Sign up at https://console.groq.com/signup
2. Create API key
3. export GROQ_API_KEY='your_key'
4. Done! Run notebooks.
```

### If you want HIGHEST QUALITY:
**→ Claude API (if you have credits)**

```bash
1. Create account at https://console.anthropic.com
2. Add payment method
3. Create API key
4. export ANTHROPIC_API_KEY='your_key'
5. Run notebooks
```

### If you want COMPLETE PRIVACY:
**→ Ollama (local, no API)**

```bash
1. ollama pull mixtral
2. ollama serve (in background)
3. Run notebooks (they'll detect it locally)
```

### If you want NO SETUP AT ALL:
**→ Demo Mode (built-in, just run)**

```bash
# Don't set any API key
# Notebooks auto-fallback to demo mode
# Pre-computed outputs load instantly
```

---

## Setting API Key in Different Ways

### Method 1: Environment Variable (RECOMMENDED)

```bash
# macOS / Linux
export GROQ_API_KEY='your_key_here'
jupyter notebook

# Windows PowerShell
$env:GROQ_API_KEY='your_key_here'
jupyter notebook

# Windows Command Prompt
set GROQ_API_KEY=your_key_here
jupyter notebook
```

### Method 2: In Python Code

```python
import os
os.environ['GROQ_API_KEY'] = 'your_key_here'

# Now notebooks can access it
```

### Method 3: .env File (Not Recommended for Security)

```python
# Create file: .env
# GROQ_API_KEY=your_key_here

# In notebook:
from dotenv import load_dotenv
load_dotenv()
```

### Method 4: Notebook First Cell

```python
# First cell of notebook
import os
os.environ['GROQ_API_KEY'] = 'your_key_here'
```

---

## Security Best Practices

### ✅ DO:
- Keep API key secret (don't commit to GitHub)
- Use environment variables
- Create key with minimal permissions
- Rotate keys occasionally
- Use different keys for dev/test/prod

### ❌ DON'T:
- Share your API key in messages/emails
- Commit key to GitHub (it will be compromised)
- Use same key in notebooks pushed to public repo
- Leave key in notebook cells that you share
- Post key in Slack/Discord

### If You Accidentally Exposed Your Key:

1. **IMMEDIATELY:** Delete/regenerate the key
2. Go to provider's dashboard
3. Delete the compromised key
4. Create a new key
5. Update notebooks/environment

Exposed keys can be used by anyone, so act fast.

---

## Verification: Did It Work?

### For Groq:

```python
from groq import Groq
import os

try:
    client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    response = client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=[{"role": "user", "content": "test"}],
        max_tokens=10
    )
    print("✅ Groq API Key works!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ Error: {e}")
```

### For Claude:

```python
import anthropic
import os

try:
    client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=10,
        messages=[{"role": "user", "content": "test"}]
    )
    print("✅ Claude API Key works!")
    print(f"Response: {message.content[0].text}")
except Exception as e:
    print(f"❌ Error: {e}")
```

---

## Common Issues & Solutions

### "ModuleNotFoundError: No module named 'groq'"

**Solution:**
```bash
pip install groq
```

### "API Key not recognized"

**Solution:**
1. Check key is correctly copied (no extra spaces)
2. Make sure environment variable is set: `echo $GROQ_API_KEY`
3. Restart notebook after setting env var
4. Check key hasn't expired

### "Rate limit exceeded"

**Solution:**
1. For Groq: Limit is 9K/day (workshop uses ~700, so unlikely)
2. Wait a bit and retry
3. Switch to demo mode (pre-computed outputs)

### "Connection timeout"

**Solution:**
1. Check internet connection
2. Check if API service is down (check status page)
3. Try different API provider (e.g., switch to Ollama local)

### "I don't see my API key after creating it"

**Solution:**
1. Some APIs only show key once - copy immediately
2. If missed, regenerate key
3. Check email for key (some send via email)

---

## Quick Reference Card

**Print this and keep at your desk:**

```
API SETUP QUICK REFERENCE

GROQ (Recommended):
  Sign up:  https://console.groq.com/signup
  Key:      In "API Keys" section
  Set:      export GROQ_API_KEY='gsk_...'
  Limit:    9,000 requests/day (SUFFICIENT ✅)
  Cost:     FREE

CLAUDE:
  Sign up:  https://console.anthropic.com
  Key:      In "API Keys" section
  Set:      export ANTHROPIC_API_KEY='sk-ant-...'
  Cost:     Pay-as-you-go (~$0.50-$5 for workshop)

LOCAL OLLAMA:
  Install:  curl -fsSL https://ollama.ai/install.sh | sh
  Model:    ollama pull mixtral
  Run:      ollama serve
  Cost:     FREE (no API key needed)

DEMO MODE:
  Setup:    (no setup needed)
  How:      Don't set any API key
  Fallback: Automatic
  Cost:     FREE
```

---

## Support

### If You Have Questions:

1. **Check the troubleshooting section above**
2. **Check provider's documentation:**
   - Groq: https://console.groq.com/docs
   - Claude: https://docs.anthropic.com
   - Together: https://www.together.ai/docs
   - Ollama: https://github.com/ollama/ollama

3. **Ask your instructor**
   - They can help debug
   - May have shared keys available

4. **Use demo mode**
   - Always works without API
   - Good for testing notebooks

---

## Summary

| Provider | Effort | Cost | Speed | Privacy | For Workshop |
|----------|--------|------|-------|---------|--------------|
| Groq | 3 min | FREE | ⚡⚡ | Shared | ✅ BEST |
| Claude | 5 min | $$ | ⚡⚡⚡ | Shared | ✅ Good |
| Ollama | 20 min | FREE | 🐢 | ✅ Private | ✅ OK |
| Demo | 0 min | FREE | ⚡⚡⚡ | ✅ Local | ✅ Works |

**Recommendation:** Start with Groq. Takes 3 minutes, costs nothing, works great.

If Groq doesn't work for you → Try local Ollama → Demo mode is always available.
