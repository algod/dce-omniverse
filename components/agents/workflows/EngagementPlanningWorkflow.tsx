'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Calendar } from 'lucide-react';
import { AgentWorkflowLayout, ModuleConfig } from './AgentWorkflowLayout';
import { engagementPlanningWorkflow } from '@/lib/workflows/engagement-planning-workflow';
import { zsColors } from '@/lib/design-system/zs-colors';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';

const moduleConfigs: Record<string, ModuleConfig> = {
  attribution: {
    id: 'attribution',
    name: 'Impact Attribution',
    icon: BarChart3,
    color: { primary: '#3B82F6', light: '#60A5FA' },
    description: 'Analyze historical channel performance by microsegment'
  },
  response: {
    id: 'response',
    name: 'Response Curves',
    icon: TrendingUp,
    color: { primary: '#8B5CF6', light: '#A78BFA' },
    description: 'Generate response curves for channel × microsegment'
  },
  optimization: {
    id: 'optimization',
    name: 'ROI Optimization',
    icon: DollarSign,
    color: { primary: '#10B981', light: '#34D399' },
    description: 'Run marketing mix analytics with constraints'
  },
  allocation: {
    id: 'allocation',
    name: 'Budget Allocation',
    icon: PieChart,
    color: { primary: '#F59E0B', light: '#FBBF24' },
    description: 'Optimize allocation across channels and segments'
  },
  planning: {
    id: 'planning',
    name: 'Engagement Planning',
    icon: Calendar,
    color: { primary: '#EF4444', light: '#F87171' },
    description: 'Generate quarterly HCP-level engagement plans'
  }
};

interface EngagementPlanningWorkflowProps {
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
    budget?: number;
  };
}

export function EngagementPlanningWorkflow({ brandContext }: EngagementPlanningWorkflowProps) {
  const [workflow, setWorkflow] = useState(engagementPlanningWorkflow);

  const generateModuleResults = (moduleId: string) => {
    const results: Record<string, any> = {
      attribution: {
        channelPerformance: [
          { channel: 'Field', roi: 3.2, impact: 45 },
          { channel: 'Digital', roi: 2.8, impact: 25 },
          { channel: 'Email', roi: 2.1, impact: 15 },
          { channel: 'Conferences', roi: 1.9, impact: 10 },
          { channel: 'Speaker Programs', roi: 1.7, impact: 5 }
        ],
        segmentResponse: [
          { segment: 'Champions', field: 85, digital: 72, email: 65 },
          { segment: 'Growers', field: 78, digital: 80, email: 70 },
          { segment: 'Converters', field: 70, digital: 75, email: 68 },
          { segment: 'Maintainers', field: 65, digital: 60, email: 55 },
          { segment: 'Defenders', field: 55, digital: 50, email: 45 }
        ]
      },
      response: {
        curves: [
          { spend: 0, response: 0 },
          { spend: 100000, response: 15 },
          { spend: 300000, response: 35 },
          { spend: 500000, response: 48 },
          { spend: 700000, response: 58 },
          { spend: 900000, response: 64 },
          { spend: 1100000, response: 68 },
          { spend: 1300000, response: 70 },
          { spend: 1500000, response: 71 }
        ],
        saturation: {
          Field: 82,
          Digital: 65,
          Email: 45,
          Conferences: 38,
          'Speaker Programs': 30
        }
      },
      optimization: {
        scenarios: [
          { name: 'Current', roi: 2.8, budget: 15000000 },
          { name: 'Optimized', roi: 3.2, budget: 15000000 },
          { name: 'Conservative', roi: 2.5, budget: 12000000 },
          { name: 'Aggressive', roi: 3.5, budget: 18000000 }
        ],
        mROI: [
          { channel: 'Digital', current: 2.8, optimal: 3.5 },
          { channel: 'Field', current: 3.2, optimal: 3.4 },
          { channel: 'Email', current: 2.1, optimal: 2.6 },
          { channel: 'Conferences', current: 1.9, optimal: 2.2 },
          { channel: 'Speaker Programs', current: 1.7, optimal: 2.0 }
        ]
      },
      allocation: {
        distribution: [
          { name: 'Field', value: 6000000, percentage: 40 },
          { name: 'Digital', value: 3750000, percentage: 25 },
          { name: 'Email', value: 2250000, percentage: 15 },
          { name: 'Conferences', value: 1500000, percentage: 10 },
          { name: 'Speaker Programs', value: 1500000, percentage: 10 }
        ],
        segmentAllocation: [
          { segment: 'Champions', budget: 4500000 },
          { segment: 'Growers', budget: 3750000 },
          { segment: 'Converters', budget: 3000000 },
          { segment: 'Maintainers', budget: 2250000 },
          { segment: 'Defenders', budget: 1500000 }
        ]
      },
      planning: {
        quarterlyPlan: [
          { quarter: 'Q1', field: 2000, digital: 3500, email: 5000 },
          { quarter: 'Q2', field: 2200, digital: 3800, email: 5500 },
          { quarter: 'Q3', field: 2100, digital: 3600, email: 5200 },
          { quarter: 'Q4', field: 2300, digital: 4000, email: 5800 }
        ],
        engagementFrequency: {
          Champions: 3.2,
          Growers: 2.8,
          Converters: 2.3,
          Maintainers: 1.8,
          Defenders: 1.2
        },
        coverage: {
          total_hcps: 2847,
          covered: 2476,
          coverage_rate: 87
        }
      }
    };

    return results[moduleId];
  };

  const renderModuleVisualization = (moduleId: string, results: any) => {
    if (!results) return null;

    switch (moduleId) {
      case 'attribution':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Channel Performance & ROI
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={results.channelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill={moduleConfigs.attribution.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Segment Response Rates
              </h4>
              <div className="space-y-2">
                {results.segmentResponse.map((seg: any) => (
                  <div key={seg.segment} className="grid grid-cols-4 gap-2 text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>{seg.segment}</span>
                    <div className="flex items-center gap-1">
                      <span>Field:</span>
                      <span className="font-medium" style={{ color: moduleConfigs.attribution.color.primary }}>
                        {seg.field}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Digital:</span>
                      <span className="font-medium" style={{ color: moduleConfigs.attribution.color.primary }}>
                        {seg.digital}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Email:</span>
                      <span className="font-medium" style={{ color: moduleConfigs.attribution.color.primary }}>
                        {seg.email}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'response':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Response Curves by Spend
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={results.curves}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="spend" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                  <YAxis label={{ value: 'Response %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Area 
                    type="monotone" 
                    dataKey="response" 
                    stroke={moduleConfigs.response.color.primary}
                    fill={moduleConfigs.response.color.light}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Channel Saturation Analysis
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(results.saturation).map(([channel, value]: [string, any]) => (
                  <div key={channel} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>{channel}</span>
                      <span style={{ color: value > 70 ? zsColors.secondary.orange : moduleConfigs.response.color.primary }}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: value > 70 ? zsColors.secondary.orange : moduleConfigs.response.color.primary 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                ROI Optimization Scenarios
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={results.scenarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill={moduleConfigs.optimization.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Marginal ROI by Channel
              </h4>
              <div className="space-y-2">
                {results.mROI.map((item: any) => (
                  <div key={item.channel} className="flex items-center justify-between p-2 rounded"
                    style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                      {item.channel}
                    </span>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Current</p>
                        <p className="font-medium">{item.current}x</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Optimal</p>
                        <p className="font-medium" style={{ color: moduleConfigs.optimization.color.primary }}>
                          {item.optimal}x
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'allocation':
        const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
        
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Budget Distribution by Channel
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={results.distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {results.distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${(value/1000000).toFixed(1)}M`} />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Microsegment Allocation
              </h4>
              <div className="space-y-2">
                {results.segmentAllocation.map((seg: any) => (
                  <div key={seg.segment} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                      {seg.segment}
                    </span>
                    <span className="font-medium" style={{ color: moduleConfigs.allocation.color.primary }}>
                      ${(seg.budget/1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'planning':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Quarterly Engagement Plan
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={results.quarterlyPlan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="field" fill="#3B82F6" name="Field" />
                  <Bar dataKey="digital" fill="#8B5CF6" name="Digital" />
                  <Bar dataKey="email" fill="#10B981" name="Email" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Engagement Frequency
                </h4>
                <div className="space-y-1">
                  {Object.entries(results.engagementFrequency).map(([segment, freq]: [string, any]) => (
                    <div key={segment} className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>{segment}</span>
                      <span className="font-medium" style={{ color: moduleConfigs.planning.color.primary }}>
                        {freq} touches/month
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Coverage Metrics
                </h4>
                <div className="text-center p-4 rounded-lg" 
                  style={{ backgroundColor: `${moduleConfigs.planning.color.primary}10` }}>
                  <p className="text-2xl font-bold" style={{ color: moduleConfigs.planning.color.primary }}>
                    {results.coverage.coverage_rate}%
                  </p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {results.coverage.covered} of {results.coverage.total_hcps} HCPs
                  </p>
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
      agentName="Engagement Planning Agent"
      agentIcon={TrendingUp}
      agentColor={{ primary: '#3B82F6', light: '#60A5FA' }}
      moduleConfigs={moduleConfigs}
      brandContext={brandContext}
      renderModuleVisualization={renderModuleVisualization}
      generateModuleResults={generateModuleResults}
    />
  );
}