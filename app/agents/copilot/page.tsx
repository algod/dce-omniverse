'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HeadphonesIcon, Send, Calendar, Mail, User } from 'lucide-react';
import Link from 'next/link';

export default function CopilotPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Field Copilot. How can I help you prepare for your calls today?' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, 
      { role: 'user', content: message },
      { role: 'assistant', content: `I'll help you with: "${message}". Here's what I found...` }
    ]);
    setMessage('');
  };

  const upcomingCalls = [
    { hcp: 'Dr. Sarah Johnson', time: '10:00 AM', specialty: 'Cardiology', priority: 'High' },
    { hcp: 'Dr. Michael Chen', time: '2:00 PM', specialty: 'Endocrinology', priority: 'Medium' },
    { hcp: 'Dr. Emily Davis', time: '4:00 PM', specialty: 'Neurology', priority: 'High' }
  ];

  const territoryInsights = [
    'High-priority territory: Downtown Medical District',
    '15 HCPs with improved payer coverage this month',
    'Average call completion: 78% (above target)',
    '8 HCPs showing increased engagement signals'
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
                <HeadphonesIcon className="h-8 w-8 text-indigo-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Field Copilot Agent</h1>
                  <p className="text-sm text-gray-500">AI Assistant for Sales Reps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
              <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about HCPs, territories, or get call prep help..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Today\'s Calls</h3>
              <div className="space-y-3">
                {upcomingCalls.map((call, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="h-10 w-10 text-gray-400" />
                      <div>
                        <p className="font-medium">{call.hcp}</p>
                        <p className="text-sm text-gray-500">{call.specialty} • {call.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Territory Insights</h3>
              <div className="space-y-3">
                {territoryInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />
                    <p className="text-sm text-gray-600">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                  Pre-call Planning
                </button>
                <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                  Virtual Coaching
                </button>
                <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                  Email Templates
                </button>
                <button className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                  Competition Analysis
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}