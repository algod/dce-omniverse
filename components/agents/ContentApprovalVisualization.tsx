'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, Shield, AlertTriangle, CheckCircle2, 
  XCircle, User, Clock, ArrowRight, MessageSquare,
  Upload, Database
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

export function ContentApprovalVisualization() {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [reviewMode, setReviewMode] = useState('auto');
  
  // Approval pipeline
  const approvalPipeline = [
    {
      id: 'MLR-001',
      name: 'Clinical Efficacy Email - Champions',
      score: 98,
      status: 'auto-approved',
      issues: [],
      channel: 'Email',
      segment: 'Champions'
    },
    {
      id: 'MLR-002',
      name: 'Safety Profile Detail Aid',
      score: 88,
      status: 'manual-review',
      issues: ['Missing ISI placement', 'Font size below requirement'],
      channel: 'Field',
      segment: 'Converters'
    },
    {
      id: 'MLR-003',
      name: 'Patient Journey Interactive',
      score: 75,
      status: 'declined',
      issues: ['Unsupported clinical claim', 'Missing reference', 'Competitive comparison not allowed'],
      channel: 'Virtual',
      segment: 'All'
    },
    {
      id: 'MLR-004',
      name: 'Formulary Access Guide',
      score: 96,
      status: 'auto-approved',
      issues: [],
      channel: 'Web',
      segment: 'Maintainers'
    },
    {
      id: 'MLR-005',
      name: 'Dosing Flexibility Brochure',
      score: 91,
      status: 'manual-review',
      issues: ['Verify dosing table accuracy'],
      channel: 'Field',
      segment: 'Growers'
    }
  ];

  // MLR scoring criteria
  const scoringCriteria = [
    { criteria: 'Clinical Claims Accuracy', weight: 30, score: 92 },
    { criteria: 'Safety Information', weight: 25, score: 88 },
    { criteria: 'Regulatory Compliance', weight: 20, score: 95 },
    { criteria: 'Brand Guidelines', weight: 15, score: 90 },
    { criteria: 'Fair Balance', weight: 10, score: 85 }
  ];

  // Approval statistics
  const approvalStats = {
    total: 147,
    autoApproved: 106,
    manualReview: 26,
    declined: 15,
    avgReviewTime: 4.2,
    veevaSync: 100
  };

  // Human review queue
  const reviewQueue = [
    { id: 'MLR-002', priority: 'High', reviewer: 'Dr. Sarah Chen', eta: '2 hours' },
    { id: 'MLR-005', priority: 'Medium', reviewer: 'Dr. Michael Ross', eta: '4 hours' },
    { id: 'MLR-007', priority: 'Low', reviewer: 'Pending Assignment', eta: '8 hours' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'auto-approved': return zsColors.secondary.green;
      case 'manual-review': return zsColors.secondary.orange;
      case 'declined': return zsColors.secondary.red;
      default: return zsColors.neutral.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'auto-approved': return CheckCircle2;
      case 'manual-review': return User;
      case 'declined': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return zsColors.secondary.green;
    if (score >= 85) return zsColors.secondary.orange;
    return zsColors.secondary.red;
  };

  return (
    <div className="space-y-6">
      {/* Approval Overview */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <p className="text-3xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
            {approvalStats.total}
          </p>
          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total Assets</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${zsColors.secondary.green}10` }}
        >
          <p className="text-3xl font-bold" style={{ color: zsColors.secondary.green }}>
            {approvalStats.autoApproved}
          </p>
          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Auto-Approved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${zsColors.secondary.orange}10` }}
        >
          <p className="text-3xl font-bold" style={{ color: zsColors.secondary.orange }}>
            {approvalStats.manualReview}
          </p>
          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Manual Review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${zsColors.secondary.red}10` }}
        >
          <p className="text-3xl font-bold" style={{ color: zsColors.secondary.red }}>
            {approvalStats.declined}
          </p>
          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Declined</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${zsColors.primary.blue}10` }}
        >
          <div className="flex items-center justify-center gap-1">
            <Database size={20} style={{ color: zsColors.primary.blue }} />
            <p className="text-2xl font-bold" style={{ color: zsColors.primary.blue }}>
              {approvalStats.veevaSync}%
            </p>
          </div>
          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Veeva Sync</p>
        </motion.div>
      </div>

      {/* MLR Review Engine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: zsColors.neutral.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              MLR Review Engine
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {['auto', 'manual', 'declined'].map((mode) => (
              <button
                key={mode}
                onClick={() => setReviewMode(mode)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: reviewMode === mode 
                    ? zsColors.primary.blue 
                    : zsColors.neutral.lightGray,
                  color: reviewMode === mode 
                    ? zsColors.neutral.white 
                    : zsColors.neutral.darkGray
                }}
              >
                {mode === 'auto' ? 'Auto-Approved' : mode === 'manual' ? 'Manual Review' : 'Declined'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {approvalPipeline
            .filter(asset => {
              if (reviewMode === 'auto') return asset.status === 'auto-approved';
              if (reviewMode === 'manual') return asset.status === 'manual-review';
              if (reviewMode === 'declined') return asset.status === 'declined';
              return true;
            })
            .map((asset, index) => {
              const StatusIcon = getStatusIcon(asset.status);
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border cursor-pointer transition-all"
                  style={{ 
                    borderColor: selectedAsset === index 
                      ? getStatusColor(asset.status) 
                      : zsColors.neutral.lightGray,
                    backgroundColor: selectedAsset === index 
                      ? `${getStatusColor(asset.status)}05` 
                      : zsColors.neutral.offWhite
                  }}
                  onClick={() => setSelectedAsset(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon size={16} style={{ color: getStatusColor(asset.status) }} />
                        <span className="text-xs font-mono px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: zsColors.neutral.lightGray,
                            color: zsColors.neutral.darkGray
                          }}>
                          {asset.id}
                        </span>
                        <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                          {asset.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span style={{ color: zsColors.neutral.gray }}>
                          Channel: <span style={{ color: zsColors.neutral.darkGray }}>{asset.channel}</span>
                        </span>
                        <span style={{ color: zsColors.neutral.gray }}>
                          Segment: <span style={{ color: zsColors.neutral.darkGray }}>{asset.segment}</span>
                        </span>
                        {asset.issues.length > 0 && (
                          <span style={{ color: zsColors.secondary.orange }}>
                            {asset.issues.length} issue{asset.issues.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {asset.issues.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {asset.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <AlertTriangle size={12} style={{ color: zsColors.secondary.orange }} />
                              <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                {issue}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-center ml-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${getScoreColor(asset.score)}20`,
                          color: getScoreColor(asset.score)
                        }}>
                        <span className="text-lg font-bold">{asset.score}</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>MLR Score</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MLR Scoring Criteria */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FileCheck size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              MLR Scoring Criteria
            </h3>
          </div>

          <div className="space-y-3">
            {scoringCriteria.map((criteria, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: zsColors.neutral.charcoal }}>
                    {criteria.criteria}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>
                      Weight: {criteria.weight}%
                    </span>
                    <span className="font-bold" 
                      style={{ color: getScoreColor(criteria.score) }}>
                      {criteria.score}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: zsColors.neutral.lightGray }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${criteria.score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: getScoreColor(criteria.score) }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg"
            style={{ backgroundColor: `${zsColors.primary.blue}10` }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                Weighted Average Score
              </span>
              <span className="text-xl font-bold" style={{ color: zsColors.primary.blue }}>
                90.4
              </span>
            </div>
          </div>
        </motion.div>

        {/* Human Review Queue */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <User size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Human Review Queue
            </h3>
          </div>

          <div className="space-y-3">
            {reviewQueue.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: zsColors.neutral.offWhite }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: zsColors.neutral.lightGray,
                        color: zsColors.neutral.darkGray
                      }}>
                      {item.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ 
                        backgroundColor: item.priority === 'High' 
                          ? `${zsColors.secondary.red}20` 
                          : item.priority === 'Medium' 
                          ? `${zsColors.secondary.orange}20` 
                          : `${zsColors.secondary.green}20`,
                        color: item.priority === 'High' 
                          ? zsColors.secondary.red 
                          : item.priority === 'Medium' 
                          ? zsColors.secondary.orange 
                          : zsColors.secondary.green
                      }}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    Reviewer: <span style={{ color: zsColors.neutral.darkGray }}>{item.reviewer}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: zsColors.neutral.gray }} />
                  <span className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                    {item.eta}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg border"
            style={{ borderColor: zsColors.primary.blue }}>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: zsColors.primary.blue }} />
              <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                Human reviewers can ask clarifying questions and request modifications
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Veeva PromoMats Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: `${zsColors.primary.blue}05` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload size={20} style={{ color: zsColors.primary.blue }} />
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Veeva PromoMats Integration
              </h3>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                Real-time synchronization with content management system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: zsColors.secondary.green }}>
                106
              </p>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Synced Today</p>
            </div>
            <ArrowRight size={20} style={{ color: zsColors.neutral.gray }} />
            <div className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: zsColors.neutral.white }}>
              <div className="flex items-center gap-2">
                <Database size={16} style={{ color: zsColors.primary.blue }} />
                <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                  Veeva PromoMats
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}