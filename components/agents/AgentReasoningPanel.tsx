'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, ChevronRight, Zap, 
  Activity, Target, Lightbulb, Code,
  Database, TrendingUp, Network, Shield,
  CheckCircle
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface ReasoningStep {
  id: string;
  type: 'analysis' | 'decision' | 'action' | 'insight';
  content: string;
  confidence?: number;
  tools?: string[];
  timestamp?: Date;
}

interface AgentReasoningPanelProps {
  agentName: string;
  agentColor: { primary: string; light: string };
  reasoningSteps: string[];
  isActive?: boolean;
  showConfidence?: boolean;
  expandable?: boolean;
}

export function AgentReasoningPanel({
  agentName,
  agentColor,
  reasoningSteps,
  isActive = false,
  showConfidence = true,
  expandable = true
}: AgentReasoningPanelProps) {
  const [expanded, setExpanded] = useState(!expandable);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processedSteps, setProcessedSteps] = useState<ReasoningStep[]>([]);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (isActive && currentStepIndex < reasoningSteps.length) {
      processNextStep();
    }
  }, [isActive, currentStepIndex]);

  const processNextStep = () => {
    if (currentStepIndex >= reasoningSteps.length) return;

    setThinking(true);
    
    setTimeout(() => {
      const step: ReasoningStep = {
        id: `step-${currentStepIndex}`,
        type: getStepType(currentStepIndex),
        content: reasoningSteps[currentStepIndex],
        confidence: 85 + Math.random() * 15,
        timestamp: new Date()
      };

      setProcessedSteps(prev => [...prev, step]);
      setCurrentStepIndex(prev => prev + 1);
      setThinking(false);
    }, 1000 + Math.random() * 1000);
  };

  const getStepType = (index: number): ReasoningStep['type'] => {
    if (index === 0) return 'analysis';
    if (index === reasoningSteps.length - 1) return 'action';
    if (index % 3 === 0) return 'insight';
    return 'decision';
  };

  const getStepIcon = (type: ReasoningStep['type']) => {
    switch (type) {
      case 'analysis':
        return <Activity size={14} />;
      case 'decision':
        return <Target size={14} />;
      case 'insight':
        return <Lightbulb size={14} />;
      case 'action':
        return <Zap size={14} />;
      default:
        return <ChevronRight size={14} />;
    }
  };

  const getStepColor = (type: ReasoningStep['type']) => {
    switch (type) {
      case 'analysis':
        return zsColors.primary.blue;
      case 'decision':
        return zsColors.secondary.green;
      case 'insight':
        return zsColors.secondary.orange;
      case 'action':
        return agentColor.primary;
      default:
        return zsColors.neutral.gray;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: zsColors.neutral.white }}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        style={{ 
          background: `linear-gradient(135deg, ${agentColor.primary}10, ${agentColor.light}10)`,
          borderBottom: `1px solid ${zsColors.neutral.lightGray}`
        }}
        onClick={() => expandable && setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${agentColor.primary}, ${agentColor.light})`
              }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: zsColors.neutral.charcoal }}>
                {agentName} Reasoning
              </h3>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                {isActive ? 'Processing...' : `${processedSteps.length} steps completed`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {thinking && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={18} style={{ color: agentColor.primary }} />
              </motion.div>
            )}
            
            {expandable && (
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={18} style={{ color: zsColors.neutral.gray }} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Reasoning Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {/* Unprocessed steps preview */}
              {reasoningSteps.map((step, index) => {
                const isProcessed = index < currentStepIndex;
                const isProcessing = index === currentStepIndex && thinking;
                const processedStep = processedSteps[index];

                if (!isProcessed && !isProcessing) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: zsColors.neutral.offWhite }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: zsColors.neutral.lightGray }}>
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                      <p className="text-sm flex-1" style={{ color: zsColors.neutral.gray }}>
                        {step}
                      </p>
                    </motion.div>
                  );
                }

                if (isProcessing) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ 
                        backgroundColor: `${agentColor.primary}05`,
                        border: `1px solid ${agentColor.primary}30`
                      }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: agentColor.primary }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.p
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-sm"
                          style={{ color: zsColors.neutral.darkGray }}
                        >
                          Analyzing: {step}
                        </motion.p>
                        <div className="mt-2 flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: agentColor.primary }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                if (processedStep) {
                  return (
                    <motion.div
                      key={processedStep.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:shadow-sm transition-all"
                      style={{ backgroundColor: zsColors.neutral.white }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${getStepColor(processedStep.type)}20` }}>
                        <div style={{ color: getStepColor(processedStep.type) }}>
                          {getStepIcon(processedStep.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: zsColors.neutral.charcoal }}>
                          {processedStep.content}
                        </p>
                        
                        {showConfidence && processedStep.confidence && (
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Shield size={12} style={{ color: zsColors.secondary.green }} />
                              <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                Confidence: {Math.round(processedStep.confidence)}%
                              </span>
                            </div>
                            
                            <div className="flex-1 h-1 bg-gray-100 rounded-full max-w-[100px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${processedStep.confidence}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: zsColors.secondary.green }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {processedStep.timestamp && (
                          <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                            {processedStep.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                }

                return null;
              })}

              {/* Completion message */}
              {!isActive && processedSteps.length === reasoningSteps.length && processedSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg text-center"
                  style={{ 
                    backgroundColor: `${zsColors.secondary.green}10`,
                    border: `1px solid ${zsColors.secondary.green}30`
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={18} style={{ color: zsColors.secondary.green }} />
                    <p className="text-sm font-medium" style={{ color: zsColors.secondary.green }}>
                      Reasoning Complete
                    </p>
                  </div>
                  <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                    All {processedSteps.length} steps processed successfully
                  </p>
                </motion.div>
              )}
            </div>

            {/* Tools Used */}
            {isActive && (
              <div className="px-4 pb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={14} style={{ color: agentColor.primary }} />
                    <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                      Active Tools & Models
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['ML Pipeline', 'Data Processor', 'Pattern Analyzer', 'Decision Engine'].map((tool) => (
                      <motion.span
                        key={tool}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: zsColors.neutral.white,
                          border: `1px solid ${agentColor.primary}30`,
                          color: agentColor.primary
                        }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Standalone version for use outside of workflow
export function StandaloneAgentReasoning({
  agentName = 'Customer Planning Agent',
  moduleId = 'persona'
}: {
  agentName?: string;
  moduleId?: string;
}) {
  const getReasoningSteps = () => {
    const steps: Record<string, string[]> = {
      persona: [
        'Accessing comprehensive HCP database with 2,847 records',
        'Analyzing prescribing patterns to identify barrier signals',
        'Running probabilistic barrier detection models',
        'Mapping each HCP to primary and secondary barriers',
        'Calculating barrier prevalence and severity scores'
      ],
      performance: [
        'Selecting KPIs based on brand strategic objectives',
        'Processing 24 months of historical prescribing data',
        'Calculating market share and growth metrics',
        'Segmenting HCPs into performance quintiles',
        'Identifying trends and performance patterns'
      ],
      potential: [
        'Configuring breadth and depth prediction models',
        'Engineering features from historical data',
        'Training ensemble models (Random Forest + XGBoost)',
        'Generating opportunity predictions per HCP',
        'Validating predictions against holdout dataset'
      ],
      preference: [
        'Analyzing historical engagement patterns',
        'Running collaborative filtering algorithms',
        'Scoring channel preferences for each HCP',
        'Mapping content type affinity scores',
        'Determining optimal engagement cadence'
      ],
      microsegmentation: [
        'Combining all 4P factors into unified dataset',
        'Applying clustering algorithms',
        'Creating 5 distinct microsegments',
        'Calculating segment value and effort scores',
        'Generating prioritization recommendations'
      ]
    };

    return steps[moduleId] || steps.persona;
  };

  const moduleColors: Record<string, any> = {
    persona: { primary: '#8B5CF6', light: '#A78BFA' },
    performance: { primary: '#3B82F6', light: '#60A5FA' },
    potential: { primary: '#10B981', light: '#34D399' },
    preference: { primary: '#F59E0B', light: '#FBBf24' },
    microsegmentation: { primary: '#EF4444', light: '#F87171' }
  };

  return (
    <AgentReasoningPanel
      agentName={agentName}
      agentColor={moduleColors[moduleId] || moduleColors.persona}
      reasoningSteps={getReasoningSteps()}
      isActive={true}
      showConfidence={true}
      expandable={true}
    />
  );
}