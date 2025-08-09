'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ResponsiveContainer, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { colors } from '@/lib/design-system/colors';

const barrierData = [
  { name: 'Referral Pathway', code: 'B001', percentage: 35, hcps: 420, severity: 'high' },
  { name: 'Side Effects', code: 'B002', percentage: 28, hcps: 336, severity: 'high' },
  { name: 'Insurance Coverage', code: 'B003', percentage: 22, hcps: 264, severity: 'medium' },
  { name: 'Formulary Approval', code: 'B004', percentage: 10, hcps: 120, severity: 'medium' },
  { name: 'Diagnostic Tool', code: 'B005', percentage: 5, hcps: 60, severity: 'low' }
];

const scatterData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 100 + 20,
  name: `HCP-${i + 1}`,
  barrier: barrierData[Math.floor(Math.random() * 5)].code
}));

const segmentData = [
  { name: 'Champions', value: 15, color: colors.success.main },
  { name: 'Growth', value: 35, color: colors.agents.budget },
  { name: 'Maintain', value: 40, color: colors.warning.main },
  { name: 'Monitor', value: 10, color: colors.gray[400] }
];

const territoryData = [
  { territory: 'Northeast', referral: 65, sideEffects: 45, insurance: 70, formulary: 30, diagnostic: 20 },
  { territory: 'Southeast', referral: 55, sideEffects: 60, insurance: 50, formulary: 40, diagnostic: 25 },
  { territory: 'Midwest', referral: 70, sideEffects: 35, insurance: 60, formulary: 45, diagnostic: 15 },
  { territory: 'West', referral: 45, sideEffects: 70, insurance: 55, formulary: 35, diagnostic: 30 },
  { territory: 'Southwest', referral: 60, sideEffects: 50, insurance: 65, formulary: 25, diagnostic: 35 }
];

export function CustomerPlanningVisualization() {
  const [selectedView, setSelectedView] = useState<'barriers' | 'opportunity' | 'segments' | 'territory'>('barriers');
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    setAnimateCharts(true);
  }, []);

  const getBarrierColor = (code: string) => {
    const colorMap: { [key: string]: string } = {
      'B001': colors.error.main,
      'B002': colors.warning.main,
      'B003': colors.agents.budget,
      'B004': colors.agents.content,
      'B005': colors.success.main
    };
    return colorMap[code] || colors.gray[400];
  };

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'barriers', label: 'Barrier Analysis' },
          { id: 'opportunity', label: 'Opportunity Map' },
          { id: 'segments', label: 'HCP Segments' },
          { id: 'territory', label: 'Territory View' }
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
        {selectedView === 'barriers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Barrier Prevalence Analysis</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barrierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="code" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-semibold text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">Code: {data.code}</p>
                          <p className="text-sm text-gray-600">Affected: {data.percentage}%</p>
                          <p className="text-sm text-gray-600">HCPs: {data.hcps}</p>
                          <p className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              data.severity === 'high' ? 'bg-red-100 text-red-800' :
                              data.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {data.severity} severity
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill={colors.agents.customer}
                  animationDuration={800}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'opportunity' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">HCP Opportunity Matrix (Depth vs Breadth)</h4>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Sales Depth" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Sales Depth Potential', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Sales Breadth" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Sales Breadth Potential', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-semibold text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">Depth Score: {Math.round(data.x)}</p>
                          <p className="text-sm text-gray-600">Breadth Score: {Math.round(data.y)}</p>
                          <p className="text-sm text-gray-600">Opportunity: {Math.round(data.size)}</p>
                          <p className="text-sm text-gray-600">Primary Barrier: {data.barrier}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="HCPs" 
                  data={scatterData} 
                  fill={colors.agents.customer}
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'segments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">HCP Segmentation</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {segmentData.map((segment) => (
                <div key={segment.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="font-medium text-gray-900">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{segment.value}%</p>
                    <p className="text-xs text-gray-500">{Math.round(segment.value * 12)} HCPs</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'territory' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Territory Barrier Analysis</h4>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart data={territoryData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="territory" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Referral Pathway" dataKey="referral" stroke={colors.error.main} fill={colors.error.main} fillOpacity={0.3} />
                <Radar name="Side Effects" dataKey="sideEffects" stroke={colors.warning.main} fill={colors.warning.main} fillOpacity={0.3} />
                <Radar name="Insurance" dataKey="insurance" stroke={colors.agents.budget} fill={colors.agents.budget} fillOpacity={0.3} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Insights</h4>
        <ul className="space-y-1 text-sm text-gray-600">
          {selectedView === 'barriers' && (
            <>
              <li>• Referral pathway barriers affect 35% of HCPs - highest priority</li>
              <li>• Side effects management is the second most common barrier</li>
              <li>• Focus field engagement on top 3 barriers for maximum impact</li>
            </>
          )}
          {selectedView === 'opportunity' && (
            <>
              <li>• High concentration of opportunities in upper-right quadrant</li>
              <li>• 15 HCPs show both high depth and breadth potential</li>
              <li>• Target high-opportunity HCPs with customized engagement</li>
            </>
          )}
          {selectedView === 'segments' && (
            <>
              <li>• Growth segment (35%) presents greatest expansion opportunity</li>
              <li>• Champions require retention strategies</li>
              <li>• Monitor segment may benefit from digital-only engagement</li>
            </>
          )}
          {selectedView === 'territory' && (
            <>
              <li>• Midwest shows highest referral pathway challenges</li>
              <li>• West territory faces significant side effect concerns</li>
              <li>• Customize territory strategies based on barrier profiles</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}