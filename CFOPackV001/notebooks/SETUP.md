# Notebook Setup Guide

How to run N1-N8 notebooks in Jupyter or Google Colab.

---

## Option 1: Local Jupyter (Recommended)

### **Prerequisites**
- Python 3.8 or higher
- pip (Python package manager)

### **Step 1: Install Jupyter**

```bash
pip install jupyter pandas numpy scikit-learn
```

### **Step 2: Convert Python to Jupyter**

Notebooks are provided as Python scripts (`.py` files). Convert to Jupyter format (`.ipynb`):

**Option A: Automated (Recommended)**
```bash
jupytext --to notebook N1_Import_and_Validate.py
jupytext --to notebook N2_Baseline_Forecast.py
# ... repeat for N3-N8
```

If `jupytext` not installed:
```bash
pip install jupytext
```

**Option B: Manual (3 steps)**
1. Open text editor
2. Copy contents of `N1_Import_and_Validate.py`
3. Create new Jupyter notebook, paste code into first cell

### **Step 3: Open Jupyter**

```bash
cd CFOPackV001/notebooks
jupyter notebook
```

This opens Jupyter in your browser. Click on converted notebook (`.ipynb` file).

### **Step 4: Run Cells**

- Press `Shift+Enter` to run each cell
- Or `Run` menu → `Run All Cells`

---

## Option 2: Google Colab (No Installation)

### **Prerequisites**
- Google account
- Internet connection

### **Step 1: Upload to Colab**

1. Go to https://colab.research.google.com/
2. Click `File` → `Open Notebook` → `Upload`
3. Select Python script (e.g., `N1_Import_and_Validate.py`)

### **Step 2: Fix Path References**

Colab runs in `/content/` directory. Edit paths in notebooks:

**Change this:**
```python
data_dir = "../data/synthetic/"
```

**To this:**
```python
# Upload CSV files to Colab first, then:
data_dir = "./"  # or upload to Colab
```

Or upload your data files:
```python
# In Colab:
from google.colab import files
files.upload()  # Select invoices.csv, etc.
```

### **Step 3: Run Cells**

- Click play button next to each cell
- Or `Runtime` menu → `Run All`

---

## Option 3: Anaconda (Windows/Mac)

### **Step 1: Install Anaconda**
Download from https://www.anaconda.com/

### **Step 2: Create Environment**

```bash
conda create -n cfo-pack python=3.9 jupyter pandas numpy scikit-learn
conda activate cfo-pack
```

### **Step 3: Launch Jupyter**

```bash
cd CFOPackV001/notebooks
jupyter notebook
```

---

## Running the Notebooks

### **Execution Order**
Run in this sequence (each produces output for the next):

1. **N1** → `N1_validated_data.csv`
2. **N2** → `N2_baseline_forecast.csv`
3. **N3** → `N3_invoice_payment_predictions.csv`
4. **N4** → `N4_revised_forecast.csv`
5. **N5** → `N5_ccc_scenarios.csv`
6. **N6** → `N6_hedge_recommendation.csv`
7. **N7** → `N7_decision_memo.md`
8. **N8** → `N8_operationalization_plan.csv`

### **File Paths**

Notebooks reference data files. Make sure paths are correct:

**Default (running from `/notebooks/`):**
```python
data_dir = "../data/synthetic/"
output_dir = "../outputs/"
```

If running from different location, adjust paths:
```python
# If running from CFOPackV001 root:
data_dir = "data/synthetic/"
output_dir = "outputs/"
```

### **Creating Output Directory**

Notebooks auto-create `/outputs/` directory. If needed manually:

```bash
mkdir outputs
```

---

## Troubleshooting

### **"Module not found" error**

**Problem:** `ModuleNotFoundError: No module named 'pandas'`

**Solution:** Install missing library
```bash
pip install pandas numpy scikit-learn
```

### **"File not found" error**

**Problem:** `FileNotFoundError: ../data/synthetic/invoices.csv`

**Solution:** Check file paths. Running from wrong directory?
```bash
# Print current directory
import os
print(os.getcwd())

# Should be: .../CFOPackV001/notebooks
# If not, adjust paths in notebook
```

### **Notebook won't run (Jupyter not found)**

**Problem:** Command `jupyter notebook` not found

**Solution:** Install Jupyter
```bash
pip install jupyter
```

### **Colab upload file limits**

**Problem:** CSV files too large for Colab upload

**Solution:** Sample data. Use top N customers instead of all
```python
# In N1:
invoices = pd.read_csv(data_dir + "invoices.csv")
invoices = invoices[invoices['customer_id'].isin(top_50_customers)]  # Sample
```

---

## Converting to Different Formats

### **Run as Python Script** (without Jupyter)

```bash
python N1_Import_and_Validate.py
python N2_Baseline_Forecast.py
# etc.
```

Output goes to console + CSV files.

### **Export Notebook to HTML** (for viewing/sharing)

```bash
jupyter nbconvert --to html N1_Import_and_Validate.ipynb
```

Creates `.html` file you can open in browser.

### **Export to PDF** (for printing)

```bash
jupyter nbconvert --to pdf N1_Import_and_Validate.ipynb
```

Requires additional setup (see Jupyter docs).

---

## Using Your Own Data

### **Step 1: Prepare CSVs**

See `data/README.md` for schema. Replace provided files:

```
CFOPackV001/data/synthetic/
├── invoices.csv (your data)
├── payments.csv (your data)
├── customers.csv (your data)
├── fx_exposure.csv (optional)
└── cash_flow.csv (your data)
```

### **Step 2: Update Paths (if needed)**

Notebooks reference `/data/synthetic/`. No changes needed if you replace files there.

### **Step 3: Run N1 First**

Always run N1 on new data to check quality:
```
✓ Missing values?
✓ Date formats?
✓ Customer references valid?
```

Fix any issues before proceeding to N2-N8.

---

## Performance Tuning

### **Notebook Runs Slowly**

**Problem:** N3 (ML model) is slow on large datasets

**Possible solutions:**
```python
# In N3, reduce training set:
training_data = training_data.sample(frac=0.5)  # Use 50% of data

# Or reduce model complexity:
model = RandomForestRegressor(n_estimators=50, max_depth=8)  # Fewer trees
```

### **Outputs Too Large**

**Problem:** CSV outputs are huge

**Solution:** Sample data in N1:
```python
# Sample 100 invoices instead of 500
invoices = invoices.sample(100)
```

---

## Questions?

- **Setup issues?** Check error message above; reinstall Python/Jupyter
- **Data issues?** See `data/README.md`
- **Notebook errors?** Error message usually tells you what's wrong; search error online
- **Jupyter help?** See https://jupyter.org/

---

## Next Steps

Once set up:
1. Run N1-N8 with provided data
2. Understand each step
3. Adapt to your own data
4. Share results with your team

**Good to go!** 🚀

