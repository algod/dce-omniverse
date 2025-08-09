'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Channel } from '@/lib/types/pharma';

interface BudgetOptimizationChartProps {
  channels: Channel[];
  scenarios?: Array<{
    name: string;
    totalBudget: number;
    totalROI: number;
    allocation: Record<string, number>;
  }>;
}

export function BudgetOptimizationChart({ channels, scenarios }: BudgetOptimizationChartProps) {
  // Response curves data
  const responseCurveData = channels.flatMap(channel => 
    channel.responseCurve.points.map(point => ({
      channel: channel.name,
      spend: point.spend / 1000000,
      response: point.response / 1000000,
      roi: point.response / point.spend
    }))
  );

  // ROI comparison data
  const roiData = channels.map(c => ({
    name: c.name,
    currentROI: c.roi,
    marginalROI: c.mroi,
    saturation: (c.actualSpend / c.responseCurve.saturationPoint) * 100
  }));

  // Budget allocation pie chart
  const allocationData = channels.map(c => ({
    name: c.name,
    value: c.proposedBudget / 1000000,
    current: c.currentBudget / 1000000
  }));

  // Scenario comparison
  const scenarioData = scenarios?.map(s => ({
    name: s.name,
    budget: s.totalBudget / 1000000,
    roi: s.totalROI,
    efficiency: (s.totalROI / s.totalBudget) * 1000000
  })) || [];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const formatCurrency = (value: number) => `$${value.toFixed(1)}M`;

  return (
    <div className="space-y-8">
      {/* Response Curves */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Channel Response Curves</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={responseCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="spend" 
              label={{ value: 'Spend ($M)', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Response ($M)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {channels.map((channel, index) => (
              <Line
                key={channel.id}
                type="monotone"
                dataKey="response"
                data={responseCurveData.filter(d => d.channel === channel.name)}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                name={channel.name}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROI Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">ROI & Saturation Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'ROI', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Saturation (%)', angle: 90, position: 'insideRight' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="currentROI" fill="#8b5cf6" name="Current ROI" />
            <Bar yAxisId="left" dataKey="marginalROI" fill="#3b82f6" name="Marginal ROI" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="saturation" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Saturation %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Proposed Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value?.toFixed(1) || 0}M`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Current vs Proposed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Current vs Proposed Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allocationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                label={{ value: 'Budget ($M)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="current" fill="#94a3b8" name="Current" />
              <Bar dataKey="value" fill="#3b82f6" name="Proposed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Comparison */}
      {scenarioData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Budget ($M)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Total ROI', angle: 90, position: 'insideRight' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="budget" fill="#8b5cf6" name="Budget ($M)" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="roi" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Total ROI"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}