'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Info, TrendingUp, AlertCircle, CheckCircle, 
  Lightbulb, Activity, Zap, Target, ChevronRight,
  Eye, EyeOff, HelpCircle, BarChart3
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { ExportButton } from '@/components/ui/ExportButton';

interface ReasoningStep {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  evidence: string[];
  timestamp?: Date;
}

interface FeatureImportance {
  feature: string;
  importance: number;
  direction: 'positive' | 'negative' | 'neutral';
  description?: string;
}

interface DecisionPath {
  decision: string;
  reasoning: string;
  alternatives: string[];
  confidence: number;
  outcome?: string;
}

interface ExplainableAIDashboardProps {
  agentId: string;
  agentName: string;
  agentColor?: string;
  reasoningSteps?: ReasoningStep[];
  featureImportances?: FeatureImportance[];
  decisionPaths?: DecisionPath[];
  confidenceScore?: number;
  modelVersion?: string;
  lastUpdated?: Date;
  onRequestExplanation?: (query: string) => void;
}

export function ExplainableAIDashboard({
  agentId,
  agentName,
  agentColor = zsColors.primary.blue,
  reasoningSteps = [],
  featureImportances = [],
  decisionPaths = [],
  confidenceScore = 0,
  modelVersion = '2.5.1',
  lastUpdated = new Date(),
  onRequestExplanation
}: ExplainableAIDashboardProps) {
  const [selectedView, setSelectedView] = useState<'reasoning' | 'features' | 'decisions'>('reasoning');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // Mock data if not provided
  const defaultReasoningSteps: ReasoningStep[] = reasoningSteps.length > 0 ? reasoningSteps : [
    {
      id: '1',
      title: 'Data Collection & Validation',
      description: 'Gathered 24 months of HCP prescribing data and validated against quality thresholds',
      confidence: 95,
      impact: 'high',
      evidence: [
        '2,847 HCPs analyzed across 12 territories',
        'Data completeness: 98.5%',
        'Outlier detection: 23 anomalies flagged and reviewed'
      ]
    },
    {
      id: '2',
      title: 'Barrier Identification',
      description: 'Applied ML models to identify primary barriers affecting prescribing behavior',
      confidence: 87,
      impact: 'high',
      evidence: [
        'Referral pathway barriers detected in 34% of HCPs',
        'Side effect management concerns in 28% of cases',
        'Insurance/formulary issues in 21% of territories'
      ]
    },
    {
      id: '3',
      title: 'Opportunity Scoring',
      description: 'Calculated opportunity scores based on barrier severity and potential impact',
      confidence: 82,
      impact: 'medium',
      evidence: [
        'Top 20% HCPs represent 65% of opportunity',
        'Average opportunity increase: 3.2x baseline',
        'Confidence interval: ±12% at 95% confidence'
      ]
    },
    {
      id: '4',
      title: 'Recommendation Generation',
      description: 'Generated personalized engagement strategies for high-opportunity HCPs',
      confidence: 78,
      impact: 'high',
      evidence: [
        '487 high-priority HCPs identified',
        'Average expected conversion: 23%',
        'ROI projection: 4.7x investment'
      ]
    }
  ];

  const defaultFeatureImportances: FeatureImportance[] = featureImportances.length > 0 ? featureImportances : [
    { feature: 'Previous Prescriptions', importance: 0.24, direction: 'positive', description: 'Historical prescribing behavior strongly predicts future actions' },
    { feature: 'Barrier Type', importance: 0.21, direction: 'negative', description: 'Specific barriers significantly impact prescribing likelihood' },
    { feature: 'Engagement History', importance: 0.18, direction: 'positive', description: 'Past interactions correlate with receptiveness' },
    { feature: 'Specialty Match', importance: 0.15, direction: 'positive', description: 'Alignment with therapeutic area increases adoption' },
    { feature: 'Referral Network', importance: 0.12, direction: 'neutral', description: 'Network effects influence prescribing patterns' },
    { feature: 'Digital Engagement', importance: 0.10, direction: 'positive', description: 'Digital channel responsiveness indicates openness' }
  ];

  const defaultDecisionPaths: DecisionPath[] = decisionPaths.length > 0 ? decisionPaths : [
    {
      decision: 'Prioritize Dr. Smith for intensive engagement',
      reasoning: 'High opportunity score (92) with addressable referral pathway barrier',
      alternatives: ['Standard engagement', 'Digital-only approach', 'Peer influence strategy'],
      confidence: 88,
      outcome: 'Expected 3x increase in prescriptions within 90 days'
    },
    {
      decision: 'Allocate 35% budget to digital channels',
      reasoning: 'Response curve analysis shows optimal ROI at this allocation',
      alternatives: ['25% digital', '45% digital', 'Field-heavy approach'],
      confidence: 76,
      outcome: 'Projected 23% improvement in reach with 18% cost reduction'
    }
  ];

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return zsColors.semantic.success;
    if (confidence >= 70) return zsColors.semantic.warning;
    return zsColors.semantic.error;
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Zap size={16} style={{ color: zsColors.semantic.error }} />;
      case 'medium': return <Activity size={16} style={{ color: zsColors.semantic.warning }} />;
      case 'low': return <Target size={16} style={{ color: zsColors.semantic.success }} />;
      default: return null;
    }
  };

  useEffect(() => {
    // Animate confidence score on mount
    setTimeout(() => setIsAnimating(false), 1500);
  }, []);

  const actualConfidence = confidenceScore || 85;

  return (
    <div className="space-y-6">
      {/* Header with Overall Confidence */}
      <AnimatedCard 
        className="p-6 bg-white rounded-xl border"
        style={{ borderColor: zsColors.neutral.lightGray }}
        glowColor={agentColor}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${agentColor}, ${agentColor}CC)`,
                boxShadow: `0 4px 12px ${agentColor}30`
              }}
            >
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                {agentName} AI Reasoning
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Model v{modelVersion} • Updated {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <ExportButton 
            data={defaultReasoningSteps}
            elementId="explainable-ai-dashboard"
            filename={`${agentId}_reasoning`}
            variant="minimal"
          />
        </div>

        {/* Overall Confidence Score */}
        <div className="flex items-center justify-between p-4 rounded-lg"
          style={{ backgroundColor: zsColors.neutral.offWhite }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={zsColors.neutral.lightGray}
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={getConfidenceColor(actualConfidence)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                  animate={{ 
                    strokeDashoffset: isAnimating 
                      ? 2 * Math.PI * 36 * (1 - actualConfidence / 100)
                      : 2 * Math.PI * 36 * (1 - actualConfidence / 100)
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-2xl font-bold"
                  style={{ color: zsColors.neutral.charcoal }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {actualConfidence}%
                </motion.span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                Overall Confidence Score
              </h4>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Based on {defaultReasoningSteps.length} reasoning steps
              </p>
              <button
                onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
                className="text-sm mt-1 flex items-center gap-1 hover:underline"
                style={{ color: agentColor }}
              >
                {showConfidenceDetails ? 'Hide' : 'Show'} details
                <ChevronRight size={14} className={showConfidenceDetails ? 'rotate-90' : ''} />
              </button>
            </div>
          </div>

          {/* Confidence Breakdown */}
          <AnimatePresence>
            {showConfidenceDetails && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-2"
              >
                <div className="text-sm">
                  <span style={{ color: zsColors.neutral.gray }}>Data Quality:</span>
                  <span className="ml-2 font-semibold" style={{ color: zsColors.semantic.success }}>95%</span>
                </div>
                <div className="text-sm">
                  <span style={{ color: zsColors.neutral.gray }}>Model Accuracy:</span>
                  <span className="ml-2 font-semibold" style={{ color: zsColors.semantic.success }}>89%</span>
                </div>
                <div className="text-sm">
                  <span style={{ color: zsColors.neutral.gray }}>Prediction Stability:</span>
                  <span className="ml-2 font-semibold" style={{ color: zsColors.semantic.warning }}>76%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedCard>

      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'reasoning', label: 'Reasoning Steps', icon: Brain },
          { id: 'features', label: 'Feature Importance', icon: BarChart3 },
          { id: 'decisions', label: 'Decision Paths', icon: Lightbulb }
        ].map(view => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              selectedView === view.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div id="explainable-ai-dashboard">
        {selectedView === 'reasoning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {defaultReasoningSteps.map((step, index) => (
              <AnimatedCard
                key={step.id}
                className="p-4 bg-white rounded-lg border"
                style={{ 
                  borderColor: expandedSteps.has(step.id) ? agentColor : zsColors.neutral.lightGray,
                  borderWidth: expandedSteps.has(step.id) ? 2 : 1
                }}
                onClick={() => toggleStepExpansion(step.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: agentColor + '20',
                        color: agentColor
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                          {step.title}
                        </h4>
                        {getImpactIcon(step.impact)}
                      </div>
                      <p className="text-sm mb-2" style={{ color: zsColors.neutral.gray }}>
                        {step.description}
                      </p>
                      
                      {/* Confidence Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ backgroundColor: getConfidenceColor(step.confidence) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${step.confidence}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                          {step.confidence}%
                        </span>
                      </div>

                      {/* Evidence (Expandable) */}
                      <AnimatePresence>
                        {expandedSteps.has(step.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3"
                            style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Info size={14} style={{ color: agentColor }} />
                              <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                                Supporting Evidence:
                              </span>
                            </div>
                            <ul className="space-y-1 ml-6">
                              {step.evidence.map((evidence, i) => (
                                <li key={i} className="text-sm flex items-start gap-2" style={{ color: zsColors.neutral.gray }}>
                                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: zsColors.semantic.success }} />
                                  {evidence}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`transition-transform ${expandedSteps.has(step.id) ? 'rotate-90' : ''}`}
                    style={{ color: zsColors.neutral.gray }}
                  />
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        )}

        {selectedView === 'features' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-6"
          >
            <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
              Feature Impact Analysis
            </h4>
            <div className="space-y-4">
              {defaultFeatureImportances.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                        {feature.feature}
                      </span>
                      {feature.direction === 'positive' && (
                        <TrendingUp size={14} style={{ color: zsColors.semantic.success }} />
                      )}
                      {feature.direction === 'negative' && (
                        <TrendingUp size={14} style={{ color: zsColors.semantic.error, transform: 'rotate(180deg)' }} />
                      )}
                      <span title={feature.description}>
                        <HelpCircle 
                          size={14} 
                          style={{ color: zsColors.neutral.gray }}
                          className="cursor-help"
                        />
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                      {(feature.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${
                            feature.direction === 'positive' ? zsColors.semantic.success :
                            feature.direction === 'negative' ? zsColors.semantic.error :
                            zsColors.semantic.warning
                          }, ${agentColor})`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${feature.importance * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                  {feature.description && (
                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'decisions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {defaultDecisionPaths.map((path, index) => (
              <AnimatedCard
                key={index}
                className="p-5 bg-white rounded-lg border"
                style={{ borderColor: zsColors.neutral.lightGray }}
                glowColor={agentColor}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: agentColor + '20',
                      color: agentColor
                    }}
                  >
                    <Lightbulb size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>
                      {path.decision}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1" style={{ color: zsColors.neutral.darkGray }}>
                          Reasoning:
                        </p>
                        <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                          {path.reasoning}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                          Alternatives Considered:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {path.alternatives.map((alt, i) => (
                            <span 
                              key={i}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: zsColors.neutral.offWhite,
                                color: zsColors.neutral.darkGray,
                                border: `1px solid ${zsColors.neutral.lightGray}`
                              }}
                            >
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {path.outcome && (
                        <div className="p-3 rounded-lg"
                          style={{ backgroundColor: zsColors.semantic.success + '10' }}
                        >
                          <div className="flex items-start gap-2">
                            <Target size={16} style={{ color: zsColors.semantic.success }} className="mt-0.5" />
                            <div>
                              <p className="text-sm font-medium" style={{ color: zsColors.semantic.success }}>
                                Expected Outcome:
                              </p>
                              <p className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                                {path.outcome}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2"
                        style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}
                      >
                        <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                          Decision Confidence:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${path.confidence}%`,
                                backgroundColor: getConfidenceColor(path.confidence)
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                            {path.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        )}
      </div>

      {/* Explanation Request */}
      {onRequestExplanation && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} style={{ color: agentColor }} />
              <div>
                <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                  Need more details?
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  Ask for specific explanations about any recommendation
                </p>
              </div>
            </div>
            <button
              onClick={() => onRequestExplanation('Explain the top recommendation')}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: agentColor,
                color: zsColors.neutral.white
              }}
            >
              Ask AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}