'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  Target,
  AlertTriangle,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { generateMockHCPs } from '@/lib/data/mock-data';

export default function CustomerPlanningPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hcps, setHcps] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [segments, setSegments] = useState<any>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const mockHCPs = generateMockHCPs(100);
    
    setTimeout(() => {
      setHcps(mockHCPs);
      calculateSegments(mockHCPs);
      setIsLoading(false);
    }, 1500);
  };

  const calculateSegments = (hcpList: any[]) => {
    const segmentData: any = {
      Champions: [],
      Growth: [],
      Maintain: [],
      Monitor: []
    };

    hcpList.forEach(hcp => {
      const score = Math.floor(Math.random() * 100);
      hcp.opportunityScore = score;
      
      if (score >= 80) {
        hcp.segment = 'Champions';
        segmentData.Champions.push(hcp);
      } else if (score >= 60) {
        hcp.segment = 'Growth';
        segmentData.Growth.push(hcp);
      } else if (score >= 40) {
        hcp.segment = 'Maintain';
        segmentData.Maintain.push(hcp);
      } else {
        hcp.segment = 'Monitor';
        segmentData.Monitor.push(hcp);
      }
    });

    setSegments(segmentData);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/agents/customer-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzePortfolio',
          data: { count: 20 }
        })
      });

      const result = await response.json();
      console.log('AI Analysis:', result);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        alert('AI Analysis Complete! Check console for results.');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setIsAnalyzing(false);
    }
  };

  const getFilteredHCPs = () => {
    if (selectedSegment === 'all') return hcps;
    return segments[selectedSegment] || [];
  };

  const getBarrierColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Customer Planning Agent</h1>
                  <p className="text-sm text-gray-500">Barrier Analysis & HCP Prioritization</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span>Analyze with AI</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(segments).map(([segment, hcpList]: [string, any]) => (
            <motion.div
              key={segment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
                selectedSegment === segment ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSegment(segment)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{segment}</h3>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{hcpList.length}</p>
              <p className="text-sm text-gray-500">HCPs</p>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Avg Score</span>
                  <span className="font-medium">
                    {hcpList.length > 0 
                      ? Math.round(hcpList.reduce((sum: number, h: any) => sum + (h.opportunityScore || 0), 0) / hcpList.length)
                      : 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                HCP Portfolio Analysis
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedSegment('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedSegment === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({hcps.length})
                </button>
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HCP Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescribing Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barriers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Loading HCP data...
                    </td>
                  </tr>
                ) : getFilteredHCPs().slice(0, 10).map((hcp) => (
                  <tr key={hcp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hcp.name}</div>
                      <div className="text-xs text-gray-500">{hcp.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hcp.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hcp.prescribingVolume}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {hcp.barriers.map((barrier: any, idx: number) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBarrierColor(barrier.severity)}`}
                          >
                            {barrier.type.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {hcp.opportunityScore || 0}
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${hcp.opportunityScore || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        hcp.segment === 'Champions' ? 'bg-green-100 text-green-800' :
                        hcp.segment === 'Growth' ? 'bg-blue-100 text-blue-800' :
                        hcp.segment === 'Maintain' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hcp.segment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}