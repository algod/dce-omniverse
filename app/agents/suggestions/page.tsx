'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { fieldSuggestionTriggers } from '@/lib/data/mock-data';

export default function SuggestionsPage() {
  const [triggers] = useState(fieldSuggestionTriggers);
  
  const activeSuggestions = [
    { id: 1, hcp: 'Dr. Smith', trigger: 'Speaker Program Follow-up', priority: 'High', daysLeft: 7 },
    { id: 2, hcp: 'Dr. Johnson', trigger: 'Low Fulfillment Rate', priority: 'Medium', daysLeft: 10 },
    { id: 3, hcp: 'Dr. Williams', trigger: 'Positive Payer Coverage', priority: 'High', daysLeft: 5 },
    { id: 4, hcp: 'Dr. Brown', trigger: 'Email Engagement', priority: 'Low', daysLeft: 12 },
    { id: 5, hcp: 'Dr. Davis', trigger: 'Slowed Prescribing', priority: 'Medium', daysLeft: 8 }
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
                <Lightbulb className="h-8 w-8 text-pink-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Field Suggestions Agent</h1>
                  <p className="text-sm text-gray-500">Trigger Management & Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500">Active Triggers</p>
            <p className="text-2xl font-bold">7</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500">Weekly Suggestions</p>
            <p className="text-2xl font-bold">140</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold">68%</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-500">Rep Feedback</p>
            <p className="text-2xl font-bold">85%</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Configured Triggers</h3>
            <div className="space-y-3">
              {triggers.map(trigger => (
                <div key={trigger.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{trigger.name}</p>
                    <p className="text-xs text-gray-500">Priority: {trigger.priority}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {trigger.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Active Suggestions</h3>
            <div className="space-y-3">
              {activeSuggestions.map(suggestion => (
                <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{suggestion.hcp}</p>
                    <p className="text-xs text-gray-500">{suggestion.trigger}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.priority === 'High' ? 'bg-red-100 text-red-800' :
                      suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{suggestion.daysLeft} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}