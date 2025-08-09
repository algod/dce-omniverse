'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Database, Brain, ArrowRight, ChevronLeft,
  MessageSquare, Settings, Activity, Zap, Info
} from 'lucide-react';
import Link from 'next/link';
import { AgentChat } from './AgentChat';

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

export function StandardAgentView(props: AgentViewProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inputs' | 'analytics' | 'outputs'>('overview');
  const [parameters, setParameters] = useState(props.businessInputs.parameters);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/5 bg-grid" />
      
      {/* Header */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
                <span className="text-sm">Back to Flow</span>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${props.agentColor} p-2`}>
                  <props.agentIcon className="w-full h-full text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">{props.agentName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">Agent Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Q&A Chat (40%) */}
          <div className="w-2/5 bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Interactive Q&A</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">Ask questions and adjust parameters</p>
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
          <div className="flex-1 bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all ${
                    selectedTab === tab.id
                      ? 'bg-gray-800 text-white border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
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
                      <h3 className="text-lg font-semibold text-white mb-3">Position in Flow</h3>
                      <p className="text-gray-300">{props.overview.position}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Purpose</h3>
                      <p className="text-gray-300">{props.overview.purpose}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Agent Reasoning</h3>
                      <ul className="space-y-2">
                        {props.overview.reasoning.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Brain size={16} className="text-blue-400 mt-1" />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Tools & Systems</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {props.overview.tools.map((tool, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-2">
                            <Database size={16} className="text-green-400" />
                            <span className="text-gray-300 text-sm">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Current Actions</h3>
                      <div className="space-y-2">
                        {props.overview.actions.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Activity size={16} className="text-purple-400" />
                            <span className="text-gray-300 text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {props.overview.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                            <p className="text-xl font-bold text-white">{metric.value}</p>
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
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Data from {props.businessInputs.upstream.source}
                        </h3>
                        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                          {props.businessInputs.upstream.data.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-400 text-sm">{item.label}:</span>
                              <span className="text-white text-sm font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Adjustable Parameters</h3>
                      <div className="space-y-4">
                        {parameters.map((param, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                            <label className="text-sm text-gray-300 mb-2 block">{param.name}</label>
                            {param.type === 'slider' && (
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={param.min}
                                  max={param.max}
                                  value={param.value}
                                  onChange={(e) => handleParameterChange(idx, parseInt(e.target.value))}
                                  className="flex-1"
                                />
                                <span className="text-white font-medium w-12 text-right">{param.value}</span>
                              </div>
                            )}
                            {param.type === 'select' && (
                              <select
                                value={param.value}
                                onChange={(e) => handleParameterChange(idx, e.target.value)}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                              >
                                {param.options?.map((opt, i) => (
                                  <option key={i} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}
                            {param.type === 'toggle' && (
                              <button
                                onClick={() => handleParameterChange(idx, !param.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  param.value 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-400'
                                }`}
                              >
                                {param.value ? 'Enabled' : 'Disabled'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Business Constraints</h3>
                      <ul className="space-y-2">
                        {props.businessInputs.constraints.map((constraint, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Zap size={16} className="text-yellow-400 mt-1" />
                            <span className="text-gray-300 text-sm">{constraint}</span>
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
                      <h3 className="text-lg font-semibold text-white mb-3">AI Models</h3>
                      <div className="space-y-3">
                        {props.analytics.models.map((model, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{model.name}</h4>
                              {model.accuracy && (
                                <span className="text-green-400 text-sm">{model.accuracy}% Accuracy</span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{model.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Algorithms</h3>
                      <div className="flex flex-wrap gap-2">
                        {props.analytics.algorithms.map((algo, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                            {algo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Reasoning Process</h3>
                      <div className="space-y-3">
                        {props.analytics.reasoning.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{step.step}</h4>
                              <p className="text-gray-400 text-sm">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Visualizations</h3>
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
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Data Package to {props.outputs.downstream.destination}
                      </h3>
                      <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                        {props.outputs.downstream.data.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-400 text-sm">{item.label}:</span>
                            <span className="text-white text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {props.outputs.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ArrowRight size={16} className="text-green-400 mt-1" />
                            <span className="text-gray-300 text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Expected Impact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {props.outputs.impact.map((impact, idx) => (
                          <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">{impact.metric}</p>
                            <p className="text-lg font-semibold text-green-400">{impact.change}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={20} className="text-blue-400" />
                        <h4 className="text-white font-semibold">Preview Downstream Impact</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        These outputs will be sent to the next agent in the flow for processing.
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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