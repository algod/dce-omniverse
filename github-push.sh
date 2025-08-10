#!/bin/bash

# GitHub Push Script for DCE OmniVerse
set -e

echo "🚀 DCE OmniVerse - GitHub Push Script"
echo "======================================"
echo ""

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo "⚠️  GitHub CLI is not authenticated. Let's set it up!"
    echo ""
    echo "Running: gh auth login"
    echo "Please follow the prompts to authenticate..."
    gh auth login
fi

echo "✅ GitHub authentication confirmed!"
echo ""

# Get GitHub username
GITHUB_USER=$(gh api user --jq .login)
echo "👤 GitHub User: $GITHUB_USER"
echo ""

# Check if repo already exists
REPO_NAME="dce-omniverse"
if gh repo view "$GITHUB_USER/$REPO_NAME" &>/dev/null; then
    echo "⚠️  Repository $REPO_NAME already exists!"
    echo "Do you want to push to the existing repository? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Exiting..."
        exit 0
    fi
    
    # Add remote if not exists
    if ! git remote get-url origin &>/dev/null; then
        git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    fi
else
    echo "📦 Creating new repository: $REPO_NAME"
    gh repo create "$REPO_NAME" \
        --public \
        --description "DCE OmniVerse - Next-generation omnichannel agentic AI solution for pharmaceutical companies" \
        --source=. \
        --remote=origin
fi

echo ""
echo "📤 Pushing code to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✨ Success! Your code has been pushed to GitHub!"
echo ""
echo "🔗 Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "📊 View on GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "📋 Repository includes:"
echo "  ✅ 6 AI Agents powered by Gemini 2.5 Pro"
echo "  ✅ Horizontal flow visualization"
echo "  ✅ Sequential workflow with validation"
echo "  ✅ Responsive design"
echo "  ✅ Interactive Q&A interface"
echo "  ✅ Comprehensive documentation"
echo ""
echo "🎉 Done! Your DCE OmniVerse is now on GitHub!"