'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, Sankey, Treemap,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { colors } from '@/lib/design-system/colors';
import { Network, Brain, TrendingUp, Zap } from 'lucide-react';

const journeyData = [
  { stage: 'Awareness', hcps: 500, conversion: 100, time: 2.5 },
  { stage: 'Interest', hcps: 400, conversion: 85, time: 3.2 },
  { stage: 'Consideration', hcps: 340, conversion: 75, time: 4.8 },
  { stage: 'Trial', hcps: 255, conversion: 65, time: 6.5 },
  { stage: 'Adoption', hcps: 165, conversion: 80, time: 8.2 },
  { stage: 'Advocacy', hcps: 132, conversion: 90, time: 12.0 }
];

const nbaRecommendations = [
  { hcp: 'Dr. Smith', currentStage: 'Interest', nextAction: 'Send efficacy data', confidence: 92, impact: 'High' },
  { hcp: 'Dr. Johnson', currentStage: 'Consideration', nextAction: 'Schedule peer discussion', confidence: 87, impact: 'High' },
  { hcp: 'Dr. Williams', currentStage: 'Awareness', nextAction: 'Email clinical study', confidence: 78, impact: 'Medium' },
  { hcp: 'Dr. Brown', currentStage: 'Trial', nextAction: 'Provide patient resources', confidence: 85, impact: 'High' },
  { hcp: 'Dr. Davis', currentStage: 'Consideration', nextAction: 'Field visit - barrier discussion', confidence: 90, impact: 'Very High' }
];

const modelPerformance = [
  { metric: 'Accuracy', value: 89.2, benchmark: 85 },
  { metric: 'Precision', value: 91.5, benchmark: 88 },
  { metric: 'Recall', value: 86.8, benchmark: 82 },
  { metric: 'F1 Score', value: 89.1, benchmark: 85 },
  { metric: 'AUC-ROC', value: 0.94, benchmark: 0.90 }
];

const channelSequence = [
  { sequence: 'Email → Field → Web', conversions: 145, avgTime: 18, success: 72 },
  { sequence: 'Field → Email → Speaker', conversions: 132, avgTime: 22, success: 68 },
  { sequence: 'Web → Email → Field', conversions: 118, avgTime: 25, success: 65 },
  { sequence: 'Speaker → Field → Email', conversions: 98, avgTime: 15, success: 78 },
  { sequence: 'Email → Web → Field', conversions: 87, avgTime: 20, success: 70 }
];

const featureImportance = [
  { feature: 'Previous Prescriptions', importance: 0.24 },
  { feature: 'Barrier Type', importance: 0.21 },
  { feature: 'Engagement History', importance: 0.18 },
  { feature: 'Specialty Match', importance: 0.15 },
  { feature: 'Referral Network', importance: 0.12 },
  { feature: 'Digital Engagement', importance: 0.10 }
];

export function OrchestrationVisualization() {
  const [selectedView, setSelectedView] = useState<'journey' | 'nba' | 'model' | 'sequences'>('journey');

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'journey', label: 'Customer Journey' },
          { id: 'nba', label: 'Next Best Action' },
          { id: 'model', label: 'Model Performance' },
          { id: 'sequences', label: 'Channel Sequences' }
        ].map(view => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              selectedView === view.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg p-4" style={{ height: '400px' }}>
        {selectedView === 'journey' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Customer Journey Funnel</h4>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart data={journeyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="hcps" 
                  fill={colors.agents.orchestration} 
                  stroke={colors.agents.orchestration}
                  fillOpacity={0.3}
                  name="HCPs in Stage"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke={colors.success.main}
                  strokeWidth={2}
                  dot={{ fill: colors.success.main }}
                  name="Conversion %"
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="time" 
                  fill={colors.agents.budget}
                  opacity={0.5}
                  name="Avg Days"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'nba' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Next Best Action Recommendations</h4>
            <div className="space-y-3 h-[90%] overflow-y-auto">
              {nbaRecommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{rec.hcp}</h5>
                      <p className="text-sm text-gray-600">Current: {rec.currentStage}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      rec.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                      rec.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{rec.nextAction}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="text-sm font-semibold text-gray-900">{rec.confidence}%</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'model' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">BERT Model Performance</h4>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={modelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill={colors.agents.orchestration} name="Actual" />
                  <Bar dataKey="benchmark" fill={colors.gray[400]} name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Feature Importance</h4>
              <div className="space-y-2">
                {featureImportance.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-10 text-right">
                        {(feature.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Brain className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-green-900">Model Status</p>
                    <p className="text-xs text-green-700 mt-1">
                      Last trained: 2 hours ago<br />
                      Training samples: 125,000<br />
                      Validation accuracy: 89.2%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'sequences' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Optimal Channel Sequences</h4>
            <div className="space-y-3 h-[90%]">
              {channelSequence.map((seq, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Network size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{seq.sequence}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      seq.success >= 75 ? 'bg-green-100 text-green-800' :
                      seq.success >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {seq.success}% Success
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-semibold text-gray-900">{seq.conversions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Time</p>
                      <p className="font-semibold text-gray-900">{seq.avgTime} days</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Efficiency</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="font-semibold text-gray-900">
                          {(seq.conversions / seq.avgTime).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Network className="text-indigo-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Orchestration Insights</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedView === 'journey' && (
                <>
                  <li>• 33% overall conversion rate from Awareness to Advocacy</li>
                  <li>• Largest drop-off at Consideration stage (25% loss)</li>
                  <li>• Average journey completion time: 36.8 days</li>
                </>
              )}
              {selectedView === 'nba' && (
                <>
                  <li>• Field visits show highest impact for Consideration stage HCPs</li>
                  <li>• Email engagement most effective for Interest stage</li>
                  <li>• Average confidence score: 86.4% across all recommendations</li>
                </>
              )}
              {selectedView === 'model' && (
                <>
                  <li>• Model exceeds all benchmark metrics by average of 4.3%</li>
                  <li>• Previous prescriptions strongest predictor (24% importance)</li>
                  <li>• Weekly retraining maintains &gt;89% accuracy</li>
                </>
              )}
              {selectedView === 'sequences' && (
                <>
                  <li>• Speaker → Field → Email shows highest success rate (78%)</li>
                  <li>• Multi-channel sequences outperform single channel by 42%</li>
                  <li>• Optimal sequence length: 3 touchpoints over 15-20 days</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}