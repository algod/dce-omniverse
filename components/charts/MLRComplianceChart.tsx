'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, LineChart, Line } from 'recharts';
import { MLRReview, ContentGap, ChannelCoverage } from '@/lib/agents/content-review';

interface MLRComplianceChartProps {
  mlrReviews: MLRReview[];
  contentGaps?: ContentGap[];
  channelCoverage?: ChannelCoverage[];
}

export function MLRComplianceChart({ mlrReviews, contentGaps, channelCoverage }: MLRComplianceChartProps) {
  // MLR Score Distribution
  const scoreDistribution = [
    { range: '90-100', count: mlrReviews.filter(r => r.score >= 90).length, color: '#10b981' },
    { range: '80-89', count: mlrReviews.filter(r => r.score >= 80 && r.score < 90).length, color: '#3b82f6' },
    { range: '70-79', count: mlrReviews.filter(r => r.score >= 70 && r.score < 80).length, color: '#f59e0b' },
    { range: '60-69', count: mlrReviews.filter(r => r.score >= 60 && r.score < 70).length, color: '#ef4444' },
    { range: '<60', count: mlrReviews.filter(r => r.score < 60).length, color: '#991b1b' }
  ];

  // Compliance Issues by Category
  const issueCategories = ['Medical', 'Legal', 'Regulatory', 'Safety', 'Fair Balance'];
  const issueData = issueCategories.map(category => {
    const issues = mlrReviews.flatMap(r => r.issues).filter(i => i.category === category);
    return {
      category,
      critical: issues.filter(i => i.severity === 'Critical').length,
      major: issues.filter(i => i.severity === 'Major').length,
      minor: issues.filter(i => i.severity === 'Minor').length
    };
  });

  // Approval Status
  const approvalData = [
    { status: 'Approved', value: mlrReviews.filter(r => r.recommendation === 'approve').length, color: '#10b981' },
    { status: 'Revise', value: mlrReviews.filter(r => r.recommendation === 'revise').length, color: '#f59e0b' },
    { status: 'Rejected', value: mlrReviews.filter(r => r.recommendation === 'reject').length, color: '#ef4444' }
  ];

  // Content Gap Priority
  const gapData = contentGaps?.map(gap => ({
    barrier: gap.barrier.name.split(' ').slice(0, 3).join(' '),
    current: gap.currentAssets,
    recommended: gap.recommendedAssets,
    gap: gap.gap,
    priority: gap.priority
  })) || [];

  // Channel Coverage Data
  const coverageData = channelCoverage?.map(c => ({
    channel: c.channel,
    coverage: c.coverageScore,
    approved: c.approvedAssets,
    pending: c.pendingAssets,
    total: c.totalAssets
  })) || [];

  // Average MLR Score
  const avgScore = mlrReviews.reduce((sum, r) => sum + r.score, 0) / mlrReviews.length || 0;

  const COLORS = {
    critical: '#ef4444',
    major: '#f59e0b',
    minor: '#3b82f6'
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Average MLR Score</div>
          <div className="text-2xl font-bold" style={{ color: avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>
            {avgScore.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Approval Rate</div>
          <div className="text-2xl font-bold text-green-600">
            {((approvalData[0].value / mlrReviews.length) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Content Gaps</div>
          <div className="text-2xl font-bold text-amber-600">
            {contentGaps?.reduce((sum, g) => sum + g.gap, 0) || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Critical Issues</div>
          <div className="text-2xl font-bold text-red-600">
            {mlrReviews.reduce((count, r) => count + r.issues.filter(i => i.severity === 'Critical').length, 0)}
          </div>
        </div>
      </div>

      {/* MLR Score Distribution & Approval Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">MLR Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis label={{ value: 'Assets', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6">
                {scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Approval Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={approvalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, value }) => `${status}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {approvalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Issues by Category */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Issues by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={issueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Number of Issues', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="critical" stackId="a" fill={COLORS.critical} name="Critical" />
            <Bar dataKey="major" stackId="a" fill={COLORS.major} name="Major" />
            <Bar dataKey="minor" stackId="a" fill={COLORS.minor} name="Minor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Content Gaps Analysis */}
      {gapData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Content Gap Analysis by Barrier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="barrier" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: 'Number of Assets', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#94a3b8" name="Current Assets" />
              <Bar dataKey="recommended" fill="#3b82f6" name="Recommended" />
              <Bar dataKey="gap" fill="#ef4444" name="Gap" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Channel Coverage */}
      {coverageData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Channel Content Coverage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={coverageData}>
              <RadialBar
                dataKey="coverage"
                fill="#3b82f6"
              />
              <Legend 
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}