'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Brain,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { mockChannels } from '@/lib/data/mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export default function BudgetPlanningPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(5500000);
  const [channels, setChannels] = useState(mockChannels);
  const [optimization, setOptimization] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const optimizeBudget = async () => {
    setIsOptimizing(true);
    
    try {
      const response = await fetch('/api/agents/budget-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize',
          data: { totalBudget, channels }
        })
      });

      const result = await response.json();
      setOptimization(result.result);
      console.log('Optimization Result:', result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBudgetChange = (channelName: string, newBudget: number) => {
    setChannels(channels.map(ch => 
      ch.name === channelName ? { ...ch, currentBudget: newBudget } : ch
    ));
  };

  const pieData = channels.map(ch => ({
    name: ch.name,
    value: ch.currentBudget,
    percentage: (ch.currentBudget / totalBudget * 100).toFixed(1)
  }));

  const barData = channels.map(ch => ({
    name: ch.name.split(' ')[0],
    current: ch.currentBudget / 1000,
    optimized: optimization?.allocations?.find((a: any) => a.channel === ch.name)?.optimized / 1000 || ch.currentBudget / 1000,
    roi: ch.roi,
    mroi: ch.mroi
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Budget Planning Agent</h1>
                  <p className="text-sm text-gray-500">Optimize Channel Allocation & ROI</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={optimizeBudget}
                disabled={isOptimizing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span>Optimize with AI</span>
                  </>
                )}
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(totalBudget / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <input
              type="range"
              min="4000000"
              max="8000000"
              step="100000"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Expected ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {optimization ? optimization.totalROI.toFixed(1) : '3.2'}x
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-sm text-green-600">
              {optimization && optimization.improvement > 0 
                ? `+${optimization.improvement.toFixed(1)}% improvement`
                : 'Run optimization to see improvement'}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Active Channels</p>
                <p className="text-2xl font-bold text-gray-900">{channels.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-sm text-gray-600">
              All channels optimized
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current vs Optimized</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Budget ($K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#94A3B8" name="Current" />
                <Bar dataKey="optimized" fill="#3B82F6" name="Optimized" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Channel Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Optimized
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    mROI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {channels.map((channel, idx) => {
                  const optimizedData = optimization?.allocations?.find((a: any) => a.channel === channel.name);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {channel.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(channel.currentBudget / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${((optimizedData?.optimized || channel.currentBudget) / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.roi}x
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.mroi}x
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {optimizedData && (
                          <span className={`text-sm font-medium ${
                            optimizedData.change > 0 ? 'text-green-600' : 
                            optimizedData.change < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {optimizedData.change > 0 ? '+' : ''}{optimizedData.change.toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}