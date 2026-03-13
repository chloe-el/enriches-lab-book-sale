# Quick Google Sheets Setup

Follow these steps to provide me with your Google Sheet information:

## 🚀 Step 1: Create Your Google Sheet

1. **Go to**: [sheets.google.com](https://sheets.google.com)
2. **Create new sheet** or use existing one
3. **Set up columns** in this exact order:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| **ID** | **Title** | **Author** | **Price** | **Category** | **Description** | **Image** | **Stock** | **ISBN** |

## 📊 Step 2: Add Your Book Data

**Example Row:**
```
1 | Beast Academy Math Workbook Level 1 | Enriches Lab | 24.99 | beast-academy | Elementary school mathematics workbook for young learners | https://picsum.photos/seed/beast1/400/300 | 15 | 978-0-7432-7356-1
```

**Category Values (use exactly these):**
- `beast-academy` - Beast Academy - Elementary School
- `aops-series` - AoPS Series - Middle and High School  
- `math-contest` - Math Contest - Middle and High School
- `mathstart` - MathStart - Early Discovery

## 🔑 Step 3: Get Google Sheets API Key

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com)
2. **Select project** or create new one
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

## 🆔 Step 4: Get Your Sheet ID

1. **Open your Google Sheet**
2. **Look at the URL**: `https://docs.google.com/spreadsheets/d/`**`YOUR_SHEET_ID_HERE`**`/edit`
3. **Copy the Sheet ID** (the long string between `/d/` and `/edit`)

## 📧 Step 5: Update the Code

**Update `google-sheets.js`:**
Replace these two lines:

```javascript
const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE';     // Paste your Sheet ID here
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';       // Paste your API key here
```

## ✅ Step 6: Test It

1. **Save all files**
2. **Open the website** in browser
3. **Check browser console** (F12) for:
   - "Successfully loaded X books from Google Sheets" ✅
   - Any error messages ❌

## 🎯 What to Send Me

Just provide these two pieces of information:

```
📋 Google Sheet ID: [Your Sheet ID here]
🔑 Google API Key: [Your API Key here]
```

That's it! I'll handle the rest.

## 📱 Alternative: Share Sheet Link

If you prefer, you can also:
1. **Share your Google Sheet** with "Anyone with the link can view"
2. **Send me the shareable link**
3. **I can extract the data** directly from the public sheet

## 🔍 Verification

After setup, you should see:
- Books loading from your Google Sheet
- Your custom book titles, prices, and descriptions
- Your inventory stock levels
- Your category assignments

## 🆘 Troubleshooting

**"No data found" error:**
- Check Sheet ID is correct
- Verify sheet is public (if using share method)
- Check API key is valid

**"API key not authorized":**
- Verify Google Sheets API is enabled
- Check API key restrictions
- Ensure correct API key format

---

**Ready when you are!** Just send me the Sheet ID and API Key, and I'll integrate your Google Sheet immediately.
