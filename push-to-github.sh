#!/bin/bash

# GitHub Push Script for DCE OmniVerse
echo "🚀 Setting up GitHub repository for DCE OmniVerse..."

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

echo ""
echo "📝 Instructions to push your code to GitHub:"
echo "============================================"
echo ""
echo "1. First, create a new repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: dce-omniverse"
echo "   - Description: DCE OmniVerse - Next-generation omnichannel agentic AI solution for pharmaceutical companies"
echo "   - Make it Public or Private as per your preference"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2. After creating the repository, GitHub will show you a URL like:"
echo "   https://github.com/YOUR_USERNAME/dce-omniverse.git"
echo ""
echo "3. Run these commands (replace YOUR_USERNAME with your GitHub username):"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/dce-omniverse.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Alternative: If you prefer SSH (if you have SSH keys set up):"
echo "   git remote add origin git@github.com:YOUR_USERNAME/dce-omniverse.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📌 Your repository will include:"
echo "   - All 6 AI agents with Gemini 2.5 Pro integration"
echo "   - Horizontal flow visualization"
echo "   - Sequential workflow with validation"
echo "   - Responsive design"
echo "   - Interactive Q&A chat interface"
echo ""
echo "Current commit to be pushed:"
git log --oneline -1
echo ""
echo "Ready to push to GitHub! Follow the steps above."