'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, PauseCircle, RotateCcw, Settings, Save,
  Zap, Clock, CheckCircle, AlertCircle, ArrowRight,
  GitBranch, Package, Send, FileCheck, Users, Calendar,
  TrendingUp, Mail, Phone, Video, MessageSquare, Globe
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AnimatedCard, AnimatedButton } from '@/components/ui/AnimatedCard';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action' | 'notification';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  icon: any;
  description: string;
  duration?: number;
  config?: any;
  dependencies?: string[];
  outputs?: any;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'campaign' | 'approval' | 'engagement' | 'analysis';
  steps: WorkflowStep[];
  estimatedTime: number;
  successRate: number;
  lastUsed?: Date;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  executionCount: number;
  lastTriggered?: Date;
  successRate: number;
}

interface WorkflowAutomationProps {
  agentId?: string;
  onWorkflowComplete?: (workflowId: string, results: any) => void;
  onStepExecute?: (step: WorkflowStep) => Promise<any>;
}

export function WorkflowAutomation({
  agentId = 'orchestration',
  onWorkflowComplete,
  onStepExecute
}: WorkflowAutomationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  // Mock workflow templates
  const templates: WorkflowTemplate[] = [
    {
      id: 'campaign-launch',
      name: 'Campaign Launch Automation',
      description: 'End-to-end campaign execution from approval to launch',
      category: 'campaign',
      estimatedTime: 45,
      successRate: 92,
      lastUsed: new Date('2024-12-20'),
      steps: [
        {
          id: 'step1',
          name: 'Content Approval Check',
          type: 'trigger',
          status: 'pending',
          icon: FileCheck,
          description: 'Verify all content has MLR approval'
        },
        {
          id: 'step2',
          name: 'Budget Validation',
          type: 'condition',
          status: 'pending',
          icon: TrendingUp,
          description: 'Ensure budget allocation is within limits',
          dependencies: ['step1']
        },
        {
          id: 'step3',
          name: 'Generate Target List',
          type: 'action',
          status: 'pending',
          icon: Users,
          description: 'Create HCP target list based on criteria',
          dependencies: ['step2']
        },
        {
          id: 'step4',
          name: 'Schedule Emails',
          type: 'action',
          status: 'pending',
          icon: Mail,
          description: 'Queue personalized emails for delivery',
          dependencies: ['step3']
        },
        {
          id: 'step5',
          name: 'Deploy Digital Ads',
          type: 'action',
          status: 'pending',
          icon: Globe,
          description: 'Activate programmatic ad campaigns',
          dependencies: ['step3']
        },
        {
          id: 'step6',
          name: 'Notify Field Team',
          type: 'notification',
          status: 'pending',
          icon: MessageSquare,
          description: 'Alert sales reps about campaign launch',
          dependencies: ['step4', 'step5']
        },
        {
          id: 'step7',
          name: 'Track Performance',
          type: 'action',
          status: 'pending',
          icon: Activity,
          description: 'Initialize performance monitoring',
          dependencies: ['step6']
        }
      ]
    },
    {
      id: 'hcp-engagement',
      name: 'HCP Engagement Sequence',
      description: 'Automated multi-touch engagement workflow',
      category: 'engagement',
      estimatedTime: 30,
      successRate: 87,
      lastUsed: new Date('2024-12-22'),
      steps: [
        {
          id: 'step1',
          name: 'Identify High-Value HCPs',
          type: 'trigger',
          status: 'pending',
          icon: Users,
          description: 'Select HCPs with opportunity score >80'
        },
        {
          id: 'step2',
          name: 'Check Engagement History',
          type: 'condition',
          status: 'pending',
          icon: Clock,
          description: 'Verify no recent touchpoints in last 14 days',
          dependencies: ['step1']
        },
        {
          id: 'step3',
          name: 'Send Initial Email',
          type: 'action',
          status: 'pending',
          icon: Mail,
          description: 'Deploy barrier-specific content',
          dependencies: ['step2']
        },
        {
          id: 'step4',
          name: 'Schedule Follow-up Call',
          type: 'action',
          status: 'pending',
          icon: Phone,
          description: 'Create task for field rep',
          dependencies: ['step3']
        },
        {
          id: 'step5',
          name: 'Track Response',
          type: 'action',
          status: 'pending',
          icon: Activity,
          description: 'Monitor email opens and clicks',
          dependencies: ['step3']
        }
      ]
    },
    {
      id: 'compliance-check',
      name: 'Automated Compliance Review',
      description: 'Pre-flight compliance validation for all materials',
      category: 'approval',
      estimatedTime: 15,
      successRate: 98,
      steps: [
        {
          id: 'step1',
          name: 'Scan Content',
          type: 'trigger',
          status: 'pending',
          icon: Search,
          description: 'Analyze content for compliance markers'
        },
        {
          id: 'step2',
          name: 'Check Claims',
          type: 'condition',
          status: 'pending',
          icon: FileCheck,
          description: 'Verify all claims have references',
          dependencies: ['step1']
        },
        {
          id: 'step3',
          name: 'Validate ISI',
          type: 'condition',
          status: 'pending',
          icon: AlertCircle,
          description: 'Ensure ISI meets requirements',
          dependencies: ['step1']
        },
        {
          id: 'step4',
          name: 'Generate Report',
          type: 'action',
          status: 'pending',
          icon: FileText,
          description: 'Create compliance assessment',
          dependencies: ['step2', 'step3']
        }
      ]
    }
  ];

  // Mock automation rules
  const mockRules: AutomationRule[] = [
    {
      id: 'rule1',
      name: 'High-Priority HCP Alert',
      trigger: 'HCP opportunity score increases >90',
      conditions: ['No engagement in 30 days', 'Barrier identified'],
      actions: ['Create field suggestion', 'Send alert to rep', 'Queue for next campaign'],
      enabled: true,
      executionCount: 342,
      lastTriggered: new Date('2024-12-23'),
      successRate: 91
    },
    {
      id: 'rule2',
      name: 'Budget Reallocation',
      trigger: 'Channel ROI drops below threshold',
      conditions: ['Budget remaining >$100k', 'Quarter not ended'],
      actions: ['Calculate optimal reallocation', 'Request approval', 'Execute transfer'],
      enabled: true,
      executionCount: 28,
      lastTriggered: new Date('2024-12-21'),
      successRate: 85
    },
    {
      id: 'rule3',
      name: 'Content Expiry Management',
      trigger: 'Content approaching expiration',
      conditions: ['30 days until expiry', 'Content still in use'],
      actions: ['Notify content team', 'Initiate renewal', 'Update distribution'],
      enabled: false,
      executionCount: 156,
      lastTriggered: new Date('2024-12-15'),
      successRate: 94
    }
  ];

  // Execute workflow step
  const executeStep = useCallback(async (step: WorkflowStep) => {
    // Update step status to running
    setWorkflowSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, status: 'running' } : s
    ));

    // Add to execution log
    setExecutionLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executing: ${step.name}`]);

    // Simulate step execution
    const result = onStepExecute ? await onStepExecute(step) : await simulateStepExecution(step);

    // Update step status based on result
    const newStatus = result.success ? 'completed' : 'failed';
    setWorkflowSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, status: newStatus, outputs: result.data } : s
    ));

    // Add result to log
    setExecutionLog(prev => [...prev, 
      `[${new Date().toLocaleTimeString()}] ${step.name}: ${newStatus.toUpperCase()}`
    ]);

    return result;
  }, [onStepExecute]);

  // Simulate step execution
  const simulateStepExecution = async (step: WorkflowStep): Promise<{ success: boolean; data: any }> => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    return {
      success,
      data: success ? {
        executedAt: new Date(),
        duration: Math.random() * 5000,
        affectedRecords: Math.floor(Math.random() * 100)
      } : {
        error: 'Simulated error for demonstration'
      }
    };
  };

  // Run workflow
  const runWorkflow = useCallback(async () => {
    if (!selectedTemplate) return;

    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setWorkflowSteps(selectedTemplate.steps.map(s => ({ ...s, status: 'pending' })));
    setExecutionLog([`[${new Date().toLocaleTimeString()}] Workflow started: ${selectedTemplate.name}`]);

    for (let i = 0; i < selectedTemplate.steps.length; i++) {
      if (isPaused) {
        await new Promise(resolve => {
          const checkPause = setInterval(() => {
            if (!isPaused) {
              clearInterval(checkPause);
              resolve(undefined);
            }
          }, 100);
        });
      }

      setCurrentStepIndex(i);
      const step = selectedTemplate.steps[i];

      // Check dependencies
      if (step.dependencies) {
        const dependenciesMet = step.dependencies.every(depId => {
          const depStep = workflowSteps.find(s => s.id === depId);
          return depStep?.status === 'completed';
        });

        if (!dependenciesMet) {
          setWorkflowSteps(prev => prev.map(s => 
            s.id === step.id ? { ...s, status: 'skipped' } : s
          ));
          continue;
        }
      }

      const result = await executeStep(step);
      
      if (!result.success && step.type === 'condition') {
        // Stop workflow if critical condition fails
        break;
      }
    }

    setIsRunning(false);
    setExecutionLog(prev => [...prev, 
      `[${new Date().toLocaleTimeString()}] Workflow completed: ${selectedTemplate.name}`
    ]);

    // Notify completion
    onWorkflowComplete?.(selectedTemplate.id, {
      steps: workflowSteps,
      executionLog
    });
  }, [selectedTemplate, isPaused, workflowSteps, executeStep, onWorkflowComplete]);

  useEffect(() => {
    setAutomationRules(mockRules);
  }, []);

  const getStepIcon = (step: WorkflowStep) => {
    const Icon = step.icon;
    return <Icon size={16} />;
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return zsColors.semantic.success;
      case 'running': return zsColors.primary.blue;
      case 'failed': return zsColors.semantic.error;
      case 'skipped': return zsColors.neutral.gray;
      default: return zsColors.neutral.lightGray;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'campaign': return zsColors.agents.customer.primary;
      case 'approval': return zsColors.agents.content.primary;
      case 'engagement': return zsColors.agents.orchestration.primary;
      case 'analysis': return zsColors.agents.budget.primary;
      default: return zsColors.primary.blue;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard 
        className="p-6 bg-white rounded-xl border"
        style={{ borderColor: zsColors.neutral.lightGray }}
        glowColor={zsColors.agents.orchestration.primary}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${zsColors.agents.orchestration.primary}, ${zsColors.agents.orchestration.gradient})`,
                boxShadow: `0 4px 12px ${zsColors.agents.orchestration.primary}30`
              }}
            >
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Workflow Automation Center
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                One-click execution of complex workflows
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isRunning && (
              <AnimatedButton
                onClick={() => setIsPaused(!isPaused)}
                variant="secondary"
                size="sm"
              >
                {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                {isPaused ? 'Resume' : 'Pause'}
              </AnimatedButton>
            )}
            <AnimatedButton
              onClick={() => setShowConfig(!showConfig)}
              variant="ghost"
              size="sm"
            >
              <Settings size={16} />
              Configure
            </AnimatedButton>
          </div>
        </div>

        {/* Workflow Templates */}
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
            Workflow Templates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(template => (
              <AnimatedCard
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id ? 'ring-2' : ''
                }`}
                style={{
                  borderColor: selectedTemplate?.id === template.id 
                    ? getCategoryColor(template.category)
                    : zsColors.neutral.lightGray
                }}
                onClick={() => {
                  setSelectedTemplate(template);
                  setWorkflowSteps(template.steps);
                }}
                hoverScale={1.02}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {template.name}
                    </h5>
                    <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                      {template.description}
                    </p>
                  </div>
                  <span 
                    className="px-2 py-1 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor: getCategoryColor(template.category) + '20',
                      color: getCategoryColor(template.category)
                    }}
                  >
                    {template.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span style={{ color: zsColors.neutral.gray }}>
                      <Clock size={12} className="inline mr-1" />
                      {template.estimatedTime}m
                    </span>
                    <span style={{ color: zsColors.neutral.gray }}>
                      <CheckCircle size={12} className="inline mr-1" />
                      {template.successRate}%
                    </span>
                  </div>
                  <span style={{ color: zsColors.neutral.gray }}>
                    {template.steps.length} steps
                  </span>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Workflow Visualization */}
        {selectedTemplate && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                Workflow Steps
              </h4>
              <AnimatedButton
                onClick={runWorkflow}
                disabled={isRunning}
                variant="primary"
                size="sm"
                style={{ backgroundColor: zsColors.agents.orchestration.primary }}
              >
                <PlayCircle size={16} />
                {isRunning ? 'Running...' : 'Execute Workflow'}
              </AnimatedButton>
            </div>
            
            <div className="relative">
              {/* Steps */}
              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: currentStepIndex === index && isRunning ? 1.02 : 1
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center gap-4 p-4 rounded-lg border ${
                      currentStepIndex === index && isRunning ? 'shadow-md' : ''
                    }`}
                    style={{
                      borderColor: currentStepIndex === index && isRunning
                        ? zsColors.primary.blue
                        : zsColors.neutral.lightGray,
                      backgroundColor: step.status === 'running' 
                        ? zsColors.primary.blue + '10'
                        : zsColors.neutral.white
                    }}
                  >
                    {/* Step Number */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: getStepColor(step.status) + '20',
                        color: getStepColor(step.status)
                      }}
                    >
                      {step.status === 'running' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Zap size={16} />
                        </motion.div>
                      ) : step.status === 'completed' ? (
                        <CheckCircle size={16} />
                      ) : step.status === 'failed' ? (
                        <AlertCircle size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: getStepColor(step.status) }}>
                          {getStepIcon(step)}
                        </span>
                        <h5 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                          {step.name}
                        </h5>
                        <span 
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: getStepColor(step.status) + '20',
                            color: getStepColor(step.status)
                          }}
                        >
                          {step.type}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {step.description}
                      </p>
                      {step.dependencies && (
                        <div className="flex items-center gap-2 mt-2">
                          <GitBranch size={12} style={{ color: zsColors.neutral.gray }} />
                          <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                            Depends on: {step.dependencies.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && step.outputs && (
                        <span className="text-xs" style={{ color: zsColors.semantic.success }}>
                          {step.outputs.affectedRecords} records
                        </span>
                      )}
                      {step.duration && (
                        <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {(step.duration / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>

                    {/* Connection Line */}
                    {index < workflowSteps.length - 1 && (
                      <div 
                        className="absolute left-9 top-14 w-0.5 h-8"
                        style={{ 
                          backgroundColor: step.status === 'completed' 
                            ? zsColors.semantic.success 
                            : zsColors.neutral.lightGray 
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Automation Rules */}
        <div>
          <h4 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
            Active Automation Rules
          </h4>
          <div className="space-y-3">
            {automationRules.map(rule => (
              <div 
                key={rule.id}
                className="p-4 rounded-lg border flex items-center justify-between"
                style={{ 
                  borderColor: zsColors.neutral.lightGray,
                  backgroundColor: rule.enabled ? zsColors.neutral.white : zsColors.neutral.offWhite
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {rule.name}
                    </h5>
                    <span 
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        rule.enabled 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: zsColors.neutral.gray }}>
                    Trigger: {rule.trigger}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>
                      Executed: <strong>{rule.executionCount}</strong> times
                    </span>
                    <span style={{ color: zsColors.neutral.gray }}>
                      Success: <strong>{rule.successRate}%</strong>
                    </span>
                    {rule.lastTriggered && (
                      <span style={{ color: zsColors.neutral.gray }}>
                        Last: {rule.lastTriggered.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAutomationRules(prev => prev.map(r => 
                      r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                    ));
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: rule.enabled 
                      ? zsColors.semantic.error + '10'
                      : zsColors.semantic.success + '10',
                    color: rule.enabled 
                      ? zsColors.semantic.error
                      : zsColors.semantic.success
                  }}
                >
                  {rule.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Log */}
        {executionLog.length > 0 && (
          <div className="mt-6">
            <h4 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
              Execution Log
            </h4>
            <div 
              className="p-4 rounded-lg font-mono text-xs overflow-y-auto"
              style={{ 
                backgroundColor: zsColors.neutral.charcoal,
                color: zsColors.neutral.white,
                maxHeight: '200px'
              }}
            >
              {executionLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatedCard>
    </div>
  );
}

import { Activity, Search, FileText } from 'lucide-react';