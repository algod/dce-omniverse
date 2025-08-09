'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Cell } from 'recharts';
import { Barrier, HCPOpportunity } from '@/lib/types/pharma';

interface BarrierAnalysisChartProps {
  barriers: Array<{
    barrier: Barrier;
    prevalence: number;
    impact: number;
    addressability: number;
  }>;
  opportunities?: HCPOpportunity[];
}

export function BarrierAnalysisChart({ barriers, opportunities }: BarrierAnalysisChartProps) {
  // Prepare data for bar chart
  const barData = barriers.map(b => ({
    name: b.barrier.name.split(' ').slice(0, 3).join(' '),
    prevalence: Math.round(b.prevalence * 100),
    impact: Math.round(b.impact * 100),
    addressability: Math.round(b.addressability * 100),
    score: Math.round((b.prevalence * b.impact * b.addressability) * 100)
  }));

  // Prepare data for radar chart
  const radarData = barriers.map(b => ({
    barrier: b.barrier.name.split(' ').slice(0, 2).join(' '),
    value: Math.round((b.prevalence + b.impact + b.addressability) / 3 * 100)
  }));

  // Prepare scatter data for opportunity matrix
  const scatterData = opportunities?.slice(0, 50).map(opp => ({
    x: opp.depthOpportunity,
    y: opp.breadthOpportunity,
    z: opp.opportunityScore,
    name: opp.hcpId
  })) || [];

  const getColor = (score: number) => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-8">
      {/* Barrier Impact Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Barrier Impact Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
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
            <Bar dataKey="prevalence" fill="#8b5cf6" name="Prevalence" />
            <Bar dataKey="impact" fill="#3b82f6" name="Impact" />
            <Bar dataKey="addressability" fill="#10b981" name="Addressability" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Barrier Distribution Radar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Barrier Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="barrier" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar 
              name="Barrier Score" 
              dataKey="value" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* HCP Opportunity Matrix */}
      {scatterData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">HCP Opportunity Matrix</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="x" 
                name="Depth" 
                label={{ value: 'Depth Opportunity', position: 'insideBottom', offset: -5 }}
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey="y" 
                name="Breadth" 
                label={{ value: 'Breadth Opportunity', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm">Depth: {data.x.toFixed(1)}%</p>
                        <p className="text-sm">Breadth: {data.y.toFixed(1)}%</p>
                        <p className="text-sm font-semibold">Score: {data.z.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="HCPs" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-sm">High Opportunity (≥70)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
              <span className="text-sm">Medium (40-69)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span className="text-sm">Low (&lt;40)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}