# API Alternatives & Fallbacks for CFOPackV001

**For participants without Claude API keys**

---

## Problem Statement

N3-N7 notebooks use Claude API for:
- N3: Collections intelligence (ML prediction prompting)
- N5: Working capital lever analysis (scenario prompting)
- N7: Decision memo synthesis (structured output generation)

**Challenge:** Workshop participants may have:
- ✓ Claude Free or Team edition (but NO API keys)
- ✓ Academic/student accounts (limited/no API access)
- ✓ Organizations blocking API usage (security policy)
- ✓ Budget constraints (no API credits available)

**Solution:** Multiple fallback options so NO ONE is left behind

---

## Option 1: Groq API (RECOMMENDED) ⭐

**Best choice for workshops: Free, fast, generous limits**

### Why Groq?

| Feature | Status |
|---------|--------|
| Cost | FREE tier available |
| Speed | 70-200 tokens/sec (fastest) |
| Models | Mixtral-8x7b, Llama-2-70b |
| Accuracy | Good (7-70B models) |
| Limits | 9,000 requests/day (free) |
| Setup | Simple (one API key) |
| For 10 runs | ✅ Sufficient |

### Setup (5 minutes)

```bash
# 1. Sign up (free)
https://console.groq.com/signup

# 2. Get API key
Copy from dashboard

# 3. Install package
pip install groq

# 4. Set environment variable
export GROQ_API_KEY="your_key_here"
```

### Code Example (Groq in N3)

```python
from groq import Groq

client = Groq()

# Same prompting as Claude API, just different client
response = client.chat.completions.create(
    model="mixtral-8x7b-32768",  # or llama2-70b-4096
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    temperature=0.3,
    max_tokens=500
)

result = response.choices[0].message.content
```

### Model Options

```
Groq Models:
  - mixtral-8x7b-32768        (Good balance, 8x7B mixture of experts)
  - llama2-70b-4096           (Higher quality, larger)
  - gemma-7b-it               (Smaller, faster, less accurate)
  - nvidia-llama3-70b-instruct (Latest, high quality)
```

### Limits for Workshop Use

```
Scenario: 12 workshop participants, 10 notebook runs each

N3 (Collections Intelligence):
  - 1 prediction per notebook run
  - 12 participants × 10 runs = 120 API calls
  - Groq limit: 9,000 calls/day
  - Status: ✅ WELL WITHIN LIMIT

N5 (Working Capital Levers):
  - ~3-5 scenario comparisons per run
  - 12 × 10 × 4 = 480 calls
  - Status: ✅ WELL WITHIN LIMIT

N7 (Decision Memo):
  - 1 memo synthesis per run
  - 12 × 10 = 120 calls
  - Status: ✅ WELL WITHIN LIMIT

Total requests: ~700 calls
Groq daily limit: 9,000 calls
Utilization: 7.8% ✅
```

### Converting Claude Code to Groq

**Original (Claude):**
```python
import anthropic

client = anthropic.Anthropic(api_key="your_key")

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
)

result = message.content[0].text
```

**Groq version:**
```python
from groq import Groq

client = Groq(api_key="your_key")

message = client.chat.completions.create(
    model="mixtral-8x7b-32768",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
)

result = message.choices[0].message.content
```

**Key differences:**
- `Anthropic()` → `Groq()`
- `claude-3-5-sonnet` → `mixtral-8x7b-32768`
- `messages.create()` → `chat.completions.create()`
- Response structure slightly different

---

## Option 2: NVIDIA NIM (NVIDIA Inference Microservices) 🔷

**Good for organizations, educational institutions**

### Why NVIDIA?

| Feature | Status |
|---------|--------|
| Cost | Free tier + educational credits |
| Speed | Fast (depends on model) |
| Models | Llama-2, Mistral, custom |
| Accuracy | Good to excellent |
| Limits | Varies by tier |
| Setup | Moderate (authentication) |
| For 10 runs | ✅ Likely sufficient |

### Setup

```bash
# 1. Register for NIM
https://build.nvidia.com/

# 2. Access models (free tier available)
Multiple open-source models available

# 3. Get API endpoint & key

# 4. Use via OpenAI-compatible API
pip install openai
```

### Code Example

```python
from openai import OpenAI

# NVIDIA NIM is OpenAI-compatible
client = OpenAI(
    api_key="your_nvidia_key",
    base_url="https://integrate.api.nvidia.com/v1"
)

response = client.chat.completions.create(
    model="meta/llama-2-70b-chat",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.3,
    max_tokens=500
)

result = response.choices[0].message.content
```

### Educational Credits

- Universities: $5,000 credits
- Students: $50-100 credits (if registered)
- Free tier: Limited requests

**For workshop of 12 students:**
- Standard requests per notebook: ~100-200
- With educational credits: ✅ Sufficient for multiple attempts

---

## Option 3: Together.ai 🚀

**Fast, accessible, good free tier**

### Why Together.ai?

| Feature | Status |
|---------|--------|
| Cost | Free trial + credits |
| Speed | Fast |
| Models | Multiple open-source models |
| Limits | Generous free tier |
| Setup | Simple API key |
| For 10 runs | ✅ Likely sufficient |

### Setup

```bash
# 1. Sign up
https://www.together.ai/

# 2. Get API key

# 3. Use OpenAI-compatible API
pip install openai
```

### Code Example

```python
from openai import OpenAI

client = OpenAI(
    api_key="your_together_key",
    base_url="https://api.together.xyz"
)

response = client.chat.completions.create(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.3,
    max_tokens=500
)

result = response.choices[0].message.content
```

---

## Option 4: Expanded Local Models (Ollama) 📦

**No API needed, fully private, but slower**

### Current Usage (N0.5)

N0.5 already uses local Phi-3 for bank reconciliation.

### Extend to N3-N8?

**Pros:**
- ✓ Completely free
- ✓ No API keys required
- ✓ Data stays private
- ✓ Works offline
- ✓ No rate limits

**Cons:**
- ✗ Slower (5-15 sec per response vs. <1 sec for Claude)
- ✗ Lower accuracy on complex tasks
- ✗ Requires significant resources (GPU recommended)
- ✗ Harder setup

### Which notebooks could use local models?

| Notebook | Feasibility | Notes |
|----------|-------------|-------|
| N3: Collections Intelligence | MEDIUM | Doable with Mixtral-7B, but accuracy lower |
| N5: Working Capital Levers | EASY | Just scenario comparison, simpler prompts |
| N7: Decision Framework | MEDIUM | Memo synthesis, needs good model |

### Model Options for N3-N7

```
For accuracy similar to Claude:
  - Mixtral-8x7b (~50GB, needs GPU)
  - Llama2-70b (~35GB, needs GPU)
  - Neural-chat-7b (~15GB, decent accuracy)

For speed (accept lower accuracy):
  - Mistral-7b (~13GB)
  - Llama2-13b (~8GB)
  - Neural-chat-7b (~15GB)
```

### Setup Example (Colab)

```python
# Install ollama in Colab
!curl -fsSL https://ollama.ai/install.sh | sh

# Download larger model (if space allows)
!ollama pull mixtral:8x7b  # Takes 10+ minutes, ~35GB

# Or use smaller model
!ollama pull mistral

# Run local reconciliation
!ollama serve &  # Background process
```

**Problem:** Colab GPU often insufficient for large models.

---

## Option 5: Hugging Face Inference API 🤗

**Free tier available, academic discounts**

### Why Hugging Face?

| Feature | Status |
|---------|--------|
| Cost | Free tier + academic credits |
| Models | Thousands of models |
| Speed | Moderate (depends on model) |
| Setup | Simple API key |
| For 10 runs | ✅ Likely sufficient |

### Setup

```bash
# 1. Sign up
https://huggingface.co/

# 2. Get API token

# 3. Install
pip install huggingface-hub

# 4. Use
from huggingface_hub import InferenceClient
```

### Code Example

```python
from huggingface_hub import InferenceClient

client = InferenceClient(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    token="your_hf_token"
)

response = client.text_generation(
    prompt=your_prompt,
    temperature=0.3,
    max_new_tokens=500
)

result = response
```

---

## Option 6: AWS Free Tier + Bedrock 🌐

**For organizations with AWS accounts**

### Why AWS?

- ✓ Free tier with credits
- ✓ Access to Claude (paid, but tier-based)
- ✓ Other models available
- ✗ Setup more complex

### Setup

```bash
# Install AWS SDK
pip install boto3

# Configure credentials
aws configure

# Use Bedrock
import boto3

client = boto3.client('bedrock-runtime', region_name='us-east-1')

response = client.invoke_model(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    body=json.dumps({
        "anthropic_version": "bedrock-2023-06-01",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}]
    })
)
```

---

## RECOMMENDATION MATRIX

Choose based on your situation:

### Scenario 1: Students with NO API Access
**Best option: Groq (Free)**
- Free API available
- Fast
- Generous limits
- Simple setup
- Sufficient for 10+ runs

### Scenario 2: Educational Institution
**Best option: NVIDIA NIM or Together.ai**
- Educational credits available
- Good models
- Support for students
- Institutional backing

### Scenario 3: Data Privacy Critical
**Best option: Expanded Ollama (Local)**
- No external API calls
- Completely private
- Free
- Slower but acceptable

### Scenario 4: Maximum Flexibility
**Best option: Multiple providers**
- Groq (primary, free)
- Ollama (fallback, local)
- Together.ai (alternative, free tier)
- Switch if any rate-limited

### Scenario 5: Organization with AWS
**Best option: AWS Bedrock**
- Existing infrastructure
- Integration with company systems
- Professional support

---

## FALLBACK: Pre-Generated Output Mode

**If NO API access available at all**

### What This Is

Modify notebooks to use **pre-computed outputs** instead of calling APIs.

### How It Works

```python
# Original (requires API):
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": prompt}]
)

# Fallback (no API needed):
# Pre-computed output stored in CSV
response = pd.read_csv("../outputs/N3_predictions_precomputed.csv")
```

### Notebooks in Fallback Mode

1. **N3: Collections Intelligence**
   - Pre-generate invoice predictions
   - Load from CSV instead of calling LLM
   - Still shows ML logic, but output is cached

2. **N5: Working Capital Levers**
   - Pre-generate scenario comparisons
   - Load results from file
   - Participants can modify scenarios and re-run local calculations

3. **N7: Decision Memo**
   - Pre-generate memo template
   - Participants fill in blanks
   - Understand structure without API

### Trade-offs

**Pros:**
- ✓ Zero cost
- ✓ Works with no API access
- ✓ No rate limits
- ✓ No setup required

**Cons:**
- ✗ Not "live" execution
- ✗ Limited learning on prompting
- ✗ Can't experiment with variations
- ✓ BUT: Still teaches the workflow and decision-making

### When to Use Fallback

- Students have no API access and can't get free tier
- Organizations block external APIs completely
- Emergency situation (API down, quota exceeded)
- Demo/showcase (just want to show the workflow)

### Creating Fallback Outputs

```python
# Generate once with API
# Save to CSV files
# Commit to repo

# Then notebooks can load:
if api_available:
    # Live execution
    results = llm_inference(...)
else:
    # Fallback mode
    results = pd.read_csv("precomputed_output.csv")
```

---

## IMPLEMENTATION PLAN

### Phase 1: Documentation (Done)
✅ This document explaining all options

### Phase 2: Create Groq Integration (1-2 hours)
- [ ] Modify N3, N5, N7 to accept Groq API key
- [ ] Create wrapper function for model switching
- [ ] Add Groq setup instructions
- [ ] Test with Groq API

### Phase 3: Create Fallback Mode (1-2 hours)
- [ ] Pre-compute outputs for N3, N5, N7
- [ ] Create CSV files with results
- [ ] Modify notebooks to detect API availability
- [ ] Add fallback loading logic
- [ ] Document fallback limitations

### Phase 4: Documentation (30 min)
- [ ] Update main README with all options
- [ ] Create quick-start guide for each provider
- [ ] Add troubleshooting for common issues
- [ ] Create decision tree for choosing option

### Phase 5: Testing (1-2 hours)
- [ ] Test with Groq API
- [ ] Test fallback mode
- [ ] Test each alternative provider
- [ ] Document actual costs/limits

---

## QUICK START GUIDE FOR PARTICIPANTS

### Option A: Use Groq (Easiest) ⭐

```
1. Sign up at https://console.groq.com/signup (free)
2. Copy your API key
3. Set environment variable:
   export GROQ_API_KEY="your_key_here"
4. Run notebooks as normal
5. They'll use Groq instead of Claude

Total setup time: 5 minutes
Cost: FREE
Runs allowed: 9,000+ per day
```

### Option B: Use Ollama Local (Slowest) 🐢

```
1. Install ollama: https://ollama.ai
2. Download model: ollama pull mistral
3. Start server: ollama serve
4. Run notebooks (they'll use local model)
5. Be patient (5-15 sec per response)

Total setup time: 15-20 minutes + download time
Cost: FREE
Runs allowed: UNLIMITED
```

### Option C: Demo Mode (Fastest) ⚡

```
1. Run notebooks in "demo mode"
2. Pre-computed outputs load from CSV
3. No API needed, instant execution
4. Can still modify some inputs and recalculate

Total setup time: 0 minutes
Cost: FREE
Runs allowed: UNLIMITED
Trade-off: Not "live" LLM inference
```

---

## COST COMPARISON

For 12 students, 10 notebook runs each (120 total workshop executions):

| Option | Setup Time | Cost | Speed | Accuracy | Difficulty |
|--------|-----------|------|-------|----------|-----------|
| **Groq (Free)** | 5 min | $0 | ⚡⚡ Fast | ⭐⭐⭐ Good | Easy |
| **Claude API** | 2 min | $5-10 | ⚡⚡⚡ Fastest | ⭐⭐⭐⭐ Best | Easy |
| **Ollama Local** | 20 min | $0 | 🐢 Slow | ⭐⭐ Fair | Hard |
| **Together.ai** | 5 min | $0-5 | ⚡⚡ Fast | ⭐⭐⭐ Good | Easy |
| **Demo Mode** | 0 min | $0 | ⚡⚡⚡ Instant | N/A | Easy |
| **NVIDIA NIM** | 10 min | $0-5 | ⚡⚡ Fast | ⭐⭐⭐ Good | Medium |

**Recommendation for budget-conscious workshops:** Groq Free (zero cost, good speed/accuracy)

---

## PARTICIPANT COMMUNICATION

### Email to Workshop Participants

```
Subject: CFOPackV001 Workshop - API Setup Options

Hi everyone,

For the treasury workshop, some notebooks need an LLM API. We've made it EASY:

OPTION A: Groq (FREE, Recommended) ⭐
- Sign up at https://console.groq.com/signup
- Copy your API key
- Set: export GROQ_API_KEY="your_key"
- Time: 5 minutes

OPTION B: Use Claude Free/Team account
- If you have Claude account, notebooks work out-of-box
- You don't need API credits for this workshop

OPTION C: Ollama Local (FREE, Slower)
- Install ollama, download model
- Runs locally, no internet needed
- Time: 20 minutes + download

OPTION D: Demo Mode
- If you don't want to set up anything
- Notebooks use pre-computed outputs
- You'll see the workflow without the API delays

Questions? Let me know by [DATE].

See you at the workshop!
```

---

## FOR INSTRUCTORS: Handling Mixed API Access

### During Workshop

```
1. Have participants state which option they chose
   → Groq: ~70% (free, easy)
   → Claude: ~15% (existing account)
   → Ollama: ~10% (privacy conscious)
   → Demo: ~5% (no setup wanted)

2. Pro tip: Have everyone test their setup BEFORE workshop
   → If issues arise, 15 min before → switch to Groq

3. Have a shared Groq project key as BACKUP
   → If someone's key fails
   → Everyone can use shared key (sufficient for 12 people)

4. If NO APIs work
   → Switch to Demo Mode (instant, no interruption)
   → Still teaches everything, just not live LLM
```

---

## SUMMARY TABLE

| Aspect | Groq | Claude API | Ollama | Together | Demo |
|--------|------|-----------|--------|----------|------|
| **Free?** | Yes | No | Yes | Yes | Yes |
| **Setup** | 5 min | 2 min | 20 min | 5 min | 0 min |
| **Speed** | Fast | Fastest | Slow | Fast | Instant |
| **Accuracy** | Good | Best | Fair | Good | N/A |
| **For workshop** | ✅ BEST | ✅ Ideal | ⚠️ OK | ✅ Good | ✅ Emergency |
| **Limit check** | 9K/day | 100K+/day | Unlimited | High | Unlimited |
| **For 120 runs** | ✅ Easy | ✅ Easy | ✅ Easy | ✅ Easy | ✅ Easy |

---

## NEXT STEPS

1. **Decide which to implement:**
   - [ ] Groq integration (recommended)
   - [ ] Fallback demo mode
   - [ ] Both (maximum flexibility)

2. **Create modifications to N3, N5, N7:**
   - Add API provider selection
   - Create wrapper functions
   - Add error handling

3. **Document for participants:**
   - Setup instructions per option
   - Troubleshooting guide
   - FAQ

4. **Test thoroughly:**
   - Run with Groq
   - Test fallback mode
   - Test with different models

5. **Communicate to participants:**
   - Email with options
   - Request setup before workshop
   - Have backup plan ready

---

**Status:** Ready for implementation  
**Recommended First Step:** Implement Groq integration (easiest, most flexible)  
**Fallback Ready:** Demo mode can be implemented in parallel
