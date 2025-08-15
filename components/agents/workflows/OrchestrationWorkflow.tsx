'use client';

import { useState } from 'react';
import { Brain, Map, Cpu, Zap, Target, BarChart3 } from 'lucide-react';
import { AgentWorkflowLayout, ModuleConfig } from './AgentWorkflowLayout';
import { aiOrchestrationWorkflow } from '@/lib/workflows/ai-orchestration-workflow';
import { zsColors } from '@/lib/design-system/zs-colors';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Sankey, AreaChart, Area
} from 'recharts';

const moduleConfigs: Record<string, ModuleConfig> = {
  journey: {
    id: 'journey',
    name: 'Journey Mapping',
    icon: Map,
    color: { primary: '#F97316', light: '#FB923C' },
    description: 'Design customer journey frameworks'
  },
  training: {
    id: 'training',
    name: 'Model Training',
    icon: Cpu,
    color: { primary: '#8B5CF6', light: '#A78BFA' },
    description: 'Train BERT model on customer behavior'
  },
  optimization: {
    id: 'optimization',
    name: 'Sequence Optimization',
    icon: Zap,
    color: { primary: '#3B82F6', light: '#60A5FA' },
    description: 'Use genetic algorithms for optimization'
  },
  nba: {
    id: 'nba',
    name: 'NBA Generation',
    icon: Target,
    color: { primary: '#10B981', light: '#34D399' },
    description: 'Create explainable recommendations'
  },
  validation: {
    id: 'validation',
    name: 'Performance Validation',
    icon: BarChart3,
    color: { primary: '#EF4444', light: '#F87171' },
    description: 'Validate and measure effectiveness'
  }
};

interface OrchestrationWorkflowProps {
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
  };
}

export function OrchestrationWorkflow({ brandContext }: OrchestrationWorkflowProps) {
  const [workflow, setWorkflow] = useState(aiOrchestrationWorkflow);

  const generateModuleResults = (moduleId: string) => {
    const results: Record<string, any> = {
      journey: {
        templates: [
          { name: 'Awareness', touchpoints: 3, duration: '2 weeks', conversion: 15 },
          { name: 'Consideration', touchpoints: 5, duration: '4 weeks', conversion: 35 },
          { name: 'Trial', touchpoints: 4, duration: '3 weeks', conversion: 55 },
          { name: 'Adoption', touchpoints: 6, duration: '6 weeks', conversion: 75 },
          { name: 'Loyalty', touchpoints: 4, duration: 'Ongoing', conversion: 85 }
        ],
        touchpointMap: [
          { stage: 'Awareness', email: 2, field: 1, digital: 3 },
          { stage: 'Consideration', email: 3, field: 2, digital: 4 },
          { stage: 'Trial', email: 2, field: 3, digital: 2 },
          { stage: 'Adoption', email: 4, field: 4, digital: 3 },
          { stage: 'Loyalty', email: 3, field: 2, digital: 2 }
        ],
        decisionPoints: 12,
        optimizationGoals: ['Conversion Rate', 'Engagement Score', 'Time to Adoption', 'ROI']
      },
      training: {
        modelMetrics: {
          accuracy: 89.2,
          precision: 87.5,
          recall: 91.3,
          f1Score: 89.4
        },
        trainingProgress: [
          { epoch: 1, loss: 0.68, accuracy: 72 },
          { epoch: 5, loss: 0.42, accuracy: 81 },
          { epoch: 10, loss: 0.31, accuracy: 85 },
          { epoch: 15, loss: 0.24, accuracy: 87 },
          { epoch: 20, loss: 0.19, accuracy: 89 }
        ],
        featureImportance: [
          { feature: 'Past Prescribing', importance: 0.28 },
          { feature: 'Engagement History', importance: 0.22 },
          { feature: 'Barrier Score', importance: 0.18 },
          { feature: 'Channel Preference', importance: 0.15 },
          { feature: 'Specialty', importance: 0.10 },
          { feature: 'Geography', importance: 0.07 }
        ],
        validationScore: 87.8
      },
      optimization: {
        geneticProgress: [
          { generation: 0, fitness: 0.45 },
          { generation: 10, fitness: 0.62 },
          { generation: 20, fitness: 0.74 },
          { generation: 30, fitness: 0.81 },
          { generation: 40, fitness: 0.86 },
          { generation: 50, fitness: 0.89 }
        ],
        sequenceMetrics: {
          avgLength: 4.2,
          efficiency: 87,
          conversionLift: 32,
          frictionReduction: 28
        },
        optimalSequences: [
          { sequence: 'Email → Field → Digital → Field', conversion: 82, hcps: 145 },
          { sequence: 'Digital → Email → Field → Email', conversion: 78, hcps: 234 },
          { sequence: 'Field → Email → Digital', conversion: 75, hcps: 189 },
          { sequence: 'Email → Digital → Field', conversion: 72, hcps: 167 }
        ]
      },
      nba: {
        recommendations: [
          { action: 'Send Clinical Update Email', confidence: 92, impact: 'High', hcps: 234 },
          { action: 'Schedule Field Visit', confidence: 88, impact: 'High', hcps: 189 },
          { action: 'Digital Campaign Enrollment', confidence: 85, impact: 'Medium', hcps: 312 },
          { action: 'Speaker Program Invitation', confidence: 82, impact: 'High', hcps: 87 },
          { action: 'Follow-up Call', confidence: 79, impact: 'Medium', hcps: 156 }
        ],
        explainability: {
          topFactors: [
            { factor: 'Recent Email Engagement', weight: 0.24 },
            { factor: 'Time Since Last Contact', weight: 0.19 },
            { factor: 'Prescribing Trend', weight: 0.17 },
            { factor: 'Barrier Resolution', weight: 0.15 },
            { factor: 'Peer Influence', weight: 0.13 },
            { factor: 'Content Affinity', weight: 0.12 }
          ]
        },
        personalizationScore: 86,
        totalNBAs: 1456
      },
      validation: {
        performanceMetrics: [
          { metric: 'Journey Completion', actual: 68, predicted: 65, variance: 4.6 },
          { metric: 'Conversion Rate', actual: 42, predicted: 45, variance: -6.7 },
          { metric: 'Engagement Score', actual: 78, predicted: 76, variance: 2.6 },
          { metric: 'Time to Action', actual: 3.2, predicted: 3.5, variance: -8.6 }
        ],
        abTestResults: {
          control: { conversion: 32, engagement: 65, satisfaction: 72 },
          treatment: { conversion: 42, engagement: 78, satisfaction: 85 }
        },
        roiImpact: {
          baseline: 2.8,
          optimized: 3.7,
          lift: 32,
          confidence: 95
        },
        statisticalSignificance: 0.98
      }
    };

    return results[moduleId];
  };

  const renderModuleVisualization = (moduleId: string, results: any) => {
    if (!results) return null;

    switch (moduleId) {
      case 'journey':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Customer Journey Templates
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={results.templates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversion" fill={moduleConfigs.journey.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Touchpoint Distribution by Stage
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={results.touchpointMap}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="email" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Area type="monotone" dataKey="field" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="digital" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${moduleConfigs.journey.color.primary}10` }}>
                <p className="text-2xl font-bold" style={{ color: moduleConfigs.journey.color.primary }}>
                  {results.decisionPoints}
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Decision Points</p>
              </div>
              <div>
                <h5 className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.gray }}>
                  Optimization Goals
                </h5>
                <div className="space-y-1">
                  {results.optimizationGoals.map((goal: string) => (
                    <div key={goal} className="text-xs flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: moduleConfigs.journey.color.primary }} />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(results.modelMetrics).map(([metric, value]: [string, any]) => (
                <div key={metric} className="text-center p-2 rounded" 
                  style={{ backgroundColor: zsColors.neutral.offWhite }}>
                  <p className="text-lg font-bold" style={{ color: moduleConfigs.training.color.primary }}>
                    {value}%
                  </p>
                  <p className="text-xs capitalize" style={{ color: zsColors.neutral.gray }}>
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Training Progress
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={results.trainingProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="loss" stroke="#EF4444" name="Loss" />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10B981" name="Accuracy" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Feature Importance
              </h4>
              <div className="space-y-2">
                {results.featureImportance.map((feat: any) => (
                  <div key={feat.feature}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: zsColors.neutral.gray }}>{feat.feature}</span>
                      <span style={{ color: moduleConfigs.training.color.primary }}>
                        {(feat.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${feat.importance * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: moduleConfigs.training.color.primary }}
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
                Genetic Algorithm Progress
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={results.geneticProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="generation" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="fitness" stroke={moduleConfigs.optimization.color.primary} 
                    fill={moduleConfigs.optimization.color.light} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(results.sequenceMetrics).map(([metric, value]: [string, any]) => (
                <div key={metric} className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                  <p className="text-xs capitalize" style={{ color: zsColors.neutral.gray }}>
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-lg font-bold" style={{ color: moduleConfigs.optimization.color.primary }}>
                    {typeof value === 'number' && metric !== 'avgLength' ? `${value}%` : value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Optimal Engagement Sequences
              </h4>
              <div className="space-y-2">
                {results.optimalSequences.map((seq: any, index: number) => (
                  <div key={index} className="p-3 rounded border" 
                    style={{ borderColor: zsColors.neutral.lightGray }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {seq.sequence}
                        </p>
                        <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                          {seq.hcps} HCPs
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: moduleConfigs.optimization.color.primary }}>
                          {seq.conversion}%
                        </p>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Conversion</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'nba':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${moduleConfigs.nba.color.primary}10` }}>
                <p className="text-2xl font-bold" style={{ color: moduleConfigs.nba.color.primary }}>
                  {results.totalNBAs}
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total NBAs</p>
              </div>
              <div className="text-center p-4 rounded-lg" 
                style={{ backgroundColor: `${moduleConfigs.nba.color.primary}10` }}>
                <p className="text-2xl font-bold" style={{ color: moduleConfigs.nba.color.primary }}>
                  {results.personalizationScore}%
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Personalization</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Top Recommendations
              </h4>
              <div className="space-y-2">
                {results.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {rec.action}
                        </p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                            {rec.hcps} HCPs
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{
                            backgroundColor: rec.impact === 'High' ? '#FEE2E2' : '#FEF3C7',
                            color: rec.impact === 'High' ? '#EF4444' : '#F59E0B'
                          }}>
                            {rec.impact} Impact
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: moduleConfigs.nba.color.primary }}>
                          {rec.confidence}%
                        </p>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Explainability Factors
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={results.explainability.topFactors} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <YAxis dataKey="factor" type="category" width={120} />
                  <Tooltip formatter={(value: any) => `${(value * 100).toFixed(0)}%`} />
                  <Bar dataKey="weight" fill={moduleConfigs.nba.color.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Performance Validation
              </h4>
              <div className="space-y-2">
                {results.performanceMetrics.map((metric: any) => (
                  <div key={metric.metric} className="p-3 rounded" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: zsColors.neutral.charcoal }}>
                        {metric.metric}
                      </span>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Predicted</p>
                          <p className="font-medium">{metric.predicted}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Actual</p>
                          <p className="font-medium" style={{ color: moduleConfigs.validation.color.primary }}>
                            {metric.actual}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Variance</p>
                          <p className="font-medium" style={{ 
                            color: metric.variance > 0 ? zsColors.secondary.green : zsColors.secondary.orange 
                          }}>
                            {metric.variance > 0 ? '+' : ''}{metric.variance}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  A/B Test Results
                </h4>
                <div className="space-y-2">
                  {['conversion', 'engagement', 'satisfaction'].map(metric => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-xs capitalize" style={{ color: zsColors.neutral.gray }}>
                        {metric}
                      </span>
                      <div className="flex gap-3">
                        <span className="text-xs">
                          Control: {results.abTestResults.control[metric]}%
                        </span>
                        <span className="text-xs font-medium" style={{ color: moduleConfigs.validation.color.primary }}>
                          Treatment: {results.abTestResults.treatment[metric]}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  ROI Impact
                </h4>
                <div className="text-center p-4 rounded-lg" 
                  style={{ backgroundColor: `${zsColors.secondary.green}10` }}>
                  <p className="text-2xl font-bold" style={{ color: zsColors.secondary.green }}>
                    +{results.roiImpact.lift}%
                  </p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>ROI Lift</p>
                  <div className="flex justify-between mt-3 text-xs">
                    <span>Baseline: {results.roiImpact.baseline}x</span>
                    <span>Optimized: {results.roiImpact.optimized}x</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: zsColors.neutral.gray }}>
                    {results.roiImpact.confidence}% Confidence
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
      agentName="AI Orchestration Agent"
      agentIcon={Brain}
      agentColor={{ primary: '#F97316', light: '#FB923C' }}
      moduleConfigs={moduleConfigs}
      brandContext={brandContext}
      renderModuleVisualization={renderModuleVisualization}
      generateModuleResults={generateModuleResults}
    />
  );
}