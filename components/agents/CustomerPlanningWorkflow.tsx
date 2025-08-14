'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, CheckCircle, Loader2, MessageSquare,
  User, TrendingUp, Target, Heart, Layers
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { 
  Workflow, 
  WorkflowStep,
  executeWorkflowStep,
  processModuleStep,
  approveModuleStep 
} from '@/lib/workflows/customer-priority-workflow';
import { ModuleChatInterface } from './ModuleChatInterface';
import { ModuleExecutor } from './ModuleExecutor';
import { AgentReasoningPanel } from './AgentReasoningPanel';

interface CustomerPlanningWorkflowProps {
  workflow: Workflow;
  onWorkflowUpdate: (workflow: Workflow) => void;
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
    objectives?: string[];
  };
}

interface ModuleConfig {
  id: string;
  name: string;
  icon: any;
  color: { primary: string; light: string };
  description: string;
}

const moduleConfigs: Record<string, ModuleConfig> = {
  persona: {
    id: 'persona',
    name: 'Persona Analysis',
    icon: User,
    color: { primary: '#8B5CF6', light: '#A78BFA' },
    description: 'Barrier inferencing and HCP classification'
  },
  performance: {
    id: 'performance', 
    name: 'Performance Metrics',
    icon: TrendingUp,
    color: { primary: '#3B82F6', light: '#60A5FA' },
    description: 'KPI selection and historical analysis'
  },
  potential: {
    id: 'potential',
    name: 'Potential Prediction',
    icon: Target,
    color: { primary: '#10B981', light: '#34D399' },
    description: 'ML-based opportunity forecasting'
  },
  preference: {
    id: 'preference',
    name: 'Preference Mapping',
    icon: Heart,
    color: { primary: '#F59E0B', light: '#FBBf24' },
    description: 'Channel and content affinity analysis'
  },
  microsegmentation: {
    id: 'microsegmentation',
    name: 'Microsegmentation',
    icon: Layers,
    color: { primary: '#EF4444', light: '#F87171' },
    description: 'Combine factors for final segments'
  }
};

export function CustomerPlanningWorkflow({ 
  workflow, 
  onWorkflowUpdate,
  brandContext 
}: CustomerPlanningWorkflowProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showReasoningPanel, setShowReasoningPanel] = useState(true);
  const [showExecutor, setShowExecutor] = useState(false);
  const [processingModule, setProcessingModule] = useState(false);
  const [moduleResults, setModuleResults] = useState<Record<string, any>>({});

  // Find current active step
  const currentStep = workflow.steps[workflow.currentStep];
  const currentModuleConfig = currentStep?.module ? moduleConfigs[currentStep.module] : null;

  useEffect(() => {
    // Auto-process modules when they become active
    if (currentStep?.status === 'active' && currentStep.module && !processingModule) {
      handleModuleProcessing();
    }
  }, [currentStep]);

  const handleModuleProcessing = async () => {
    if (!currentStep?.module) return;
    
    setProcessingModule(true);
    setActiveModule(currentStep.module);
    setShowExecutor(true);

    // Simulate module processing
    setTimeout(() => {
      const updatedWorkflow = processModuleStep(workflow, workflow.currentStep);
      onWorkflowUpdate(updatedWorkflow);
      setProcessingModule(false);
      setShowExecutor(false);
      
      // Generate mock results
      if (currentStep.module) {
        generateModuleResults(currentStep.module);
      }
    }, 5000);
  };

  const generateModuleResults = (moduleId: string) => {
    const results: Record<string, any> = {
      persona: {
        total_hcps: 2847,
        barriers_identified: {
          'Referral Pathways': { count: 796, percentage: 28 },
          'Side Effects': { count: 626, percentage: 22 },
          'Insurance': { count: 569, percentage: 20 },
          'Formulary': { count: 512, percentage: 18 },
          'Diagnostic': { count: 341, percentage: 12 }
        },
        confidence: 89
      },
      performance: {
        segments: {
          'High Performers': 423,
          'Growth Potential': 892,
          'Maintain': 1532
        },
        kpis: ['Market Share', 'Growth Rate', 'Prescription Volume', 'Patient Retention'],
        trend: 'positive'
      },
      potential: {
        depth_opportunity: '$285K',
        breadth_opportunity: '$142K',
        total_opportunity: '$427K',
        model_accuracy: 94,
        high_opportunity_hcps: 423
      },
      preference: {
        channels: {
          'Field': 85,
          'Email': 65,
          'Virtual': 55,
          'Web': 40
        },
        content_types: ['Clinical Data', 'Case Studies', 'Guidelines', 'Patient Resources'],
        optimal_frequency: '2.3 touches/month'
      },
      microsegmentation: {
        segments_created: 5,
        options: [
          { name: 'Growth Focus', impact: '+45%', priority_hcps: 423 },
          { name: 'Efficiency Focus', impact: '+32%', priority_hcps: 500 },
          { name: 'Balanced Approach', impact: '+28%', priority_hcps: 650 }
        ],
        recommendation: 'Growth Focus strategy recommended based on brand objectives'
      }
    };

    setModuleResults(prev => ({
      ...prev,
      [moduleId]: results[moduleId]
    }));
  };

  const handleApproveModule = (adjustments?: any) => {
    const updatedWorkflow = approveModuleStep(workflow, workflow.currentStep, adjustments);
    onWorkflowUpdate(updatedWorkflow);
    setActiveModule(null);
  };

  const renderModuleVisualization = () => {
    if (!activeModule || !moduleResults[activeModule]) return null;

    const results = moduleResults[activeModule];

    switch (activeModule) {
      case 'persona':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Barrier Distribution Analysis
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(results.barriers_identified).map(([barrier, data]: [string, any]) => (
                <div key={barrier} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>{barrier}</span>
                    <span style={{ color: moduleConfigs.persona.color.primary }}>
                      {data.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage * 3}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: moduleConfigs.persona.color.primary }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {data.count} HCPs
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Performance Segmentation
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(results.segments).map(([segment, count]: [string, any]) => (
                <motion.div
                  key={segment}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${moduleConfigs.performance.color.primary}10` }}
                >
                  <p className="text-2xl font-bold" style={{ color: moduleConfigs.performance.color.primary }}>
                    {count}
                  </p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {segment}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'potential':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Opportunity Prediction
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Depth Opportunity</p>
                <p className="text-xl font-bold" style={{ color: moduleConfigs.potential.color.primary }}>
                  {results.depth_opportunity}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Breadth Opportunity</p>
                <p className="text-xl font-bold" style={{ color: moduleConfigs.potential.color.primary }}>
                  {results.breadth_opportunity}
                </p>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg border" 
              style={{ borderColor: moduleConfigs.potential.color.primary }}>
              <p className="text-2xl font-bold" style={{ color: moduleConfigs.potential.color.primary }}>
                {results.total_opportunity}
              </p>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                Total Average Opportunity per HCP
              </p>
            </div>
          </div>
        );

      case 'preference':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Engagement Preferences
            </h4>
            <div className="space-y-3">
              {Object.entries(results.channels).map(([channel, score]: [string, any]) => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="text-xs w-16" style={{ color: zsColors.neutral.gray }}>
                    {channel}
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: moduleConfigs.preference.color.primary }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'microsegmentation':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Prioritization Options
            </h4>
            <div className="space-y-3">
              {results.options.map((option: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                  style={{ 
                    borderColor: index === 0 ? moduleConfigs.microsegmentation.color.primary : zsColors.neutral.lightGray 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                        {option.name}
                      </p>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {option.priority_hcps} priority HCPs
                      </p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: moduleConfigs.microsegmentation.color.primary }}>
                      {option.impact}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${zsColors.agents.customer.primary}, ${zsColors.agents.customer.light})`
              }}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Customer Planning Workflow
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Analyzing {brandContext?.brand_name || 'your brand'} in {brandContext?.therapeutic_area || 'therapeutic area'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${zsColors.primary.blue}20` }}>
            <span className="text-xs font-medium" style={{ color: zsColors.primary.blue }}>
              Module {workflow.currentStep} of {workflow.steps.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span style={{ color: zsColors.neutral.gray }}>Overall Progress</span>
            <span style={{ color: zsColors.neutral.darkGray }}>
              {(() => {
                const moduleSteps = workflow.steps.filter(s => s.module && ['persona', 'performance', 'potential', 'preference', 'microsegmentation'].includes(s.module));
                const completedSteps = moduleSteps.filter(s => s.status === 'approved' || s.status === 'completed' || s.status === 'review');
                return Math.round((completedSteps.length / moduleSteps.length) * 100) || 0;
              })()}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(() => {
                  const moduleSteps = workflow.steps.filter(s => s.module && ['persona', 'performance', 'potential', 'preference', 'microsegmentation'].includes(s.module));
                  const completedSteps = moduleSteps.filter(s => s.status === 'approved' || s.status === 'completed' || s.status === 'review');
                  return (completedSteps.length / moduleSteps.length) * 100 || 0;
                })()}%` 
              }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: zsColors.secondary.green }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Module Progress and Reasoning */}
        <div className="space-y-6">
          {/* Module Progress */}
          <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: zsColors.neutral.charcoal }}>
              Module Progress
            </h3>
            
            <div className="space-y-3">
              {workflow.steps.filter(step => step.module).map((step, index) => {
                const config = moduleConfigs[step.module!];
                if (!config) return null;

                const Icon = config.icon;
                const isActive = step.status === 'active' || step.status === 'review';
                const isCompleted = step.status === 'approved' || step.status === 'completed';

                return (
                  <div key={index}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? 'animate-pulse' : ''
                        }`}
                          style={{ 
                            background: isCompleted
                              ? zsColors.secondary.green
                              : isActive
                              ? `linear-gradient(135deg, ${config.color.primary}, ${config.color.light})`
                              : zsColors.neutral.lightGray
                          }}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5" style={{ 
                              color: isActive ? 'white' : zsColors.neutral.gray 
                            }} />
                          )}
                        </div>
                        
                        {isActive && step.status === 'active' && (
                          <motion.div
                            className="absolute inset-0 rounded-lg"
                            style={{ border: `2px solid ${config.color.primary}` }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                            {config.name}
                          </h4>
                          {step.status === 'review' && (
                            <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              style={{ 
                                backgroundColor: `${zsColors.secondary.orange}20`,
                                color: zsColors.secondary.orange
                              }}>
                              <MessageSquare size={12} />
                              Review Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {step.status === 'approved' && 'Completed & Approved'}
                          {step.status === 'active' && 'Processing...'}
                          {step.status === 'review' && 'Ready for your review'}
                          {step.status === 'pending' && 'Waiting'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Reasoning Panel */}
          {showReasoningPanel && currentStep?.reasoning && currentModuleConfig && (
            <AgentReasoningPanel
              agentName={`${currentModuleConfig.name} Agent`}
              agentColor={currentModuleConfig.color}
              reasoningSteps={currentStep.reasoning}
              isActive={processingModule}
              showConfidence={true}
              expandable={true}
            />
          )}
          
          {/* Module Executor */}
          {showExecutor && currentStep?.data && currentModuleConfig && (
            <ModuleExecutor
              moduleId={currentModuleConfig.id}
              moduleName={currentModuleConfig.name}
              moduleColor={currentModuleConfig.color}
              tools={currentStep.data.tools || []}
              metrics={currentStep.data.metrics || []}
              onComplete={(results) => {
                console.log('Module completed with results:', results);
              }}
              isActive={processingModule}
            />
          )}
        </div>

        {/* Right: Module Visualization and Chat */}
        <div className="space-y-6">
          {/* Module Visualization */}
          {activeModule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-6"
              style={{ backgroundColor: zsColors.neutral.white }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                  {currentModuleConfig?.name} Results
                </h3>
                {processingModule ? (
                  <Loader2 className="animate-spin" size={18} style={{ color: zsColors.primary.blue }} />
                ) : (
                  <CheckCircle size={18} style={{ color: zsColors.secondary.green }} />
                )}
              </div>
              
              {renderModuleVisualization()}
            </motion.div>
          )}

          {/* Chat Interface */}
          {currentStep?.status === 'review' && currentModuleConfig && (
            <div className="h-[500px]">
              <ModuleChatInterface
                moduleId={currentModuleConfig.id}
                moduleName={currentModuleConfig.name}
                moduleColor={currentModuleConfig.color}
                onApprove={handleApproveModule}
                onAdjust={(adjustments) => handleApproveModule(adjustments)}
                initialMessage={`The ${currentModuleConfig.name} analysis is complete. You can review the results, ask questions, or request adjustments before approving.`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}