'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Play, Pause, CheckCircle, AlertCircle, TrendingUp,
  Layers, Cpu, Eye, Target, Zap, BarChart2, GitBranch,
  Activity, Database, Settings, ChevronRight, Info
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { orchestrationBERTAgent } from '@/lib/agents/orchestration-bert-agent';
import type { BERTWorkflowStep, AttentionPattern, FeatureImportance } from '@/lib/agents/orchestration-bert-agent';

interface BERTModelWorkflowProps {
  onStepComplete?: (step: string) => void;
}

export function BERTModelWorkflow({ onStepComplete }: BERTModelWorkflowProps) {
  const [activeView, setActiveView] = useState<'training' | 'attention' | 'explainability' | 'optimization'>('training');
  const [workflowSteps, setWorkflowSteps] = useState<BERTWorkflowStep[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState({ loss: 0.42, accuracy: 0.89 });

  useEffect(() => {
    setWorkflowSteps(orchestrationBERTAgent.getWorkflowSteps());
  }, []);

  const modelViews = [
    { id: 'training', label: 'Model Training', icon: Brain, color: zsColors.primary.navy },
    { id: 'attention', label: 'Attention Matrix', icon: Eye, color: zsColors.secondary.blue },
    { id: 'explainability', label: 'Explainability', icon: GitBranch, color: zsColors.secondary.teal },
    { id: 'optimization', label: 'GA Optimization', icon: Target, color: zsColors.secondary.orange }
  ];

  const featureImportance = orchestrationBERTAgent.getFeatureImportance();
  const attentionPatterns = orchestrationBERTAgent.getAttentionAnalysis().attentionPatterns;
  const bestSequence = orchestrationBERTAgent.getBestSequence();

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training progress
    const interval = setInterval(() => {
      setCurrentEpoch(prev => {
        if (prev >= 50) {
          clearInterval(interval);
          setIsTraining(false);
          return 50;
        }
        return prev + 1;
      });
      setTrainingMetrics({
        loss: Math.max(0.1, 0.42 - Math.random() * 0.01),
        accuracy: Math.min(0.95, 0.89 + Math.random() * 0.01)
      });
    }, 100);
  };

  const getStepIcon = (stepId: string) => {
    const icons: Record<string, any> = {
      'data-prep': Database,
      'feature-eng': Settings,
      'model-init': Cpu,
      'training': Brain,
      'validation': CheckCircle,
      'attention-analysis': Eye,
      'explainability': GitBranch,
      'optimization': Target,
      'deployment': Zap
    };
    return icons[stepId] || Activity;
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'complete': return zsColors.semantic.success;
      case 'in-progress': return zsColors.secondary.blue;
      case 'error': return zsColors.semantic.error;
      default: return zsColors.neutral.gray;
    }
  };

  return (
    <div className="space-y-6">
      {/* BERT Model Views */}
      <div className="rounded-lg p-6" style={{
        backgroundColor: zsColors.neutral.white,
        border: `1px solid ${zsColors.neutral.lightGray}`
      }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
          BERT Model Workflow
        </h3>

        {/* View Selector */}
        <div className="flex items-center gap-3 mb-6">
          {modelViews.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === view.id ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                backgroundColor: activeView === view.id ? view.color + '15' : zsColors.neutral.offWhite,
                borderColor: activeView === view.id ? view.color : zsColors.neutral.lightGray,
                borderWidth: '1px',
                borderStyle: 'solid',
                ...(activeView === view.id && { ringColor: view.color })
              }}
            >
              <view.icon size={18} style={{ color: view.color }} />
              <span className="text-sm font-medium" style={{
                color: activeView === view.id ? view.color : zsColors.neutral.darkGray
              }}>
                {view.label}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Model Training View */}
          {activeView === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Training Progress */}
              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                    Training Progress
                  </h4>
                  {!isTraining ? (
                    <button
                      onClick={handleStartTraining}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: zsColors.primary.navy,
                        color: zsColors.neutral.white
                      }}
                    >
                      <Play size={16} />
                      Start Training
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                      style={{
                        backgroundColor: zsColors.semantic.warning,
                        color: zsColors.neutral.white
                      }}
                    >
                      <Pause size={16} />
                      Training...
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: zsColors.neutral.gray }}>Epoch {currentEpoch}/50</span>
                      <span style={{ color: zsColors.neutral.darkGray }}>{(currentEpoch / 50 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: zsColors.neutral.lightGray }}>
                      <motion.div
                        className="h-full"
                        animate={{ width: `${(currentEpoch / 50) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        style={{ backgroundColor: zsColors.primary.navy }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg p-3" style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                      <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Training Loss</p>
                      <p className="text-xl font-bold" style={{ color: zsColors.secondary.orange }}>
                        {trainingMetrics.loss.toFixed(3)}
                      </p>
                    </div>
                    <div className="rounded-lg p-3" style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                      <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Accuracy</p>
                      <p className="text-xl font-bold" style={{ color: zsColors.semantic.success }}>
                        {(trainingMetrics.accuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-2">
                {workflowSteps.map((step, idx) => {
                  const Icon = getStepIcon(step.id);
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: getStepColor(step.status) + '20',
                          color: getStepColor(step.status)
                        }}>
                        {step.status === 'complete' ? (
                          <CheckCircle size={20} />
                        ) : step.status === 'in-progress' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Activity size={20} />
                          </motion.div>
                        ) : (
                          <Icon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                              {step.name}
                            </p>
                            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                              {step.description}
                            </p>
                          </div>
                          {step.duration && (
                            <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                              {step.duration}min
                            </span>
                          )}
                        </div>
                        {step.status === 'in-progress' && (
                          <div className="mt-2 w-full h-1 rounded-full overflow-hidden"
                            style={{ backgroundColor: zsColors.neutral.lightGray }}>
                            <motion.div
                              className="h-full"
                              animate={{ width: `${step.progress}%` }}
                              style={{ backgroundColor: zsColors.secondary.blue }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Attention Matrix View */}
          {activeView === 'attention' && (
            <motion.div
              key="attention"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <h4 className="font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                  Attention Pattern Analysis
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg p-3" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Total Layers</p>
                    <p className="text-2xl font-bold" style={{ color: zsColors.primary.navy }}>12</p>
                  </div>
                  <div className="rounded-lg p-3" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Attention Heads</p>
                    <p className="text-2xl font-bold" style={{ color: zsColors.secondary.blue }}>12</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {attentionPatterns.map((pattern, idx) => (
                    <div key={idx} className="rounded-lg p-3" style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {pattern.pattern}
                        </h5>
                        <span className="text-xs px-2 py-1 rounded" style={{
                          backgroundColor: zsColors.secondary.blue + '20',
                          color: zsColors.secondary.blue
                        }}>
                          {(pattern.frequency * 100).toFixed(0)}% frequency
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                        {pattern.interpretation}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pattern.examples.map((example, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded" style={{
                            backgroundColor: zsColors.neutral.offWhite,
                            color: zsColors.neutral.darkGray
                          }}>
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attention Heatmap Visualization (Placeholder) */}
                <div className="mt-4 rounded-lg p-4" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`,
                  height: '200px'
                }}>
                  <p className="text-center text-sm" style={{ color: zsColors.neutral.gray }}>
                    Attention Heatmap Visualization
                  </p>
                  <div className="grid grid-cols-8 gap-1 mt-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded"
                        style={{
                          backgroundColor: zsColors.secondary.blue,
                          opacity: 0.2 + Math.random() * 0.8
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Explainability View */}
          {activeView === 'explainability' && (
            <motion.div
              key="explainability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <h4 className="font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                  Feature Importance Analysis
                </h4>

                <div className="space-y-3">
                  {featureImportance.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-32">
                        <p className="text-sm font-medium truncate" style={{ color: zsColors.neutral.charcoal }}>
                          {feature.feature.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {feature.category}
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-6 rounded-full overflow-hidden"
                          style={{ backgroundColor: zsColors.neutral.lightGray }}>
                          <motion.div
                            className="h-full flex items-center justify-end px-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.importance * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            style={{
                              backgroundColor: feature.direction === 'positive'
                                ? zsColors.semantic.success
                                : feature.direction === 'negative'
                                ? zsColors.semantic.error
                                : zsColors.neutral.gray
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              {(feature.importance * 100).toFixed(1)}%
                            </span>
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {feature.direction === 'positive' ? (
                          <TrendingUp size={16} style={{ color: zsColors.semantic.success }} />
                        ) : feature.direction === 'negative' ? (
                          <TrendingUp size={16} style={{ color: zsColors.semantic.error, transform: 'rotate(180deg)' }} />
                        ) : (
                          <Activity size={16} style={{ color: zsColors.neutral.gray }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Model Interpretations */}
                <div className="mt-4 space-y-3">
                  <h5 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                    Key Insights
                  </h5>
                  {orchestrationBERTAgent.getRecommendations().slice(0, 2).map((insight, idx) => (
                    <div key={idx} className="rounded-lg p-3" style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                      <div className="flex items-start gap-2">
                        <Info size={16} style={{ color: zsColors.secondary.teal }} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-1" style={{ color: zsColors.neutral.charcoal }}>
                            {insight.finding}
                          </p>
                          <p className="text-xs mb-2" style={{ color: zsColors.neutral.gray }}>
                            Confidence: {(insight.confidence * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs" style={{ color: zsColors.secondary.teal }}>
                            → {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* GA Optimization View */}
          {activeView === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <h4 className="font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                  Genetic Algorithm Optimization
                </h4>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-lg p-3 text-center" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Generation</p>
                    <p className="text-xl font-bold" style={{ color: zsColors.secondary.orange }}>1,247</p>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Best Fitness</p>
                    <p className="text-xl font-bold" style={{ color: zsColors.semantic.success }}>0.934</p>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>Converged</p>
                    <p className="text-xl font-bold" style={{ color: zsColors.semantic.success }}>✓</p>
                  </div>
                </div>

                {/* Best Sequence */}
                <div className="rounded-lg p-4" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <h5 className="font-medium mb-3" style={{ color: zsColors.neutral.charcoal }}>
                    Optimal Journey Sequence
                  </h5>
                  <div className="space-y-2">
                    {bestSequence.sequence.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: zsColors.secondary.orange }}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                              {step.channel}
                            </span>
                            <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                              Day {step.timing.day} • {step.timing.optimalTime}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                            {step.content}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium" style={{ color: zsColors.semantic.success }}>
                            {(step.expectedResponse * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>response</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 flex items-center justify-between" style={{
                    borderTop: `1px solid ${zsColors.neutral.lightGray}`
                  }}>
                    <div>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Predicted Outcome</p>
                      <p className="text-lg font-bold" style={{ color: zsColors.semantic.success }}>
                        92% Conversion
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: zsColors.secondary.orange,
                        color: zsColors.neutral.white
                      }}>
                      Deploy Sequence
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}