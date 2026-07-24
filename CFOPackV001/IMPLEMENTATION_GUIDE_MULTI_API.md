# Implementation Guide: Multi-API Support for CFOPackV001

**How to modify N3, N5, N7 to support Groq, Claude, Ollama, and Demo Mode**

---

## Overview

This guide shows exactly how to modify notebooks to support multiple API providers with automatic fallback.

---

## Step 1: Create API Abstraction Layer

**File:** `notebooks/llm_provider.py` (NEW)

This wrapper handles all API calls, abstracting away provider differences.

```python
"""
LLM Provider Wrapper
Supports: Claude, Groq, Ollama, Demo Mode
Automatic fallback if API unavailable
"""

import os
import json
from typing import Optional, Dict, Any
import warnings

class LLMProvider:
    """
    Universal LLM interface supporting multiple providers.
    
    Usage:
        provider = LLMProvider.auto_detect()  # Uses env vars or demo mode
        response = provider.generate(system_prompt, user_prompt)
    """
    
    def __init__(self, provider_type: str, api_key: Optional[str] = None):
        self.provider_type = provider_type
        self.api_key = api_key
        self.model = self._select_model()
        
    @classmethod
    def auto_detect(cls):
        """
        Auto-detect available provider and create instance.
        Priority:
        1. Claude API (if ANTHROPIC_API_KEY set)
        2. Groq API (if GROQ_API_KEY set)
        3. Together.ai (if TOGETHER_API_KEY set)
        4. Local Ollama (if running)
        5. Demo mode (fallback)
        """
        
        # Check for Claude
        if os.getenv('ANTHROPIC_API_KEY'):
            print("[OK] Using Claude API")
            return cls('claude', os.getenv('ANTHROPIC_API_KEY'))
        
        # Check for Groq
        elif os.getenv('GROQ_API_KEY'):
            print("[OK] Using Groq API (free tier)")
            return cls('groq', os.getenv('GROQ_API_KEY'))
        
        # Check for Together.ai
        elif os.getenv('TOGETHER_API_KEY'):
            print("[OK] Using Together.ai API")
            return cls('together', os.getenv('TOGETHER_API_KEY'))
        
        # Check for Ollama
        elif cls._check_ollama():
            print("[OK] Using Local Ollama (Mixtral)")
            return cls('ollama', None)
        
        # Fallback to demo mode
        else:
            print("[NOTE] No API key found. Using Demo Mode (pre-computed outputs)")
            print("[TIP]  To use real LLM:")
            print("       export GROQ_API_KEY='your_key'  (free tier, recommended)")
            print("       or ANTHROPIC_API_KEY for Claude")
            return cls('demo', None)
    
    @staticmethod
    def _check_ollama():
        """Check if Ollama is running"""
        try:
            import requests
            response = requests.get('http://localhost:11434/api/tags', timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def _select_model(self) -> str:
        """Select appropriate model for provider"""
        models = {
            'claude': 'claude-3-5-sonnet-20241022',
            'groq': 'mixtral-8x7b-32768',
            'together': 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            'ollama': 'mixtral',
            'demo': 'demo-mode'
        }
        return models.get(self.provider_type, 'unknown')
    
    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 1000,
        **kwargs
    ) -> str:
        """
        Generate response using selected provider.
        
        Args:
            system_prompt: System context
            user_prompt: User input
            temperature: Sampling temperature
            max_tokens: Maximum output tokens
            
        Returns:
            Generated text
        """
        
        if self.provider_type == 'claude':
            return self._call_claude(system_prompt, user_prompt, temperature, max_tokens)
        elif self.provider_type == 'groq':
            return self._call_groq(system_prompt, user_prompt, temperature, max_tokens)
        elif self.provider_type == 'together':
            return self._call_together(system_prompt, user_prompt, temperature, max_tokens)
        elif self.provider_type == 'ollama':
            return self._call_ollama(system_prompt, user_prompt, temperature, max_tokens)
        elif self.provider_type == 'demo':
            return self._demo_output(user_prompt)
    
    def _call_claude(self, system_prompt, user_prompt, temperature, max_tokens) -> str:
        """Call Claude API"""
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.api_key)
            
            message = client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            return message.content[0].text
        
        except Exception as e:
            print(f"[ERROR] Claude API failed: {e}")
            print("[FALLBACK] Switching to Groq...")
            return self._call_groq(system_prompt, user_prompt, temperature, max_tokens)
    
    def _call_groq(self, system_prompt, user_prompt, temperature, max_tokens) -> str:
        """Call Groq API"""
        try:
            from groq import Groq
            client = Groq(api_key=self.api_key)
            
            message = client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            return message.choices[0].message.content
        
        except Exception as e:
            print(f"[ERROR] Groq API failed: {e}")
            print("[FALLBACK] Switching to Together.ai...")
            return self._call_together(system_prompt, user_prompt, temperature, max_tokens)
    
    def _call_together(self, system_prompt, user_prompt, temperature, max_tokens) -> str:
        """Call Together.ai API"""
        try:
            from openai import OpenAI
            
            client = OpenAI(
                api_key=self.api_key,
                base_url="https://api.together.xyz"
            )
            
            message = client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            return message.choices[0].message.content
        
        except Exception as e:
            print(f"[ERROR] Together.ai API failed: {e}")
            print("[FALLBACK] Switching to local Ollama...")
            return self._call_ollama(system_prompt, user_prompt, temperature, max_tokens)
    
    def _call_ollama(self, system_prompt, user_prompt, temperature, max_tokens) -> str:
        """Call Local Ollama"""
        try:
            import requests
            
            response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': self.model,
                    'prompt': f"{system_prompt}\n\n{user_prompt}",
                    'temperature': temperature,
                    'stream': False
                },
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()['response']
            else:
                raise Exception(f"Ollama error: {response.status_code}")
        
        except Exception as e:
            print(f"[ERROR] Ollama failed: {e}")
            print("[FALLBACK] Using demo mode (pre-computed outputs)...")
            return self._demo_output(user_prompt)
    
    def _demo_output(self, user_prompt) -> str:
        """
        Demo mode: Return pre-computed or template response
        """
        
        # Simple demo: Return indication this is demo mode
        return """
[DEMO MODE - Pre-computed Output]

This is a demonstration output. In actual execution with an API,
this would be generated from your data.

For the actual workshop, set:
  export GROQ_API_KEY='your_key'

The output structure shows what would be generated.
"""
    
    def get_provider_info(self) -> Dict[str, Any]:
        """Return info about current provider"""
        return {
            'provider': self.provider_type,
            'model': self.model,
            'has_api_key': self.api_key is not None,
            'speed': {
                'claude': 'Very Fast (< 1 sec)',
                'groq': 'Fast (1-2 sec)',
                'together': 'Fast (1-2 sec)',
                'ollama': 'Slow (5-15 sec)',
                'demo': 'Instant'
            }.get(self.provider_type, 'Unknown')
        }


# Global instance (created once per notebook)
_provider = None

def get_llm_provider() -> LLMProvider:
    """Get or create global LLM provider"""
    global _provider
    if _provider is None:
        _provider = LLMProvider.auto_detect()
    return _provider


def generate(system_prompt: str, user_prompt: str, **kwargs) -> str:
    """
    Simple function to generate LLM response.
    
    Usage in notebook:
        from llm_provider import generate
        
        result = generate(
            system_prompt="You are a treasury analyst",
            user_prompt="Analyze these invoices..."
        )
    """
    provider = get_llm_provider()
    return provider.generate(system_prompt, user_prompt, **kwargs)
```

---

## Step 2: Modify N3 Notebook to Use Wrapper

**Changes to `N3_Collections_Intelligence.py`:**

```python
# At top of notebook, add:
import sys
sys.path.insert(0, '..')
from llm_provider import get_llm_provider, generate

# Replace all API calls with wrapper
# BEFORE (Claude only):
# import anthropic
# client = anthropic.Anthropic()
# message = client.messages.create(...)

# AFTER (Multi-provider):
# Just use the generate function

# Example in N3 where you might want to call LLM for analysis:
def get_payment_patterns(invoice_data):
    """Use LLM to identify payment patterns"""
    
    system_prompt = """
    You are a treasury analyst specializing in payment behavior.
    Analyze invoice and payment patterns.
    """
    
    user_prompt = f"""
    Analyze payment patterns from this data:
    {invoice_data}
    
    Return JSON with:
    - average_days_late
    - pattern_description
    - risk_assessment
    """
    
    # This works with ANY provider (auto-detected)
    response = generate(system_prompt, user_prompt, max_tokens=500)
    
    return response


# At notebook end, show provider info:
provider = get_llm_provider()
print(f"\n[INFO] Using {provider.provider_type} provider")
print(f"[MODEL] {provider.model}")
print(f"[SPEED] {provider.get_provider_info()['speed']}")
```

---

## Step 3: Same Pattern for N5 and N7

**`N5_Working_Capital_Levers.py`:**

```python
from llm_provider import generate

def compare_scenarios():
    """Use LLM to compare working capital scenarios"""
    
    system_prompt = """
    You are a treasury strategy expert.
    Compare working capital optimization scenarios.
    """
    
    user_prompt = """
    Compare these three scenarios:
    1. Reduce DSO 5 days
    2. Reduce DIO 10%
    3. Increase DPO 7 days
    
    Return JSON with: impact, timeline, feasibility for each
    """
    
    response = generate(system_prompt, user_prompt)
    return response
```

**`N7_Decision_Framework.py`:**

```python
from llm_provider import generate

def synthesize_decision_memo(analysis_results):
    """Use LLM to synthesize decision memo"""
    
    system_prompt = """
    You are a CFO advisor writing executive decision memos.
    Synthesize analysis into clear, actionable recommendations.
    """
    
    user_prompt = f"""
    Synthesize this treasury analysis into a decision memo:
    {analysis_results}
    
    Format as markdown with:
    - Executive Summary
    - Problem Statement
    - Recommendation
    - Evidence
    - Implementation Timeline
    """
    
    response = generate(system_prompt, user_prompt, max_tokens=2000)
    return response
```

---

## Step 4: Setup Instructions for Participants

**File:** `SETUP_API_FOR_WORKSHOP.md` (NEW)

```markdown
# API Setup for CFOPackV001 Workshop

## Option 1: Groq (Recommended - FREE) ⭐

### Setup (5 minutes)

1. **Sign up:**
   ```
   Go to https://console.groq.com/signup (free)
   ```

2. **Get API key:**
   - After signup, go to API Keys
   - Copy your key

3. **Set environment variable:**
   ```bash
   # macOS / Linux
   export GROQ_API_KEY="gsk_YOUR_KEY_HERE"
   
   # Windows (PowerShell)
   $env:GROQ_API_KEY="gsk_YOUR_KEY_HERE"
   
   # Windows (CMD)
   set GROQ_API_KEY=gsk_YOUR_KEY_HERE
   ```

4. **Done!** Run notebooks normally

### Verification
```bash
python -c "import os; print('OK' if os.getenv('GROQ_API_KEY') else 'NOT SET')"
```

### Limits
- 9,000 requests per day
- For 12 students × 10 runs: ~700 requests (7.8% usage)
- **Sufficient for entire workshop** ✅

---

## Option 2: Claude API

If you have Claude API credits:

```bash
export ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"
```

---

## Option 3: Local Ollama (No API)

For complete privacy:

```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Download model
ollama pull mixtral

# Start server
ollama serve
```

Notebooks will auto-detect and use it.

---

## Option 4: Let Notebooks Auto-Detect

If ANY API is configured, notebooks will use it in this order:
1. Claude (if ANTHROPIC_API_KEY set)
2. Groq (if GROQ_API_KEY set)
3. Together (if TOGETHER_API_KEY set)
4. Ollama (if running locally)
5. Demo Mode (fallback, no setup)

**No action needed** - just set one API key and run!

---

## Troubleshooting

### Q: API key not recognized
**A:** Make sure you set the environment variable correctly:
```bash
export GROQ_API_KEY="your_actual_key"
# Then run notebook in same terminal
```

### Q: Getting rate limit error
**A:** Groq limit is 9,000/day. For workshop:
- If you hit it: Switch to demo mode temporarily
- Or use shared instructor API key

### Q: Notebook is very slow
**A:** You're using Ollama (local). Expected behavior:
- Each response takes 5-15 seconds
- That's OK, just be patient
- To go faster: Set GROQ_API_KEY

### Q: Want to test with real LLM?
**A:**
```bash
export GROQ_API_KEY="gsk_YOUR_KEY"
python notebook.py  # Uses Groq

# Remove API key to fall back to demo
unset GROQ_API_KEY
python notebook.py  # Uses pre-computed demo
```

---

## Cost Summary

| Option | Cost | Setup | Speed | 10 Runs |
|--------|------|-------|-------|---------|
| Groq | FREE | 5 min | Fast ⚡ | ✅ Yes |
| Claude | $$ | 2 min | Fastest ⚡⚡ | ✅ Yes |
| Ollama | FREE | 20 min | Slow 🐢 | ✅ Yes |
| Demo | FREE | 0 min | Instant | ✅ Yes |

**Recommendation:** Groq (zero cost, fast, generous limits)
```

---

## Step 5: Update Main Notebooks (Header Section)

Add this to N1, N3, N5, N7, N8:

```python
"""
N3: Collections Intelligence
CFO Pack V001 - Treasury Decision Workshop

MULTI-API SUPPORT:
  Automatically detects and uses available API:
  1. Claude (if ANTHROPIC_API_KEY set)
  2. Groq (if GROQ_API_KEY set) ← RECOMMENDED (free)
  3. Local Ollama (if running)
  4. Demo mode (fallback, pre-computed outputs)

SETUP (Choose one):
  Option A: Groq (free, recommended)
    export GROQ_API_KEY='your_key'
  
  Option B: Claude API
    export ANTHROPIC_API_KEY='your_key'
  
  Option C: Local Ollama (no key needed)
    ollama pull mixtral && ollama serve
  
  Option D: Demo mode (no setup needed)
    Notebooks auto-fallback to pre-computed outputs

No API? No problem. Demo mode works out-of-box.
"""

import sys
sys.path.insert(0, '..')
from llm_provider import get_llm_provider

# Show provider info at notebook start
provider = get_llm_provider()
print("\n" + "="*80)
print(f"[OK] LLM Provider: {provider.provider_type.upper()}")
print(f"[MODEL] {provider.model}")
print("="*80 + "\n")
```

---

## Step 6: Testing Script

**File:** `test_api_setup.py` (NEW)

```python
#!/usr/bin/env python3
"""
Test script: Verify API setup for CFOPackV001
Run this before the workshop to catch issues early
"""

import os
import sys

def test_groq():
    try:
        from groq import Groq
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            print("❌ GROQ_API_KEY not set")
            return False
        
        client = Groq(api_key=api_key)
        # Make small test call
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=10
        )
        print("✅ Groq API working")
        return True
    except Exception as e:
        print(f"❌ Groq API failed: {e}")
        return False

def test_claude():
    try:
        import anthropic
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            print("⏭️  ANTHROPIC_API_KEY not set (skipped)")
            return None
        
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=10,
            messages=[{"role": "user", "content": "test"}]
        )
        print("✅ Claude API working")
        return True
    except Exception as e:
        print(f"❌ Claude API failed: {e}")
        return False

def test_ollama():
    try:
        import requests
        response = requests.get('http://localhost:11434/api/tags', timeout=2)
        if response.status_code == 200:
            print("✅ Ollama running")
            return True
    except:
        print("⏭️  Ollama not running (skipped)")
        return None

def test_llm_provider():
    try:
        sys.path.insert(0, '.')
        from llm_provider import LLMProvider
        provider = LLMProvider.auto_detect()
        print(f"✅ LLM Provider auto-detected: {provider.provider_type}")
        return True
    except Exception as e:
        print(f"❌ LLM Provider failed: {e}")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("CFOPackV001 API Setup Test")
    print("="*60 + "\n")
    
    print("[Checking available APIs...]")
    print()
    
    test_groq()
    test_claude()
    test_ollama()
    test_llm_provider()
    
    print()
    print("="*60)
    print("If you see ✅ for at least one API, you're ready!")
    print("If you only see ⏭️, demo mode will be used (still works).")
    print("="*60 + "\n")
```

**Run before workshop:**
```bash
python test_api_setup.py
```

---

## Implementation Checklist

- [ ] Create `notebooks/llm_provider.py` (wrapper abstraction layer)
- [ ] Modify `N3_Collections_Intelligence.py` to use wrapper
- [ ] Modify `N5_Working_Capital_Levers.py` to use wrapper
- [ ] Modify `N7_Decision_Framework.py` to use wrapper
- [ ] Create `SETUP_API_FOR_WORKSHOP.md` (participant instructions)
- [ ] Create `test_api_setup.py` (verification script)
- [ ] Update notebook headers with setup instructions
- [ ] Create pre-computed outputs CSV for demo mode
- [ ] Test with all providers (Claude, Groq, Ollama, Demo)
- [ ] Document in main README

---

## Expected File Changes Summary

```
CFOPackV001/
├── notebooks/
│   ├── llm_provider.py                    ← NEW
│   ├── N3_Collections_Intelligence.py     ← MODIFIED (use wrapper)
│   ├── N5_Working_Capital_Levers.py       ← MODIFIED (use wrapper)
│   ├── N7_Decision_Framework.py           ← MODIFIED (use wrapper)
│   └── (N1, N2, N4, N6, N8 unchanged)
├── SETUP_API_FOR_WORKSHOP.md              ← NEW
├── test_api_setup.py                      ← NEW
└── outputs/
    └── N3_predictions_demo.csv            ← NEW (for demo mode)
    └── N5_scenarios_demo.csv              ← NEW (for demo mode)
    └── N7_memo_demo.md                    ← NEW (for demo mode)
```

---

## Testing Sequence

1. **Test Groq (free tier):**
   ```bash
   export GROQ_API_KEY="your_key"
   python test_api_setup.py
   # Should see ✅ for Groq
   ```

2. **Test Claude (if you have credits):**
   ```bash
   export ANTHROPIC_API_KEY="your_key"
   python test_api_setup.py
   # Should see ✅ for Claude
   ```

3. **Test Ollama (local):**
   ```bash
   ollama serve  # In another terminal
   python test_api_setup.py
   # Should see ✅ for Ollama
   ```

4. **Test demo mode (no setup):**
   ```bash
   unset GROQ_API_KEY
   unset ANTHROPIC_API_KEY
   python test_api_setup.py
   # Should auto-use demo mode
   ```

---

## Ready!

Once implemented, workshops can proceed with:
- ✅ No setup needed (demo mode)
- ✅ Groq free tier (recommended)
- ✅ Claude API (premium)
- ✅ Local Ollama (private)

All with ZERO code changes to N3, N5, N7 - just import and use!
