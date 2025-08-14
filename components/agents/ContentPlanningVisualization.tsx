'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch, Target, AlertTriangle, CheckCircle, 
  Calendar, BarChart3, Layers, TrendingUp 
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

export function ContentPlanningVisualization() {
  const [selectedSegment, setSelectedSegment] = useState('champions');
  
  // Content coverage heatmap data
  const contentCoverage = {
    segments: ['Champions', 'Growers', 'Converters', 'Maintainers', 'Defenders'],
    channels: ['Field', 'Email', 'Virtual', 'Web', 'Conference'],
    coverage: [
      [95, 88, 75, 82, 90], // Champions
      [78, 92, 68, 85, 73], // Growers
      [65, 70, 88, 72, 60], // Converters
      [82, 75, 70, 90, 78], // Maintainers
      [70, 68, 65, 75, 85]  // Defenders
    ]
  };

  // Message theme mapping
  const messageThemes = [
    { theme: 'Clinical Efficacy', segments: ['Champions', 'Growers'], priority: 'High', assets: 42 },
    { theme: 'Safety Profile', segments: ['Converters', 'Defenders'], priority: 'Critical', assets: 38 },
    { theme: 'Patient Outcomes', segments: ['Champions', 'Maintainers'], priority: 'High', assets: 35 },
    { theme: 'Formulary Access', segments: ['All'], priority: 'Medium', assets: 28 },
    { theme: 'Dosing Flexibility', segments: ['Growers', 'Converters'], priority: 'Medium', assets: 22 }
  ];

  // Content gaps by priority
  const contentGaps = [
    { channel: 'Virtual', segment: 'Converters', gap: 12, priority: 'Critical' },
    { channel: 'Email', segment: 'Growers', gap: 9, priority: 'High' },
    { channel: 'Field', segment: 'Defenders', gap: 8, priority: 'High' },
    { channel: 'Web', segment: 'Champions', gap: 7, priority: 'Medium' },
    { channel: 'Conference', segment: 'Maintainers', gap: 6, priority: 'Low' }
  ];

  // MLR timeline
  const mlrTimeline = [
    { week: 'Week 1-2', phase: 'Content Development', assets: 15, status: 'active' },
    { week: 'Week 3-4', phase: 'Initial Review', assets: 12, status: 'pending' },
    { week: 'Week 5-6', phase: 'MLR Submission', assets: 10, status: 'pending' },
    { week: 'Week 7-8', phase: 'Final Approval', assets: 8, status: 'pending' }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return zsColors.secondary.red;
      case 'High': return zsColors.secondary.orange;
      case 'Medium': return zsColors.secondary.orange;
      case 'Low': return zsColors.secondary.green;
      default: return zsColors.neutral.gray;
    }
  };

  const getCoverageColor = (value: number) => {
    if (value >= 85) return zsColors.secondary.green;
    if (value >= 70) return zsColors.secondary.orange;
    if (value >= 50) return zsColors.secondary.orange;
    return zsColors.secondary.red;
  };

  return (
    <div className="space-y-6">
      {/* Content Coverage Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: zsColors.neutral.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Layers size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Content Coverage Heatmap
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: zsColors.neutral.gray }}>Coverage %:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: zsColors.secondary.green }} />
              <span>85-100%</span>
              <div className="w-4 h-4 rounded" style={{ backgroundColor: zsColors.secondary.orange }} />
              <span>70-84%</span>
              <div className="w-4 h-4 rounded" style={{ backgroundColor: zsColors.secondary.orange }} />
              <span>50-69%</span>
              <div className="w-4 h-4 rounded" style={{ backgroundColor: zsColors.secondary.red }} />
              <span>&lt;50%</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-3" style={{ color: zsColors.neutral.darkGray }}>
                  Segment / Channel
                </th>
                {contentCoverage.channels.map(channel => (
                  <th key={channel} className="text-center py-2 px-3 text-sm" 
                      style={{ color: zsColors.neutral.darkGray }}>
                    {channel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contentCoverage.segments.map((segment, sIdx) => (
                <motion.tr 
                  key={segment}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sIdx * 0.05 }}
                  className="border-t"
                  style={{ borderColor: zsColors.neutral.lightGray }}
                >
                  <td className="py-3 px-3 font-medium text-sm" 
                      style={{ color: zsColors.neutral.charcoal }}>
                    {segment}
                  </td>
                  {contentCoverage.coverage[sIdx].map((value, cIdx) => (
                    <td key={cIdx} className="text-center py-3 px-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold text-sm"
                        style={{ backgroundColor: getCoverageColor(value) }}
                      >
                        {value}%
                      </motion.div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Theme Mapping */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Message Theme Mapping
            </h3>
          </div>

          <div className="space-y-3">
            {messageThemes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg border"
                style={{ 
                  borderColor: zsColors.neutral.lightGray,
                  backgroundColor: zsColors.neutral.offWhite
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                    {item.theme}
                  </h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getPriorityColor(item.priority)}20`,
                      color: getPriorityColor(item.priority)
                    }}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: zsColors.neutral.gray }}>
                    Segments: {Array.isArray(item.segments) ? item.segments.join(', ') : item.segments}
                  </span>
                  <span style={{ color: zsColors.primary.blue }}>
                    {item.assets} assets
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Gaps Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} style={{ color: zsColors.secondary.orange }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Priority Content Gaps
            </h3>
          </div>

          <div className="space-y-3">
            {contentGaps.map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: zsColors.neutral.offWhite }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {gap.channel} → {gap.segment}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>
                      Gap: {gap.gap} assets
                    </span>
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${getPriorityColor(gap.priority)}20`,
                        color: getPriorityColor(gap.priority)
                      }}>
                      {gap.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ 
                    backgroundColor: `${getPriorityColor(gap.priority)}20`,
                    color: getPriorityColor(gap.priority)
                  }}>
                  <span className="font-bold text-sm">{gap.gap}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MLR Approval Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: zsColors.neutral.white }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={20} style={{ color: zsColors.primary.navy }} />
          <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
            MLR Approval Timeline
          </h3>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-0.5"
            style={{ backgroundColor: zsColors.neutral.lightGray }} />

          <div className="grid grid-cols-4 gap-4">
            {mlrTimeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: phase.status === 'active' ? zsColors.primary.blue : zsColors.neutral.white,
                    borderColor: phase.status === 'active' ? zsColors.primary.blue : zsColors.neutral.gray
                  }} />

                <div className="pt-12 text-center">
                  <h4 className="font-medium text-sm mb-1" style={{ color: zsColors.neutral.charcoal }}>
                    {phase.week}
                  </h4>
                  <p className="text-xs mb-2" style={{ color: zsColors.neutral.gray }}>
                    {phase.phase}
                  </p>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: phase.status === 'active' 
                        ? `${zsColors.primary.blue}20` 
                        : zsColors.neutral.offWhite
                    }}>
                    {phase.status === 'active' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <CheckCircle size={14} style={{ color: zsColors.primary.blue }} />
                      </motion.div>
                    ) : (
                      <Calendar size={14} style={{ color: zsColors.neutral.gray }} />
                    )}
                    <span className="text-xs font-medium" 
                      style={{ 
                        color: phase.status === 'active' ? zsColors.primary.blue : zsColors.neutral.darkGray 
                      }}>
                      {phase.assets} assets
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}