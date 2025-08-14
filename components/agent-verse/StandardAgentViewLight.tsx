'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Database, Brain, ArrowRight, ChevronLeft,
  MessageSquare, Settings, Activity, Zap, Info, Home, Target, ChevronRight,
  ChevronDown, Heart, Layers, Users, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { AgentChat } from './AgentChat';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AGENT_CONTEXTS } from '@/lib/ai/system-prompts';
import { getNextLogicalAgents, getFlowNavigationMessage } from '@/lib/utils/agent-flow';

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
    actions?: string[];
    keyMetrics?: Array<{ label: string; value: string | number }>;
  };
  businessInputs?: {
    upstream?: {
      source: string;
      data: Array<{ label: string; value: string }>;
    };
    fromUpstream?: string[];
    userInputs?: string[];
    businessRules?: string[];
    parameters?: Array<{
      name: string;
      type: 'slider' | 'select' | 'toggle' | 'number';
      value: any;
      options?: any[];
      min?: number;
      max?: number;
    }>;
    constraints?: string[];
  };
  analytics?: {
    models?: Array<{ name: string; description: string; accuracy?: number }>;
    algorithms?: string[];
    reasoning?: {
      steps: Array<{ step: string; description: string }>;
    };
    visualizations?: React.ReactNode;
  };
  outputs?: {
    downstream?: {
      destination: string;
      data: Array<{ label: string; value: string }>;
    };
    toDownstream?: string[];
    metrics?: string[];
    actions?: string[];
    recommendations?: string[];
    impact?: Array<{ metric: string; change: string }>;
  };
  visualizationComponent?: React.ComponentType;
}

export function StandardAgentViewLight(props: AgentViewProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inputs' | 'analytics' | 'outputs'>('overview');
  const [parameters, setParameters] = useState(props.businessInputs?.parameters || []);
  const [isNavigating, setIsNavigating] = useState(false);
  const [workflowState, setWorkflowState] = useState({
    overviewCompleted: false,
    inputsCompleted: true, // Allow proceeding with default inputs
    analyticsCompleted: false,
    outputsApproved: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const tabs = [
    { 
      id: 'overview', 
      label: '1. Overview', 
      icon: Info, 
      step: 1, 
      description: 'Agent purpose & position in flow',
      enabled: true,
      completed: workflowState.overviewCompleted
    },
    { 
      id: 'inputs', 
      label: '2. Business Inputs', 
      icon: Settings, 
      step: 2, 
      description: 'User parameters & constraints',
      enabled: workflowState.overviewCompleted,
      completed: workflowState.inputsCompleted
    },
    { 
      id: 'analytics', 
      label: '3. Analytics & AI', 
      icon: Brain, 
      step: 3, 
      description: 'ML models & reasoning steps',
      enabled: workflowState.inputsCompleted,
      completed: workflowState.analyticsCompleted
    },
    { 
      id: 'outputs', 
      label: '4. Outputs & Flow', 
      icon: ArrowRight, 
      step: 4, 
      description: 'Results & downstream connections',
      enabled: workflowState.analyticsCompleted,
      completed: workflowState.outputsApproved
    }
  ];

  const handleParameterChange = (index: number, value: any) => {
    const newParams = [...parameters];
    newParams[index].value = value;
    setParameters(newParams);
    validateInputs(newParams);
  };

  const validateInputs = (params: typeof parameters) => {
    const errors: string[] = [];
    
    // Check if all required parameters are filled
    params.forEach((param) => {
      if (param.type === 'slider' && (param.value < param.min! || param.value > param.max!)) {
        errors.push(`${param.name} must be between ${param.min} and ${param.max}`);
      }
    });
    
    // Check if barrier weights sum to 100% (for customer planning)
    if (props.agentId === 'customer') {
      const barrierWeights = params.filter(p => p.name.includes('Barrier Weight')).reduce((sum, p) => sum + p.value, 0);
      if (Math.abs(barrierWeights - 100) > 1) {
        errors.push('Barrier weights must sum to 100%');
      }
    }
    
    setValidationErrors(errors);
    
    // Update workflow state
    if (errors.length === 0 && selectedTab === 'inputs') {
      setWorkflowState(prev => ({ ...prev, inputsCompleted: true }));
    }
  };

  const handleTabChange = (tabId: 'overview' | 'inputs' | 'analytics' | 'outputs') => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && tab.enabled) {
      setSelectedTab(tabId);
      
      // Mark current tab as completed when moving away
      if (selectedTab === 'overview') {
        setWorkflowState(prev => ({ ...prev, overviewCompleted: true }));
      }
    }
  };

  const runAnalytics = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setWorkflowState(prev => ({ ...prev, analyticsCompleted: true }));
    }, 3000);
  };

  const approveOutputs = () => {
    setWorkflowState(prev => ({ ...prev, outputsApproved: true }));
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

  // Initialize validation on component mount
  useEffect(() => {
    validateInputs(parameters);
  }, []);

  const getAgentSuggestedQueries = (agentId: string): string[] => {
    const questions = AGENT_CONTEXTS[agentId as keyof typeof AGENT_CONTEXTS]?.sampleQuestions;
    return questions ? [...questions] : [];
  };

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
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
          {/* Left Panel - Sequential Workflow (55% desktop, full width mobile) */}
          <div className="w-full lg:w-[55%] rounded-xl overflow-hidden flex flex-col" 
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              boxShadow: zsColors.shadows.md,
              minHeight: '500px',
              maxHeight: '700px'
            }}>
            {/* Enhanced Tab Navigation with Workflow Progress */}
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${zsColors.neutral.lightGray}` }}>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Sequential Workflow
                </h2>
                <div className="flex items-center gap-2">
                  {tabs.map((tab, index) => (
                    <div key={tab.id} className="flex items-center">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          selectedTab === tab.id ? 'scale-110' : 'scale-100'
                        }`}
                        style={{
                          backgroundColor: selectedTab === tab.id 
                            ? agentTheme.primary 
                            : tab.completed 
                              ? zsColors.semantic.success 
                              : tab.enabled 
                                ? zsColors.neutral.lightGray 
                                : zsColors.neutral.lightGray + '60',
                          color: selectedTab === tab.id || tab.completed
                            ? zsColors.neutral.white 
                            : tab.enabled 
                              ? zsColors.neutral.gray 
                              : zsColors.neutral.gray + '80',
                          cursor: tab.enabled ? 'pointer' : 'not-allowed',
                          opacity: tab.enabled ? 1 : 0.6,
                          pointerEvents: tab.enabled ? 'auto' : 'none'
                        }}
                        onClick={() => tab.enabled && handleTabChange(tab.id as any)}
                        whileHover={tab.enabled ? { scale: 1.1 } : {}}
                        whileTap={tab.enabled ? { scale: 0.95 } : {}}
                      >
                        {tab.step}
                      </motion.div>
                      {index < tabs.length - 1 && (
                        <div 
                          className="w-8 h-0.5 mx-2"
                          style={{ 
                            backgroundColor: tabs.findIndex(t => t.id === selectedTab) > index 
                              ? agentTheme.primary + '60' 
                              : zsColors.neutral.lightGray
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Current Step Description */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1" style={{ color: agentTheme.primary }}>
                  {tabs.find(t => t.id === selectedTab)?.label}
                </h3>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  {tabs.find(t => t.id === selectedTab)?.description}
                </p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto flex-1" style={{ minHeight: '400px' }}>
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
                    {/* For Customer Planning Agent - Show 5 Module Workflow */}
                    {props.agentId === 'customer' ? (
                      <>
                        <div className="rounded-lg p-5" style={{ 
                          backgroundColor: zsColors.neutral.white,
                          border: `1px solid ${zsColors.neutral.lightGray}`
                        }}>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: zsColors.neutral.charcoal }}>
                            <Brain size={20} />
                            Customer Planning 5-Module Workflow
                          </h3>
                          <p className="mb-5 leading-relaxed" style={{ color: zsColors.neutral.darkGray }}>
                            Classifies and prioritizes high-opportunity customers based on microsegments through a comprehensive 5-module analysis process.
                          </p>
                          
                          {/* 5 Modules */}
                          <div className="space-y-4">
                            {/* Module 1: Persona Analysis */}
                            <div className="rounded-lg p-4" style={{ 
                              backgroundColor: agentTheme.primary + '10',
                              border: `1px solid ${agentTheme.primary}30`
                            }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: agentTheme.primary }}>
                                  1
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2" style={{ color: agentTheme.primary }}>Persona Analysis</h4>
                                  <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                    Barrier inferencing and HCP classification
                                  </p>
                                  <ul className="text-xs space-y-1" style={{ color: zsColors.neutral.gray }}>
                                    <li>• Analyzes 2,847 HCPs for barrier patterns</li>
                                    <li>• Runs probabilistic barrier detection</li>
                                    <li>• Maps HCPs to 5 primary barriers</li>
                                    <li>• Calculates barrier prevalence and severity</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Module 2: Performance Metrics */}
                            <div className="rounded-lg p-4" style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: agentTheme.primary }}>
                                  2
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>Performance Metrics</h4>
                                  <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                    KPI selection and historical analysis
                                  </p>
                                  <ul className="text-xs space-y-1" style={{ color: zsColors.neutral.gray }}>
                                    <li>• Selects KPIs based on brand objectives</li>
                                    <li>• Processes 24 months of historical data</li>
                                    <li>• Segments HCPs into performance quintiles</li>
                                    <li>• Identifies trends and patterns</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Module 3: Potential Prediction */}
                            <div className="rounded-lg p-4" style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: agentTheme.primary }}>
                                  3
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>Potential Prediction</h4>
                                  <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                    ML-based opportunity forecasting
                                  </p>
                                  <ul className="text-xs space-y-1" style={{ color: zsColors.neutral.gray }}>
                                    <li>• Configures breadth and depth prediction models</li>
                                    <li>• Trains ensemble models (Random Forest + XGBoost)</li>
                                    <li>• Generates opportunity predictions per HCP</li>
                                    <li>• Validates against holdout dataset</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Module 4: Preference Mapping */}
                            <div className="rounded-lg p-4" style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: agentTheme.primary }}>
                                  4
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>Preference Mapping</h4>
                                  <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                    Channel and content affinity analysis
                                  </p>
                                  <ul className="text-xs space-y-1" style={{ color: zsColors.neutral.gray }}>
                                    <li>• Analyzes historical engagement data</li>
                                    <li>• Runs collaborative filtering algorithms</li>
                                    <li>• Scores channel preferences (Field, Email, Virtual, Web)</li>
                                    <li>• Maps content type affinity</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Module 5: Microsegmentation */}
                            <div className="rounded-lg p-4" style={{ 
                              backgroundColor: agentTheme.primary + '10',
                              border: `1px solid ${agentTheme.primary}30`
                            }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: agentTheme.primary }}>
                                  5
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2" style={{ color: agentTheme.primary }}>Microsegmentation</h4>
                                  <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                    Strategic prioritization using 4P framework
                                  </p>
                                  <ul className="text-xs space-y-1" style={{ color: zsColors.neutral.gray }}>
                                    <li>• Combines all 4P factors (Persona, Performance, Potential, Preference)</li>
                                    <li>• Creates 5 distinct microsegments</li>
                                    <li>• Generates 3 prioritization options:</li>
                                    <li className="ml-3">- Growth Focus: Champions, Growers, Converters (+45% growth)</li>
                                    <li className="ml-3">- Efficiency Focus: Champions, Maintainers, Defenders (+32% ROI)</li>
                                    <li className="ml-3">- Balanced: All segments weighted (+28% performance)</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* For other agents - Show standard overview */
                      <div className="rounded-lg p-5" style={{ 
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: zsColors.neutral.charcoal }}>
                          <Brain size={20} />
                          Agent Purpose & Capabilities
                        </h3>
                        <p className="mb-5 leading-relaxed" style={{ color: zsColors.neutral.darkGray }}>{props.overview.purpose}</p>
                        
                        {/* Key Tools */}
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Available Tools:</h4>
                          <div className="flex flex-wrap gap-2">
                            {props.overview.tools.map((tool, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1.5 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: zsColors.neutral.offWhite,
                                  color: zsColors.neutral.darkGray,
                                  border: `1px solid ${zsColors.neutral.lightGray}`
                                }}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>Agent Reasoning</h3>
                      <ul className="space-y-3">
                        {props.overview.reasoning.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Brain size={16} style={{ color: agentTheme.primary }} className="mt-1 flex-shrink-0" />
                            <span className="text-sm leading-relaxed" style={{ color: zsColors.neutral.darkGray }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>Tools & Systems</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {props.overview.tools.map((tool, idx) => (
                          <div key={idx} className="rounded-lg p-4 flex items-center gap-3"
                            style={{ 
                              backgroundColor: zsColors.neutral.offWhite,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <Database size={16} style={{ color: zsColors.secondary.teal }} className="flex-shrink-0" />
                            <span className="text-sm font-medium truncate" style={{ color: zsColors.neutral.darkGray }}>{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>Current Actions</h3>
                      <div className="space-y-3">
                        {props.overview.actions?.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Activity size={16} style={{ color: zsColors.secondary.orange }} className="mt-0.5 flex-shrink-0" />
                            <span className="text-sm leading-relaxed" style={{ color: zsColors.neutral.darkGray }}>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>Key Metrics</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {props.overview.keyMetrics?.map((metric, idx) => (
                          <div key={idx} className="rounded-lg p-4 text-center"
                            style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                            <p className="text-xs mb-2 font-medium" style={{ color: zsColors.neutral.gray }}>{metric.label}</p>
                            <p className="text-xl font-bold truncate" style={{ color: agentTheme.primary }}>{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Next Step Button for Overview */}
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite, border: `1px solid ${zsColors.neutral.lightGray}` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold mb-1" style={{ color: zsColors.neutral.charcoal }}>Ready to Configure?</h4>
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Proceed to provide business inputs for this agent.</p>
                        </div>
                        <button
                          onClick={() => {
                            setWorkflowState(prev => ({ ...prev, overviewCompleted: true }));
                            handleTabChange('inputs');
                          }}
                          className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
                          style={{
                            backgroundColor: agentTheme.primary,
                            color: zsColors.neutral.white
                          }}
                        >
                          Configure Inputs →
                        </button>
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
                    {/* Customer Planning Specific Inputs */}
                    {props.agentId === 'customer' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                          Brand Objectives & Priorities
                        </h3>
                        <div className="rounded-lg p-4 space-y-3"
                          style={{ 
                            backgroundColor: zsColors.neutral.offWhite,
                            border: `1px solid ${zsColors.neutral.lightGray}`
                          }}>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="obj1" defaultChecked />
                            <label htmlFor="obj1" className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                              Increase market share in high-value HCP segments
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="obj2" defaultChecked />
                            <label htmlFor="obj2" className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                              Improve HCP engagement through barrier resolution
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="obj3" defaultChecked />
                            <label htmlFor="obj3" className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                              Optimize resource allocation across channels
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {props.businessInputs?.upstream && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                          Data from {props.businessInputs?.upstream?.source}
                        </h3>
                        <div className="rounded-lg p-4 space-y-2"
                          style={{ 
                            backgroundColor: zsColors.neutral.offWhite,
                            border: `1px solid ${zsColors.neutral.lightGray}`
                          }}>
                          {props.businessInputs?.upstream?.data?.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-sm" style={{ color: zsColors.neutral.gray }}>{item.label}:</span>
                              <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                        {props.agentId === 'customer' ? 'Barrier Importance Weights' : 'Adjustable Parameters'}
                      </h3>
                      
                      {/* Validation Errors */}
                      {validationErrors.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: zsColors.semantic.error + '10', border: `1px solid ${zsColors.semantic.error}30` }}>
                          <h4 className="text-sm font-semibold mb-2" style={{ color: zsColors.semantic.error }}>Validation Errors:</h4>
                          <ul className="text-xs space-y-1">
                            {validationErrors.map((error, idx) => (
                              <li key={idx} style={{ color: zsColors.semantic.error }}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
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
                        {props.businessInputs?.constraints?.map((constraint, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Zap size={16} style={{ color: zsColors.semantic.warning }} className="mt-1" />
                            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Next Step Button */}
                    {selectedTab === 'inputs' && (
                      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite, border: `1px solid ${zsColors.neutral.lightGray}` }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold mb-1" style={{ color: zsColors.neutral.charcoal }}>Ready to Proceed?</h4>
                            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>All inputs are validated and ready for analysis.</p>
                          </div>
                          <button
                            onClick={() => handleTabChange('analytics')}
                            disabled={!workflowState.inputsCompleted || validationErrors.length > 0}
                            className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                            style={{
                              backgroundColor: workflowState.inputsCompleted && validationErrors.length === 0 ? agentTheme.primary : zsColors.neutral.gray,
                              color: zsColors.neutral.white
                            }}
                          >
                            Run Analytics →
                          </button>
                        </div>
                      </div>
                    )}
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
                    {/* Customer Planning Workflow Execution */}
                    {props.agentId === 'customer' ? (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                            Customer Planning 5-Module Workflow: Analytics & AI
                          </h3>
                          
                          {/* All 5 Modules with Dropdown */}
                          <div className="space-y-4">
                            {/* Module 1: Persona Analysis */}
                            <div className="rounded-lg overflow-hidden" style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <button
                                onClick={() => setExpandedModule(expandedModule === 1 ? null : 1)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: agentTheme.primary + '20',
                                      color: agentTheme.primary
                                    }}>
                                    <Users size={20} />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                                      Module 1: Persona Analysis
                                    </h4>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      Barrier inferencing and HCP classification
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`transition-transform ${expandedModule === 1 ? 'rotate-180' : ''}`}
                                  style={{ color: zsColors.neutral.gray }}
                                />
                              </button>
                              
                              {expandedModule === 1 && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        AI Models & Analytics
                                      </h5>
                                      <ul className="space-y-2 text-xs" style={{ color: zsColors.neutral.gray }}>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Barrier Detection ML Model (Random Forest, 89% accuracy)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Pattern Recognition Engine for behavioral analysis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>HCP Behavioral Analytics processing 24 months of data</span>
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        Outputs
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>HCPs Analyzed</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>2,847</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Barriers Identified</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>5</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Barrier Prevalence</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>73%</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Confidence</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>92%</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Module 2: Performance Metrics */}
                            <div className="rounded-lg overflow-hidden" style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <button
                                onClick={() => setExpandedModule(expandedModule === 2 ? null : 2)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: agentTheme.primary + '20',
                                      color: agentTheme.primary
                                    }}>
                                    <TrendingUp size={20} />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                                      Module 2: Performance Metrics
                                    </h4>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      KPI selection and historical analysis
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`transition-transform ${expandedModule === 2 ? 'rotate-180' : ''}`}
                                  style={{ color: zsColors.neutral.gray }}
                                />
                              </button>
                              
                              {expandedModule === 2 && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        AI Models & Analytics
                                      </h5>
                                      <ul className="space-y-2 text-xs" style={{ color: zsColors.neutral.gray }}>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>KPI Calculator with brand objective alignment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Trend Analysis Engine (Time Series Analysis)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Competitive Intelligence benchmarking</span>
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        Outputs
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>KPIs Selected</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>12</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Data Processed</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>24mo</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Quintiles</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>5</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Trends Found</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>8</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Module 3: Potential Prediction */}
                            <div className="rounded-lg overflow-hidden" style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <button
                                onClick={() => setExpandedModule(expandedModule === 3 ? null : 3)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: agentTheme.primary + '20',
                                      color: agentTheme.primary
                                    }}>
                                    <Target size={20} />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                                      Module 3: Potential Prediction
                                    </h4>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      ML-based opportunity forecasting
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`transition-transform ${expandedModule === 3 ? 'rotate-180' : ''}`}
                                  style={{ color: zsColors.neutral.gray }}
                                />
                              </button>
                              
                              {expandedModule === 3 && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        AI Models & Analytics
                                      </h5>
                                      <ul className="space-y-2 text-xs" style={{ color: zsColors.neutral.gray }}>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Predictive Analytics Suite (Ensemble Models)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Random Forest + XGBoost for depth/breadth prediction</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Opportunity Calculator with validation (87% accuracy)</span>
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        Outputs
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Depth Opp.</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>$28M</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Breadth Opp.</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>$17M</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>High Priority</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>423</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Model Acc.</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>87%</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Module 4: Preference Mapping */}
                            <div className="rounded-lg overflow-hidden" style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <button
                                onClick={() => setExpandedModule(expandedModule === 4 ? null : 4)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: agentTheme.primary + '20',
                                      color: agentTheme.primary
                                    }}>
                                    <Heart size={20} />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                                      Module 4: Preference Mapping
                                    </h4>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      Channel and content affinity analysis
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`transition-transform ${expandedModule === 4 ? 'rotate-180' : ''}`}
                                  style={{ color: zsColors.neutral.gray }}
                                />
                              </button>
                              
                              {expandedModule === 4 && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        AI Models & Analytics
                                      </h5>
                                      <ul className="space-y-2 text-xs" style={{ color: zsColors.neutral.gray }}>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Collaborative Filtering Engine</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Engagement Analytics with historical patterns</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Channel Optimizer with response modeling</span>
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        Outputs
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Field Pref.</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>62%</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Digital Pref.</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>38%</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Opt. Frequency</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>2.3/mo</p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Content Types</p>
                                          <p className="text-lg font-bold" style={{ color: agentTheme.primary }}>7</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Module 5: Microsegmentation */}
                            <div className="rounded-lg overflow-hidden" style={{ 
                              backgroundColor: zsColors.neutral.white,
                              border: `1px solid ${zsColors.neutral.lightGray}`
                            }}>
                              <button
                                onClick={() => setExpandedModule(expandedModule === 5 ? null : 5)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: agentTheme.primary + '20',
                                      color: agentTheme.primary
                                    }}>
                                    <Layers size={20} />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                                      Module 5: Microsegmentation
                                    </h4>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      Strategic prioritization using 4P framework
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`transition-transform ${expandedModule === 5 ? 'rotate-180' : ''}`}
                                  style={{ color: zsColors.neutral.gray }}
                                />
                              </button>
                              
                              {expandedModule === 5 && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        AI Models & Analytics
                                      </h5>
                                      <ul className="space-y-2 text-xs" style={{ color: zsColors.neutral.gray }}>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Segmentation Engine with 4P integration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>Priority Matrix Builder (K-means Clustering)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-500">✓</span>
                                          <span>ROI Calculator for strategy comparison</span>
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.neutral.darkGray }}>
                                        Outputs - Strategic Options
                                      </h5>
                                      <div className="space-y-2">
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Growth Focus</span>
                                            <span className="text-xs" style={{ color: zsColors.semantic.success }}>+45% growth</span>
                                          </div>
                                          <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                                            Champions, Growers, Converters
                                          </p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Efficiency Focus</span>
                                            <span className="text-xs" style={{ color: zsColors.secondary.teal }}>+32% ROI</span>
                                          </div>
                                          <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                                            Champions, Maintainers, Defenders
                                          </p>
                                        </div>
                                        <div className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Balanced</span>
                                            <span className="text-xs" style={{ color: agentTheme.primary }}>+28% overall</span>
                                          </div>
                                          <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                                            All segments weighted
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Standard Analytics for other agents */
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>AI Models</h3>
                          <div className="space-y-3">
                            {props.analytics?.models?.map((model, idx) => (
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
                        {props.analytics?.algorithms?.map((algo, idx) => (
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
                        {props.analytics?.reasoning?.steps?.map((step, idx) => (
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

                    {/* Only show visualizations after analytics are complete */}
                    {workflowState.analyticsCompleted && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>Visualizations</h3>
                        {isProcessing ? (
                          <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-transparent border-t-current mx-auto mb-4" style={{ color: agentTheme.primary }} />
                            <p className="text-sm" style={{ color: zsColors.neutral.gray }}>AI models are processing your inputs...</p>
                          </div>
                        ) : (
                          <>{props.analytics?.visualizations || (props.visualizationComponent && <props.visualizationComponent />)}</>
                        )}
                      </div>
                    )}
                    
                      </>
                    )}
                    
                    {/* Analytics Action Button */}
                    {selectedTab === 'analytics' && !workflowState.analyticsCompleted && !isProcessing && (
                      <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: agentTheme.primary + '10', border: `2px solid ${agentTheme.primary}30` }}>
                        <h4 className="text-lg font-semibold mb-2" style={{ color: agentTheme.primary }}>Ready to Run AI Analysis</h4>
                        <p className="text-sm mb-4" style={{ color: zsColors.neutral.darkGray }}>Execute machine learning models and generate insights</p>
                        <button
                          onClick={runAnalytics}
                          className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                          style={{
                            backgroundColor: agentTheme.primary,
                            color: zsColors.neutral.white
                          }}
                        >
                          ▶ Run Analytics & AI Models
                        </button>
                      </div>
                    )}
                    
                    {/* Analytics Completed */}
                    {selectedTab === 'analytics' && workflowState.analyticsCompleted && (
                      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: zsColors.semantic.success + '10', border: `1px solid ${zsColors.semantic.success}30` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zsColors.semantic.success }} />
                            <span className="text-sm font-semibold" style={{ color: zsColors.semantic.success }}>Analysis Complete</span>
                          </div>
                          <button
                            onClick={() => handleTabChange('outputs')}
                            className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
                            style={{
                              backgroundColor: zsColors.semantic.success,
                              color: zsColors.neutral.white
                            }}
                          >
                            View Results →
                          </button>
                        </div>
                      </div>
                    )}
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
                    {/* Customer Planning 5-Module Results */}
                    {props.agentId === 'customer' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                          5-Module Workflow Results
                        </h3>
                        
                        {/* Microsegmentation Strategies */}
                        <div className="mb-6 rounded-lg p-4" style={{ 
                          backgroundColor: agentTheme.primary + '10',
                          border: `1px solid ${agentTheme.primary}30`
                        }}>
                          <h4 className="font-semibold mb-3" style={{ color: agentTheme.primary }}>
                            Microsegmentation Strategies
                          </h4>
                          <div className="space-y-3">
                            <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.white }}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                  Growth Focus Strategy
                                </h5>
                                <span className="text-xs px-2 py-1 rounded" style={{ 
                                  backgroundColor: zsColors.semantic.success + '20',
                                  color: zsColors.semantic.success
                                }}>
                                  +45% expected growth
                                </span>
                              </div>
                              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                Champions, Growers, Converters - Focus on high-growth potential segments
                              </p>
                            </div>
                            
                            <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.white }}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                  Efficiency Focus Strategy
                                </h5>
                                <span className="text-xs px-2 py-1 rounded" style={{ 
                                  backgroundColor: zsColors.secondary.teal + '20',
                                  color: zsColors.secondary.teal
                                }}>
                                  +32% ROI improvement
                                </span>
                              </div>
                              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                Champions, Maintainers, Defenders - Maximize ROI with stable segments
                              </p>
                            </div>
                            
                            <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.white }}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                  Balanced Approach
                                </h5>
                                <span className="text-xs px-2 py-1 rounded" style={{ 
                                  backgroundColor: agentTheme.primary + '20',
                                  color: agentTheme.primary
                                }}>
                                  +28% overall performance
                                </span>
                              </div>
                              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                All segments with weighted priority - Balanced growth and stability
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Key Outputs */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="rounded-lg p-4" style={{ 
                            backgroundColor: zsColors.neutral.offWhite,
                            border: `1px solid ${zsColors.neutral.lightGray}`
                          }}>
                            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Prioritized HCPs</p>
                            <p className="text-2xl font-bold" style={{ color: agentTheme.primary }}>423</p>
                            <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>High-opportunity</p>
                          </div>
                          <div className="rounded-lg p-4" style={{ 
                            backgroundColor: zsColors.neutral.offWhite,
                            border: `1px solid ${zsColors.neutral.lightGray}`
                          }}>
                            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Total Opportunity</p>
                            <p className="text-2xl font-bold" style={{ color: zsColors.semantic.success }}>$45M</p>
                            <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>Potential revenue</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                        Data Package to {props.outputs?.downstream?.destination || 'Next Agent'}
                      </h3>
                      <div className="rounded-lg p-4 space-y-2"
                        style={{ 
                          backgroundColor: zsColors.neutral.offWhite,
                          border: `1px solid ${zsColors.neutral.lightGray}`
                        }}>
                        {props.outputs?.downstream?.data?.map((item, idx) => (
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
                        {props.outputs?.recommendations?.map((rec, idx) => (
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
                        {props.outputs?.impact?.map((impact, idx) => (
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
                        <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>Downstream Impact & Approval</h4>
                      </div>
                      <p className="text-sm mb-4" style={{ color: zsColors.neutral.darkGray }}>
                        Review the results and approve sending these outputs to the next agent in the flow.
                      </p>
                      
                      {!workflowState.outputsApproved ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="review-checkbox" className="rounded" />
                            <label htmlFor="review-checkbox" className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                              I have reviewed the results and recommendations
                            </label>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={approveOutputs}
                              className="flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold hover:shadow-md"
                              style={{ 
                                backgroundColor: zsColors.semantic.success,
                                color: zsColors.neutral.white
                              }}>
                              ✓ Approve & Send to Next Agent
                            </button>
                            <button className="px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-medium border"
                              style={{ 
                                color: agentTheme.primary,
                                border: `1px solid ${agentTheme.primary}`,
                                backgroundColor: 'transparent'
                              }}>
                              Request Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: zsColors.semantic.success + '20' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zsColors.semantic.success }} />
                            <span className="text-sm font-semibold" style={{ color: zsColors.semantic.success }}>Outputs Approved & Sent</span>
                          </div>
                          <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Ready for downstream processing</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Next Agent Navigation */}
                    <div className="mt-6 space-y-4">
                      <div className="p-4 rounded-lg" style={{ 
                        backgroundColor: zsColors.neutral.offWhite,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                          Continue to Next Agent
                        </h4>
                        <p className="text-xs mb-4" style={{ color: zsColors.neutral.gray }}>
                          {getFlowNavigationMessage(props.agentId)}
                        </p>
                        <div className="space-y-3">
                          {getNextLogicalAgents(props.agentId).map((nextAgent) => (
                            <Link
                              key={nextAgent.id}
                              href={nextAgent.path}
                              className="block rounded-lg p-4 transition-all hover:shadow-md"
                              style={{
                                backgroundColor: zsColors.neutral.white,
                                border: `2px solid ${nextAgent.color.primary}30`
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg p-2" style={{
                                    backgroundColor: nextAgent.color.primary + '15'
                                  }}>
                                    <nextAgent.icon className="w-full h-full" style={{ color: nextAgent.color.primary }} />
                                  </div>
                                  <div>
                                    <h5 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                      {nextAgent.name}
                                    </h5>
                                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                      {nextAgent.description}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight size={20} style={{ color: nextAgent.color.primary }} />
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        {/* Alternative: Return to Flow Overview */}
                        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                          <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: zsColors.primary.navy }}
                          >
                            <ChevronLeft size={16} />
                            Return to Agent Flow Overview
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right Panel - Interactive Q&A (45% desktop, full width mobile) */}
          <div className="w-full lg:w-[45%] rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              boxShadow: zsColors.shadows.md,
              minHeight: '500px',
              maxHeight: '700px'
            }}>
            <div className="p-4" style={{ borderBottom: `1px solid ${zsColors.neutral.lightGray}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: zsColors.neutral.charcoal }}>
                  <MessageSquare size={20} />
                  Interactive Q&A
                </h2>
                <span className="text-xs px-2 py-1 rounded-full" style={{ 
                  backgroundColor: zsColors.semantic.success + '20',
                  color: zsColors.semantic.success 
                }}>
                  AI Assistant Ready
                </span>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="h-full">
              <AgentChat 
                agentId={props.agentId}
                agentName={props.agentName}
                agentColor={props.agentColor}
                suggestedQueries={getAgentSuggestedQueries(props.agentId)}
                contextData={parameters}
                parameters={parameters.map((param, idx) => ({
                  label: param.name,
                  key: `param_${idx}`,
                  type: param.type === 'slider' ? 'slider' : param.type === 'select' ? 'select' : param.type === 'toggle' ? 'select' : 'text',
                  value: param.value,
                  options: param.options,
                  min: param.min,
                  max: param.max
                }))}
                onRerun={(params) => {
                  console.log('Rerun with params:', params);
                  // Handle parameter updates
                  Object.keys(params).forEach((key) => {
                    const idx = parseInt(key.replace('param_', ''));
                    if (!isNaN(idx) && idx < parameters.length) {
                      handleParameterChange(idx, params[key]);
                    }
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}