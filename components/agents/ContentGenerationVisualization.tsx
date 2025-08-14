'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, FileText, Copy, CheckCircle2, 
  AlertTriangle, Layers, BarChart3, Target,
  Zap, Shield
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

export function ContentGenerationVisualization() {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [generationPhase, setGenerationPhase] = useState('blueprint');
  
  // Asset generation pipeline
  const generationPipeline = [
    { 
      id: 'CG-001',
      name: 'Clinical Efficacy Email Series',
      blueprint: 'Master Template A',
      variants: 5,
      segments: ['Champions', 'Growers'],
      channel: 'Email',
      quality: 92,
      compliance: 98,
      status: 'completed'
    },
    {
      id: 'CG-002', 
      name: 'Safety Profile Detail Aid',
      blueprint: 'Master Template B',
      variants: 3,
      segments: ['Converters', 'Defenders'],
      channel: 'Field',
      quality: 88,
      compliance: 95,
      status: 'completed'
    },
    {
      id: 'CG-003',
      name: 'Patient Journey Interactive',
      blueprint: 'Master Template C',
      variants: 4,
      segments: ['All'],
      channel: 'Virtual',
      quality: 85,
      compliance: 92,
      status: 'in_progress'
    },
    {
      id: 'CG-004',
      name: 'Formulary Access Guide',
      blueprint: 'Master Template D',
      variants: 2,
      segments: ['Maintainers'],
      channel: 'Web',
      quality: 90,
      compliance: 96,
      status: 'pending'
    }
  ];

  // Blueprint to variant mapping
  const blueprintVariants = {
    'Master Template A': [
      { name: 'Champions Focus', modifications: 12, quality: 94 },
      { name: 'Growers Emphasis', modifications: 15, quality: 91 },
      { name: 'Data-Heavy Version', modifications: 18, quality: 89 },
      { name: 'Visual-First Design', modifications: 10, quality: 92 },
      { name: 'Mobile Optimized', modifications: 8, quality: 93 }
    ]
  };

  // Generation phases
  const phases = [
    { id: 'blueprint', name: 'Blueprint Creation', icon: FileText, duration: '2h', status: 'completed' },
    { id: 'variants', name: 'Variant Generation', icon: Copy, duration: '4h', status: 'completed' },
    { id: 'compliance', name: 'Compliance Check', icon: Shield, duration: '1h', status: 'active' },
    { id: 'optimization', name: 'Channel Optimization', icon: Zap, duration: '2h', status: 'pending' },
    { id: 'tagging', name: 'Asset Tagging', icon: Layers, duration: '30m', status: 'pending' }
  ];

  // Content quality metrics
  const qualityMetrics = [
    { metric: 'Message Clarity', score: 92, benchmark: 85 },
    { metric: 'Brand Consistency', score: 88, benchmark: 90 },
    { metric: 'Regulatory Compliance', score: 95, benchmark: 95 },
    { metric: 'Visual Appeal', score: 86, benchmark: 80 },
    { metric: 'Call-to-Action', score: 90, benchmark: 85 }
  ];

  // Generation statistics
  const stats = [
    { label: 'Blueprints Created', value: '12', change: '+3', positive: true },
    { label: 'Variants Generated', value: '142', change: '+47', positive: true },
    { label: 'Avg Quality Score', value: '8.2/10', change: '+0.5', positive: true },
    { label: 'Compliance Rate', value: '94%', change: '+2%', positive: true }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return zsColors.secondary.green;
      case 'in_progress': case 'active': return zsColors.primary.blue;
      case 'pending': return zsColors.neutral.gray;
      default: return zsColors.neutral.gray;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return zsColors.secondary.green;
    if (score >= 80) return zsColors.secondary.orange;
    if (score >= 70) return zsColors.secondary.orange;
    return zsColors.secondary.red;
  };

  return (
    <div className="space-y-6">
      {/* Generation Statistics */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl p-4"
            style={{ backgroundColor: zsColors.neutral.white }}
          >
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                {stat.value}
              </p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full`}
                style={{ 
                  backgroundColor: stat.positive ? `${zsColors.secondary.green}20` : `${zsColors.secondary.red}20`,
                  color: stat.positive ? zsColors.secondary.green : zsColors.secondary.red
                }}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generation Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: zsColors.neutral.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Content Generation Pipeline
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: phase.status === 'active' 
                    ? `${zsColors.primary.blue}20` 
                    : zsColors.neutral.offWhite,
                  color: phase.status === 'active' 
                    ? zsColors.primary.blue 
                    : zsColors.neutral.gray
                }}
                whileHover={{ scale: 1.05 }}
              >
                <phase.icon size={12} />
                <span>{phase.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {generationPipeline.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{ 
                borderColor: selectedAsset === index 
                  ? zsColors.primary.blue 
                  : zsColors.neutral.lightGray,
                backgroundColor: selectedAsset === index 
                  ? `${zsColors.primary.blue}05` 
                  : zsColors.neutral.offWhite
              }}
              onClick={() => setSelectedAsset(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: zsColors.neutral.lightGray,
                        color: zsColors.neutral.darkGray
                      }}>
                      {asset.id}
                    </span>
                    <h4 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                      {asset.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${getStatusColor(asset.status)}20`,
                        color: getStatusColor(asset.status)
                      }}>
                      {asset.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <span style={{ color: zsColors.neutral.gray }}>Blueprint: </span>
                      <span style={{ color: zsColors.neutral.darkGray }}>{asset.blueprint}</span>
                    </div>
                    <div>
                      <span style={{ color: zsColors.neutral.gray }}>Variants: </span>
                      <span style={{ color: zsColors.primary.blue }}>{asset.variants}</span>
                    </div>
                    <div>
                      <span style={{ color: zsColors.neutral.gray }}>Channel: </span>
                      <span style={{ color: zsColors.neutral.darkGray }}>{asset.channel}</span>
                    </div>
                    <div>
                      <span style={{ color: zsColors.neutral.gray }}>Segments: </span>
                      <span style={{ color: zsColors.neutral.darkGray }}>
                        {Array.isArray(asset.segments) ? asset.segments.join(', ') : asset.segments}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 ml-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getQualityColor(asset.quality)}20`,
                        color: getQualityColor(asset.quality)
                      }}>
                      <span className="text-lg font-bold">{asset.quality}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>Quality</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getQualityColor(asset.compliance)}20`,
                        color: getQualityColor(asset.compliance)
                      }}>
                      <span className="text-lg font-bold">{asset.compliance}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>Compliance</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blueprint to Variants */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Copy size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Blueprint → Variants
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border-2 border-dashed"
              style={{ borderColor: zsColors.primary.blue, backgroundColor: `${zsColors.primary.blue}05` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                  Master Template A
                </span>
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${zsColors.primary.blue}20`,
                    color: zsColors.primary.blue
                  }}>
                  Blueprint
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Layers size={20} style={{ color: zsColors.neutral.gray }} />
              </motion.div>
            </div>

            {blueprintVariants['Master Template A'].map((variant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg"
                style={{ backgroundColor: zsColors.neutral.offWhite }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {variant.name}
                    </p>
                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                      {variant.modifications} modifications
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getQualityColor(variant.quality)}20`,
                        color: getQualityColor(variant.quality)
                      }}>
                      <span className="text-sm font-bold">{variant.quality}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Content Quality Metrics
            </h3>
          </div>

          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: zsColors.neutral.charcoal }}>
                    {metric.metric}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>
                      Benchmark: {metric.benchmark}
                    </span>
                    <span className="font-bold" 
                      style={{ color: metric.score >= metric.benchmark ? zsColors.secondary.green : zsColors.secondary.orange }}>
                      {metric.score}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: zsColors.neutral.lightGray }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ 
                      backgroundColor: metric.score >= metric.benchmark 
                        ? zsColors.secondary.green 
                        : zsColors.secondary.orange 
                    }}
                  />
                  <div className="absolute inset-y-0 w-0.5"
                    style={{ 
                      left: `${metric.benchmark}%`,
                      backgroundColor: zsColors.neutral.darkGray
                    }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: `${zsColors.secondary.green}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                  Overall Quality Score
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  Exceeds benchmark requirements
                </p>
              </div>
              <div className="text-2xl font-bold" style={{ color: zsColors.secondary.green }}>
                8.2/10
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}