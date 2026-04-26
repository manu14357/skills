---
name: invoice-organizer
description: Automatically organize invoices and receipts for tax preparation by extracting key information, renaming files consistently, and sorting into logical folders. Transform chaotic bookkeeping into tax-ready records.
compatibility:
  use-case: Tax preparation, expense management, financial record organization
  frameworks: Invoice processing, file organization, document extraction
---

# Invoice Organizer

## Use This Skill When

- Preparing for tax season with disorganized invoices
- Managing business expenses across multiple vendors
- Setting up automated invoice filing system
- Organizing receipts from email downloads or scans
- Archiving financial records by year or category
- Reconciling expenses for reimbursement
- Preparing documentation for accountants
- Need to extract invoice data for expense tracking

## When NOT to Use

- Complex bookkeeping requiring accountant review (consult professional)
- Invoices with legal/compliance requirements
- International tax documents (jurisdiction-specific)
- Personal financial organization unrelated to taxes
- Highly sensitive financial data (security concerns)

## Context: Invoice Organization Maturity

**Undeveloped**: Folder of mixed, unnamed invoices; chaos at tax time.

**Target**: Consistent naming, organized by vendor/category/date, extractable data.

**Optimized**: Automated recurring invoices, real-time expense categorization, integration with accounting software.

## Core Principle

**Organization reduces tax-time stress.** Consistent naming, logical folders, and extracted data means accountants spend less time sorting and more time optimizing — saving money and reducing audit risk.

## Instructions

### Step 1: Understand Your Invoice Collection

**Assess current state:**

```bash
# See what you have
ls -la ~/invoices  # Count files
find ~/invoices -type f | wc -l  # Total file count
file ~/invoices/* | head -20  # File types
```

**Gather:** vendor list, time period, expense categories

### Step 2: Extract Invoice Data

**Read invoice files and extract key information:**

```markdown
## Invoice Data Extraction

For each invoice file, extract:

| Field | Example |
|-------|---------|
| **Vendor/Company** | Adobe Systems |
| **Invoice Number** | INV-2024-001234 |
| **Date** | 2024-03-15 |
| **Amount** | $99.00 |
| **Category** | Software/SaaS |
| **Description** | Creative Cloud Monthly |
| **Tax Category** | Deductible-Business |
| **Payment Method** | Credit Card (last 4: 5678) |

### Extraction Methods

**Method 1: Manual (PDFs with readable text)**
- Open PDF, read invoice details, record in spreadsheet

**Method 2: OCR (Scanned receipts/images)**
```bash
tesseract receipt.jpg stdout | grep -E 'total|amount|date'
```

**Method 3: Metadata (Emails with attachments)**
- Extract from email subject, date, sender

**Consolidate into CSV:**
```csv
Date,Vendor,Invoice#,Amount,Category,Description,PaymentMethod
2024-03-15,Adobe,INV-2024-001234,99.00,Software,Creative Cloud,CC-5678
2024-03-18,AWS,621-3917-2491,245.32,Cloud Services,EC2+RDS,CC-5678
```
```

### Step 3: Create Consistent Naming Convention

**Standardize file names:**

```
Format: YYYY-MM-DD_Vendor_Amount_Description.pdf

Examples:
✓ 2024-03-15_Adobe_99.00_CreativeCloud.pdf
✓ 2024-03-18_AWS_245.32_EC2-RDS.pdf
✓ 2024-03-20_Stripe_15.00_ProcessingFees.pdf
✗ Invoice.pdf (unclear)
✗ adobe_creative_subscription (no date)
```

**Benefits:**
- Sortable by date (YYYY-MM-DD prefix)
- Easy to search by vendor
- Amount visible for reconciliation
- Original attachment name preserved as reference

### Step 4: Organize Into Logical Folders

**Choose organization strategy:**

**Option A: By Category**
```
invoices/
├── 2024/
│   ├── Software-SaaS/
│   │   ├── 2024-03-15_Adobe_99.00_CreativeCloud.pdf
│   │   ├── 2024-03-20_Figma_12.00_Professional.pdf
│   ├── Cloud-Infrastructure/
│   │   ├── 2024-03-18_AWS_245.32_EC2.pdf
│   │   ├── 2024-03-19_Heroku_50.00_Dynos.pdf
│   ├── Office-Supplies/
│   └── Travel/
├── 2023/
│   ├── Software-SaaS/
│   └── [categories]
```

**Option B: By Vendor**
```
invoices/
├── 2024/
│   ├── Adobe/
│   │   └── 2024-03-15_Adobe_99.00_CreativeCloud.pdf
│   ├── AWS/
│   │   ├── 2024-03-18_AWS_245.32_EC2.pdf
│   │   └── 2024-04-10_AWS_267.45_RDS.pdf
│   ├── Figma/
│   └── [vendors]
├── 2023/
│   └── [vendors]
```

**Option C: Hybrid (Category + Vendor)**
```
invoices/
├── 2024/
│   ├── Q1/
│   │   ├── Software-SaaS/
│   │   │   ├── Adobe/
│   │   │   └── Figma/
│   │   └── Cloud-Infrastructure/
```

**Recommendation**: Category → Year → Vendor (most searchable for accountants)

### Step 5: Rename and Organize Files

**Batch rename and move:**

```bash
#!/bin/bash
# organize-invoices.sh

INVOICE_DIR="${1:-.}"
TARGET_DIR="${2:-./organized}"

mkdir -p "$TARGET_DIR"

# For each invoice file
for invoice in "$INVOICE_DIR"/*; do
  if [ -f "$invoice" ]; then
    # Extract info (manual or via OCR)
    # For demo: assume filename has date_vendor_amount
    
    filename=$(basename "$invoice")
    date=$(echo $filename | cut -d_ -f1)
    vendor=$(echo $filename | cut -d_ -f2)
    year=${date:0:4}
    category="General"  # Or extract from vendor mapping
    
    # Create folder structure
    mkdir -p "$TARGET_DIR/$year/$category/$vendor"
    
    # Move file
    cp "$invoice" "$TARGET_DIR/$year/$category/$vendor/$filename"
    echo "✓ Moved: $TARGET_DIR/$year/$category/$vendor/$filename"
  fi
done
```

**Run:**
```bash
chmod +x organize-invoices.sh
./organize-invoices.sh ~/messy-invoices ~/invoices-organized
```

### Step 6: Create Tax Summary

**Generate tax-ready report:**

```markdown
## Tax Year 2024 — Invoice Summary

### By Category

| Category | # Invoices | Total Amount | Tax Deductible |
|----------|-----------|--------------|----------------|
| Software-SaaS | 12 | $1,248.00 | ✓ Yes |
| Cloud Infrastructure | 8 | $2,145.60 | ✓ Yes |
| Office Supplies | 15 | $452.30 | ✓ Yes |
| Travel | 6 | $3,821.45 | ✓ Yes |
| Meals & Entertainment | 8 | $645.80 | ⚠️ 50% |
| Personal | 3 | $156.20 | ✗ No |

### Tax Summary
- **Total Deductible Expenses**: $7,313.15
- **Non-Deductible**: $156.20
- **50% Deductible**: $645.80 (× 0.5 = $322.90)
- **Total Tax Benefit**: ~$2,194 (at 30% tax rate)

### By Vendor (Top 10)
1. AWS: $2,145.60
2. Adobe: $1,188.00
3. Stripe: $234.60
[...etc]

### Missing or Incomplete
- [ ] Verify all 2024 expenses captured
- [ ] Q4 reconciliation with bank statements
- [ ] Confirm all personal expenses removed
- [ ] Backup originals before tax submission
```

### Step 7: Verify Completeness

**Tax-ready checklist:**

```markdown
## Invoice Organization Checklist

**✓ Data Extraction**
- [ ] All invoices read (OCR, manual, or metadata)
- [ ] Key fields extracted: date, vendor, amount, category
- [ ] Data entered into spreadsheet

**✓ Naming**
- [ ] All files follow YYYY-MM-DD_Vendor_Amount format
- [ ] No duplicate filenames
- [ ] Original filenames preserved if needed

**✓ Organization**
- [ ] Folder structure established (Year/Category or Vendor)
- [ ] All files moved to proper locations
- [ ] Original folder archived (if needed)

**✓ Documentation**
- [ ] Tax summary generated
- [ ] Categories finalized and consistent
- [ ] Personal expenses removed
- [ ] Accountant-friendly structure confirmed

**✓ Backup & Handoff**
- [ ] Backup created (entire organized folder)
- [ ] Read-only copy for accountant
- [ ] Spreadsheet with extracted data ready
- [ ] Notes on any ambiguous invoices
```

## Output

**Deliver:**

1. **Extraction Summary** (total invoices read, data captured)
2. **Organization Report** (folder structure created, files organized)
3. **Tax Summary** (by category, totals, deductibility)
4. **Backup Confirmation** (original data preserved)
5. **Accountant-Ready Package** (organized folder + data spreadsheet)