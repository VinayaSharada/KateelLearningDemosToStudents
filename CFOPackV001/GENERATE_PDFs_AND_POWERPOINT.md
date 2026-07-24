# Generate PDFs and PowerPoint
## Step-by-step instructions for local generation

**Why local?** Pandoc and PowerPoint generation work better on your machine.

---

## Step 1: Install Pandoc (One-Time)

### macOS
```bash
brew install pandoc
```

### Windows (via Chocolatey)
```powershell
choco install pandoc
```

### Windows (via Scoop)
```powershell
scoop install pandoc
```

### Or Download Directly
👉 https://pandoc.org/installing.html

---

## Step 2: Generate PDFs

### Option A: One-Command (Generates Both)

```bash
# From CFOPackV001 directory
pandoc START_HERE.md -o CFOPackV001_Student_Guide.pdf
pandoc INSTRUCTOR_QUICK_START.md -o CFOPackV001_Instructor_Guide.pdf
```

### Option B: With Styling (Better Looking)

```bash
# Create nice PDFs with table of contents
pandoc START_HERE.md \
  --toc \
  --toc-depth=2 \
  --pdf-engine=xelatex \
  -o CFOPackV001_Student_Guide.pdf

pandoc INSTRUCTOR_QUICK_START.md \
  --toc \
  --toc-depth=2 \
  --pdf-engine=xelatex \
  -o CFOPackV001_Instructor_Guide.pdf
```

### Option C: From Google Docs (Alternative)

1. Open START_HERE.md in a text editor
2. Copy all content
3. Paste into Google Docs
4. File → Download → PDF
5. Done!

---

## Step 3: Verify PDFs

After generation:

```bash
# Check files exist
ls -lh CFOPackV001_Student_Guide.pdf
ls -lh CFOPackV001_Instructor_Guide.pdf

# Open to verify
open CFOPackV001_Student_Guide.pdf  # macOS
# or
start CFOPackV001_Student_Guide.pdf  # Windows
```

Expected result:
- ✅ 5-10 MB PDF files
- ✅ All content included
- ✅ Clickable links (if using option B)
- ✅ Table of contents (if using option B)

---

## Step 4: Generate PowerPoint Presentation

### Option A: Python Script (Easiest)

Create file: `generate_presentation.py`

```python
"""
Generate PowerPoint from INSTRUCTOR_PRESENTATION_OUTLINE.md
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Read the markdown
with open('INSTRUCTOR_PRESENTATION_OUTLINE.md', 'r') as f:
    content = f.read()

# Create presentation
prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(7.5)

# Parse slides (look for ## Slide X: Title)
slides_text = content.split('## Slide ')

for slide_content in slides_text[1:]:  # Skip content before first slide
    lines = slide_content.split('\n')
    
    # Add blank slide
    blank_slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # Add title (from first line)
    if lines:
        title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(1))
        title_frame = title_box.text_frame
        title_frame.word_wrap = True
        
        title_text = lines[0].split(':')[1].strip() if ':' in lines[0] else lines[0]
        p = title_frame.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(44)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0, 51, 102)  # Dark blue
    
    # Add content (everything after title until speaker notes)
    content_text = '\n'.join(lines[1:])
    content_text = content_text.split('**Speaker Notes:**')[0]  # Remove speaker notes
    
    if content_text.strip():
        content_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.7), Inches(9), Inches(5.5))
        text_frame = content_box.text_frame
        text_frame.word_wrap = True
        
        # Clean up content
        content_lines = [l.strip() for l in content_text.split('\n') if l.strip()]
        
        for i, line in enumerate(content_lines):
            if i == 0:
                p = text_frame.paragraphs[0]
            else:
                p = text_frame.add_paragraph()
            
            # Handle bullet points
            if line.startswith('- '):
                p.text = line[2:]
                p.level = 0
            elif line.startswith('  - '):
                p.text = line[4:]
                p.level = 1
            else:
                p.text = line
            
            p.font.size = Pt(24)
            p.space_before = Pt(12)

# Save
prs.save('CFOPackV001_Workshop_Briefing.pptx')
print("✅ PowerPoint created: CFOPackV001_Workshop_Briefing.pptx")
```

Run it:
```bash
python generate_presentation.py
```

### Option B: Manual in PowerPoint (More Control)

1. Open PowerPoint
2. Use INSTRUCTOR_PRESENTATION_OUTLINE.md as reference
3. Create slides matching the 14-slide structure
4. Copy text from markdown into slides
5. Add any images/branding
6. Save as `CFOPackV001_Workshop_Briefing.pptx`

### Option C: Online Converter

1. Convert markdown to PDF (Step 2 above)
2. Use online tool: https://cloudconvert.com/pdf-to-pptx
3. Clean up in PowerPoint if needed

---

## Step 5: Update Notebook Headers

See next section: NOTEBOOK_HEADER_TEMPLATE.md

Apply this template header to ALL 8 notebooks (N1-N8):

```python
"""
Module Title: [Name from NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md]
CFO Pack V001 - Treasury Decision Workshop

[Markdown cell with description, link to Colab, etc.]
"""

# Then rest of notebook follows...
```

---

## Step 6: Testing Checklist

Create file: `TESTING_CHECKLIST.md`

See the TESTING_CHECKLIST.md file (next section) for the complete checklist.

Run through it:
```bash
# Go through each item
- [ ] Colab button 1 (N1): Click link, verify notebook opens
- [ ] Colab button 2 (N2): Click link, verify notebook opens
- [ ] ... (repeat for N3-N8)
- [ ] Groq API: Test with sample notebook run
- [ ] Demo mode: Disable API key, verify fallback works
- [ ] Markdown files: Open START_HERE.md and verify all links work
- [ ] GitHub repo: Verify synthetic data loads from GitHub URLs
```

---

## Complete Workflow

### On Your Machine

```bash
# 1. Install pandoc (one time)
brew install pandoc  # or appropriate command for your OS

# 2. Generate PDFs
cd CFOPackV001
pandoc START_HERE.md -o CFOPackV001_Student_Guide.pdf
pandoc INSTRUCTOR_QUICK_START.md -o CFOPackV001_Instructor_Guide.pdf

# 3. Generate PowerPoint (if using Python script)
python generate_presentation.py

# 4. Verify files exist
ls -lh *.pdf *.pptx

# 5. Open and review
open CFOPackV001_Student_Guide.pdf
open CFOPackV001_Workshop_Briefing.pptx

# 6. Upload to GitHub (if desired)
git add CFOPackV001_Student_Guide.pdf
git add CFOPackV001_Instructor_Guide.pdf
git add CFOPackV001_Workshop_Briefing.pptx
git commit -m "Add PDF and PowerPoint versions of CFOPackV001 materials"
git push origin main
```

---

## Files Generated

```
CFOPackV001/
├─ START_HERE.md (markdown source)
├─ CFOPackV001_Student_Guide.pdf (PDF - generated)
├─ INSTRUCTOR_QUICK_START.md (markdown source)
├─ CFOPackV001_Instructor_Guide.pdf (PDF - generated)
├─ INSTRUCTOR_PRESENTATION_OUTLINE.md (markdown source)
├─ CFOPackV001_Workshop_Briefing.pptx (PowerPoint - generated)
└─ (other files...)
```

---

## Distribution Options

### Option 1: Email (Preferred)
```
To: All students
Subject: CFOPackV001 - Getting Ready

Files attached:
- CFOPackV001_Student_Guide.pdf
- START_HERE.md

(Or just send links to GitHub if they prefer)
```

### Option 2: GitHub
```
Push PDFs to repo:
1. pdf files in CFOPackV001/ directory
2. Linked from main README
3. Students download as needed
```

### Option 3: Shared Drive
```
- Google Drive / Dropbox / OneDrive
- Share link with participants
- Always available, easy to update
```

### Option 4: Printed
```
- Print both PDFs
- Bring to workshop
- Give to participants
```

---

## Troubleshooting PDF Generation

### "pandoc: command not found"
**Solution:** Install pandoc (see Step 1)

### "PDF looks ugly"
**Solution:** Use Option B with better styling:
```bash
pandoc START_HERE.md \
  --pdf-engine=xelatex \
  --toc \
  -V geometry:margin=1in \
  -o CFOPackV001_Student_Guide.pdf
```

### "Links don't work in PDF"
**Solution:** Links should work with pandoc default. If not, use Google Docs PDF export instead.

### "File is too large"
**Solution:** Normal - PDFs will be 5-10MB. Compress if needed:
```bash
# macOS
brew install ghostscript
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
  -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
```

---

## Troubleshooting PowerPoint Generation

### Python script fails
**Solution:** Install required package:
```bash
pip install python-pptx
```

### "No module named pptx"
**Solution:** Same as above - install python-pptx

### Manual is too much work
**Solution:** Use online converter (PDF → PPTX):
1. Generate PDF (Step 2)
2. Upload to https://cloudconvert.com/pdf-to-pptx
3. Download PPTX
4. Touch up in PowerPoint if needed

---

## Next Steps After Generation

1. **Review all PDFs** - Make sure content looks good
2. **Review PowerPoint** - Verify slides are readable
3. **Test Colab links** - Click all buttons from PDFs
4. **Test Groq API** - Run one notebook with Groq key
5. **Share with students** - Email or upload to GitHub
6. **Print for yourself** - Bring to workshop

---

## Quick Reference: Commands

```bash
# Install pandoc
brew install pandoc  # macOS
choco install pandoc  # Windows (Chocolatey)
scoop install pandoc  # Windows (Scoop)

# Generate PDFs
pandoc START_HERE.md -o CFOPackV001_Student_Guide.pdf
pandoc INSTRUCTOR_QUICK_START.md -o CFOPackV001_Instructor_Guide.pdf

# Generate PowerPoint (with Python script)
python generate_presentation.py

# Verify files
ls -lh CFOPackV001*.pdf
ls -lh CFOPackV001*.pptx

# Upload to Git
git add CFOPackV001*.pdf CFOPackV001*.pptx
git commit -m "Add PDF and PowerPoint versions"
git push origin main
```

---

## Support

- **Pandoc issues?** Check: https://pandoc.org/installing.html
- **Python-pptx issues?** Check: https://python-pptx.readthedocs.io/
- **PowerPoint issues?** Manual creation in PowerPoint.com is easiest

---

## Time Estimate

- Install pandoc: 2-3 min
- Generate PDFs: 1 min
- Generate PowerPoint: 2-3 min (Python script) or 15-20 min (manual)
- Review & verify: 5-10 min
- Upload to GitHub: 2-3 min

**Total: 10-20 minutes**

---

**All steps are optional** - the workshop works great with just the markdown files. PDFs and PowerPoint are for convenience/distribution.

The next files (NOTEBOOK_HEADER_TEMPLATE.md and TESTING_CHECKLIST.md) will guide you through updating notebooks and testing.
