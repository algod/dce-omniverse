'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, AlertTriangle, XCircle, Clock,
  TrendingUp, Package, Upload, Shield, Zap, Target,
  ChevronRight, Download, Send, Archive, RefreshCw
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import type { ContentAsset, ContentGap, MLRScore } from '@/lib/agents/content-review-agent';

interface ContentReviewWorkflowProps {
  onPhaseChange?: (phase: string) => void;
}

export function ContentReviewWorkflow({ onPhaseChange }: ContentReviewWorkflowProps) {
  const [activePhase, setActivePhase] = useState<'gap-analysis' | 'factory' | 'mlr-review' | 'approval' | 'production'>('gap-analysis');
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);

  // Mock data for demonstration
  const contentGaps: ContentGap[] = [
    {
      barrier: 'B001 - Referral Pathways',
      channel: 'Email',
      severity: 'High',
      impactedHCPs: 342,
      revenueAtRisk: 1.2e6,
      description: 'Missing referral pathway education content for email channel'
    },
    {
      barrier: 'B003 - Insurance Denials',
      channel: 'Web',
      severity: 'Critical',
      impactedHCPs: 567,
      revenueAtRisk: 2.3e6,
      description: 'No insurance navigation tools available on web portal'
    },
    {
      barrier: 'B002 - Side Effects',
      channel: 'Print',
      severity: 'Medium',
      impactedHCPs: 189,
      revenueAtRisk: 0.8e6,
      description: 'Outdated side effect management guides'
    }
  ];

  const factoryQueue = [
    { id: 'REQ-001', type: 'Email Template', barrier: 'B001', status: 'In Development', progress: 75 },
    { id: 'REQ-002', type: 'Web Tool', barrier: 'B003', status: 'Design Review', progress: 45 },
    { id: 'REQ-003', type: 'Print Brochure', barrier: 'B002', status: 'Content Writing', progress: 30 }
  ];

  const mlrQueue = [
    { id: 'MLR-001', name: 'HCP Email Campaign v2.1', score: 92, status: 'Review Complete', flags: 0 },
    { id: 'MLR-002', name: 'Insurance Portal Update', score: 87, status: 'In Review', flags: 2 },
    { id: 'MLR-003', name: 'Side Effect Guide 2025', score: 94, status: 'Pending', flags: 0 }
  ];

  const productionAssets = [
    { id: 'PROD-001', name: 'Welcome Email Series', barrier: 'B001', performance: 'High', roi: 4.2 },
    { id: 'PROD-002', name: 'Dosing Calculator', barrier: 'B005', performance: 'Medium', roi: 3.1 },
    { id: 'PROD-003', name: 'Speaker Deck Q1', barrier: 'B004', performance: 'High', roi: 3.8 }
  ];

  const workflowPhases = [
    { id: 'gap-analysis', label: 'Gap Analysis', icon: Target, color: zsColors.secondary.orange },
    { id: 'factory', label: 'Content Factory', icon: Package, color: zsColors.secondary.blue },
    { id: 'mlr-review', label: 'MLR Review', icon: Shield, color: zsColors.primary.navy },
    { id: 'approval', label: 'Approval', icon: CheckCircle, color: zsColors.semantic.success },
    { id: 'production', label: 'Production', icon: TrendingUp, color: zsColors.secondary.teal }
  ];

  const handlePhaseClick = (phaseId: string) => {
    setActivePhase(phaseId as any);
    onPhaseChange?.(phaseId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return zsColors.semantic.error;
      case 'High': return zsColors.secondary.orange;
      case 'Medium': return zsColors.semantic.warning;
      case 'Low': return zsColors.semantic.success;
      default: return zsColors.neutral.gray;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'High': return zsColors.semantic.success;
      case 'Medium': return zsColors.semantic.warning;
      case 'Low': return zsColors.semantic.error;
      default: return zsColors.neutral.gray;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Pipeline Visualization */}
      <div className="rounded-lg p-6" style={{ 
        backgroundColor: zsColors.neutral.white,
        border: `1px solid ${zsColors.neutral.lightGray}`
      }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
          Content Review Workflow Pipeline
        </h3>
        
        <div className="flex items-center justify-between mb-6">
          {workflowPhases.map((phase, idx) => (
            <div key={phase.id} className="flex items-center">
              <motion.button
                onClick={() => handlePhaseClick(phase.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all cursor-pointer ${
                  activePhase === phase.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: activePhase === phase.id ? phase.color + '15' : zsColors.neutral.offWhite,
                  borderColor: activePhase === phase.id ? phase.color : zsColors.neutral.lightGray,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  ...(activePhase === phase.id && { ringColor: phase.color })
                }}
              >
                <phase.icon size={24} style={{ color: phase.color }} />
                <span className="text-xs mt-2 font-medium" style={{ 
                  color: activePhase === phase.id ? phase.color : zsColors.neutral.darkGray 
                }}>
                  {phase.label}
                </span>
              </motion.button>
              {idx < workflowPhases.length - 1 && (
                <ChevronRight size={20} className="mx-2" style={{ color: zsColors.neutral.gray }} />
              )}
            </div>
          ))}
        </div>

        {/* Phase-specific Content */}
        <AnimatePresence mode="wait">
          {/* Gap Analysis Phase */}
          {activePhase === 'gap-analysis' && (
            <motion.div
              key="gap-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Identified Content Gaps
                </h4>
                <button className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: zsColors.secondary.orange,
                    color: zsColors.neutral.white
                  }}>
                  Run Analysis
                </button>
              </div>

              <div className="space-y-3">
                {contentGaps.map((gap, idx) => (
                  <div key={idx} className="rounded-lg p-4 flex items-start justify-between"
                    style={{
                      backgroundColor: zsColors.neutral.offWhite,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: getSeverityColor(gap.severity) }}>
                          {gap.severity}
                        </span>
                        <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {gap.barrier}
                        </span>
                        <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                          • {gap.channel}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: zsColors.neutral.darkGray }}>
                        {gap.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span style={{ color: zsColors.neutral.gray }}>
                          <strong>{gap.impactedHCPs}</strong> HCPs affected
                        </span>
                        <span style={{ color: zsColors.semantic.error }}>
                          <strong>${(gap.revenueAtRisk / 1e6).toFixed(1)}M</strong> at risk
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium ml-4"
                      style={{
                        backgroundColor: zsColors.primary.navy,
                        color: zsColors.neutral.white
                      }}>
                      Request Asset
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content Factory Phase */}
          {activePhase === 'factory' && (
            <motion.div
              key="factory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Content Development Queue
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                    3 assets in development
                  </span>
                  <Upload size={16} style={{ color: zsColors.secondary.blue }} />
                </div>
              </div>

              <div className="space-y-3">
                {factoryQueue.map((item) => (
                  <div key={item.id} className="rounded-lg p-4"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FileText size={20} style={{ color: zsColors.secondary.blue }} />
                        <div>
                          <span className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                            {item.type}
                          </span>
                          <span className="text-sm ml-2" style={{ color: zsColors.neutral.gray }}>
                            ({item.id})
                          </span>
                        </div>
                      </div>
                      <span className="text-sm px-2 py-1 rounded" style={{
                        backgroundColor: zsColors.secondary.blue + '20',
                        color: zsColors.secondary.blue
                      }}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: zsColors.neutral.gray }}>Target Barrier: {item.barrier}</span>
                        <span style={{ color: zsColors.neutral.darkGray }}>{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: zsColors.neutral.lightGray }}>
                        <motion.div 
                          className="h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 0.5 }}
                          style={{ backgroundColor: zsColors.secondary.blue }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MLR Review Phase */}
          {activePhase === 'mlr-review' && (
            <motion.div
              key="mlr-review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  MLR Review Engine
                </h4>
                <div className="flex items-center gap-3 text-sm">
                  <span style={{ color: zsColors.semantic.success }}>
                    92% First-Pass Approval
                  </span>
                  <Shield size={16} style={{ color: zsColors.primary.navy }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.semantic.success + '10',
                  border: `1px solid ${zsColors.semantic.success}30`
                }}>
                  <p className="text-2xl font-bold" style={{ color: zsColors.semantic.success }}>94%</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>Medical Score</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.semantic.warning + '10',
                  border: `1px solid ${zsColors.semantic.warning}30`
                }}>
                  <p className="text-2xl font-bold" style={{ color: zsColors.semantic.warning }}>91%</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>Legal Score</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.semantic.success + '10',
                  border: `1px solid ${zsColors.semantic.success}30`
                }}>
                  <p className="text-2xl font-bold" style={{ color: zsColors.semantic.success }}>90%</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>Regulatory Score</p>
                </div>
              </div>

              <div className="space-y-3">
                {mlrQueue.map((item) => (
                  <div key={item.id} className="rounded-lg p-4 flex items-center justify-between"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                    <div className="flex items-center gap-3">
                      {item.score >= 90 ? (
                        <CheckCircle size={20} style={{ color: zsColors.semantic.success }} />
                      ) : item.score >= 80 ? (
                        <AlertTriangle size={20} style={{ color: zsColors.semantic.warning }} />
                      ) : (
                        <XCircle size={20} style={{ color: zsColors.semantic.error }} />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          MLR Score: {item.score}% • {item.flags} flags
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded" style={{
                        backgroundColor: item.status === 'Review Complete' 
                          ? zsColors.semantic.success + '20' 
                          : zsColors.semantic.warning + '20',
                        color: item.status === 'Review Complete'
                          ? zsColors.semantic.success
                          : zsColors.semantic.warning
                      }}>
                        {item.status}
                      </span>
                      <button className="p-1.5 rounded hover:bg-gray-100">
                        <Download size={16} style={{ color: zsColors.neutral.gray }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Approval Phase */}
          {activePhase === 'approval' && (
            <motion.div
              key="approval"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Approval Workflow
                </h4>
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: zsColors.semantic.warning }} />
                  <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                    Avg. 48hr turnaround
                  </span>
                </div>
              </div>

              <div className="rounded-lg p-4" style={{
                backgroundColor: zsColors.neutral.offWhite,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <div className="space-y-3">
                  {['Medical', 'Legal', 'Regulatory', 'Marketing'].map((dept, idx) => (
                    <div key={dept} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold`}
                          style={{
                            backgroundColor: idx < 3 ? zsColors.semantic.success : zsColors.neutral.gray
                          }}>
                          {idx < 3 ? '✓' : idx + 1}
                        </div>
                        <span className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {dept} Review
                        </span>
                      </div>
                      <span className="text-sm" style={{
                        color: idx < 3 ? zsColors.semantic.success : zsColors.neutral.gray
                      }}>
                        {idx < 3 ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                  <button className="w-full py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{
                      backgroundColor: zsColors.semantic.success,
                      color: zsColors.neutral.white
                    }}>
                    Approve & Deploy to Production
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Production Phase */}
          {activePhase === 'production' && (
            <motion.div
              key="production"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                  Production Library
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                    892 active assets
                  </span>
                  <Archive size={16} style={{ color: zsColors.secondary.teal }} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <p className="text-xl font-bold" style={{ color: zsColors.secondary.teal }}>1,247</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total Assets</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <p className="text-xl font-bold" style={{ color: zsColors.semantic.success }}>892</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Active</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <p className="text-xl font-bold" style={{ color: zsColors.semantic.warning }}>147</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>In Review</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{
                  backgroundColor: zsColors.neutral.white,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}>
                  <p className="text-xl font-bold" style={{ color: zsColors.semantic.success }}>3.7x</p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Avg ROI</p>
                </div>
              </div>

              <div className="space-y-3">
                {productionAssets.map((asset) => (
                  <div key={asset.id} className="rounded-lg p-4 flex items-center justify-between"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`
                    }}>
                    <div className="flex items-center gap-3">
                      <TrendingUp size={20} style={{ color: getPerformanceColor(asset.performance) }} />
                      <div>
                        <p className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {asset.name}
                        </p>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {asset.barrier} • ROI: {asset.roi}x
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded" style={{
                        backgroundColor: getPerformanceColor(asset.performance) + '20',
                        color: getPerformanceColor(asset.performance)
                      }}>
                        {asset.performance} Performance
                      </span>
                      <button className="p-1.5 rounded hover:bg-gray-100">
                        <RefreshCw size={16} style={{ color: zsColors.neutral.gray }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}