'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { Territory, HCP, PrescribingData } from '@/lib/types/pharma';
import { MapPin, TrendingUp, Users, Calendar } from 'lucide-react';

interface TerritoryPerformanceChartProps {
  territories: Territory[];
  hcps?: HCP[];
  prescribingData?: PrescribingData[];
}

export function TerritoryPerformanceChart({ territories, hcps, prescribingData }: TerritoryPerformanceChartProps) {
  // Territory Performance Data
  const territoryData = territories.map(t => ({
    name: t.name,
    region: t.region,
    attainment: Math.round(t.attainment * 100),
    targetCalls: t.targetCalls,
    actualCalls: t.actualCalls,
    hcpCount: t.hcpCount,
    efficiency: Math.round((t.actualCalls / t.hcpCount) * 100) / 100
  }));

  // Regional Performance
  const regionData = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'].map(region => {
    const regionTerritories = territories.filter(t => t.region === region);
    const avgAttainment = regionTerritories.reduce((sum, t) => sum + t.attainment, 0) / regionTerritories.length;
    const totalHCPs = regionTerritories.reduce((sum, t) => sum + t.hcpCount, 0);
    const totalCalls = regionTerritories.reduce((sum, t) => sum + t.actualCalls, 0);
    
    return {
      region,
      territories: regionTerritories.length,
      avgAttainment: Math.round(avgAttainment * 100),
      totalHCPs,
      totalCalls,
      callsPerHCP: Math.round((totalCalls / totalHCPs) * 10) / 10
    };
  });

  // Top Performers
  const topPerformers = [...territories]
    .sort((a, b) => b.attainment - a.attainment)
    .slice(0, 5)
    .map(t => ({
      territory: t.name,
      rep: t.repName,
      attainment: Math.round(t.attainment * 100),
      calls: t.actualCalls,
      hcps: t.hcpCount
    }));

  // Call Activity Trend (Mock monthly data)
  const monthlyTrend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    target: territories.reduce((sum, t) => sum + t.targetCalls, 0) / 6,
    actual: territories.reduce((sum, t) => sum + t.actualCalls * (0.8 + index * 0.05), 0) / 6,
    emails: Math.floor(Math.random() * 500) + 200,
    virtual: Math.floor(Math.random() * 100) + 50
  }));

  // HCP Tier Distribution
  const tierData = hcps ? [
    { tier: 'A', count: hcps.filter(h => h.tier === 'A').length, color: '#10b981' },
    { tier: 'B', count: hcps.filter(h => h.tier === 'B').length, color: '#3b82f6' },
    { tier: 'C', count: hcps.filter(h => h.tier === 'C').length, color: '#f59e0b' },
    { tier: 'D', count: hcps.filter(h => h.tier === 'D').length, color: '#6b7280' }
  ] : [];

  // Prescribing Trend
  const prescribingTrend = prescribingData ? 
    ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'].map(period => {
      const periodData = prescribingData.filter(p => p.period === period);
      return {
        period: period.substring(5),
        totalRx: periodData.reduce((sum, p) => sum + p.totalRx, 0),
        brandRx: periodData.reduce((sum, p) => sum + p.brandRx, 0),
        marketShare: periodData.length > 0 
          ? Math.round((periodData.reduce((sum, p) => sum + p.marketShare, 0) / periodData.length) * 100)
          : 0
      };
    }) : [];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Territories</div>
              <div className="text-2xl font-bold text-blue-600">{territories.length}</div>
            </div>
            <MapPin className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Avg Attainment</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((territories.reduce((sum, t) => sum + t.attainment, 0) / territories.length) * 100)}%
              </div>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total HCPs</div>
              <div className="text-2xl font-bold text-purple-600">
                {territories.reduce((sum, t) => sum + t.hcpCount, 0)}
              </div>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Calls</div>
              <div className="text-2xl font-bold text-amber-600">
                {territories.reduce((sum, t) => sum + t.actualCalls, 0)}
              </div>
            </div>
            <Calendar className="text-amber-500" size={24} />
          </div>
        </div>
      </div>

      {/* Territory Attainment */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Territory Call Attainment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={territoryData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Calls / Attainment %', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="targetCalls" fill="#e5e7eb" name="Target Calls" />
            <Bar dataKey="actualCalls" fill="#3b82f6" name="Actual Calls" />
            <Line type="monotone" dataKey="attainment" stroke="#10b981" strokeWidth={2} name="Attainment %" yAxisId="right" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 120]} tick={{ fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={regionData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="region" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Avg Attainment %" dataKey="avgAttainment" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Territories</h3>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={performer.territory} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                       style={{ backgroundColor: COLORS[index] }}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.territory}</div>
                    <div className="text-sm text-gray-600">{performer.rep}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{performer.attainment}%</div>
                  <div className="text-sm text-gray-600">{performer.calls} calls</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Number of Activities', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="target" stackId="1" stroke="#e5e7eb" fill="#e5e7eb" name="Target" />
            <Area type="monotone" dataKey="actual" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="F2F Calls" />
            <Area type="monotone" dataKey="emails" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Emails" />
            <Area type="monotone" dataKey="virtual" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Virtual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* HCP Tier Distribution & Prescribing Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tierData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">HCP Tier Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tier, count }) => `Tier ${tier}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {prescribingTrend.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Prescribing Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={prescribingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" label={{ value: 'Prescriptions', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Market Share %', angle: 90, position: 'insideRight' }} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="totalRx" stroke="#3b82f6" strokeWidth={2} name="Total Rx" />
                <Line yAxisId="left" type="monotone" dataKey="brandRx" stroke="#10b981" strokeWidth={2} name="Brand Rx" />
                <Line yAxisId="right" type="monotone" dataKey="marketShare" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Market Share %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}