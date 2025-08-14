'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Play, CheckCircle, AlertCircle, 
  Loader2, BarChart3, Database, Cpu, 
  Network, TrendingUp, ChevronRight
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface ModuleExecutorProps {
  moduleId: string;
  moduleName: string;
  moduleColor: { primary: string; light: string };
  tools: string[];
  metrics: string[];
  onComplete: (results: any) => void;
  isActive: boolean;
}

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  output?: any;
}

export function ModuleExecutor({
  moduleId,
  moduleName,
  moduleColor,
  tools,
  metrics,
  onComplete,
  isActive
}: ModuleExecutorProps) {
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive && !isExecuting) {
      startExecution();
    }
  }, [isActive]);

  const getExecutionSteps = (): ExecutionStep[] => {
    switch (moduleId) {
      case 'persona':
        return [
          { id: 'load', name: 'Loading HCP Database', status: 'pending' },
          { id: 'analyze', name: 'Analyzing Prescribing Patterns', status: 'pending' },
          { id: 'detect', name: 'Running Barrier Detection Models', status: 'pending' },
          { id: 'map', name: 'Mapping HCPs to Barriers', status: 'pending' },
          { id: 'calculate', name: 'Calculating Scores', status: 'pending' }
        ];
      case 'performance':
        return [
          { id: 'select', name: 'Selecting KPIs', status: 'pending' },
          { id: 'process', name: 'Processing Historical Data', status: 'pending' },
          { id: 'calculate', name: 'Calculating Metrics', status: 'pending' },
          { id: 'segment', name: 'Segmenting HCPs', status: 'pending' },
          { id: 'trend', name: 'Identifying Trends', status: 'pending' }
        ];
      case 'potential':
        return [
          { id: 'configure', name: 'Configuring ML Models', status: 'pending' },
          { id: 'engineer', name: 'Feature Engineering', status: 'pending' },
          { id: 'train', name: 'Training Ensemble Models', status: 'pending' },
          { id: 'predict', name: 'Generating Predictions', status: 'pending' },
          { id: 'validate', name: 'Validating Results', status: 'pending' }
        ];
      case 'preference':
        return [
          { id: 'analyze', name: 'Analyzing Engagement Data', status: 'pending' },
          { id: 'filter', name: 'Running Collaborative Filtering', status: 'pending' },
          { id: 'score', name: 'Scoring Channel Preferences', status: 'pending' },
          { id: 'map', name: 'Mapping Content Affinity', status: 'pending' },
          { id: 'optimize', name: 'Determining Optimal Cadence', status: 'pending' }
        ];
      case 'microsegmentation':
        return [
          { id: 'combine', name: 'Combining 4P Factors', status: 'pending' },
          { id: 'cluster', name: 'Applying Clustering Algorithms', status: 'pending' },
          { id: 'create', name: 'Creating Microsegments', status: 'pending' },
          { id: 'calculate', name: 'Calculating Value Scores', status: 'pending' },
          { id: 'generate', name: 'Generating Prioritization Options', status: 'pending' }
        ];
      default:
        return [];
    }
  };

  const startExecution = async () => {
    setIsExecuting(true);
    const steps = getExecutionSteps();
    setExecutionSteps(steps);
    
    // Add initial log entry
    addLog(`Starting ${moduleName} execution...`);
    addLog(`Initializing ${tools.length} tools: ${tools.join(', ')}`);

    // Execute each step
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await executeStep(i, steps);
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Complete execution
    setTimeout(() => {
      addLog(`${moduleName} execution completed successfully`);
      setIsExecuting(false);
      onComplete(generateMockResults());
    }, 1000);
  };

  const executeStep = async (index: number, steps: ExecutionStep[]) => {
    const step = steps[index];
    
    // Update step status to running
    setExecutionSteps(prev => prev.map((s, i) => 
      i === index ? { ...s, status: 'running' } : s
    ));
    
    addLog(`Executing: ${step.name}`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Update step status to completed
    setExecutionSteps(prev => prev.map((s, i) => 
      i === index ? { ...s, status: 'completed', duration: 800 + Math.random() * 700 } : s
    ));
    
    addLog(`✓ ${step.name} completed`);
  };

  const addLog = (message: string) => {
    setExecutionLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const generateMockResults = () => {
    const results: Record<string, any> = {
      persona: {
        barriers_analyzed: 5,
        hcps_processed: 2847,
        confidence_score: 89,
        top_barrier: 'Referral Pathways'
      },
      performance: {
        kpis_tracked: 4,
        segments_created: 3,
        trend_direction: 'positive',
        top_segment: 'High Performers'
      },
      potential: {
        models_trained: 2,
        accuracy: 94,
        opportunities_identified: 423,
        total_value: '$45M'
      },
      preference: {
        channels_analyzed: 4,
        top_channel: 'Field',
        content_types: 4,
        optimal_frequency: '2.3/month'
      },
      microsegmentation: {
        segments_created: 5,
        options_generated: 3,
        recommended_strategy: 'Growth Focus',
        priority_hcps: 423
      }
    };

    return results[moduleId] || {};
  };

  const getStepIcon = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'running':
        return <Loader2 size={14} className="animate-spin" style={{ color: moduleColor.primary }} />;
      case 'error':
        return <AlertCircle size={14} className="text-red-600" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-300" />;
    }
  };

  if (!isActive) {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: zsColors.neutral.lightGray }}>
            <Brain size={24} style={{ color: zsColors.neutral.gray }} />
          </div>
          <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
            Module executor waiting for activation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Execution Header */}
      <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${moduleColor.primary}, ${moduleColor.light})`
              }}>
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: zsColors.neutral.charcoal }}>
                {moduleName} Executor
              </h3>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                {isExecuting ? 'Processing...' : 'Ready'}
              </p>
            </div>
          </div>
          
          {isExecuting && (
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium" style={{ color: moduleColor.primary }}>
                {Math.round(progress)}%
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: moduleColor.primary }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Execution Steps */}
        <div className="space-y-2">
          {executionSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg"
              style={{ 
                backgroundColor: step.status === 'running' 
                  ? `${moduleColor.primary}10` 
                  : zsColors.neutral.white
              }}
            >
              {getStepIcon(step.status)}
              <span className="text-sm flex-1" style={{ 
                color: step.status === 'completed' 
                  ? zsColors.neutral.darkGray 
                  : step.status === 'running'
                  ? moduleColor.primary
                  : zsColors.neutral.gray
              }}>
                {step.name}
              </span>
              {step.duration && (
                <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  {(step.duration / 1000).toFixed(1)}s
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tools & Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: zsColors.neutral.white }}>
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} style={{ color: moduleColor.primary }} />
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Active Tools
            </h4>
          </div>
          <div className="space-y-1">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <ChevronRight size={12} style={{ color: moduleColor.primary }} />
                <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  {tool}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: zsColors.neutral.white }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} style={{ color: moduleColor.primary }} />
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Tracking Metrics
            </h4>
          </div>
          <div className="space-y-1">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <ChevronRight size={12} style={{ color: moduleColor.primary }} />
                <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  {metric}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: zsColors.neutral.white }}>
          <div className="flex items-center gap-2 mb-3">
            <Network size={16} style={{ color: moduleColor.primary }} />
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Execution Log
            </h4>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {executionLog.slice(-5).map((log, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-mono"
                style={{ color: zsColors.neutral.gray }}
              >
                {log}
              </motion.p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}