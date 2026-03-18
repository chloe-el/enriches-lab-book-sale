# Enriches Lab Book Sale - GitHub Pages Deployment

## Quick Setup for GitHub Pages

### 1. Update Stripe Configuration
Edit `script.js` and replace the Stripe key:
```javascript
// Find this line in script.js
const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_YOUR_LIVE_PUBLISHABLE_KEY');
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Set **Source**: Deploy from a branch
4. Set **Branch**: main
5. Click **Save**

### 4. Configure Stripe
1. Go to Stripe Dashboard → Settings → Checkout
2. Add your domain: `https://yourusername.github.io/your-repo`
3. Set up webhook (optional): `https://yourusername.github.io/your-repo/webhook`

## Architecture

- **Frontend**: GitHub Pages (static HTML/CSS/JS)
- **Payments**: Direct Stripe Checkout API
- **Orders**: Stripe Dashboard (no backend needed)

## Benefits

✅ **Free hosting** - No monthly costs
✅ **SSL included** - Automatic HTTPS
✅ **Global CDN** - Fast worldwide delivery
✅ **Auto deployment** - Push to deploy
✅ **Custom domain** - Use your own domain

## Files Deployed

```
├── index.html          # Main book store
├── success.html        # Payment confirmation
├── styles/            # CSS styling
├── images/            # Book covers and logo
├── script.js           # Main JavaScript (updated for direct Stripe)
├── books.json          # Book inventory
└── .github/workflows/  # Auto-deployment
```

## What Happens

1. Customer clicks "Proceed to Checkout"
2. JavaScript calls Stripe API directly
3. Customer pays on Stripe's secure servers
4. Stripe redirects back to your success page
5. All order data lives in Stripe Dashboard

Perfect for a few hundred visits! 🚀
