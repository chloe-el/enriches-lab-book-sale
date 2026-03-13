# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets as the data source for your Enriches Lab Book Sale website.

## 📋 Overview

Using Google Sheets allows you to:
- **Manage inventory** without editing code
- **Update prices, stock, and descriptions** in real-time
- **Add new books** easily through a spreadsheet
- **Collaborate** with team members on book management

## 🚀 Quick Setup

### Step 1: Create Your Google Sheet

1. **Create a new Google Sheet** at [sheets.google.com](https://sheets.google.com)
2. **Set up columns** in this exact order:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | Title | Author | Price | Category | Description | Image | Stock | ISBN |

3. **Add your book data** following the format below

### Step 2: Get Google Sheets API Key

1. **Go to Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create a new project** or select existing one
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

### Step 3: Get Your Sheet ID

1. **Open your Google Sheet**
2. **Look at the URL**: `https://docs.google.com/spreadsheets/d/`**`SHEET_ID_HERE`**`/edit`
3. **Copy the Sheet ID** (the long string between `/d/` and `/edit`)

### Step 4: Configure Your Website

1. **Open `google-sheets.js`**
2. **Replace the placeholders**:

```javascript
const GOOGLE_SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';     // Paste your Sheet ID here
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';       // Paste your API key here
```

## 📊 Sheet Format Examples

### Example Data Structure

| ID | Title | Author | Price | Category | Description | Image | Stock | ISBN |
|----|-------|--------|-------|----------|-------------|-------|-------|------|
| 1 | Beast Academy Math Workbook Level 1 | Enriches Lab | 24.99 | beast-academy | Elementary school mathematics workbook for young learners | https://picsum.photos/seed/beast1/400/300 | 15 | 978-0-7432-7356-1 |
| 2 | Introduction to Algebra | AoPS | 49.99 | aops-series | Comprehensive introduction to algebra for middle school students | https://picsum.photos/seed/algebra1/400/300 | 8 | 978-0-7432-7356-3 |

### Category Values

Use these exact category values:
- `beast-academy` - Beast Academy - Elementary School
- `aops-series` - AoPS Series - Middle and High School
- `math-contest` - Math Contest - Middle and High School
- `mathstart` - MathStart - Early Discovery

### Image URLs

- **Use your own images**: Upload to your server and use full URLs
- **Use placeholder images**: `https://picsum.photos/seed/UNIQUE_ID/400/300`
- **Leave blank**: Will use automatic placeholder images

## 🔧 Advanced Configuration

### Custom Sheet Range

If your data is in a different sheet or range:

```javascript
const SHEET_RANGE = 'Books!A:I';     // Sheet named "Books"
const SHEET_RANGE = 'Sheet2!A:H';    // Different sheet
const SHEET_RANGE = 'A1:H100';       // Specific range
```

### Error Handling

The system includes automatic fallback:
- **If Google Sheets fails**: Uses backup book data
- **If API quota exceeded**: Shows error message with retry option
- **If sheet is empty**: Displays "No books found" message

## 🛡️ Security Considerations

### API Key Security

1. **Restrict your API key**:
   - Go to Google Cloud Console → Credentials
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your website domain: `*.yourdomain.com`

2. **For local development**:
   - Add `localhost:*` and `127.0.0.1:*` to referrers
   - **Important**: Remove these before production deployment

### Sheet Sharing

1. **Make sheet public**:
   - Click "Share" → "General access"
   - Select "Anyone with the link"
   - Set role to "Viewer"

2. **Alternative**: Use service account for more security

## 📱 Testing Your Setup

### Local Testing

1. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

2. **Open browser console** to check for:
   - API key errors
   - Network requests
   - Data parsing issues

### Common Issues

**"API key not authorized"**
- Check API key is correct
- Verify Google Sheets API is enabled
- Check referrer restrictions

**"No data found"**
- Verify sheet is public
- Check Sheet ID is correct
- Ensure data starts in row 2 (row 1 is headers)

**"Invalid column format"**
- Ensure columns are in correct order
- Check for empty rows in the middle
- Verify numeric fields (Price, Stock, ID) contain numbers

## 🔄 Real-time Updates

When you update your Google Sheet:
1. **Changes appear immediately** on page refresh
2. **Stock updates** reflect in real-time
3. **New books** appear automatically
4. **Price changes** update instantly

## 📈 Performance Tips

- **Limit to 1000 rows** for best performance
- **Use specific ranges** instead of entire sheet
- **Cache data** in browser for offline access
- **Monitor API quota** usage

## 🆘 Troubleshooting

### Debug Mode

Add this to your browser console to debug:

```javascript
// Check if Google Sheets loaded
console.log('Books loaded:', window.books.length);

// Test API directly
fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A:H?key=YOUR_API_KEY`)
  .then(r => r.json())
  .then(console.log);
```

### Getting Help

1. **Check browser console** for error messages
2. **Verify API key permissions** in Google Cloud Console
3. **Test sheet URL** by opening it directly
4. **Check network tab** for failed requests

---

**Ready to go!** Your book inventory is now managed through Google Sheets, making updates simple and collaborative.
