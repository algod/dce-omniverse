'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Database, Brain, ArrowRight, ChevronLeft,
  MessageSquare, Settings, Activity, Zap, Info, Home
} from 'lucide-react';
import { AgentChat } from './AgentChat';
import { zsColors } from '@/lib/design-system/zs-colors';

interface AgentViewProps {
  agentId: string;
  agentName: string;
  agentIcon: React.ElementType;
  agentColor: string;
  overview: {
    position: string;
    purpose: string;
    reasoning: string[];
    tools: string[];
    actions: string[];
    keyMetrics: Array<{ label: string; value: string | number }>;
  };
  businessInputs: {
    upstream?: {
      source: string;
      data: Array<{ label: string; value: string }>;
    };
    parameters: Array<{
      name: string;
      type: 'slider' | 'select' | 'toggle' | 'number';
      value: any;
      options?: any[];
      min?: number;
      max?: number;
    }>;
    constraints: string[];
  };
  analytics: {
    models: Array<{ name: string; description: string; accuracy?: number }>;
    algorithms: string[];
    reasoning: {
      steps: Array<{ step: string; description: string }>;
    };
    visualizations: React.ReactNode;
  };
  outputs: {
    downstream: {
      destination: string;
      data: Array<{ label: string; value: string }>;
    };
    recommendations: string[];
    impact: Array<{ metric: string; change: string }>;
  };
}

export function StandardAgentViewLight(props: AgentViewProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inputs' | 'analytics' | 'outputs'>('overview');
  const [parameters, setParameters] = useState(props.businessInputs.parameters);
  const [isNavigating, setIsNavigating] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'inputs', label: 'Business Inputs', icon: Settings },
    { id: 'analytics', label: 'Analytics & AI', icon: Brain },
    { id: 'outputs', label: 'Outputs & Next Steps', icon: ArrowRight }
  ];

  const handleParameterChange = (index: number, value: any) => {
    const newParams = [...parameters];
    newParams[index].value = value;
    setParameters(newParams);
  };

  // Get agent color from zsColors
  const agentColorMap: Record<string, any> = {
    customer: zsColors.agents.customer,
    budget: zsColors.agents.budget,
    content: zsColors.agents.content,
    orchestration: zsColors.agents.orchestration,
    suggestions: zsColors.agents.suggestions,
    copilot: zsColors.agents.copilot
  };
  const agentTheme = agentColorMap[props.agentId] || zsColors.agents.customer;

  return (
    <div className="min-h-screen" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Header */}
      <div className="relative z-10" style={{ 
        backgroundColor: zsColors.neutral.white,
        borderBottom: `1px solid ${zsColors.neutral.lightGray}`,
        boxShadow: zsColors.shadows.sm
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Navigation clicked - attempting to navigate to home');
                  setIsNavigating(true);
                  
                  // Try multiple navigation methods
                  try {
                    // Method 1: Use router.push
                    router.push('/');
                    console.log('Router.push executed');
                    
                    // Method 2: Fallback to window.location after a short delay
                    setTimeout(() => {
                      if (window.location.pathname !== '/') {
                        console.log('Router.push may have failed, using window.location');
                        window.location.href = '/';
                      }
                    }, 500);
                  } catch (error) {
                    console.error('Navigation error:', error);
                    // Method 3: Direct fallback
                    window.location.href = '/';
                  }
                }}
                disabled={isNavigating}
                className="flex items-center gap-2 transition-colors cursor-pointer group hover:text-blue-600 disabled:opacity-50"
                style={{ color: isNavigating ? zsColors.neutral.lightGray : zsColors.neutral.gray }}
              >
                <ChevronLeft size={20} className="transition-colors" />
                <span className="text-sm font-medium">
                  {isNavigating ? 'Navigating...' : 'Back to Flow'}
                </span>
              </button>
              <div className="h-6 w-px" style={{ backgroundColor: zsColors.neutral.lightGray }} />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg p-2" style={{
                  background: `linear-gradient(135deg, ${agentTheme.primary}, ${agentTheme.light})`
                }}>
                  <props.agentIcon className="w-full h-full text-white" />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>{props.agentName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: zsColors.semantic.success }} />
              <span className="text-sm" style={{ color: zsColors.neutral.gray }}>Agent Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Q&A Chat (40%) */}
          <div className="w-2/5 rounded-xl overflow-hidden" 
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              boxShadow: zsColors.shadows.md
            }}>
            <div className="p-4" style={{ 
              borderBottom: `1px solid ${zsColors.neutral.lightGray}`,
              backgroundColor: zsColors.neutral.white
            }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} style={{ color: agentTheme.primary }} />
                <h2 className="text-lg font-semibold" style={{ color: zsColors.neutral.charcoal }}>Interactive Q&A</h2>
              </div>
              <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>Ask questions and adjust parameters</p>
            </div>
            <AgentChat 
              agentId={props.agentId} 
              agentName={props.agentName}
              agentColor={props.agentColor}
              onSendMessage={async (message) => {
                console.log('Message sent:', message);
                return `Processing: ${message}`;
              }}
            />
          </div>

          {/* Right Panel - Visualizations (60%) */}
          <div className="flex-1 rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              boxShadow: zsColors.shadows.md
            }}>
            {/* Tab Navigation */}
            <div className="flex" style={{ borderBottom: `1px solid ${zsColors.neutral.lightGray}` }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className="flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-opacity-10"
                  style={{
                    backgroundColor: selectedTab === tab.id ? zsColors.neutral.white : 'transparent',
                    color: selectedTab === tab.id ? zsColors.neutral.charcoal : zsColors.neutral.gray,
                    borderBottom: selectedTab === tab.id ? `2px solid ${agentTheme.primary}` : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = `${agentTheme.primary}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <tab.icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-48px)]">
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {selectedTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Position in Flow</h3>
                      <p style={{ color: zsColors.neutral.darkGray }}>{props.overview.position}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Purpose</h3>
                      <p style={{ color: zsColors.neutral.darkGray }}>{props.overview.purpose}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Agent Reasoning</h3>
                      <ul className="space-y-2">
                        {props.overview.reasoning.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Brain size={16} style={{ color: agentTheme.primary }} className="mt-1" />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Tools & Systems</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {props.overview.tools.map((tool, idx) => (
                          <div key={idx} className="rounded-lg p-3 flex items-center gap-2"
                            style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <Database size={16} style={{ color: zsColors.secondary.teal }} />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Current Actions</h3>
                      <div className="space-y-2">
                        {props.overview.actions.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Activity size={16} style={{ color: zsColors.secondary.orange }} />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Key Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {props.overview.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="rounded-lg p-4"
                            style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>{metric.label}</p>
                            <p className="text-xl font-bold" style={{ color: agentTheme.primary }}>{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Business Inputs Tab */}
                {selectedTab === 'inputs' && (
                  <motion.div
                    key="inputs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {props.businessInputs.upstream && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                          Data from {props.businessInputs.upstream.source}
                        </h3>
                        <div className="rounded-lg p-4 space-y-2"
                          style={{ 
                            backgroundColor: zsColors.neutral.offWhite,
                            border: `1px solid ${zsColors.neutral.lightGray}`
                          }}>
                          {props.businessInputs.upstream.data.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-sm" style={{ color: zsColors.neutral.gray }}>{item.label}:</span>
                              <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Adjustable Parameters</h3>
                      <div className="space-y-4">
                        {parameters.map((param, idx) => (
                          <div key={idx} className="rounded-lg p-4"
                            style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <label className="text-sm mb-2 block font-medium" style={{ color: zsColors.neutral.darkGray }}>{param.name}</label>
                            {param.type === 'slider' && (
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={param.min}
                                  max={param.max}
                                  value={param.value}
                                  onChange={(e) => handleParameterChange(idx, parseInt(e.target.value))}
                                  className="flex-1"
                                  style={{
                                    accentColor: agentTheme.primary
                                  }}
                                />
                                <span className="font-medium w-12 text-right" style={{ color: agentTheme.primary }}>{param.value}</span>
                              </div>
                            )}
                            {param.type === 'select' && (
                              <select
                                value={param.value}
                                onChange={(e) => handleParameterChange(idx, e.target.value)}
                                className="w-full rounded-lg px-3 py-2"
                                style={{ 
                                  backgroundColor: zsColors.neutral.white,
                                  color: zsColors.neutral.charcoal,
                                  border: `1px solid ${zsColors.neutral.lightGray}`
                                }}
                              >
                                {param.options?.map((opt, i) => (
                                  <option key={i} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}
                            {param.type === 'toggle' && (
                              <button
                                onClick={() => handleParameterChange(idx, !param.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md`}
                                style={{
                                  backgroundColor: param.value ? agentTheme.primary : zsColors.neutral.gray,
                                  color: zsColors.neutral.white,
                                  boxShadow: zsColors.shadows.sm
                                }}
                              >
                                {param.value ? 'Enabled' : 'Disabled'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Business Constraints</h3>
                      <ul className="space-y-2">
                        {props.businessInputs.constraints.map((constraint, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Zap size={16} style={{ color: zsColors.semantic.warning }} className="mt-1" />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Analytics & AI Tab */}
                {selectedTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>AI Models</h3>
                      <div className="space-y-3">
                        {props.analytics.models.map((model, idx) => (
                          <div key={idx} className="rounded-lg p-4"
                            style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>{model.name}</h4>
                              {model.accuracy && (
                                <span className="text-sm font-semibold" style={{ color: zsColors.semantic.success }}>{model.accuracy}% Accuracy</span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: zsColors.neutral.gray }}>{model.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Algorithms</h3>
                      <div className="flex flex-wrap gap-2">
                        {props.analytics.algorithms.map((algo, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full text-sm text-white"
                            style={{ backgroundColor: agentTheme.primary }}>
                            {algo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Reasoning Process</h3>
                      <div className="space-y-3">
                        {props.analytics.reasoning.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ 
                                background: `linear-gradient(135deg, ${agentTheme.primary}, ${agentTheme.light})`
                              }}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={{ color: zsColors.neutral.charcoal }}>{step.step}</h4>
                              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Visualizations</h3>
                      {props.analytics.visualizations}
                    </div>
                  </motion.div>
                )}

                {/* Outputs Tab */}
                {selectedTab === 'outputs' && (
                  <motion.div
                    key="outputs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                        Data Package to {props.outputs.downstream.destination}
                      </h3>
                      <div className="rounded-lg p-4 space-y-2"
                        style={{ 
                          backgroundColor: zsColors.neutral.offWhite,
                          border: `1px solid ${zsColors.neutral.lightGray}`
                        }}>
                        {props.outputs.downstream.data.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-sm" style={{ color: zsColors.neutral.gray }}>{item.label}:</span>
                            <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Recommendations</h3>
                      <ul className="space-y-2">
                        {props.outputs.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ArrowRight size={16} style={{ color: zsColors.semantic.success }} className="mt-1" />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Expected Impact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {props.outputs.impact.map((impact, idx) => (
                          <div key={idx} className="rounded-lg p-3"
                            style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>{impact.metric}</p>
                            <p className="text-lg font-semibold" style={{ color: zsColors.semantic.success }}>{impact.change}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg"
                      style={{ 
                        backgroundColor: zsColors.neutral.white,
                        border: `2px solid ${agentTheme.primary}`
                      }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={20} style={{ color: agentTheme.primary }} />
                        <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>Preview Downstream Impact</h4>
                      </div>
                      <p className="text-sm mb-3" style={{ color: zsColors.neutral.darkGray }}>
                        These outputs will be sent to the next agent in the flow for processing.
                      </p>
                      <button className="px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-medium hover:shadow-md"
                        style={{ 
                          backgroundColor: agentTheme.primary,
                          color: zsColors.neutral.white,
                          boxShadow: zsColors.shadows.sm
                        }}>
                        Confirm & Send to Next Agent
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}