# Google Analytics Setup

## Instructions

1. **Get your GA4 Measurement ID:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Admin → Property → Data Streams → Web
   - Copy the Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to all demos:**
   ```bash
   python add_analytics.py G-XXXXXXXXXX
   ```

3. **Or manually add to index.html:**
   - Replace `G-XXXXXXXXXX` in the analytics-template.html
   - Copy the GA code to each demo's index.html

## Files
- `analytics-template.html` - GA template code
- `add_analytics.py` - Script to batch-add GA to all demos

## How to Run
```bash
# Install nothing - Python 3 is enough
python add_analytics.py G-YOUR-MEASUREMENT-ID
```

## What It Tracks
- Page views for landing page
- Page views for each demo
- Custom event tracking (optional)