'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, Play, RotateCcw, Save, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Info, Calculator, Zap,
  DollarSign, Users, Target, BarChart3, ArrowRight
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AnimatedCard, AnimatedButton } from '@/components/ui/AnimatedCard';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioParameter {
  id: string;
  name: string;
  description: string;
  type: 'slider' | 'select' | 'number';
  value: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  unit?: string;
  impact: 'high' | 'medium' | 'low';
}

interface SimulationResult {
  metric: string;
  baseline: number;
  simulated: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  confidence: number;
}

interface ComparisonData {
  label: string;
  baseline: number;
  scenario1?: number;
  scenario2?: number;
  scenario3?: number;
}

interface WhatIfSimulatorProps {
  agentId: string;
  agentName: string;
  agentColor?: string;
  parameters?: ScenarioParameter[];
  onSimulate?: (params: any) => Promise<SimulationResult[]>;
  presetScenarios?: { name: string; params: any }[];
}

export function WhatIfSimulator({
  agentId,
  agentName,
  agentColor = zsColors.primary.blue,
  parameters: customParameters,
  onSimulate,
  presetScenarios = []
}: WhatIfSimulatorProps) {
  // Default parameters if not provided
  const defaultParameters: ScenarioParameter[] = customParameters || [
    {
      id: 'budget',
      name: 'Total Budget',
      description: 'Overall promotional budget allocation',
      type: 'slider',
      value: 47000000,
      min: 30000000,
      max: 70000000,
      step: 1000000,
      unit: '$',
      impact: 'high'
    },
    {
      id: 'digital_allocation',
      name: 'Digital Channel %',
      description: 'Percentage of budget for digital channels',
      type: 'slider',
      value: 35,
      min: 10,
      max: 60,
      step: 5,
      unit: '%',
      impact: 'high'
    },
    {
      id: 'hcp_threshold',
      name: 'HCP Opportunity Threshold',
      description: 'Minimum score to prioritize HCP',
      type: 'slider',
      value: 70,
      min: 50,
      max: 90,
      step: 5,
      unit: 'pts',
      impact: 'medium'
    },
    {
      id: 'barrier_weight',
      name: 'Barrier Weight Adjustment',
      description: 'Emphasis on barrier resolution',
      type: 'select',
      value: 'balanced',
      options: [
        { label: 'Conservative', value: 'conservative' },
        { label: 'Balanced', value: 'balanced' },
        { label: 'Aggressive', value: 'aggressive' }
      ],
      impact: 'medium'
    },
    {
      id: 'engagement_frequency',
      name: 'Engagement Frequency',
      description: 'Average touchpoints per HCP per quarter',
      type: 'number',
      value: 8,
      min: 4,
      max: 16,
      step: 1,
      unit: 'touches',
      impact: 'low'
    }
  ];

  const [parameters, setParameters] = useState<ScenarioParameter[]>(defaultParameters);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock simulation function if not provided
  const runSimulation = useCallback(async (params: any): Promise<SimulationResult[]> => {
    if (onSimulate) {
      return onSimulate(params);
    }

    // Mock simulation with realistic results
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

    const budgetImpact = (params.budget - 47000000) / 47000000;
    const digitalImpact = (params.digital_allocation - 35) / 100;
    const thresholdImpact = (70 - params.hcp_threshold) / 100;

    return [
      {
        metric: 'Expected ROI',
        baseline: 4.2,
        simulated: 4.2 * (1 + budgetImpact * 0.3 + digitalImpact * 0.4),
        change: 0,
        changePercent: 0,
        trend: 'neutral',
        confidence: 85
      },
      {
        metric: 'HCP Reach',
        baseline: 2847,
        simulated: Math.round(2847 * (1 + thresholdImpact * 0.5)),
        change: 0,
        changePercent: 0,
        trend: 'neutral',
        confidence: 78
      },
      {
        metric: 'Conversion Rate',
        baseline: 23,
        simulated: 23 * (1 + digitalImpact * 0.2 + thresholdImpact * 0.1),
        change: 0,
        changePercent: 0,
        trend: 'neutral',
        confidence: 72
      },
      {
        metric: 'Cost per Conversion',
        baseline: 1250,
        simulated: 1250 / (1 + budgetImpact * 0.2),
        change: 0,
        changePercent: 0,
        trend: 'neutral',
        confidence: 81
      },
      {
        metric: 'Barrier Resolution Rate',
        baseline: 67,
        simulated: 67 * (1 + (params.barrier_weight === 'aggressive' ? 0.15 : params.barrier_weight === 'conservative' ? -0.1 : 0)),
        change: 0,
        changePercent: 0,
        trend: 'neutral',
        confidence: 69
      }
    ].map(result => ({
      ...result,
      change: result.simulated - result.baseline,
      changePercent: ((result.simulated - result.baseline) / result.baseline) * 100,
      trend: result.simulated > result.baseline ? 'up' : result.simulated < result.baseline ? 'down' : 'neutral'
    }));
  }, [onSimulate]);

  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => prev.map(param => 
      param.id === paramId ? { ...param, value } : param
    ));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    const paramValues = parameters.reduce((acc, param) => ({
      ...acc,
      [param.id]: param.value
    }), {});
    
    try {
      const simulationResults = await runSimulation(paramValues);
      setResults(simulationResults);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setParameters(defaultParameters);
    setResults([]);
  };

  const handleSaveScenario = () => {
    const scenario = {
      id: Date.now().toString(),
      name: `Scenario ${savedScenarios.length + 1}`,
      timestamp: new Date(),
      parameters: parameters.reduce((acc, param) => ({
        ...acc,
        [param.id]: param.value
      }), {}),
      results: results
    };
    setSavedScenarios(prev => [...prev, scenario]);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return zsColors.semantic.error;
      case 'medium': return zsColors.semantic.warning;
      case 'low': return zsColors.semantic.success;
      default: return zsColors.neutral.gray;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} style={{ color: zsColors.semantic.success }} />;
      case 'down': return <TrendingDown size={16} style={{ color: zsColors.semantic.error }} />;
      default: return <span className="w-4 h-[2px] bg-gray-400 inline-block" />;
    }
  };

  // Generate comparison chart data
  const comparisonData: ComparisonData[] = results.map(result => ({
    label: result.metric,
    baseline: result.baseline,
    scenario1: result.simulated
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard 
        className="p-6 bg-white rounded-xl border"
        style={{ borderColor: zsColors.neutral.lightGray }}
        glowColor={agentColor}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${agentColor}, ${agentColor}CC)`,
                boxShadow: `0 4px 12px ${agentColor}30`
              }}
            >
              <Calculator className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                What-If Scenario Simulator
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Explore different scenarios and predict outcomes
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <AnimatedButton
              onClick={handleReset}
              variant="ghost"
              size="sm"
            >
              <RotateCcw size={16} />
              Reset
            </AnimatedButton>
            {results.length > 0 && (
              <AnimatedButton
                onClick={handleSaveScenario}
                variant="secondary"
                size="sm"
              >
                <Save size={16} />
                Save Scenario
              </AnimatedButton>
            )}
          </div>
        </div>

        {/* Preset Scenarios */}
        {presetScenarios.length > 0 && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <p className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
              Quick Scenarios:
            </p>
            <div className="flex flex-wrap gap-2">
              {presetScenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => {
                    Object.entries(scenario.params).forEach(([key, value]) => {
                      handleParameterChange(key, value);
                    });
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`,
                    color: zsColors.neutral.darkGray
                  }}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Parameters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-semibold" style={{ color: zsColors.neutral.charcoal }}>
              Simulation Parameters
            </h4>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm flex items-center gap-1"
              style={{ color: agentColor }}
            >
              {showAdvanced ? 'Hide' : 'Show'} advanced
              <Sliders size={14} />
            </button>
          </div>

          {parameters
            .filter(param => showAdvanced || param.impact === 'high')
            .map(param => (
            <div key={param.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                    {param.name}
                  </span>
                  <span 
                    className="px-2 py-0.5 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor: getImpactColor(param.impact) + '20',
                      color: getImpactColor(param.impact)
                    }}
                  >
                    {param.impact} impact
                  </span>
                  <span title={param.description}>
                    <Info size={14} style={{ color: zsColors.neutral.gray }} className="cursor-help" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {param.type === 'slider' && (
                    <>
                      <span className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                        {typeof param.value === 'number' && param.unit === '$' 
                          ? `$${(param.value / 1000000).toFixed(1)}M`
                          : `${param.value}${param.unit || ''}`}
                      </span>
                    </>
                  )}
                  {param.type === 'select' && (
                    <span className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                      {param.options?.find(opt => opt.value === param.value)?.label}
                    </span>
                  )}
                  {param.type === 'number' && (
                    <span className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>
                      {param.value}{param.unit || ''}
                    </span>
                  )}
                </div>
              </div>
              
              {param.type === 'slider' && (
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {param.unit === '$' ? `$${((param.min || 0) / 1000000).toFixed(0)}M` : param.min}
                  </span>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value as number}
                    onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                    className="flex-1"
                    style={{ accentColor: agentColor }}
                  />
                  <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {param.unit === '$' ? `$${((param.max || 0) / 1000000).toFixed(0)}M` : param.max}
                  </span>
                </div>
              )}
              
              {param.type === 'select' && (
                <select
                  value={param.value as string}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`,
                    color: zsColors.neutral.charcoal
                  }}
                >
                  {param.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {param.type === 'number' && (
                <input
                  type="number"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value as number}
                  onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: zsColors.neutral.white,
                    border: `1px solid ${zsColors.neutral.lightGray}`,
                    color: zsColors.neutral.charcoal
                  }}
                />
              )}
              
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                {param.description}
              </p>
            </div>
          ))}
        </div>

        {/* Simulate Button */}
        <div className="mt-6 flex justify-center">
          <AnimatedButton
            onClick={handleSimulate}
            disabled={isSimulating}
            variant="primary"
            size="lg"
            style={{
              backgroundColor: agentColor,
              minWidth: '200px'
            }}
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap size={20} />
                </motion.div>
                Simulating...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Simulation
              </>
            )}
          </AnimatedButton>
        </div>
      </AnimatedCard>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.slice(0, 6).map((result, index) => (
                <AnimatedCard
                  key={index}
                  className="p-4 bg-white rounded-lg border"
                  style={{ borderColor: zsColors.neutral.lightGray }}
                  hoverScale={1.03}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: zsColors.neutral.gray }}>
                        {result.metric}
                      </p>
                      <p className="text-2xl font-bold mt-1" style={{ color: zsColors.neutral.charcoal }}>
                        {result.metric.includes('Rate') || result.metric.includes('%') 
                          ? `${result.simulated.toFixed(1)}%`
                          : result.metric.includes('Cost') || result.metric.includes('$')
                          ? `$${result.simulated.toFixed(0)}`
                          : result.simulated.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      {getTrendIcon(result.trend)}
                      <p className={`text-sm font-semibold mt-1`}
                        style={{ 
                          color: result.trend === 'up' ? zsColors.semantic.success : 
                                 result.trend === 'down' ? zsColors.semantic.error : 
                                 zsColors.neutral.gray 
                        }}
                      >
                        {result.changePercent > 0 ? '+' : ''}{result.changePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>Baseline:</span>
                      <span style={{ color: zsColors.neutral.darkGray }}>
                        {result.metric.includes('Rate') || result.metric.includes('%')
                          ? `${result.baseline.toFixed(1)}%`
                          : result.metric.includes('Cost') || result.metric.includes('$')
                          ? `$${result.baseline.toFixed(0)}`
                          : result.baseline.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>Confidence:</span>
                      <span style={{ color: zsColors.neutral.darkGray }}>{result.confidence}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${result.confidence}%`,
                          backgroundColor: result.confidence > 80 ? zsColors.semantic.success :
                                         result.confidence > 60 ? zsColors.semantic.warning :
                                         zsColors.semantic.error
                        }}
                      />
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Comparison Chart */}
            <AnimatedCard 
              className="p-6 bg-white rounded-lg border"
              style={{ borderColor: zsColors.neutral.lightGray }}
            >
              <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                Baseline vs Simulated Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={zsColors.neutral.lightGray} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 11 }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="baseline" fill={zsColors.neutral.gray} name="Baseline" />
                  <Bar dataKey="scenario1" fill={agentColor} name="Simulated" />
                </BarChart>
              </ResponsiveContainer>
            </AnimatedCard>

            {/* Saved Scenarios */}
            {savedScenarios.length > 0 && (
              <AnimatedCard 
                className="p-6 bg-white rounded-lg border"
                style={{ borderColor: zsColors.neutral.lightGray }}
              >
                <h4 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                  Saved Scenarios
                </h4>
                <div className="space-y-3">
                  {savedScenarios.map(scenario => (
                    <div 
                      key={scenario.id}
                      className="p-4 rounded-lg border flex items-center justify-between"
                      style={{ 
                        backgroundColor: zsColors.neutral.offWhite,
                        borderColor: zsColors.neutral.lightGray
                      }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {scenario.name}
                        </p>
                        <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                          {new Date(scenario.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          Object.entries(scenario.parameters).forEach(([key, value]) => {
                            handleParameterChange(key, value as any);
                          });
                          setResults(scenario.results);
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                        style={{
                          backgroundColor: zsColors.neutral.white,
                          border: `1px solid ${zsColors.neutral.lightGray}`,
                          color: agentColor
                        }}
                      >
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}