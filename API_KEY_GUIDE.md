# How to Find Your Google Sheets API Key

Follow these exact steps to get your API key:

## 🔑 Step-by-Step Guide

### 1. Go to Google Cloud Console
1. **Visit**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Sign in** with your Google account
3. **Select existing project** or **create new project**

### 2. Enable Google Sheets API
1. **Click menu** (☰) → "APIs & Services"
2. **Click "Library"** (left sidebar)
3. **Search for**: "Google Sheets API"
4. **Click on it** from the results
5. **Click "Enable"** button

### 3. Create API Key
1. **Go to**: "APIs & Services" → "Credentials"
2. **Click "+ CREATE CREDENTIALS"** (top bar)
3. **Select "API key"** from dropdown
4. **Copy the API key** that appears
5. **Click "RESTRICT KEY"** (recommended for security)

### 4. Restrict API Key (Important!)
1. **Under "Application restrictions"**:
   - Select "HTTP referrers"
   - Add: `localhost:*` (for testing)
   - Add: `*.yourdomain.com` (for production)
2. **Under "API restrictions"**:
   - Click "Restrict key"
   - Search and select "Google Sheets API"
3. **Click "Save"**

## 📋 What Your API Key Looks Like

Your API key will be a long string like:
```
AIzaSyC-abcdefghijklmnopqrstuvwxyz1234567890
```

## 🔍 Alternative: Find Existing API Key

If you already have one:

1. **Go to**: "APIs & Services" → "Credentials"
2. **Look for "API keys"** section
3. **Click on your existing key**
4. **Copy the key** from the "API key" field

## 🛡️ Security Notes

### For Testing (Local Development)
Add these referrers:
- `localhost:*`
- `127.0.0.1:*`

### For Production (Live Website)
Add your actual domain:
- `*.yourdomain.com`
- `yourdomain.com`

### ⚠️ Important
- **Never share** your API key publicly
- **Remove localhost** restrictions before going live
- **Keep API key** secure and private

## 🔧 What to Do With Your API Key

Once you have it:

1. **Copy the API key**
2. **Send it to me** in this format:
   ```
   🔑 Google API Key: AIzaSyC-...
   ```
3. **I'll update** your `google-sheets.js` file

## 🆘 Troubleshooting

### "API key not authorized"
- Check if Google Sheets API is enabled
- Verify referrer restrictions
- Ensure API key is correct

### "Exceeded quota"
- Check API usage limits
- Consider upgrading to paid plan
- Optimize API calls

### "Invalid API key"
- Copy key again (no extra spaces)
- Check key is active
- Verify project selection

## 📱 Mobile Access

You can do this on mobile too:
1. **Open browser** and go to console.cloud.google.com
2. **Request desktop site** if needed
3. **Follow same steps**

## ✅ Quick Checklist

Before sending me your API key:
- [ ] Google Sheets API is enabled
- [ ] API key is copied correctly
- [ ] Referrers are set (localhost for testing)
- [ ] API key is restricted to Google Sheets API
- [ ] You have the exact key string

---

**Ready!** Once you have your API key, send it to me and I'll integrate it immediately.
