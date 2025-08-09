'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  Treemap, Sankey
} from 'recharts';
import { colors } from '@/lib/design-system/colors';
import { FileCheck, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const contentData = [
  { barrier: 'Referral Pathway', total: 45, approved: 38, pending: 5, rejected: 2 },
  { barrier: 'Side Effects', total: 52, approved: 45, pending: 4, rejected: 3 },
  { barrier: 'Insurance Coverage', total: 38, approved: 35, pending: 2, rejected: 1 },
  { barrier: 'Formulary Approval', total: 28, approved: 25, pending: 3, rejected: 0 },
  { barrier: 'Diagnostic Tool', total: 15, approved: 12, pending: 2, rejected: 1 }
];

const channelContent = [
  { channel: 'Email', required: 25, available: 22, gap: 3 },
  { channel: 'Web/Digital', required: 35, available: 30, gap: 5 },
  { channel: 'Field Materials', required: 40, available: 38, gap: 2 },
  { channel: 'Speaker Deck', required: 15, available: 12, gap: 3 },
  { channel: 'Conference', required: 20, available: 18, gap: 2 },
  { channel: 'Direct Mail', required: 12, available: 12, gap: 0 }
];

const mlrStatus = [
  { status: 'Approved', count: 155, percentage: 70, color: colors.success.main },
  { status: 'Pending Review', count: 44, percentage: 20, color: colors.warning.main },
  { status: 'In Revision', count: 17, percentage: 8, color: colors.agents.suggestions },
  { status: 'Rejected', count: 4, percentage: 2, color: colors.error.main }
];

const themeMapping = [
  { theme: 'Efficacy', barriers: ['B001', 'B002'], assets: 42 },
  { theme: 'Access', barriers: ['B003', 'B004'], assets: 35 },
  { theme: 'Diagnosis', barriers: ['B005'], assets: 15 },
  { theme: 'Safety', barriers: ['B002'], assets: 28 },
  { theme: 'Cost-Effectiveness', barriers: ['B003'], assets: 22 }
];

const timelineData = [
  { month: 'Jan', submitted: 25, approved: 20, avgDays: 5.2 },
  { month: 'Feb', submitted: 30, approved: 27, avgDays: 4.8 },
  { month: 'Mar', submitted: 35, approved: 30, avgDays: 4.5 },
  { month: 'Apr', submitted: 28, approved: 25, avgDays: 4.2 },
  { month: 'May', submitted: 32, approved: 29, avgDays: 3.9 },
  { month: 'Jun', submitted: 38, approved: 35, avgDays: 3.5 }
];

export function ContentReviewVisualization() {
  const [selectedView, setSelectedView] = useState<'coverage' | 'mlr' | 'gaps' | 'timeline'>('coverage');

  const totalContent = contentData.reduce((sum, item) => sum + item.total, 0);
  const totalApproved = contentData.reduce((sum, item) => sum + item.approved, 0);
  const approvalRate = ((totalApproved / totalContent) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'coverage', label: 'Barrier Coverage' },
          { id: 'mlr', label: 'MLR Status' },
          { id: 'gaps', label: 'Content Gaps' },
          { id: 'timeline', label: 'Approval Timeline' }
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
        {selectedView === 'coverage' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Content Coverage by Barrier</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={contentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="barrier" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill={colors.success.main} name="Approved" />
                <Bar dataKey="pending" stackId="a" fill={colors.warning.main} name="Pending" />
                <Bar dataKey="rejected" stackId="a" fill={colors.error.main} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'mlr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">MLR Approval Status</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={mlrStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {mlrStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3 pl-4">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall Approval Rate</span>
                  <span className="text-2xl font-bold text-green-600">{approvalRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>
              </div>
              {mlrStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{status.count}</p>
                    <p className="text-xs text-gray-500">{status.percentage}%</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Average Review Time</p>
                    <p className="text-xs text-blue-700 mt-1">3.8 days (↓ 25% from last quarter)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'gaps' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Content Gap Analysis by Channel</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={channelContent} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="available" fill={colors.agents.content} name="Available" />
                <Bar dataKey="gap" fill={colors.error.main} name="Gap" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {channelContent.filter(c => c.gap > 0).map(channel => (
                <div key={channel.channel} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="text-yellow-600" size={14} />
                  <span className="text-xs text-yellow-900">
                    {channel.channel}: {channel.gap} assets needed
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'timeline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">MLR Submission & Approval Timeline</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="submitted" fill={colors.agents.budget} name="Submitted" />
                <Bar yAxisId="left" dataKey="approved" fill={colors.success.main} name="Approved" />
                <Bar yAxisId="right" dataKey="avgDays" fill={colors.agents.orchestration} name="Avg Days" type="monotone" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileCheck className="text-purple-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Content Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedView === 'coverage' && (
                <>
                  <li>• Referral pathway content well-covered with 84% approval rate</li>
                  <li>• Need 7 additional assets for side effects management</li>
                  <li>• Consider retiring outdated formulary content (3 assets)</li>
                </>
              )}
              {selectedView === 'mlr' && (
                <>
                  <li>• MLR approval rate improved by 12% this quarter</li>
                  <li>• 44 assets awaiting review - prioritize barrier-critical content</li>
                  <li>• Average review time decreased to 3.8 days</li>
                </>
              )}
              {selectedView === 'gaps' && (
                <>
                  <li>• Digital channel has largest gap (5 assets) - priority for Q3</li>
                  <li>• Direct mail fully covered - reallocate resources</li>
                  <li>• Speaker deck content gaps align with upcoming programs</li>
                </>
              )}
              {selectedView === 'timeline' && (
                <>
                  <li>• Submission volume trending up 15% month-over-month</li>
                  <li>• June showed best approval efficiency at 92%</li>
                  <li>• Review time improvement saving ~2 weeks per quarter</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Total Assets</span>
            <CheckCircle className="text-green-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">{totalContent}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Approved</span>
            <FileCheck className="text-blue-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">{totalApproved}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Pending</span>
            <Clock className="text-yellow-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">18</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Content Gaps</span>
            <AlertTriangle className="text-red-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">15</p>
        </div>
      </div>
    </div>
  );
}