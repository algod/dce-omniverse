'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentChat } from './AgentChat';
import Card from '@/components/design-system/Card';
import { colors } from '@/lib/design-system/colors';
import { 
  Brain, Database, Target, TrendingUp, Network, BarChart3, 
  Activity, Users, DollarSign, FileText, Lightbulb, HeadphonesIcon,
  ChevronRight, Info, Settings, Maximize2, Minimize2
} from 'lucide-react';
import Button from '@/components/design-system/Button';

interface AgentViewProps {
  agentId: string;
  agentName: string;
  agentColor: string;
  agentIcon: any;
  overview: string;
  businessInputs: {
    label: string;
    description: string;
    type: string;
  }[];
  outputs: {
    label: string;
    description: string;
    format: string;
  }[];
  analytics: {
    title: string;
    description: string;
    type: 'chart' | 'table' | 'metric' | 'heatmap';
  }[];
  downstreamUsage: {
    agent: string;
    usage: string;
  }[];
  capabilities: string[];
  parameters?: any[];
  suggestedQueries?: string[];
  visualizationComponent?: React.ReactNode;
}

export function AgentView({
  agentId,
  agentName,
  agentColor,
  agentIcon: Icon,
  overview,
  businessInputs,
  outputs,
  analytics,
  downstreamUsage,
  capabilities,
  parameters = [],
  suggestedQueries = [],
  visualizationComponent
}: AgentViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inputs' | 'outputs' | 'analytics' | 'downstream'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleSendMessage = async (message: string): Promise<string> => {
    // Simulate AI response based on message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (message.toLowerCase().includes('barrier')) {
      return `I've identified 5 primary barriers affecting HCP adoption:
1. Efficacy concerns (35% of HCPs)
2. Safety/tolerability issues (28%)
3. Insurance coverage gaps (22%)
4. Workflow integration challenges (10%)
5. Patient adherence concerns (5%)

Would you like me to dive deeper into any specific barrier?`;
    }
    
    if (message.toLowerCase().includes('prioritize') || message.toLowerCase().includes('top')) {
      return `Based on barrier analysis, here are the top 10 prioritized HCPs:
1. Dr. Smith - High potential, efficacy barrier
2. Dr. Johnson - Medium potential, coverage barrier
3. Dr. Williams - High potential, workflow barrier
...and 7 more.

Shall I generate engagement strategies for these HCPs?`;
    }
    
    return `I understand your query about "${message}". Let me analyze the data and provide insights based on the current parameters. The analysis shows opportunities for improvement in the selected segments.`;
  };

  const handleRerun = (params: any) => {
    setAnalysisResults({
      timestamp: new Date(),
      parameters: params,
      status: 'processing'
    });
    
    // Simulate analysis completion
    setTimeout(() => {
      setAnalysisResults({
        timestamp: new Date(),
        parameters: params,
        status: 'complete',
        results: 'Analysis completed with updated parameters'
      });
    }, 2000);
  };

  const TabButton = ({ id, label, isActive }: { id: string; label: string; isActive: boolean }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive 
          ? 'text-white shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      style={{
        backgroundColor: isActive ? agentColor : 'transparent'
      }}
    >
      {label}
    </button>
  );

  return (
    <div className={`flex h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Left Panel - Q&A Chat (40%) */}
      <div className="w-2/5 border-r border-gray-200">
        <AgentChat
          agentId={agentId}
          agentName={agentName}
          agentColor={agentColor}
          onSendMessage={handleSendMessage}
          onRerun={handleRerun}
          parameters={parameters}
          suggestedQueries={suggestedQueries}
        />
      </div>

      {/* Right Panel - Visualizations and Information (60%) */}
      <div className="w-3/5 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${agentColor}15` }}
              >
                <Icon size={20} style={{ color: agentColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{agentName}</h2>
                <p className="text-sm text-gray-600">Agent Intelligence & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} />
            <TabButton id="inputs" label="Business Inputs" isActive={activeTab === 'inputs'} />
            <TabButton id="outputs" label="Outputs" isActive={activeTab === 'outputs'} />
            <TabButton id="analytics" label="Analytics" isActive={activeTab === 'analytics'} />
            <TabButton id="downstream" label="Downstream" isActive={activeTab === 'downstream'} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <Brain size={24} style={{ color: agentColor }} className="mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Agent Overview</h3>
                      <p className="text-gray-600">{overview}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Capabilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {capabilities.map((capability, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5"
                          style={{ backgroundColor: agentColor }}
                        />
                        <span className="text-sm text-gray-600">{capability}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Visualization Component */}
                {visualizationComponent && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Analysis</h3>
                    {visualizationComponent}
                  </Card>
                )}
              </motion.div>
            )}

            {/* Business Inputs Tab */}
            {activeTab === 'inputs' && (
              <motion.div
                key="inputs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Database className="inline mr-2" size={20} style={{ color: agentColor }} />
                    Required Business Inputs
                  </h3>
                  <div className="space-y-4">
                    {businessInputs.map((input, index) => (
                      <div key={index} className="border-l-2 pl-4" style={{ borderColor: agentColor }}>
                        <h4 className="font-medium text-gray-900">{input.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{input.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                          {input.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Outputs Tab */}
            {activeTab === 'outputs' && (
              <motion.div
                key="outputs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Target className="inline mr-2" size={20} style={{ color: agentColor }} />
                    Agent Outputs
                  </h3>
                  <div className="grid gap-4">
                    {outputs.map((output, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{output.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{output.description}</p>
                          </div>
                          <span
                            className="px-2 py-1 text-xs font-medium text-white rounded"
                            style={{ backgroundColor: agentColor }}
                          >
                            {output.format}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <BarChart3 className="inline mr-2" size={20} style={{ color: agentColor }} />
                    Analytics & Visualizations
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {analytics.map((item, index) => {
                      const icons = {
                        chart: BarChart3,
                        table: Database,
                        metric: TrendingUp,
                        heatmap: Activity
                      };
                      const ItemIcon = icons[item.type];
                      
                      return (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <ItemIcon size={20} style={{ color: agentColor }} />
                            <div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {analysisResults && (
                  <Card>
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={20} style={{ color: agentColor }} />
                      <h4 className="font-medium text-gray-900">Latest Analysis Run</h4>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Status: {analysisResults.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {analysisResults.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {analysisResults.results && (
                        <p className="text-sm text-gray-700 mt-2">{analysisResults.results}</p>
                      )}
                    </div>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Downstream Usage Tab */}
            {activeTab === 'downstream' && (
              <motion.div
                key="downstream"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Network className="inline mr-2" size={20} style={{ color: agentColor }} />
                    Downstream Agent Usage
                  </h3>
                  <div className="space-y-4">
                    {downstreamUsage.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <ChevronRight size={20} style={{ color: agentColor }} className="mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.agent}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}