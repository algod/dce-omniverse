'use client';

import { useState } from 'react';
import { FileText, Database, Search, CheckCircle2, Calendar } from 'lucide-react';
import { AgentWorkflowLayout, ModuleConfig } from './AgentWorkflowLayout';
import { contentPlanningWorkflow } from '@/lib/workflows/content-planning-workflow';
import { zsColors } from '@/lib/design-system/zs-colors';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, Sankey
} from 'recharts';

const moduleConfigs: Record<string, ModuleConfig> = {
  inventory: {
    id: 'inventory',
    name: 'Inventory Analysis',
    icon: Database,
    color: { primary: '#8B5CF6', light: '#A78BFA' },
    description: 'Assess current content asset library'
  },
  mapping: {
    id: 'mapping',
    name: 'Microsegment Mapping',
    icon: Search,
    color: { primary: '#3B82F6', light: '#60A5FA' },
    description: 'Map content to customer microsegments and barriers'
  },
  gaps: {
    id: 'gaps',
    name: 'Gap Assessment',
    icon: FileText,
    color: { primary: '#EF4444', light: '#F87171' },
    description: 'Identify content gaps by message theme and channel'
  },
  quality: {
    id: 'quality',
    name: 'Quality Review',
    icon: CheckCircle2,
    color: { primary: '#10B981', light: '#34D399' },
    description: 'Evaluate quality of existing content assets'
  },
  strategy: {
    id: 'strategy',
    name: 'Planning Strategy',
    icon: Calendar,
    color: { primary: '#F59E0B', light: '#FBBF24' },
    description: 'Develop content creation and MLR approval timeline'
  }
};

interface ContentPlanningWorkflowProps {
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
  };
}

export function ContentPlanningWorkflow({ brandContext }: ContentPlanningWorkflowProps) {
  const [workflow, setWorkflow] = useState(contentPlanningWorkflow);

  const generateModuleResults = (moduleId: string) => {
    const results: Record<string, any> = {
      inventory: {
        totalAssets: 847,
        assetsByType: [
          { type: 'Clinical Data', count: 234, percentage: 28 },
          { type: 'Patient Materials', count: 189, percentage: 22 },
          { type: 'HCP Education', count: 156, percentage: 18 },
          { type: 'Case Studies', count: 134, percentage: 16 },
          { type: 'Guidelines', count: 89, percentage: 11 },
          { type: 'Other', count: 45, percentage: 5 }
        ],
        assetsByChannel: [
          { channel: 'Email', assets: 312 },
          { channel: 'Web', assets: 267 },
          { channel: 'Field', assets: 178 },
          { channel: 'Print', assets: 90 }
        ],
        ageDistribution: [
          { age: '< 3 months', count: 156 },
          { age: '3-6 months', count: 234 },
          { age: '6-12 months', count: 289 },
          { age: '> 12 months', count: 168 }
        ]
      },
      mapping: {
        segmentCoverage: [
          { segment: 'Champions', covered: 85, total: 100 },
          { segment: 'Growers', covered: 72, total: 100 },
          { segment: 'Converters', covered: 45, total: 100 },
          { segment: 'Maintainers', covered: 68, total: 100 },
          { segment: 'Defenders', covered: 38, total: 100 }
        ],
        barrierAlignment: [
          { barrier: 'Formulary', assets: 45, needed: 80 },
          { barrier: 'Referral Pathways', assets: 38, needed: 75 },
          { barrier: 'Side Effects', assets: 52, needed: 70 },
          { barrier: 'Insurance', assets: 28, needed: 60 },
          { barrier: 'Diagnostic', assets: 15, needed: 40 }
        ],
        messageThemes: {
          'Clinical Efficacy': 78,
          'Safety Profile': 65,
          'Patient Outcomes': 82,
          'Cost Effectiveness': 45,
          'Administration': 58
        }
      },
      gaps: {
        gapMatrix: [
          { theme: 'Clinical Efficacy', email: 3, web: 2, field: 5, print: 1 },
          { theme: 'Safety Profile', email: 5, web: 4, field: 2, print: 3 },
          { theme: 'Patient Outcomes', email: 2, web: 3, field: 4, print: 2 },
          { theme: 'Cost Effectiveness', email: 8, web: 7, field: 9, print: 6 },
          { theme: 'Administration', email: 4, web: 5, field: 3, print: 4 }
        ],
        priorityGaps: [
          { gap: 'Cost content for Converters', severity: 'High', assets_needed: 12 },
          { gap: 'Formulary materials for Champions', severity: 'High', assets_needed: 8 },
          { gap: 'Side effects for Defenders', severity: 'Medium', assets_needed: 6 },
          { gap: 'Digital content for Growers', severity: 'Medium', assets_needed: 10 },
          { gap: 'Print materials update', severity: 'Low', assets_needed: 4 }
        ],
        totalGaps: 45,
        criticalGaps: 12
      },
      quality: {
        qualityScores: [
          { category: 'Excellent', count: 234, percentage: 28 },
          { category: 'Good', count: 356, percentage: 42 },
          { category: 'Fair', count: 178, percentage: 21 },
          { category: 'Poor', count: 79, percentage: 9 }
        ],
        mlrCompliance: {
          compliant: 678,
          needs_update: 134,
          non_compliant: 35
        },
        engagementMetrics: [
          { metric: 'Open Rate', email: 45, web: 62, field: 78 },
          { metric: 'Engagement', email: 38, web: 55, field: 82 },
          { metric: 'Conversion', email: 12, web: 18, field: 35 }
        ],
        refreshCandidates: 89
      },
      strategy: {
        timeline: [
          { month: 'Month 1', create: 12, review: 8, retire: 3 },
          { month: 'Month 2', create: 15, review: 12, retire: 5 },
          { month: 'Month 3', create: 10, review: 15, retire: 4 },
          { month: 'Month 4', create: 8, review: 10, retire: 2 },
          { month: 'Month 5', create: 6, review: 8, retire: 2 },
          { month: 'Month 6', create: 4, review: 6, retire: 1 }
        ],
        plannedAssets: {
          new_creation: 55,
          updates: 89,
          retirement: 17,
          mlr_submissions: 144
        },
        veevaIntegration: {
          ready: 42,
          in_progress: 28,
          planned: 85
        }
      }
    };

    return results[moduleId];
  };

  const renderModuleVisualization = (moduleId: string, results: any) => {
    if (!results) return null;

    switch (moduleId) {
      case 'inventory':
        const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];
        
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Content Asset Distribution
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie
                      data={results.assetsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, percentage }) => `${percentage}%`}
                    >
                      {results.assetsByType.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  <p className="text-2xl font-bold" style={{ color: moduleConfigs.inventory.color.primary }}>
                    {results.totalAssets}
                  </p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total Assets</p>
                  <div className="space-y-1 mt-3">
                    {results.assetsByChannel.map((ch: any) => (
                      <div key={ch.channel} className="flex justify-between text-xs">
                        <span style={{ color: zsColors.neutral.gray }}>{ch.channel}</span>
                        <span className="font-medium">{ch.assets}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Asset Age Distribution
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={results.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={moduleConfigs.inventory.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Microsegment Content Coverage
              </h4>
              <div className="space-y-2">
                {results.segmentCoverage.map((seg: any) => (
                  <div key={seg.segment}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: zsColors.neutral.gray }}>{seg.segment}</span>
                      <span style={{ color: moduleConfigs.mapping.color.primary }}>
                        {seg.covered}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${seg.covered}%` }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: seg.covered > 70 
                            ? moduleConfigs.mapping.color.primary 
                            : zsColors.secondary.orange 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Barrier Content Alignment
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={results.barrierAlignment} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="barrier" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="assets" fill={moduleConfigs.mapping.color.light} name="Current" />
                  <Bar dataKey="needed" fill={moduleConfigs.mapping.color.primary} name="Needed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Message Theme Coverage
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(results.messageThemes).map(([theme, coverage]: [string, any]) => (
                  <div key={theme} className="p-2 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>{theme}</p>
                    <p className="text-lg font-bold" style={{ 
                      color: coverage > 70 ? zsColors.secondary.green : moduleConfigs.mapping.color.primary 
                    }}>
                      {coverage}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gaps':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${moduleConfigs.gaps.color.primary}10` }}>
                <p className="text-2xl font-bold" style={{ color: moduleConfigs.gaps.color.primary }}>
                  {results.totalGaps}
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total Gaps</p>
              </div>
              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${zsColors.secondary.orange}10` }}>
                <p className="text-2xl font-bold" style={{ color: zsColors.secondary.orange }}>
                  {results.criticalGaps}
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Critical Gaps</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Content Gap Heat Map
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Theme</th>
                      <th className="text-center p-2">Email</th>
                      <th className="text-center p-2">Web</th>
                      <th className="text-center p-2">Field</th>
                      <th className="text-center p-2">Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.gapMatrix.map((row: any) => (
                      <tr key={row.theme}>
                        <td className="p-2" style={{ color: zsColors.neutral.gray }}>{row.theme}</td>
                        <td className="text-center p-2">
                          <span className="px-2 py-1 rounded" style={{
                            backgroundColor: row.email > 5 ? '#FEE2E2' : row.email > 3 ? '#FEF3C7' : '#D1FAE5',
                            color: row.email > 5 ? '#EF4444' : row.email > 3 ? '#F59E0B' : '#10B981'
                          }}>
                            {row.email}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="px-2 py-1 rounded" style={{
                            backgroundColor: row.web > 5 ? '#FEE2E2' : row.web > 3 ? '#FEF3C7' : '#D1FAE5',
                            color: row.web > 5 ? '#EF4444' : row.web > 3 ? '#F59E0B' : '#10B981'
                          }}>
                            {row.web}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="px-2 py-1 rounded" style={{
                            backgroundColor: row.field > 5 ? '#FEE2E2' : row.field > 3 ? '#FEF3C7' : '#D1FAE5',
                            color: row.field > 5 ? '#EF4444' : row.field > 3 ? '#F59E0B' : '#10B981'
                          }}>
                            {row.field}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className="px-2 py-1 rounded" style={{
                            backgroundColor: row.print > 5 ? '#FEE2E2' : row.print > 3 ? '#FEF3C7' : '#D1FAE5',
                            color: row.print > 5 ? '#EF4444' : row.print > 3 ? '#F59E0B' : '#10B981'
                          }}>
                            {row.print}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Priority Gaps
              </h4>
              <div className="space-y-2">
                {results.priorityGaps.map((gap: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded"
                    style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                        {gap.gap}
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {gap.assets_needed} assets needed
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded" style={{
                      backgroundColor: gap.severity === 'High' ? '#FEE2E2' : gap.severity === 'Medium' ? '#FEF3C7' : '#D1FAE5',
                      color: gap.severity === 'High' ? '#EF4444' : gap.severity === 'Medium' ? '#F59E0B' : '#10B981'
                    }}>
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'quality':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Content Quality Distribution
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={results.qualityScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={moduleConfigs.quality.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  MLR Compliance Status
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Compliant</span>
                    <span className="font-medium">{results.mlrCompliance.compliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Needs Update</span>
                    <span className="font-medium" style={{ color: zsColors.secondary.orange }}>
                      {results.mlrCompliance.needs_update}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Non-Compliant</span>
                    <span className="font-medium" style={{ color: zsColors.secondary.red }}>
                      {results.mlrCompliance.non_compliant}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${moduleConfigs.quality.color.primary}10` }}>
                <p className="text-2xl font-bold" style={{ color: moduleConfigs.quality.color.primary }}>
                  {results.refreshCandidates}
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  Assets Need Refresh
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Channel Engagement Metrics
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={results.engagementMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="email" fill="#8B5CF6" />
                  <Bar dataKey="web" fill="#3B82F6" />
                  <Bar dataKey="field" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Content Development Timeline
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={results.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="create" stroke="#10B981" name="Create" />
                  <Line type="monotone" dataKey="review" stroke="#3B82F6" name="Review" />
                  <Line type="monotone" dataKey="retire" stroke="#EF4444" name="Retire" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Planned Actions
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>New Creation</span>
                      <span className="font-bold" style={{ color: zsColors.secondary.green }}>
                        {results.plannedAssets.new_creation}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Updates</span>
                      <span className="font-bold" style={{ color: zsColors.primary.blue }}>
                        {results.plannedAssets.updates}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>MLR Submissions</span>
                      <span className="font-bold" style={{ color: moduleConfigs.strategy.color.primary }}>
                        {results.plannedAssets.mlr_submissions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Veeva PromoMats Integration
                </h4>
                <div className="space-y-2">
                  {Object.entries(results.veevaIntegration).map(([status, count]: [string, any]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-xs capitalize" style={{ color: zsColors.neutral.gray }}>
                        {status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / 155) * 100}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: moduleConfigs.strategy.color.primary }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AgentWorkflowLayout
      workflow={workflow}
      onWorkflowUpdate={setWorkflow}
      agentName="Content Planning Agent"
      agentIcon={FileText}
      agentColor={{ primary: '#8B5CF6', light: '#A78BFA' }}
      moduleConfigs={moduleConfigs}
      brandContext={brandContext}
      renderModuleVisualization={renderModuleVisualization}
      generateModuleResults={generateModuleResults}
    />
  );
}