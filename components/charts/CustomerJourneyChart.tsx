'use client';

import { Sankey, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { CustomerJourney, NextBestAction } from '@/lib/types/pharma';
import { ChevronRight, Target, TrendingUp, Users } from 'lucide-react';

interface CustomerJourneyChartProps {
  journeys: CustomerJourney[];
  nextBestActions?: NextBestAction[];
  modelPerformance?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
}

export function CustomerJourneyChart({ journeys, nextBestActions, modelPerformance }: CustomerJourneyChartProps) {
  // Journey Stage Progression
  const stageData = ['Awareness', 'Consideration', 'Trial', 'Adoption', 'Advocacy'].map(stage => {
    const completed = journeys.filter(j => 
      j.stages.find(s => s.name === stage)?.status === 'Completed'
    ).length;
    const inProgress = journeys.filter(j => 
      j.stages.find(s => s.name === stage)?.status === 'In Progress'
    ).length;
    const notStarted = journeys.filter(j => 
      j.stages.find(s => s.name === stage)?.status === 'Not Started'
    ).length;
    
    return {
      stage,
      completed,
      inProgress,
      notStarted,
      total: completed + inProgress
    };
  });

  // Journey Conversion Funnel
  const funnelData = stageData.map((s, index) => ({
    stage: s.stage,
    value: s.completed + s.inProgress,
    conversion: index > 0 ? ((s.completed + s.inProgress) / (stageData[index - 1].completed + stageData[index - 1].inProgress) * 100).toFixed(1) : '100'
  }));

  // NBA Impact Distribution
  const nbaImpactData = nextBestActions?.map(nba => ({
    action: nba.action.substring(0, 20),
    impact: nba.expectedImpact,
    confidence: nba.confidence * 100,
    channel: nba.channel
  })) || [];

  // Model Performance Radar Data
  const performanceData = modelPerformance ? [
    { metric: 'Accuracy', value: modelPerformance.accuracy * 100 },
    { metric: 'Precision', value: modelPerformance.precision * 100 },
    { metric: 'Recall', value: modelPerformance.recall * 100 },
    { metric: 'F1 Score', value: modelPerformance.f1Score * 100 },
    { metric: 'AUC', value: modelPerformance.auc * 100 }
  ] : [];

  // Journey Velocity (time in each stage)
  const velocityData = journeys.slice(0, 10).map((j, index) => {
    const stages = j.stages.filter(s => s.completionDate);
    const avgDays = stages.length > 0 
      ? stages.reduce((sum, s) => {
          if (s.startDate && s.completionDate) {
            const days = (new Date(s.completionDate).getTime() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }
          return sum;
        }, 0) / stages.length
      : 0;
    
    return {
      hcp: `HCP-${index + 1}`,
      velocity: avgDays,
      probability: j.completionProbability * 100
    };
  });

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Journey Funnel Visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Customer Journey Funnel</h3>
        <div className="space-y-3">
          {funnelData.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: COLORS[index] }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{stage.value} HCPs</span>
                  {index > 0 && (
                    <span className="text-sm font-semibold" style={{ color: parseFloat(stage.conversion) >= 70 ? '#10b981' : '#f59e0b' }}>
                      {stage.conversion}% conversion
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="absolute h-full rounded-lg transition-all duration-500"
                  style={{ 
                    width: `${(stage.value / journeys.length) * 100}%`,
                    backgroundColor: COLORS[index],
                    opacity: 0.8
                  }}
                />
              </div>
              {index < funnelData.length - 1 && (
                <div className="flex justify-center my-2">
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stage Progression Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Stage Progression Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Number of HCPs', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="In Progress" />
            <Bar dataKey="notStarted" stackId="a" fill="#e5e7eb" name="Not Started" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* NBA Impact Analysis */}
      {nbaImpactData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Next Best Action Impact</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="confidence" 
                  name="Confidence" 
                  label={{ value: 'Confidence (%)', position: 'insideBottom', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="impact" 
                  name="Impact" 
                  label={{ value: 'Expected Impact (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Actions" data={nbaImpactData.slice(0, 20)} fill="#3b82f6">
                  {nbaImpactData.slice(0, 20).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Journey Velocity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hcp" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Days per Stage', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Completion Probability (%)', angle: 90, position: 'insideRight' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="velocity" fill="#8b5cf6" name="Avg Days/Stage" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Completion Probability"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Model Performance Metrics */}
      {performanceData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">BERT Model Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {performanceData.map((metric, index) => (
              <div key={metric.metric} className="text-center">
                <div className="text-sm text-gray-600 mb-1">{metric.metric}</div>
                <div className="text-2xl font-bold" style={{ color: metric.value >= 85 ? '#10b981' : '#3b82f6' }}>
                  {metric.value.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Fix TypeScript import for ComposedChart
import { ComposedChart } from 'recharts';