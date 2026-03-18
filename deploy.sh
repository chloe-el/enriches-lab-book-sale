#!/bin/bash

echo "🚀 Deploying Enriches Lab Book Sale to GitHub Pages..."

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to GitHub
git push origin main

echo "✅ Deployment complete!"
echo "📝 Next steps:"
echo "1. Go to GitHub repository Settings → Pages"
echo "2. Enable GitHub Pages from main branch"
echo "3. Update Stripe Dashboard with your domain"
echo ""
echo "🌐 Your site will be live at: https://yourusername.github.io/your-repo"
