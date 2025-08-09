'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FieldSuggestion, FieldSuggestionTrigger } from '@/lib/types/pharma';
import { TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface FieldSuggestionsChartProps {
  suggestions: FieldSuggestion[];
  triggers: FieldSuggestionTrigger[];
  performanceMetrics?: {
    acceptanceRate: number;
    completionRate: number;
    avgTimeToAction: number;
    impactScore: number;
  };
}

export function FieldSuggestionsChart({ suggestions, triggers, performanceMetrics }: FieldSuggestionsChartProps) {
  // Trigger Performance Data
  const triggerData = triggers.map(trigger => {
    const triggerSuggestions = suggestions.filter(s => s.triggerId === trigger.id);
    const completed = triggerSuggestions.filter(s => s.status === 'Completed').length;
    const active = triggerSuggestions.filter(s => s.status === 'Active').length;
    const dismissed = triggerSuggestions.filter(s => s.status === 'Dismissed').length;
    
    return {
      name: trigger.name.substring(0, 25),
      total: triggerSuggestions.length,
      completed,
      active,
      dismissed,
      acceptanceRate: triggerSuggestions.length > 0 
        ? (completed / triggerSuggestions.length) * 100 
        : 0
    };
  });

  // Status Distribution
  const statusData = [
    { name: 'Active', value: suggestions.filter(s => s.status === 'Active').length, color: '#3b82f6' },
    { name: 'Completed', value: suggestions.filter(s => s.status === 'Completed').length, color: '#10b981' },
    { name: 'Dismissed', value: suggestions.filter(s => s.status === 'Dismissed').length, color: '#f59e0b' },
    { name: 'Expired', value: suggestions.filter(s => s.status === 'Expired').length, color: '#6b7280' }
  ];

  // Priority Distribution
  const priorityData = [
    { priority: 'Critical', count: suggestions.filter(s => s.priority === 'Critical').length, color: '#ef4444' },
    { priority: 'High', count: suggestions.filter(s => s.priority === 'High').length, color: '#f59e0b' },
    { priority: 'Medium', count: suggestions.filter(s => s.priority === 'Medium').length, color: '#3b82f6' },
    { priority: 'Low', count: suggestions.filter(s => s.priority === 'Low').length, color: '#10b981' }
  ];

  // Weekly Trend Data
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (7 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weekSuggestions = suggestions.filter(s => {
      const created = new Date(s.createdDate);
      return created >= weekStart && created < weekEnd;
    });
    
    return {
      week: `W${i + 1}`,
      created: weekSuggestions.length,
      completed: weekSuggestions.filter(s => s.status === 'Completed').length,
      dismissed: weekSuggestions.filter(s => s.status === 'Dismissed').length
    };
  });

  // Feedback Analysis
  const feedbackData = suggestions.filter(s => s.feedback);
  const usefulFeedback = feedbackData.filter(s => s.feedback?.useful).length;
  const feedbackRate = suggestions.length > 0 ? (feedbackData.length / suggestions.length) * 100 : 0;
  const usefulRate = feedbackData.length > 0 ? (usefulFeedback / feedbackData.length) * 100 : 0;

  // Trigger Sensitivity Radar
  const sensitivityData = triggers.slice(0, 6).map(t => ({
    trigger: t.name.split(' ')[0],
    sensitivity: t.sensitivity.threshold * 100,
    volume: (suggestions.filter(s => s.triggerId === t.id).length / suggestions.length) * 100
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Acceptance Rate</div>
              <div className="text-2xl font-bold text-blue-600">
                {performanceMetrics?.acceptanceRate.toFixed(1) || '72.5'}%
              </div>
            </div>
            <CheckCircle className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics?.completionRate.toFixed(1) || '68.3'}%
              </div>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Avg Time to Action</div>
              <div className="text-2xl font-bold text-amber-600">
                {performanceMetrics?.avgTimeToAction.toFixed(1) || '3.2'} days
              </div>
            </div>
            <Clock className="text-amber-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Impact Score</div>
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics?.impactScore.toFixed(1) || '85.7'}%
              </div>
            </div>
            <AlertCircle className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Trigger Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Trigger Performance Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={triggerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={120}
              tick={{ fontSize: 11 }}
            />
            <YAxis label={{ value: 'Number of Suggestions', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="active" stackId="a" fill="#3b82f6" name="Active" />
            <Bar dataKey="dismissed" stackId="a" fill="#f59e0b" name="Dismissed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status and Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="priority" type="category" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Suggestion Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Number of Suggestions', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name="Created" />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
            <Line type="monotone" dataKey="dismissed" stroke="#f59e0b" strokeWidth={2} name="Dismissed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Feedback Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Feedback Provided</span>
              <span className="font-semibold text-blue-600">{feedbackRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Marked as Useful</span>
              <span className="font-semibold text-green-600">{usefulRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Feedback</span>
              <span className="font-semibold">{feedbackData.length}</span>
            </div>
          </div>
        </div>

        {/* Trigger Sensitivity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Trigger Sensitivity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={sensitivityData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="trigger" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Sensitivity" dataKey="sensitivity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Volume %" dataKey="volume" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}