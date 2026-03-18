# Google Sheets Troubleshooting Guide

If you're not seeing your books update, follow these steps:

## 🔍 Step 1: Check Browser Console

1. **Open your website** in browser
2. **Open Developer Tools** (F12 or right-click → Inspect)
3. **Go to Console tab**
4. **Look for these messages**:

### ✅ Success Messages
- "Successfully loaded X books from Google Sheets"
- "Loaded books from cache"
- "Cached X books locally"

### ❌ Error Messages
- "Failed to fetch data from Google Sheets"
- "No data found in Google Sheets"
- "API key not authorized"
- "403 Forbidden"
- "404 Not Found"

## 🛠️ Step 2: Common Issues & Solutions

### Issue: "Failed to fetch data from Google Sheets"
**Causes:**
- Sheet is not public
- API key restrictions
- Sheet ID is wrong

**Solutions:**
1. **Make sheet public**:
   - Open your Google Sheet
   - Click "Share" → "General access"
   - Select "Anyone with the link"
   - Set role to "Viewer"

2. **Check API key restrictions**:
   - Go to Google Cloud Console
   - Go to "APIs & Services" → "Credentials"
   - Click on your API key
   - Under "Application restrictions" → "HTTP referrers"
   - Add: `localhost:*` (for testing)

### Issue: "No data found in Google Sheets"
**Causes:**
- Sheet is empty
- Wrong range specified
- Headers in wrong format

**Solutions:**
1. **Check sheet structure**:
   - Column A: ID
   - Column B: Title
   - Column C: Author
   - Column D: Price
   - Column E: Category
   - Column F: Description
   - Column G: Image
   - Column H: Stock
   - Column I: ISBN

2. **Add sample data**:
   ```
   1 | Beast Academy Math Workbook Level 1 | Enriches Lab | 24.99 | beast-academy | Elementary school mathematics workbook | https://picsum.photos/seed/beast1/400/300 | 15 | 978-0-7432-7356-1
   ```

### Issue: "API key not authorized"
**Causes:**
- Google Sheets API not enabled
- API key restrictions too strict

**Solutions:**
1. **Enable Google Sheets API**:
   - Go to Google Cloud Console
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API"
   - Click "Enable"

2. **Check API key permissions**:
   - Go to "APIs & Services" → "Credentials"
   - Click your API key
   - Under "API restrictions" → "Restrict key"
   - Select "Google Sheets API"

## 🧪 Step 3: Test API Directly

Open browser console and run this test:

```javascript
// Test direct API call
fetch('https://sheets.googleapis.com/v4/spreadsheets/1SCi7-4l-ky4ko4Hp8YOHyuyB5jgwdYoQCcTjnbtpKGk/values/Sheet1!A:I?key=AIzaSyCIYMqeECBBr-chJsEJ7Z2kiVqKQX3GZ9g')
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('API Error:', error));
```

## 🔄 Step 4: Clear Cache & Refresh

If you had old data cached:

```javascript
// Clear cache in console
localStorage.removeItem('enriches_lab_books_cache');
localStorage.removeItem('enriches_lab_books_cache_timestamp');

// Refresh page
location.reload();
```

## 📋 Step 5: Verify Sheet URL

Check your sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/1SCi7-4l-ky4ko4Hp8YOHyuyB5jgwdYoQCcTjnbtpKGk/edit
```

The ID should match: `1SCi7-4l-ky4ko4Hp8YOHyuyB5jgwdYoQCcTjnbtpKGk`

## 🆘 Step 6: Debug Information

Run this in console to check current status:

```javascript
// Check cache status
console.log('Cache exists:', !!localStorage.getItem('enriches_lab_books_cache'));
console.log('Cache timestamp:', localStorage.getItem('enriches_lab_books_cache_timestamp'));

// Check if books are loaded
console.log('Books loaded:', window.books ? window.books.length : 0);

// Test refresh function
refreshBooksFromGoogleSheets();
```

## 📞 Step 7: Send Me Error Details

If still not working, send me:
1. **Console error messages** (copy/paste)
2. **Screenshot of your Google Sheet** (showing column headers)
3. **Result of the API test** (from Step 3)

---

**Quick Fix Checklist:**
- [ ] Sheet is public (Anyone with link can view)
- [ ] Google Sheets API is enabled
- [ ] API key has localhost referrer
- [ ] Sheet has correct column structure
- [ ] At least one row of data exists
- [ ] Console shows no error messages

Try these steps and let me know what you find!
