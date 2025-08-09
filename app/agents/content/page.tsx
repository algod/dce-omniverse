'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Brain,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { generateMockContent } from '@/lib/data/mock-data';

export default function ContentReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    const mockContent = generateMockContent(20);
    setTimeout(() => {
      setContent(mockContent);
      setIsLoading(false);
    }, 1000);
  }, []);

  const runMLRReview = async () => {
    setIsReviewing(true);
    
    try {
      const response = await fetch('/api/agents/content-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batchReview',
          data: { assets: content.slice(0, 5) }
        })
      });

      const result = await response.json();
      console.log('MLR Review Result:', result);
      alert(`Review complete! ${result.approved || 0} approved, ${result.needsRevision || 0} need revision`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getFilteredContent = () => {
    if (filter === 'all') return content;
    return content.filter(c => c.status === filter);
  };

  const stats = {
    total: content.length,
    approved: content.filter(c => c.status === 'approved').length,
    pending: content.filter(c => c.status === 'pending').length,
    rejected: content.filter(c => c.status === 'rejected').length
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
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Content Review Agent</h1>
                  <p className="text-sm text-gray-500">MLR Approval & Content Management</p>
                </div>
              </div>
            </div>
            <button 
              onClick={runMLRReview}
              disabled={isReviewing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isReviewing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Reviewing...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Run MLR Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setFilter(status)}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
                filter === status ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 capitalize">{status === 'all' ? 'Total Assets' : status}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {status === 'all' ? stats.total : stats[status as keyof typeof stats]}
                  </p>
                </div>
                {status !== 'all' && getStatusIcon(status)}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Content Library</h3>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Showing {getFilteredContent().length} assets
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MLR Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Loading content library...
                    </td>
                  </tr>
                ) : getFilteredContent().slice(0, 10).map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.title}</div>
                        <div className="text-xs text-gray-500">{asset.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.theme}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.barrier || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {asset.mlrScore?.toFixed(0) || 'N/A'}
                        </span>
                        {asset.mlrScore && (
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                asset.mlrScore >= 85 ? 'bg-green-600' :
                                asset.mlrScore >= 70 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${asset.mlrScore}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(asset.status)}
                        <span className="text-sm capitalize">{asset.status}</span>
                      </div>
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