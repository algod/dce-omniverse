'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  RadialBarChart, RadialBar
} from 'recharts';
import { colors } from '@/lib/design-system/colors';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const triggerData = [
  { trigger: 'Speaker Follow-up', priority: 1, volume: 145, completion: 78, feedback: 85 },
  { trigger: 'Low Rx Fulfillment', priority: 2, volume: 132, completion: 72, feedback: 75 },
  { trigger: 'Positive Coverage', priority: 3, volume: 118, completion: 85, feedback: 88 },
  { trigger: 'Slowed Prescribing', priority: 4, volume: 98, completion: 68, feedback: 70 },
  { trigger: 'Single Rx', priority: 5, volume: 87, completion: 65, feedback: 68 },
  { trigger: 'Email Ready', priority: 6, volume: 75, completion: 82, feedback: 80 },
  { trigger: 'High Potential', priority: 7, volume: 62, completion: 88, feedback: 90 }
];

const prioritizationData = [
  { factor: 'Rep Feedback', weight: 40, color: colors.agents.suggestions },
  { factor: 'Strategic Priority', weight: 40, color: colors.agents.budget },
  { factor: 'Behavior Severity', weight: 20, color: colors.agents.customer }
];

const performanceData = [
  { week: 'W1', generated: 180, accepted: 145, completed: 110 },
  { week: 'W2', generated: 195, accepted: 162, completed: 128 },
  { week: 'W3', generated: 210, accepted: 178, completed: 142 },
  { week: 'W4', generated: 188, accepted: 160, completed: 135 },
  { week: 'W5', generated: 198, accepted: 172, completed: 148 },
  { week: 'W6', generated: 205, accepted: 185, completed: 162 }
];

const feedbackSentiment = [
  { sentiment: 'Very Helpful', count: 285, percentage: 38 },
  { sentiment: 'Helpful', count: 248, percentage: 33 },
  { sentiment: 'Neutral', count: 150, percentage: 20 },
  { sentiment: 'Not Helpful', count: 52, percentage: 7 },
  { sentiment: 'Misleading', count: 15, percentage: 2 }
];

const territoryAdoption = [
  { territory: 'Northeast', suggestions: 145, adoption: 82, avgTime: 2.3 },
  { territory: 'Southeast', suggestions: 132, adoption: 78, avgTime: 2.8 },
  { territory: 'Midwest', suggestions: 125, adoption: 85, avgTime: 2.1 },
  { territory: 'West', suggestions: 118, adoption: 75, avgTime: 3.2 },
  { territory: 'Southwest', suggestions: 110, adoption: 72, avgTime: 3.5 }
];

export function FieldSuggestionsVisualization() {
  const [selectedView, setSelectedView] = useState<'triggers' | 'prioritization' | 'performance' | 'feedback'>('triggers');

  const totalSuggestions = triggerData.reduce((sum, t) => sum + t.volume, 0);
  const avgCompletion = (triggerData.reduce((sum, t) => sum + t.completion, 0) / triggerData.length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'triggers', label: 'Trigger Analysis' },
          { id: 'prioritization', label: 'Prioritization' },
          { id: 'performance', label: 'Performance' },
          { id: 'feedback', label: 'Field Feedback' }
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
        {selectedView === 'triggers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Trigger Configuration & Performance</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={triggerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="trigger" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill={colors.agents.suggestions} name="Volume" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="completion" 
                  stroke={colors.success.main}
                  strokeWidth={2}
                  dot={{ fill: colors.success.main }}
                  name="Completion %"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'prioritization' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">40/40/20 Prioritization</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={prioritizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="weight"
                    label={({ name, value }) => `${value}%`}
                  >
                    {prioritizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3 pl-4">
              <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Current Configuration</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Suggestions/Week:</span>
                    <span className="font-medium text-gray-900">20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiration Period:</span>
                    <span className="font-medium text-gray-900">14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suppression Active:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                </div>
              </div>
              {prioritizationData.map((factor) => (
                <div key={factor.factor} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                    <span className="text-lg font-bold" style={{ color: factor.color }}>
                      {factor.weight}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${factor.weight}%`,
                        backgroundColor: factor.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'performance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Weekly Performance Trends</h4>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="generated" 
                  stroke={colors.agents.suggestions}
                  strokeWidth={2}
                  dot={{ fill: colors.agents.suggestions }}
                  name="Generated"
                />
                <Line 
                  type="monotone" 
                  dataKey="accepted" 
                  stroke={colors.agents.budget}
                  strokeWidth={2}
                  dot={{ fill: colors.agents.budget }}
                  name="Accepted"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke={colors.success.main}
                  strokeWidth={2}
                  dot={{ fill: colors.success.main }}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Acceptance Rate</p>
                <p className="text-lg font-bold text-gray-900">85%</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Completion Rate</p>
                <p className="text-lg font-bold text-gray-900">76%</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Avg Response Time</p>
                <p className="text-lg font-bold text-gray-900">2.8 days</p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'feedback' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Field Feedback Analysis</h4>
            <div className="grid grid-cols-2 gap-4 h-[90%]">
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-3">Sentiment Distribution</h5>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={feedbackSentiment} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="sentiment" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill={colors.agents.suggestions}
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-3">Territory Adoption</h5>
                <div className="space-y-2 h-[85%] overflow-y-auto">
                  {territoryAdoption.map((territory) => (
                    <div key={territory.territory} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{territory.territory}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          territory.adoption >= 80 ? 'bg-green-100 text-green-800' :
                          territory.adoption >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {territory.adoption}% Adoption
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Suggestions:</span>
                          <span className="ml-1 font-medium">{territory.suggestions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Time:</span>
                          <span className="ml-1 font-medium">{territory.avgTime}d</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-orange-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggestion Insights</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedView === 'triggers' && (
                <>
                  <li>• Speaker follow-up trigger has highest completion rate (78%)</li>
                  <li>• Total of {totalSuggestions} suggestions generated this week</li>
                  <li>• Average completion rate: {avgCompletion}% across all triggers</li>
                </>
              )}
              {selectedView === 'prioritization' && (
                <>
                  <li>• Balanced 40/40/20 weighting optimizes field acceptance</li>
                  <li>• Current configuration within 20/week guardrail limit</li>
                  <li>• 14-day expiration prevents suggestion overload</li>
                </>
              )}
              {selectedView === 'performance' && (
                <>
                  <li>• 15% improvement in completion rate over 6 weeks</li>
                  <li>• Week 6 shows highest acceptance rate at 90%</li>
                  <li>• Consistent upward trend in suggestion quality</li>
                </>
              )}
              {selectedView === 'feedback' && (
                <>
                  <li>• 71% of field reps find suggestions helpful or very helpful</li>
                  <li>• Midwest territory leads with 85% adoption rate</li>
                  <li>• Average response time improving across all territories</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}