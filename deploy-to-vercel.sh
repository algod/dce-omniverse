#!/bin/bash

echo "🚀 DCE OmniVerse - Vercel Deployment Script"
echo "==========================================="
echo ""
echo "This script will deploy your application to Vercel."
echo ""
echo "⚠️  Prerequisites:"
echo "1. You need a Vercel account (free at vercel.com)"
echo "2. You need a Google AI Studio API key for Gemini 2.5 Pro"
echo ""
echo "📝 Steps to get Gemini API Key:"
echo "1. Visit https://aistudio.google.com/"
echo "2. Sign in with Google account"
echo "3. Create new API key"
echo "4. Copy the key"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo ""
echo "🔧 Starting Vercel deployment..."
echo ""

# Deploy with Vercel CLI
vercel --yes

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📌 Next Steps:"
echo "1. Go to your Vercel dashboard: https://vercel.com/dashboard"
echo "2. Find your project 'dce-omniverse'"
echo "3. Go to Settings > Environment Variables"
echo "4. Add these variables:"
echo "   - GEMINI_API_KEY = [your Gemini API key]"
echo "   - POSTGRES_URL = [optional - for production]"
echo "   - KV_URL = [optional - for production]"
echo ""
echo "5. Redeploy after adding environment variables"
echo ""
echo "🎉 Your app will be live at the URL shown above!"