'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  DollarSign, 
  FileText, 
  Network, 
  Lightbulb, 
  HeadphonesIcon,
  ChevronRight,
  Activity,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    description: 'Prioritize high-opportunity HCPs using barrier analysis',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    stats: { active: 1000, analyzed: 450, opportunities: 89 },
    href: '/agents/customer'
  },
  {
    id: 'budget',
    name: 'Budget Planning',
    description: 'Optimize budget allocation across promotional channels',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    stats: { budget: '$5.5M', channels: 6, roi: '3.2x' },
    href: '/agents/budget'
  },
  {
    id: 'content',
    name: 'Content Review',
    description: 'Accelerate MLR approval and content management',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    stats: { assets: 120, pending: 15, approved: 95 },
    href: '/agents/content'
  },
  {
    id: 'orchestration',
    name: 'AI Orchestration',
    description: 'Generate optimal customer journeys with NBA',
    icon: Network,
    color: 'from-orange-500 to-orange-600',
    stats: { journeys: 250, nba: 1200, accuracy: '87%' },
    href: '/agents/orchestration'
  },
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    description: 'Design and monitor field suggestions for reps',
    icon: Lightbulb,
    color: 'from-pink-500 to-pink-600',
    stats: { triggers: 7, active: 140, feedback: '85%' },
    href: '/agents/suggestions'
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    description: 'AI assistant for pre-call planning and execution',
    icon: HeadphonesIcon,
    color: 'from-indigo-500 to-indigo-600',
    stats: { reps: 50, calls: 320, insights: 1500 },
    href: '/agents/copilot'
  }
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalHCPs: 0,
    activeEngagements: 0,
    avgROI: 0,
    completionRate: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setMetrics({
        totalHCPs: 1000,
        activeEngagements: 450,
        avgROI: 3.2,
        completionRate: 87
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DCE OmniVerse</h1>
                <p className="text-sm text-gray-500">Pharmaceutical Omnichannel AI Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by Gemini 2.5 Pro</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Demo Mode
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total HCPs"
              value={metrics.totalHCPs.toLocaleString()}
              icon={Users}
              trend="+12%"
              loading={isLoading}
            />
            <MetricCard
              title="Active Engagements"
              value={metrics.activeEngagements.toLocaleString()}
              icon={Activity}
              trend="+8%"
              loading={isLoading}
            />
            <MetricCard
              title="Average ROI"
              value={`${metrics.avgROI}x`}
              icon={TrendingUp}
              trend="+15%"
              loading={isLoading}
            />
            <MetricCard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              icon={BarChart3}
              trend="+5%"
              loading={isLoading}
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Agents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={agent.href}>
                  <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${agent.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${agent.color}`}>
                          <agent.icon className="h-6 w-6 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {agent.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                        {Object.entries(agent.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                            <p className="text-sm font-semibold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready for Your Presentation
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                This demonstration showcases the power of Gemini 2.5 Pro in transforming pharmaceutical 
                omnichannel planning and execution. Each agent provides real-time AI-powered insights 
                and recommendations tailored for senior commercial leaders.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Start Demo Presentation
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, loading }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-gray-400" />
        <span className="text-xs text-green-600 font-medium">{trend}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  );
}