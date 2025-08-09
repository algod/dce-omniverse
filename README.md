# DCE OmniVerse - Pharmaceutical Omnichannel AI Platform

## Overview

DCE OmniVerse is a next-generation omnichannel agentic AI solution for pharmaceutical companies, featuring 6 intelligent AI agents powered by Advanced AI Engine. This demonstration application showcases advanced AI capabilities for omnichannel planning and execution.

## 🚀 Features

### 6 Agentic AI Modules

1. **Customer Planning Agent** - Prioritizes high-opportunity HCPs using barrier analysis
2. **Budget Planning Agent** - Optimizes budget allocation across promotional channels
3. **Content Review Agent** - Accelerates MLR approval and content management
4. **AI Orchestration Agent** - Generates optimal customer journeys with NBA
5. **Field Suggestions Agent** - Designs and monitors field suggestions for reps
6. **Field Copilot Agent** - AI assistant for pre-call planning and execution

## 🛠️ Tech Stack

- **AI Model**: Advanced AI Engine (extended context window)
- **Framework**: Next.js 14 with TypeScript
- **Deployment**: Vercel
- **Database**: Vercel Postgres + Vercel KV
- **UI**: React, Tailwind CSS, Framer Motion

## 📦 Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd dce-omniverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
POSTGRES_URL=your_postgres_url_here
KV_URL=your_redis_kv_url_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

### Manual Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy to Vercel**:
```bash
vercel
```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add the following:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `POSTGRES_URL`: Your Vercel Postgres URL
     - `KV_URL`: Your Vercel KV URL

4. **Configure Vercel Postgres & KV**:
   - In Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Create a new KV store
   - Connect them to your project

## 🔑 Getting API Keys

### AI Engine API Key
1. Contact your system administrator
2. Request API access credentials
3. Create a new API key
4. Copy and add to your environment variables

### Vercel Storage
1. Sign up for [Vercel](https://vercel.com)
2. Create a new project
3. Navigate to Storage tab
4. Create Postgres and KV databases
5. Copy connection strings to environment variables

## 📱 Demo Scenarios

The application includes pre-configured demo scenarios for each agent:

- **Customer Planning**: Analyze 1000 HCPs with barrier analysis
- **Budget Planning**: Optimize $5.5M across 6 channels
- **Content Review**: Review 120 content assets with MLR simulation
- **AI Orchestration**: Generate 250 customer journeys
- **Field Suggestions**: Monitor 7 active triggers
- **Field Copilot**: Support 50 field reps

## 🎯 Key Features for Presentation

- **< 2 second load times** - Optimized for executive demonstrations
- **Live AI reasoning** - Real-time AI Engine explanations
- **Interactive visualizations** - Drag-and-drop budget allocation
- **Mobile responsive** - Works on all devices
- **Demo mode** - Pre-loaded with realistic pharma data

## 📊 Performance Metrics

- Page load: < 2 seconds
- API response: < 3 seconds
- 60fps animations
- 100% feature coverage
- Zero-error demonstrations

## 🔒 Security & Compliance

- All demo data is synthetic
- HIPAA-compliant architecture ready
- No real patient/HCP information
- Audit trail for all AI recommendations

## 📝 Documentation

For detailed documentation about each agent and their capabilities, see [CLAUDE.md](../CLAUDE.md)

## 🤝 Support

For questions or support, please contact your implementation team.

## 📄 License

Proprietary - DCE OmniVerse 2025

---

**Built for pharmaceutical senior commercial leaders** | **Powered by Advanced AI Engine**