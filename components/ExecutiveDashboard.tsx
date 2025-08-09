'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, FileCheck, Users, Calendar, MessageSquare, 
  BarChart3, Activity, Target, AlertCircle, ChevronRight, 
  Sparkles, Database, Zap, Shield
} from 'lucide-react';
import { generateCompletePharmaData } from '@/lib/data/mock-pharma-data';
import { 
  BarrierAnalysisChart, 
  BudgetOptimizationChart, 
  MLRComplianceChart, 
  CustomerJourneyChart, 
  FieldSuggestionsChart, 
  TerritoryPerformanceChart 
} from '@/components/charts';

const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description: 'Barrier analysis & HCP prioritization',
    metrics: { hcps: 2847, barriers: 5, opportunities: 423 }
  },
  {
    id: 'budget',
    name: 'Budget Planning',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    description: 'ROI optimization & channel allocation',
    metrics: { budget: '$15M', roi: 3.2, channels: 6 }
  },
  {
    id: 'content',
    name: 'Content Review',
    icon: FileCheck,
    color: 'from-purple-500 to-purple-600',
    description: 'MLR compliance & gap analysis',
    metrics: { assets: 147, approval: '72%', gaps: 12 }
  },
  {
    id: 'orchestration',
    name: 'AI Orchestration',
    icon: Brain,
    color: 'from-amber-500 to-amber-600',
    description: 'BERT model & journey optimization',
    metrics: { accuracy: '89%', nbas: 850, journeys: 423 }
  },
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    icon: MessageSquare,
    color: 'from-red-500 to-red-600',
    description: '7 triggers & feedback loop',
    metrics: { active: 127, completed: 89, acceptance: '72%' }
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: Calendar,
    color: 'from-indigo-500 to-indigo-600',
    description: 'Pre-call planning & coaching',
    metrics: { territories: 20, reps: 120, calls: 3420 }
  }
];

export function ExecutiveDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Generate comprehensive mock data
    const mockData = generateCompletePharmaData();
    setData(mockData);
    setLoading(false);
  }, []);

  const renderAgentContent = () => {
    if (!data || !selectedAgent) return null;

    switch (selectedAgent) {
      case 'customer':
        return (
          <BarrierAnalysisChart 
            barriers={data.barriers.map((b: any) => ({
              barrier: b,
              prevalence: Math.random(),
              impact: Math.random(),
              addressability: Math.random()
            }))}
            opportunities={data.hcpOpportunities}
          />
        );
      case 'budget':
        return (
          <BudgetOptimizationChart 
            channels={data.channels}
            scenarios={[
              { name: 'Conservative', totalBudget: 12000000, totalROI: 2.8, allocation: {} },
              { name: 'Balanced', totalBudget: 15000000, totalROI: 3.2, allocation: {} },
              { name: 'Aggressive', totalBudget: 18000000, totalROI: 3.5, allocation: {} }
            ]}
          />
        );
      case 'content':
        const mlrReviews = data.contentAssets.map((asset: any) => ({
          assetId: asset.id,
          recommendation: asset.mlrScore > 80 ? 'approve' : asset.mlrScore > 60 ? 'revise' : 'reject',
          score: asset.mlrScore,
          issues: asset.complianceIssues.map((issue: string) => ({
            category: 'Medical',
            severity: 'Minor',
            description: issue
          })),
          suggestions: [],
          reasoning: 'Automated MLR review',
          reviewDate: new Date(),
          estimatedApprovalTime: '24 hours'
        }));
        
        return (
          <MLRComplianceChart 
            mlrReviews={mlrReviews}
            contentGaps={[]}
            channelCoverage={[]}
          />
        );
      case 'orchestration':
        return (
          <CustomerJourneyChart 
            journeys={data.customerJourneys}
            nextBestActions={data.nextBestActions}
            modelPerformance={{
              accuracy: 0.89,
              precision: 0.87,
              recall: 0.91,
              f1Score: 0.89,
              auc: 0.93
            }}
          />
        );
      case 'suggestions':
        return (
          <FieldSuggestionsChart 
            suggestions={data.fieldSuggestions}
            triggers={[
              { 
                id: 'TR-01', 
                name: 'Speaker Program Follow-up', 
                description: 'HCP attended without follow-up',
                criteria: [],
                priority: 1,
                isActive: true,
                maxWeeklyVolume: 5,
                suppressionRules: [],
                sensitivity: { threshold: 0.9, adjustment: 0.1 }
              },
              { 
                id: 'TR-02', 
                name: 'Low Fulfillment Rate', 
                description: 'Prescription fulfillment below threshold',
                criteria: [],
                priority: 2,
                isActive: true,
                maxWeeklyVolume: 8,
                suppressionRules: [],
                sensitivity: { threshold: 0.8, adjustment: 0.1 }
              },
              { 
                id: 'TR-03', 
                name: 'Payer Coverage Change', 
                description: 'Positive coverage update',
                criteria: [],
                priority: 3,
                isActive: true,
                maxWeeklyVolume: 10,
                suppressionRules: [],
                sensitivity: { threshold: 0.85, adjustment: 0.1 }
              },
              { 
                id: 'TR-04', 
                name: 'Slowed Prescribing', 
                description: 'Declining prescription trend',
                criteria: [],
                priority: 4,
                isActive: true,
                maxWeeklyVolume: 7,
                suppressionRules: [],
                sensitivity: { threshold: 0.75, adjustment: 0.1 }
              },
              { 
                id: 'TR-05', 
                name: 'Email Engagement', 
                description: 'High email engagement signals',
                criteria: [],
                priority: 5,
                isActive: true,
                maxWeeklyVolume: 12,
                suppressionRules: [],
                sensitivity: { threshold: 0.7, adjustment: 0.1 }
              }
            ]}
            performanceMetrics={{
              acceptanceRate: 72.5,
              completionRate: 68.3,
              avgTimeToAction: 3.2,
              impactScore: 85.7
            }}
          />
        );
      case 'copilot':
        return (
          <TerritoryPerformanceChart 
            territories={data.territories}
            hcps={data.hcps}
            prescribingData={data.prescribingData}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DCE OmniVerse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">DCE OmniVerse</h1>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Powered by Advanced AI Engine
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Zap size={16} />
                <span>Run Demo</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Shield size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAgent(agent.id)}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all ${
                  selectedAgent === agent.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${agent.color} rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <ChevronRight className={`text-gray-400 transition-transform ${
                    selectedAgent === agent.id ? 'rotate-90' : ''
                  }`} size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {Object.entries(agent.metrics).map(([key, value], index) => (
                    <div key={key}>
                      <span className="font-medium text-gray-700">{value}</span>
                      <span className="ml-1">{key}</span>
                    </div>
                  )).slice(0, 2)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Agent Details */}
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {agents.find(a => a.id === selectedAgent)?.name} Agent
                </h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 border-b border-gray-200">
                {['overview', 'analytics', 'insights'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Agent Capabilities</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <Target className="text-blue-500 mr-2 mt-0.5" size={16} />
                          <span>Advanced AI reasoning with Gemini 2.5 Pro</span>
                        </li>
                        <li className="flex items-start">
                          <Activity className="text-green-500 mr-2 mt-0.5" size={16} />
                          <span>Real-time data processing and insights</span>
                        </li>
                        <li className="flex items-start">
                          <Database className="text-purple-500 mr-2 mt-0.5" size={16} />
                          <span>Integration with pharmaceutical data sources</span>
                        </li>
                      </ul>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p>
                        This agent leverages advanced AI capabilities to deliver pharmaceutical-specific insights
                        and recommendations. It processes complex healthcare data to identify opportunities,
                        optimize strategies, and improve commercial outcomes.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {renderAgentContent()}
                  </div>
                )}
                
                {activeTab === 'insights' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="text-amber-600 mr-3 mt-0.5" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Key Insights</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Opportunity for 23% improvement in HCP engagement</li>
                            <li>• Budget reallocation could increase ROI by 0.4 points</li>
                            <li>• 12 content gaps identified in critical barrier areas</li>
                            <li>• Field suggestions showing 72% acceptance rate</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Predicted Impact</div>
                        <div className="text-2xl font-bold text-green-600">+18.5%</div>
                        <div className="text-xs text-gray-500">Market share growth</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Time to Value</div>
                        <div className="text-2xl font-bold text-blue-600">3-6 mo</div>
                        <div className="text-xs text-gray-500">Implementation timeline</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}