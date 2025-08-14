'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, TrendingDown, TrendingUp, ArrowRight, 
  Info, X, ChevronRight, Activity
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface ImpactItem {
  agent: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  estimatedChange: string;
  metrics: {
    name: string;
    before: string;
    after: string;
    change: string;
  }[];
}

interface DownstreamImpactPreviewProps {
  sourceAgent: string;
  changes: any;
  impacts: Record<string, any>;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DownstreamImpactPreview({
  sourceAgent,
  changes,
  impacts,
  onConfirm,
  onCancel
}: DownstreamImpactPreviewProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return zsColors.secondary.red;
      case 'medium': return zsColors.secondary.orange;
      case 'low': return zsColors.secondary.green;
      default: return zsColors.neutral.gray;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'high': return TrendingDown;
      case 'medium': return Activity;
      case 'low': return TrendingUp;
      default: return Info;
    }
  };

  // Mock detailed impacts
  const detailedImpacts: Record<string, ImpactItem> = {
    'engagement': {
      agent: 'Engagement Planning',
      severity: 'high',
      description: 'Budget allocation will need recalculation based on new microsegments',
      estimatedChange: '+32%',
      metrics: [
        { name: 'Budget Reallocation', before: '$15M', after: '$19.8M', change: '+32%' },
        { name: 'Channel Mix', before: '6 channels', after: '5 channels', change: '-1' },
        { name: 'ROI Projection', before: '3.2x', after: '3.8x', change: '+18.7%' }
      ]
    },
    'content-planning': {
      agent: 'Content Planning',
      severity: 'medium',
      description: 'Content gaps will be re-prioritized for new segments',
      estimatedChange: '+18%',
      metrics: [
        { name: 'Content Gaps', before: '47 assets', after: '55 assets', change: '+17%' },
        { name: 'Priority Changes', before: 'N/A', after: '23 reprioritized', change: 'New' },
        { name: 'Timeline Impact', before: '8 weeks', after: '10 weeks', change: '+2 weeks' }
      ]
    },
    'orchestration': {
      agent: 'Orchestration',
      severity: 'low',
      description: 'Journey sequences will be optimized for new priorities',
      estimatedChange: '+12%',
      metrics: [
        { name: 'Journey Plans', before: '2,847', after: '3,196', change: '+12.3%' },
        { name: 'NBA Updates', before: '8,541', after: '9,022', change: '+5.6%' },
        { name: 'Model Accuracy', before: '92%', after: '91%', change: '-1%' }
      ]
    }
  };

  return (
    <>
      {/* Floating Impact Preview Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowDetails(true)}
        className="fixed bottom-8 left-8 z-40 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        style={{ 
          backgroundColor: zsColors.secondary.orange,
          color: 'white'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle size={16} />
        <span className="text-sm font-medium">Preview Downstream Impact</span>
      </motion.button>

      {/* Impact Preview Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b" style={{ borderColor: zsColors.neutral.lightGray }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                      Downstream Impact Analysis
                    </h2>
                    <p className="text-sm mt-1" style={{ color: zsColors.neutral.gray }}>
                      Changes in {sourceAgent} will affect downstream agents
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} style={{ color: zsColors.neutral.darkGray }} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                {/* Source Changes */}
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                  <h3 className="font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
                    Proposed Changes in {sourceAgent}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(changes || {}).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span style={{ color: zsColors.neutral.gray }}>{key}:</span>
                        <span className="font-medium" style={{ color: zsColors.neutral.darkGray }}>
                          {JSON.stringify(value).substring(0, 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downstream Impacts */}
                <div className="space-y-4">
                  <h3 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                    Impact on Downstream Agents
                  </h3>
                  
                  {Object.entries(impacts || detailedImpacts).map(([agentId, impact]) => {
                    const impactData = detailedImpacts[agentId] || impact;
                    const SeverityIcon = getSeverityIcon(impactData.severity);
                    const isExpanded = expandedAgent === agentId;
                    
                    return (
                      <motion.div
                        key={agentId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg overflow-hidden"
                        style={{ borderColor: zsColors.neutral.lightGray }}
                      >
                        <button
                          onClick={() => setExpandedAgent(isExpanded ? null : agentId)}
                          className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ 
                                  backgroundColor: `${getSeverityColor(impactData.severity)}20`,
                                  color: getSeverityColor(impactData.severity)
                                }}
                              >
                                <SeverityIcon size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                  {impactData.agent || agentId}
                                </h4>
                                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                                  {impactData.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span 
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{ 
                                  backgroundColor: `${getSeverityColor(impactData.severity)}20`,
                                  color: getSeverityColor(impactData.severity)
                                }}
                              >
                                {impactData.estimatedChange}
                              </span>
                              <ChevronRight 
                                size={20} 
                                style={{ 
                                  color: zsColors.neutral.gray,
                                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                                  transition: 'transform 0.2s'
                                }}
                              />
                            </div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && impactData.metrics && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t"
                              style={{ borderColor: zsColors.neutral.lightGray }}
                            >
                              <div className="p-4 space-y-3">
                                {impactData.metrics.map((metric, idx) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                                      {metric.name}
                                    </span>
                                    <div className="flex items-center gap-3 text-sm">
                                      <span style={{ color: zsColors.neutral.darkGray }}>
                                        {metric.before}
                                      </span>
                                      <ArrowRight size={14} style={{ color: zsColors.neutral.gray }} />
                                      <span className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                                        {metric.after}
                                      </span>
                                      <span 
                                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                                        style={{ 
                                          backgroundColor: metric.change.startsWith('+') 
                                            ? `${zsColors.secondary.green}20` 
                                            : `${zsColors.secondary.red}20`,
                                          color: metric.change.startsWith('+') 
                                            ? zsColors.secondary.green 
                                            : zsColors.secondary.red
                                        }}
                                      >
                                        {metric.change}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex items-center justify-between" 
                style={{ borderColor: zsColors.neutral.lightGray }}>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Review impacts carefully before confirming changes
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      onCancel?.();
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: zsColors.neutral.lightGray,
                      color: zsColors.neutral.darkGray
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      onConfirm?.();
                    }}
                    className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                    style={{ 
                      backgroundColor: zsColors.primary.blue
                    }}
                  >
                    Confirm Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}