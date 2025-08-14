'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Users, TrendingUp, FileCheck, Brain, 
  Zap, HeadphonesIcon, CheckCircle, Clock, Play
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { Workflow, WorkflowStep } from '@/lib/workflows/customer-priority-workflow';

interface WorkflowVisualizationProps {
  workflow: Workflow;
  onStepClick?: (step: WorkflowStep, index: number) => void;
}

const agentIcons: Record<string, any> = {
  omni: Sparkles,
  customer: Users,
  engagement: TrendingUp,
  'content-planning': FileCheck,
  'content-generation': Sparkles,
  'content-approval': FileCheck,
  content: FileCheck, // Legacy support
  orchestration: Brain,
  activation: Zap,
  suggestions: Brain,
  copilot: HeadphonesIcon
};

const agentColors: Record<string, any> = {
  omni: { primary: '#6B46C1', light: '#9F7AEA' },
  customer: { primary: '#002B5C', light: '#0075BE' },
  engagement: { primary: '#0075BE', light: '#00A3E0' },
  'content-planning': { primary: '#8B5CF6', light: '#A78BFA' },
  'content-generation': { primary: '#6366F1', light: '#818CF8' },
  'content-approval': { primary: '#10B981', light: '#34D399' },
  content: { primary: '#00A3E0', light: '#4FC3F7' }, // Legacy support
  orchestration: { primary: '#FF6B35', light: '#FF8F65' },
  activation: { primary: '#14B8A6', light: '#5EEAD4' },
  suggestions: { primary: '#F59E0B', light: '#FBBf24' },
  copilot: { primary: '#4CAF50', light: '#66BB6A' }
};

export function WorkflowVisualization({ workflow, onStepClick }: WorkflowVisualizationProps) {
  const getStepIcon = (agent: string) => {
    const Icon = agentIcons[agent] || Sparkles;
    return Icon;
  };

  const getStepColor = (agent: string) => {
    return agentColors[agent] || { primary: '#6B46C1', light: '#9F7AEA' };
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'active':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Play size={16} className="text-blue-600" />
          </motion.div>
        );
      case 'review':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-orange-500 text-xs font-bold">!</span>
          </motion.div>
        );
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
            {workflow.name}
          </h3>
          <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
            {workflow.description}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ backgroundColor: `${zsColors.primary.blue}20` }}>
          <span className="text-xs font-medium" style={{ color: zsColors.primary.blue }}>
            Step {workflow.currentStep + 1} of {workflow.steps.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {workflow.steps.map((step, index) => {
          const Icon = getStepIcon(step.agent);
          const color = getStepColor(step.agent);
          const isActive = step.status === 'active' || step.status === 'review';
          const isCompleted = step.status === 'completed' || step.status === 'approved';
          const needsReview = step.status === 'review';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className="group"
            >
              <div
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all"
                style={{
                  borderColor: isActive ? color.primary : isCompleted ? zsColors.secondary.green : zsColors.neutral.lightGray,
                  backgroundColor: isActive ? `${color.primary}10` : zsColors.neutral.white
                }}
                onClick={() => onStepClick?.(step, index)}
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: isCompleted ? zsColors.secondary.green : isActive ? color.primary : zsColors.neutral.lightGray,
                      color: isCompleted || isActive ? 'white' : zsColors.neutral.gray
                    }}>
                    {index + 1}
                  </div>
                </div>

                {/* Agent Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: isActive || isCompleted 
                        ? `linear-gradient(135deg, ${color.primary}, ${color.light})`
                        : zsColors.neutral.lightGray,
                      opacity: step.status === 'pending' ? 0.5 : 1
                    }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Step Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                        {step.action}
                      </p>
                      {step.module && (
                        <p className="text-xs mt-1 font-medium" style={{ color: color.primary }}>
                          Module: {step.module}
                        </p>
                      )}
                      {step.data && (
                        <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                          {step.data.details || step.data.module}
                        </p>
                      )}
                      {needsReview && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs mt-2 px-2 py-1 rounded-full inline-block"
                          style={{ 
                            backgroundColor: `${zsColors.secondary.orange}20`,
                            color: zsColors.secondary.orange
                          }}>
                          Review Required
                        </motion.p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {getStatusIcon(step.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              {index < workflow.steps.length - 1 && (
                <div className="ml-4 h-4 border-l-2 transition-all"
                  style={{
                    borderColor: isCompleted ? zsColors.secondary.green : zsColors.neutral.lightGray,
                    marginLeft: '16px'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
            Workflow Progress
          </span>
          <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
            {Math.round((workflow.steps.filter(s => s.status === 'completed' || s.status === 'approved').length / workflow.steps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(workflow.steps.filter(s => s.status === 'completed' || s.status === 'approved').length / workflow.steps.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: zsColors.secondary.green }}
          />
        </div>
      </div>
    </div>
  );
}