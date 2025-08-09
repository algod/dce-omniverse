'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Network, Brain, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';

export default function OrchestrationPage() {
  const [selectedHCP, setSelectedHCP] = useState('HCP-001');
  
  const journeyStages = [
    { name: 'Awareness', status: 'completed', engagement: 'low' },
    { name: 'Consideration', status: 'completed', engagement: 'medium' },
    { name: 'Trial', status: 'active', engagement: 'high' },
    { name: 'Adoption', status: 'pending', engagement: '-' },
    { name: 'Advocacy', status: 'pending', engagement: '-' }
  ];

  const nextBestActions = [
    { action: 'Send clinical trial results', channel: 'Email', timing: 'Within 48 hours', impact: 92 },
    { action: 'Schedule follow-up call', channel: 'Field', timing: 'Next week', impact: 85 },
    { action: 'Invite to speaker program', channel: 'Event', timing: 'Within 2 weeks', impact: 78 }
  ];

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
                <Network className="h-8 w-8 text-orange-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Orchestration Agent</h1>
                  <p className="text-sm text-gray-500">Customer Journey & Next Best Actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Precision</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">F1 Score</span>
                <span className="font-medium">88%</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Journey - {selectedHCP}</h3>
            <div className="flex justify-between items-center">
              {journeyStages.map((stage, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                    stage.status === 'active' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium">{stage.name}</p>
                  <p className="text-xs text-gray-500">{stage.engagement}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Next Best Actions</h3>
          <div className="space-y-4">
            {nextBestActions.map((nba, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{nba.action}</p>
                  <p className="text-sm text-gray-600">{nba.channel} • {nba.timing}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Expected Impact</p>
                  <p className="text-2xl font-bold text-blue-600">{nba.impact}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}