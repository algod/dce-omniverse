'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart, FunnelChart, Funnel, LabelList
} from 'recharts';
import { colors } from '@/lib/design-system/colors';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const channelData = [
  { channel: 'Field Sales', budget: 5000000, roi: 3.2, mroi: 2.8, saturation: 65 },
  { channel: 'Email', budget: 1500000, roi: 4.5, mroi: 3.9, saturation: 45 },
  { channel: 'Digital/Web', budget: 2000000, roi: 5.1, mroi: 4.2, saturation: 35 },
  { channel: 'Speaker Programs', budget: 3000000, roi: 2.8, mroi: 2.1, saturation: 78 },
  { channel: 'Conferences', budget: 2500000, roi: 2.5, mroi: 1.9, saturation: 82 },
  { channel: 'Direct Mail', budget: 1000000, roi: 1.8, mroi: 1.2, saturation: 90 }
];

const responseCurveData = [
  { spend: 0, response: 0 },
  { spend: 100000, response: 15 },
  { spend: 500000, response: 35 },
  { spend: 1000000, response: 50 },
  { spend: 2000000, response: 65 },
  { spend: 3000000, response: 75 },
  { spend: 4000000, response: 82 },
  { spend: 5000000, response: 87 },
  { spend: 6000000, response: 90 },
  { spend: 7000000, response: 92 }
];

const quarterlyData = [
  { quarter: 'Q1', field: 1200000, email: 375000, digital: 500000, speaker: 750000 },
  { quarter: 'Q2', field: 1300000, email: 375000, digital: 500000, speaker: 750000 },
  { quarter: 'Q3', field: 1250000, email: 375000, digital: 500000, speaker: 750000 },
  { quarter: 'Q4', field: 1250000, email: 375000, digital: 500000, speaker: 750000 }
];

const roiWaterfallData = [
  { name: 'Base Sales', value: 10000000, fill: colors.gray[400] },
  { name: 'Field Impact', value: 3500000, fill: colors.agents.customer },
  { name: 'Digital Impact', value: 2200000, fill: colors.agents.budget },
  { name: 'Email Impact', value: 1800000, fill: colors.agents.content },
  { name: 'Speaker Impact', value: 1500000, fill: colors.success.main },
  { name: 'Total Sales', value: 19000000, fill: colors.primary.main }
];

export function BudgetPlanningVisualization() {
  const [selectedView, setSelectedView] = useState<'allocation' | 'roi' | 'response' | 'quarterly'>('allocation');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const totalBudget = channelData.reduce((sum, c) => sum + c.budget, 0);

  const pieData = channelData.map(c => ({
    name: c.channel,
    value: c.budget,
    percentage: ((c.budget / totalBudget) * 100).toFixed(1)
  }));

  const channelColors = [
    colors.agents.customer,
    colors.agents.budget,
    colors.agents.content,
    colors.agents.orchestration,
    colors.agents.suggestions,
    colors.agents.copilot
  ];

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'allocation', label: 'Budget Allocation' },
          { id: 'roi', label: 'ROI Analysis' },
          { id: 'response', label: 'Response Curves' },
          { id: 'quarterly', label: 'Quarterly Plan' }
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
        {selectedView === 'allocation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Channel Budget Allocation</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                    onClick={(data) => setSelectedChannel(data.name)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={channelColors[index % channelColors.length]}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 pl-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Total Budget</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${(totalBudget / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              {channelData.map((channel, index) => (
                <div
                  key={channel.channel}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedChannel === channel.channel 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedChannel(channel.channel)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: channelColors[index] }}
                      />
                      <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      ${(channel.budget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>ROI: {channel.roi}x</span>
                    <span>Saturation: {channel.saturation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'roi' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">ROI & mROI by Channel</h4>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="roi" name="ROI" fill={colors.agents.budget} radius={[8, 8, 0, 0]} />
                <Bar yAxisId="left" dataKey="mroi" name="mROI" fill={colors.agents.customer} radius={[8, 8, 0, 0]} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="saturation" 
                  name="Saturation %" 
                  stroke={colors.warning.main}
                  strokeWidth={2}
                  dot={{ fill: colors.warning.main }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'response' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Channel Response Curves</h4>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={responseCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="spend" 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  label={{ value: 'Investment', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Response Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'response') return `${value}%`;
                    return `$${(value / 1000000).toFixed(1)}M`;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="response" 
                  stroke={colors.agents.budget}
                  fill={colors.agents.budget}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.agents.budget} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.agents.budget} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Optimal Range</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Diminishing Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Saturated</span>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'quarterly' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Quarterly Budget Distribution</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
                <Legend />
                <Bar dataKey="field" name="Field Sales" stackId="a" fill={colors.agents.customer} />
                <Bar dataKey="email" name="Email" stackId="a" fill={colors.agents.budget} />
                <Bar dataKey="digital" name="Digital" stackId="a" fill={colors.agents.content} />
                <Bar dataKey="speaker" name="Speaker Programs" stackId="a" fill={colors.agents.orchestration} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Optimization Insights */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-green-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Optimization Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedView === 'allocation' && (
                <>
                  <li>• Shift $500K from Conferences to Digital for +12% ROI improvement</li>
                  <li>• Email channel shows highest mROI (3.9x) - consider 20% budget increase</li>
                  <li>• Direct Mail approaching saturation - reduce by 30%</li>
                </>
              )}
              {selectedView === 'roi' && (
                <>
                  <li>• Digital/Web channel has best ROI (5.1x) with low saturation</li>
                  <li>• Speaker Programs and Conferences showing diminishing returns</li>
                  <li>• Field Sales maintains steady ROI despite 65% saturation</li>
                </>
              )}
              {selectedView === 'response' && (
                <>
                  <li>• Optimal spend range: $1M - $3M per channel</li>
                  <li>• Response plateaus after $4M investment</li>
                  <li>• Marginal returns drop significantly after $5M</li>
                </>
              )}
              {selectedView === 'quarterly' && (
                <>
                  <li>• Q2 shows highest allocation - align with product launch</li>
                  <li>• Maintain consistent digital presence across all quarters</li>
                  <li>• Consider Q4 boost for year-end formulary decisions</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Warning for saturated channels */}
      {selectedChannel && (channelData.find(c => c.channel === selectedChannel)?.saturation || 0) > 75 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
            <div className="text-sm">
              <p className="font-medium text-yellow-900">Channel Saturation Alert</p>
              <p className="text-yellow-700 mt-1">
                {selectedChannel} is {channelData.find(c => c.channel === selectedChannel)?.saturation}% saturated. 
                Consider reallocating budget to channels with higher marginal returns.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}