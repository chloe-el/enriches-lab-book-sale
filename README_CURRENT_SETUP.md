# Enriches Lab Book Sale - Current Setup

## 📚 Book Data Source
**Primary:** `books.json` file (29 books)
- ✅ **All 29 books loaded** from local JSON
- ✅ **Categories:** AoPS Series, Beast Academy, Math Contest, MathStart
- ✅ **No API dependencies** - Reliable and fast
- ✅ **Easy to update** - Edit JSON file directly

## 💳 Order Storage
**Primary:** Google Sheets (Orders tab)
- ✅ **Orders saved** to Google Sheets automatically
- ✅ **Order ID format:** ORD-2026ABS-0001, ORD-2026ABS-0002
- ✅ **Fallback:** Local `orders.json` file if Sheets fails
- ✅ **Server endpoints:** `/sheets-orders`, `/sheets-book-counts`

## 🚀 Deployment Ready
**Status:** ✅ **Ready for GitHub Pages**
- ✅ **Static files** - index.html, styles.css, script.js
- ✅ **Server for payments** - server-stripe.js (Node.js)
- ✅ **Order management** - Google Sheets integration
- ✅ **Stripe checkout** - Complete payment flow

## 📊 Current Book Count
**Total:** 29 books in `books.json`
- **AoPS Series:** Multiple titles (Prealgebra, Algebra, Geometry, etc.)
- **Beast Academy:** Multiple levels (1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B)
- **Math Contest:** Competition preparation books
- **MathStart:** Level sets (1, 2, 3)

## 🎯 Features Working
- ✅ **Book display** - All 29 books shown
- ✅ **Category filtering** - By series/level
- ✅ **Search functionality** - Find books by title
- ✅ **Shopping cart** - Add/remove items
- ✅ **Sticky checkout** - Total and button always visible
- ✅ **Stripe payments** - Secure checkout
- ✅ **Order tracking** - Sequential order IDs
- ✅ **Success page** - Order confirmation
- ✅ **Order storage** - Google Sheets + local backup

## 🔧 To Update Books
**Simple process:**
1. **Edit `books.json`** - Add/remove books
2. **Update IDs** - Keep sequential (1, 2, 3...)
3. **Refresh website** - Changes appear immediately
4. **Test functionality** - Cart, checkout, etc.

## 🌐 To Deploy to GitHub Pages
**Steps:**
1. **Push to GitHub** - All files except server files
2. **Enable GitHub Pages** - In repository settings
3. **Deploy server separately** - Heroku, Vercel, or similar
4. **Update Stripe webhook** - Point to production server

## 📱 End-to-End Test
**Test flow:**
1. **Browse books** - All 29 should display
2. **Add to cart** - Test cart functionality
3. **Checkout** - Complete Stripe payment
4. **Check Google Sheets** - Order should appear in Orders tab
5. **Verify order ID** - Should be ORD-2026ABS-0001 format

## 🎨 UI Features
- ✅ **Sticky cart footer** - Total and checkout always visible
- ✅ **Responsive design** - Mobile friendly
- ✅ **Pre-order banner** - Delivery information
- ✅ **Success page** - Clear next steps
- ✅ **Professional styling** - Modern appearance

---
**Status:** ✅ **Production Ready**
