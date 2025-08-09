'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { colors } from '@/lib/design-system/colors';
import { HeadphonesIcon, Calendar, MessageSquare, Target } from 'lucide-react';

const preCallData = [
  { metric: 'HCP Profile Views', value: 892, trend: '+12%' },
  { metric: 'Barrier Insights', value: 756, trend: '+18%' },
  { metric: 'Content Accessed', value: 623, trend: '+8%' },
  { metric: 'Call Plans Created', value: 445, trend: '+15%' },
  { metric: 'Success Strategies', value: 380, trend: '+22%' }
];

const territoryMetrics = [
  { territory: 'Northeast', calls: 145, emails: 89, meetings: 42, score: 88 },
  { territory: 'Southeast', calls: 132, emails: 78, meetings: 38, score: 82 },
  { territory: 'Midwest', calls: 125, emails: 92, meetings: 45, score: 90 },
  { territory: 'West', calls: 118, emails: 72, meetings: 35, score: 78 },
  { territory: 'Southwest', calls: 110, emails: 68, meetings: 32, score: 75 }
];

const coachingTopics = [
  { topic: 'Barrier Discussion', sessions: 145, satisfaction: 92, improvement: 28 },
  { topic: 'Objection Handling', sessions: 132, satisfaction: 88, improvement: 25 },
  { topic: 'Clinical Evidence', sessions: 118, satisfaction: 90, improvement: 22 },
  { topic: 'Access Navigation', sessions: 98, satisfaction: 85, improvement: 30 },
  { topic: 'Closing Techniques', sessions: 87, satisfaction: 87, improvement: 18 }
];

const activityDistribution = [
  { activity: 'Pre-Call Planning', count: 445, percentage: 28 },
  { activity: 'Email Drafting', count: 380, percentage: 24 },
  { activity: 'Territory Analysis', count: 285, percentage: 18 },
  { activity: 'Virtual Coaching', count: 238, percentage: 15 },
  { activity: 'Call Scheduling', count: 190, percentage: 12 },
  { activity: 'Post-Call Notes', count: 47, percentage: 3 }
];

const performanceRadar = [
  { skill: 'Product Knowledge', A: 85, B: 78 },
  { skill: 'Barrier Resolution', A: 88, B: 82 },
  { skill: 'Relationship Building', A: 92, B: 85 },
  { skill: 'Data Utilization', A: 78, B: 72 },
  { skill: 'Follow-up Execution', A: 82, B: 88 },
  { skill: 'Digital Engagement', A: 75, B: 90 }
];

export function FieldCopilotVisualization() {
  const [selectedView, setSelectedView] = useState<'precall' | 'territory' | 'coaching' | 'activity'>('precall');

  const totalActivities = activityDistribution.reduce((sum, a) => sum + a.count, 0);
  const avgSatisfaction = (coachingTopics.reduce((sum, t) => sum + t.satisfaction, 0) / coachingTopics.length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'precall', label: 'Pre-Call Planning' },
          { id: 'territory', label: 'Territory Insights' },
          { id: 'coaching', label: 'Virtual Coaching' },
          { id: 'activity', label: 'Activity Analysis' }
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
        {selectedView === 'precall' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Pre-Call Planning Analytics</h4>
            <div className="grid grid-cols-2 gap-4 h-[90%]">
              <div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={preCallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill={colors.agents.copilot} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Top Pre-Call Actions</h5>
                  <div className="space-y-2">
                    {['Review HCP barriers', 'Check prescribing history', 'Prepare clinical data', 'Plan objection responses'].map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{action}</span>
                        <span className="text-xs font-medium text-purple-600">
                          {85 + idx * 3}% used
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Success Rate</span>
                    <span className="text-2xl font-bold text-green-600">78%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Calls with pre-planning show 34% higher success rate
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'territory' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Territory Performance Overview</h4>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={territoryMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="territory" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="calls" stackId="1" stroke={colors.agents.copilot} fill={colors.agents.copilot} fillOpacity={0.6} name="Calls" />
                <Area type="monotone" dataKey="emails" stackId="1" stroke={colors.agents.budget} fill={colors.agents.budget} fillOpacity={0.6} name="Emails" />
                <Area type="monotone" dataKey="meetings" stackId="1" stroke={colors.agents.customer} fill={colors.agents.customer} fillOpacity={0.6} name="Meetings" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-green-500" />
                <span className="text-gray-600">Midwest leads with 90% performance score</span>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'coaching' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Coaching Session Topics</h4>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={coachingTopics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="topic" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill={colors.agents.copilot} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Performance Impact</h4>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={performanceRadar}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[60, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Top Performers" dataKey="A" stroke={colors.success.main} fill={colors.success.main} fillOpacity={0.3} />
                  <Radar name="Average" dataKey="B" stroke={colors.agents.copilot} fill={colors.agents.copilot} fillOpacity={0.3} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {selectedView === 'activity' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex"
          >
            <div className="w-1/2">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Activity Distribution</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        colors.agents.copilot,
                        colors.agents.budget,
                        colors.agents.customer,
                        colors.agents.orchestration,
                        colors.agents.suggestions,
                        colors.agents.content
                      ][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 pl-4">
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Total Activities</span>
                  <span className="text-2xl font-bold text-purple-600">{totalActivities}</span>
                </div>
                <p className="text-xs text-gray-600">This week • ↑ 15% from last week</p>
              </div>
              {activityDistribution.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: [
                        colors.agents.copilot,
                        colors.agents.budget,
                        colors.agents.customer,
                        colors.agents.orchestration,
                        colors.agents.suggestions,
                        colors.agents.content
                      ][index % 6] }}
                    />
                    <span className="text-xs text-gray-700">{activity.activity}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">{activity.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HeadphonesIcon className="text-purple-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Copilot Insights</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedView === 'precall' && (
                <>
                  <li>• Pre-call planning increases success rate by 34%</li>
                  <li>• HCP profile views up 12% week-over-week</li>
                  <li>• Barrier insights most accessed pre-call resource</li>
                </>
              )}
              {selectedView === 'territory' && (
                <>
                  <li>• Midwest territory shows highest performance score (90%)</li>
                  <li>• Email engagement strongest in Southeast region</li>
                  <li>• Meeting conversion rates improving across all territories</li>
                </>
              )}
              {selectedView === 'coaching' && (
                <>
                  <li>• Barrier discussion most popular coaching topic</li>
                  <li>• {avgSatisfaction}% average satisfaction across all sessions</li>
                  <li>• 25% average skill improvement after coaching</li>
                </>
              )}
              {selectedView === 'activity' && (
                <>
                  <li>• Pre-call planning accounts for 28% of all activities</li>
                  <li>• Email drafting assistance saves 45 min/day per rep</li>
                  <li>• {totalActivities} total activities completed this week</li>
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
            <span className="text-xs text-gray-600">Active Reps</span>
            <HeadphonesIcon className="text-purple-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">248</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Calls Planned</span>
            <Calendar className="text-blue-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">445</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Emails Drafted</span>
            <MessageSquare className="text-green-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">380</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Coaching Sessions</span>
            <Target className="text-orange-500" size={16} />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">580</p>
        </div>
      </div>
    </div>
  );
}