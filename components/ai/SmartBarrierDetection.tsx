'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, TrendingUp, Brain, Search, 
  Lightbulb, Target, Activity, BarChart3, Info,
  CheckCircle, XCircle, Clock, Zap, ArrowRight,
  RefreshCw, Filter, Download, ChevronDown
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AnimatedCard, AnimatedButton } from '@/components/ui/AnimatedCard';
import { ExportButton } from '@/components/ui/ExportButton';
import { LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Define the 5 primary barriers
const PRIMARY_BARRIERS = [
  { id: 'B001', name: 'Referral Pathways', description: 'No/challenging referral pathways to specialists' },
  { id: 'B002', name: 'Side Effects', description: 'Managing side effects requires additional resources' },
  { id: 'B003', name: 'Insurance Denials', description: 'Insurance denials due to administrative confusion' },
  { id: 'B004', name: 'Formulary Status', description: 'Product not yet approved in organizational formulary' },
  { id: 'B005', name: 'Diagnostic Tools', description: 'Requires new diagnostic test/tool not widely recognized' }
];

interface EmergingBarrier {
  id: string;
  name: string;
  description: string;
  prevalence: number;
  growthRate: number;
  affectedHCPs: number;
  confidence: number;
  firstDetected: Date;
  trend: 'emerging' | 'growing' | 'stable' | 'declining';
  relatedTo: string[];
  suggestedActions: string[];
}

interface BarrierPattern {
  pattern: string;
  frequency: number;
  territories: string[];
  correlation: number;
  insight: string;
}

interface ResolutionPlaybook {
  barrierId: string;
  barrierName: string;
  successRate: number;
  avgResolutionTime: number;
  steps: {
    order: number;
    action: string;
    resources: string[];
    expectedOutcome: string;
    successProbability: number;
  }[];
  bestPractices: string[];
  commonPitfalls: string[];
}

interface SmartBarrierDetectionProps {
  agentId?: string;
  hcpData?: any[];
  onBarrierDetected?: (barrier: EmergingBarrier) => void;
  onPlaybookRequest?: (barrierId: string) => void;
}

export function SmartBarrierDetection({
  agentId = 'customer',
  hcpData = [],
  onBarrierDetected,
  onPlaybookRequest
}: SmartBarrierDetectionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'emerging' | 'patterns' | 'playbooks'>('overview');
  const [emergingBarriers, setEmergingBarriers] = useState<EmergingBarrier[]>([]);
  const [patterns, setPatterns] = useState<BarrierPattern[]>([]);
  const [playbooks, setPlaybooks] = useState<ResolutionPlaybook[]>([]);
  const [selectedBarrier, setSelectedBarrier] = useState<string | null>(null);
  const [filterTerritory, setFilterTerritory] = useState<string>('all');
  const [showOnlyEmerging, setShowOnlyEmerging] = useState(false);
  const [barrierTrends, setBarrierTrends] = useState<any[]>([]);

  // Mock emerging barriers
  const mockEmergingBarriers: EmergingBarrier[] = [
    {
      id: 'E001',
      name: 'Telemedicine Integration',
      description: 'HCPs struggling with remote patient monitoring integration',
      prevalence: 18,
      growthRate: 45,
      affectedHCPs: 287,
      confidence: 82,
      firstDetected: new Date('2024-10-15'),
      trend: 'emerging',
      relatedTo: ['B001', 'B005'],
      suggestedActions: [
        'Provide telemedicine training resources',
        'Develop integration guides',
        'Partner with telehealth platforms'
      ]
    },
    {
      id: 'E002',
      name: 'Biosimilar Confusion',
      description: 'Uncertainty about biosimilar substitution policies',
      prevalence: 23,
      growthRate: 32,
      affectedHCPs: 412,
      confidence: 76,
      firstDetected: new Date('2024-11-01'),
      trend: 'growing',
      relatedTo: ['B003', 'B004'],
      suggestedActions: [
        'Create biosimilar education materials',
        'Clarify substitution guidelines',
        'Engage with pharmacy teams'
      ]
    },
    {
      id: 'E003',
      name: 'Patient Cost Concerns',
      description: 'Increasing patient out-of-pocket costs affecting adherence',
      prevalence: 31,
      growthRate: 28,
      affectedHCPs: 623,
      confidence: 89,
      firstDetected: new Date('2024-09-20'),
      trend: 'growing',
      relatedTo: ['B003'],
      suggestedActions: [
        'Enhance patient assistance programs',
        'Provide cost comparison tools',
        'Develop affordability resources'
      ]
    }
  ];

  // Mock barrier patterns
  const mockPatterns: BarrierPattern[] = [
    {
      pattern: 'Referral + Insurance combo',
      frequency: 34,
      territories: ['Northeast', 'Midwest'],
      correlation: 0.72,
      insight: 'HCPs with referral barriers are 72% more likely to also face insurance issues'
    },
    {
      pattern: 'Formulary delays in Q1',
      frequency: 28,
      territories: ['West', 'Southwest'],
      correlation: 0.65,
      insight: 'Formulary approvals significantly slower in Q1 due to budget cycles'
    },
    {
      pattern: 'Side effects in elderly',
      frequency: 41,
      territories: ['Southeast', 'Florida'],
      correlation: 0.81,
      insight: 'Side effect concerns 81% higher in practices with >60% elderly patients'
    }
  ];

  // Mock resolution playbooks
  const mockPlaybooks: ResolutionPlaybook[] = [
    {
      barrierId: 'B001',
      barrierName: 'Referral Pathways',
      successRate: 76,
      avgResolutionTime: 21,
      steps: [
        {
          order: 1,
          action: 'Map existing referral network',
          resources: ['Network analysis tool', 'HCP relationship map'],
          expectedOutcome: 'Complete visibility of referral patterns',
          successProbability: 95
        },
        {
          order: 2,
          action: 'Identify referral champions',
          resources: ['Champion identification criteria', 'Engagement toolkit'],
          expectedOutcome: '3-5 champion specialists identified',
          successProbability: 82
        },
        {
          order: 3,
          action: 'Facilitate introductions',
          resources: ['Introduction templates', 'Meeting coordination support'],
          expectedOutcome: 'Direct connections established',
          successProbability: 71
        },
        {
          order: 4,
          action: 'Provide referral tools',
          resources: ['Digital referral platform', 'Paper forms', 'Training materials'],
          expectedOutcome: 'Streamlined referral process',
          successProbability: 68
        }
      ],
      bestPractices: [
        'Start with high-volume prescribers',
        'Use peer-to-peer introductions',
        'Provide bi-directional communication tools',
        'Track referral completion rates'
      ],
      commonPitfalls: [
        'Forcing connections without mutual interest',
        'Ignoring existing referral preferences',
        'Not following up after initial introduction'
      ]
    },
    {
      barrierId: 'B003',
      barrierName: 'Insurance Denials',
      successRate: 83,
      avgResolutionTime: 14,
      steps: [
        {
          order: 1,
          action: 'Analyze denial patterns',
          resources: ['Denial analytics dashboard', 'Payer policies database'],
          expectedOutcome: 'Root causes identified for 90% of denials',
          successProbability: 88
        },
        {
          order: 2,
          action: 'Create prior auth templates',
          resources: ['PA template library', 'Clinical evidence packets'],
          expectedOutcome: 'Standardized PA process',
          successProbability: 91
        },
        {
          order: 3,
          action: 'Train office staff',
          resources: ['Training modules', 'Quick reference guides', 'Support hotline'],
          expectedOutcome: 'Staff proficiency in PA process',
          successProbability: 79
        },
        {
          order: 4,
          action: 'Implement appeals process',
          resources: ['Appeals toolkit', 'Legal support', 'Success stories'],
          expectedOutcome: '60% appeals success rate',
          successProbability: 74
        }
      ],
      bestPractices: [
        'Document medical necessity thoroughly',
        'Submit PAs electronically when possible',
        'Follow up within 48 hours',
        'Maintain payer contact relationships'
      ],
      commonPitfalls: [
        'Incomplete clinical documentation',
        'Missing deadlines for appeals',
        'Not leveraging patient assistance programs'
      ]
    }
  ];

  // Simulate barrier detection
  const runSmartDetection = useCallback(async () => {
    setIsScanning(true);
    
    // Simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update with detected barriers
    setEmergingBarriers(mockEmergingBarriers);
    setPatterns(mockPatterns);
    setPlaybooks(mockPlaybooks);
    
    // Generate trend data
    const trends = PRIMARY_BARRIERS.map(barrier => ({
      name: barrier.name,
      month1: Math.random() * 30 + 20,
      month2: Math.random() * 30 + 25,
      month3: Math.random() * 30 + 22,
      month4: Math.random() * 30 + 28,
      month5: Math.random() * 30 + 24,
      month6: Math.random() * 30 + 26
    }));
    setBarrierTrends(trends);
    
    setIsScanning(false);
    
    // Notify about new barriers
    mockEmergingBarriers.forEach(barrier => {
      onBarrierDetected?.(barrier);
    });
  }, [onBarrierDetected]);

  useEffect(() => {
    // Auto-run detection on mount
    runSmartDetection();
  }, []);

  // Radar chart data for barrier analysis
  const radarData = PRIMARY_BARRIERS.map(barrier => ({
    barrier: barrier.name.split(' ')[0],
    current: Math.random() * 40 + 30,
    predicted: Math.random() * 40 + 35,
    resolved: Math.random() * 30 + 20
  }));

  const getBarrierIcon = (trend: string) => {
    switch (trend) {
      case 'emerging': return <Zap size={16} style={{ color: zsColors.semantic.warning }} />;
      case 'growing': return <TrendingUp size={16} style={{ color: zsColors.semantic.error }} />;
      case 'stable': return <Activity size={16} style={{ color: zsColors.primary.blue }} />;
      case 'declining': return <TrendingUp size={16} style={{ color: zsColors.semantic.success, transform: 'rotate(180deg)' }} />;
      default: return null;
    }
  };

  const territories = ['All', 'Northeast', 'Southeast', 'Midwest', 'West', 'Southwest', 'Florida'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard 
        className="p-6 bg-white rounded-xl border"
        style={{ borderColor: zsColors.neutral.lightGray }}
        glowColor={zsColors.agents.customer.primary}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${zsColors.agents.customer.primary}, ${zsColors.agents.customer.gradient})`,
                boxShadow: `0 4px 12px ${zsColors.agents.customer.primary}30`
              }}
            >
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Smart Barrier Detection System
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                ML-powered barrier discovery and resolution
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <AnimatedButton
              onClick={runSmartDetection}
              variant="secondary"
              size="sm"
              disabled={isScanning}
            >
              <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'Scanning...' : 'Re-scan'}
            </AnimatedButton>
            <ExportButton 
              data={emergingBarriers}
              elementId="barrier-detection"
              filename="barrier_analysis"
              variant="minimal"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-2">
              <Brain size={20} style={{ color: zsColors.agents.customer.primary }} />
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: zsColors.semantic.error + '20',
                  color: zsColors.semantic.error
                }}
              >
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {emergingBarriers.length}
            </p>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
              Emerging Barriers
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-2">
              <Target size={20} style={{ color: zsColors.semantic.success }} />
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: zsColors.semantic.success + '20',
                  color: zsColors.semantic.success
                }}
              >
                76%
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              1,322
            </p>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
              HCPs Affected
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-2">
              <Activity size={20} style={{ color: zsColors.secondary.orange }} />
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: zsColors.secondary.orange + '20',
                  color: zsColors.secondary.orange
                }}
              >
                Growing
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {patterns.length}
            </p>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
              Patterns Detected
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={20} style={{ color: zsColors.primary.blue }} />
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: zsColors.primary.blue + '20',
                  color: zsColors.primary.blue
                }}
              >
                Ready
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {playbooks.length}
            </p>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
              Resolution Playbooks
            </p>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'emerging', label: 'Emerging Barriers', icon: AlertTriangle },
            { id: 'patterns', label: 'Patterns', icon: Search },
            { id: 'playbooks', label: 'Resolution Playbooks', icon: Lightbulb }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                selectedView === view.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div id="barrier-detection">
          {/* Overview */}
          {selectedView === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Barrier Trends */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: zsColors.neutral.lightGray }}>
                <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                  Barrier Prevalence Trends (6 Months)
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={barrierTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke={zsColors.neutral.lightGray} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    {['month1', 'month2', 'month3', 'month4', 'month5', 'month6'].map((month, index) => (
                      <Line
                        key={month}
                        type="monotone"
                        dataKey={month}
                        stroke={Object.values(zsColors.agents)[index % 6].primary}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name={`Month ${index + 1}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border" style={{ borderColor: zsColors.neutral.lightGray }}>
                  <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                    Barrier Impact Analysis
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={zsColors.neutral.lightGray} />
                      <PolarAngleAxis dataKey="barrier" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 60]} tick={{ fontSize: 10 }} />
                      <Radar 
                        name="Current" 
                        dataKey="current" 
                        stroke={zsColors.agents.customer.primary}
                        fill={zsColors.agents.customer.primary}
                        fillOpacity={0.3}
                      />
                      <Radar 
                        name="Predicted" 
                        dataKey="predicted" 
                        stroke={zsColors.semantic.warning}
                        fill={zsColors.semantic.warning}
                        fillOpacity={0.3}
                      />
                      <Radar 
                        name="Resolved" 
                        dataKey="resolved" 
                        stroke={zsColors.semantic.success}
                        fill={zsColors.semantic.success}
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg p-6 border" style={{ borderColor: zsColors.neutral.lightGray }}>
                  <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                    Detection Confidence
                  </h4>
                  <div className="space-y-3">
                    {emergingBarriers.map(barrier => (
                      <div key={barrier.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getBarrierIcon(barrier.trend)}
                          <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                            {barrier.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${barrier.confidence}%`,
                                backgroundColor: barrier.confidence > 80 
                                  ? zsColors.semantic.success 
                                  : barrier.confidence > 60 
                                  ? zsColors.semantic.warning 
                                  : zsColors.semantic.error
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium w-10 text-right" 
                            style={{ color: zsColors.neutral.gray }}
                          >
                            {barrier.confidence}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Emerging Barriers */}
          {selectedView === 'emerging' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOnlyEmerging(!showOnlyEmerging)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      showOnlyEmerging 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Filter size={14} className="inline mr-1" />
                    Emerging Only
                  </button>
                  <select
                    value={filterTerritory}
                    onChange={(e) => setFilterTerritory(e.target.value)}
                    className="px-3 py-1.5 text-sm rounded-lg border"
                    style={{ 
                      borderColor: zsColors.neutral.lightGray,
                      color: zsColors.neutral.charcoal
                    }}
                  >
                    {territories.map(territory => (
                      <option key={territory} value={territory.toLowerCase()}>
                        {territory}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  {emergingBarriers.length} barriers detected
                </p>
              </div>

              {/* Barrier Cards */}
              {emergingBarriers
                .filter(barrier => !showOnlyEmerging || barrier.trend === 'emerging')
                .map(barrier => (
                <AnimatedCard
                  key={barrier.id}
                  className="p-5 bg-white rounded-lg border"
                  style={{ 
                    borderColor: selectedBarrier === barrier.id 
                      ? zsColors.agents.customer.primary 
                      : zsColors.neutral.lightGray,
                    borderWidth: selectedBarrier === barrier.id ? 2 : 1
                  }}
                  onClick={() => setSelectedBarrier(barrier.id)}
                  glowColor={zsColors.agents.customer.primary}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: zsColors.semantic.warning + '20',
                          color: zsColors.semantic.warning
                        }}
                      >
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                            {barrier.name}
                          </h4>
                          {getBarrierIcon(barrier.trend)}
                          <span 
                            className="px-2 py-0.5 text-xs rounded-full font-medium"
                            style={{
                              backgroundColor: zsColors.semantic.warning + '20',
                              color: zsColors.semantic.warning
                            }}
                          >
                            {barrier.trend}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                          {barrier.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                        {barrier.prevalence}%
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        prevalence
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Growth Rate</p>
                      <p className="text-sm font-semibold" 
                        style={{ color: barrier.growthRate > 30 ? zsColors.semantic.error : zsColors.neutral.darkGray }}
                      >
                        +{barrier.growthRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Affected HCPs</p>
                      <p className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                        {barrier.affectedHCPs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>First Detected</p>
                      <p className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                        {barrier.firstDetected.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedBarrier === barrier.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-3 mt-3 space-y-3"
                      style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}
                    >
                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                          Related Barriers:
                        </p>
                        <div className="flex gap-2">
                          {barrier.relatedTo.map(id => (
                            <span 
                              key={id}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: zsColors.neutral.offWhite,
                                color: zsColors.neutral.darkGray
                              }}
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                          Suggested Actions:
                        </p>
                        <ul className="space-y-1">
                          {barrier.suggestedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm" 
                              style={{ color: zsColors.neutral.gray }}
                            >
                              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" 
                                style={{ color: zsColors.semantic.success }} 
                              />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => onPlaybookRequest?.(barrier.id)}
                        className="w-full py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{
                          backgroundColor: zsColors.agents.customer.primary,
                          color: zsColors.neutral.white
                        }}
                      >
                        View Resolution Playbook
                        <ArrowRight size={14} className="inline ml-2" />
                      </button>
                    </motion.div>
                  )}
                </AnimatedCard>
              ))}
            </motion.div>
          )}

          {/* Patterns */}
          {selectedView === 'patterns' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {patterns.map((pattern, index) => (
                <AnimatedCard
                  key={index}
                  className="p-5 bg-white rounded-lg border"
                  style={{ borderColor: zsColors.neutral.lightGray }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: zsColors.primary.blue + '20',
                          color: zsColors.primary.blue
                        }}
                      >
                        <Search size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                          {pattern.pattern}
                        </h4>
                        <p className="text-sm mt-1" style={{ color: zsColors.neutral.gray }}>
                          {pattern.insight}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                        {pattern.frequency}%
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        frequency
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {pattern.territories.map(territory => (
                        <span 
                          key={territory}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: zsColors.neutral.offWhite,
                            color: zsColors.neutral.darkGray
                          }}
                        >
                          {territory}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                        Correlation:
                      </span>
                      <span className="text-sm font-semibold" 
                        style={{ 
                          color: pattern.correlation > 0.7 
                            ? zsColors.semantic.success 
                            : pattern.correlation > 0.5 
                            ? zsColors.semantic.warning 
                            : zsColors.semantic.error 
                        }}
                      >
                        {(pattern.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </motion.div>
          )}

          {/* Resolution Playbooks */}
          {selectedView === 'playbooks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {playbooks.map(playbook => (
                <AnimatedCard
                  key={playbook.barrierId}
                  className="p-6 bg-white rounded-lg border"
                  style={{ borderColor: zsColors.neutral.lightGray }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                        {playbook.barrierName} Resolution Playbook
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} style={{ color: zsColors.semantic.success }} />
                          <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                            Success Rate: <strong>{playbook.successRate}%</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} style={{ color: zsColors.primary.blue }} />
                          <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                            Avg Resolution: <strong>{playbook.avgResolutionTime} days</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <ExportButton 
                      data={playbook}
                      filename={`playbook_${playbook.barrierId}`}
                      variant="minimal"
                    />
                  </div>

                  {/* Steps */}
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                      Resolution Steps:
                    </h5>
                    {playbook.steps.map(step => (
                      <div 
                        key={step.order}
                        className="flex gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: zsColors.neutral.offWhite }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                          style={{
                            backgroundColor: zsColors.agents.customer.primary,
                            color: zsColors.neutral.white
                          }}
                        >
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1" style={{ color: zsColors.neutral.charcoal }}>
                            {step.action}
                          </p>
                          <p className="text-xs mb-2" style={{ color: zsColors.neutral.gray }}>
                            Expected: {step.expectedOutcome}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {step.resources.map((resource, i) => (
                                <span 
                                  key={i}
                                  className="px-2 py-0.5 text-xs rounded-full"
                                  style={{
                                    backgroundColor: zsColors.neutral.white,
                                    color: zsColors.neutral.darkGray,
                                    border: `1px solid ${zsColors.neutral.lightGray}`
                                  }}
                                >
                                  {resource}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-medium" 
                              style={{ 
                                color: step.successProbability > 80 
                                  ? zsColors.semantic.success 
                                  : step.successProbability > 60 
                                  ? zsColors.semantic.warning 
                                  : zsColors.semantic.error
                              }}
                            >
                              {step.successProbability}% success
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Best Practices & Pitfalls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.semantic.success + '10' }}>
                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.semantic.success }}>
                        Best Practices
                      </h5>
                      <ul className="space-y-1">
                        {playbook.bestPractices.map((practice, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" 
                            style={{ color: zsColors.neutral.darkGray }}
                          >
                            <CheckCircle size={12} className="mt-0.5 flex-shrink-0" 
                              style={{ color: zsColors.semantic.success }} 
                            />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.semantic.error + '10' }}>
                      <h5 className="text-sm font-semibold mb-2" style={{ color: zsColors.semantic.error }}>
                        Common Pitfalls
                      </h5>
                      <ul className="space-y-1">
                        {playbook.commonPitfalls.map((pitfall, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" 
                            style={{ color: zsColors.neutral.darkGray }}
                          >
                            <XCircle size={12} className="mt-0.5 flex-shrink-0" 
                              style={{ color: zsColors.semantic.error }} 
                            />
                            {pitfall}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </motion.div>
          )}
        </div>
      </AnimatedCard>

      {/* Real-time Alert */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 p-4 bg-white rounded-lg shadow-lg border max-w-sm"
            style={{ borderColor: zsColors.semantic.warning }}
          >
            <div className="flex items-start gap-3">
              <div className="animate-pulse">
                <AlertTriangle size={20} style={{ color: zsColors.semantic.warning }} />
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                  Scanning for New Barriers...
                </p>
                <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                  Analyzing HCP data patterns using ML models
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}