'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, CheckCircle, Loader2, MessageSquare, Sun,
  User, TrendingUp, Target, Heart, Layers, ChevronLeft
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { Workflow, WorkflowStep } from '@/lib/workflows/engagement-planning-workflow';
import {
  executeWorkflowStep,
  processModuleStep,
  approveModuleStep,
  getWorkflowProgress
} from '@/lib/workflows/workflow-utils';
import { ModuleChatInterface } from '../ModuleChatInterface';
import { ModuleExecutor } from '../ModuleExecutor';
import { AgentReasoningPanel } from '../AgentReasoningPanel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface ModuleConfig {
  id: string;
  name: string;
  icon: any;
  color: { primary: string; light: string };
  description: string;
}

interface AgentWorkflowLayoutProps {
  workflow: Workflow;
  onWorkflowUpdate: (workflow: Workflow) => void;
  agentName: string;
  agentIcon: React.ElementType;
  agentColor: { primary: string; light: string };
  moduleConfigs: Record<string, ModuleConfig>;
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
    objectives?: string[];
  };
  renderModuleVisualization: (moduleId: string, results: any) => React.ReactNode;
  generateModuleResults?: (moduleId: string) => any;
}

export function AgentWorkflowLayout({ 
  workflow, 
  onWorkflowUpdate,
  agentName,
  agentIcon: AgentIcon,
  agentColor,
  moduleConfigs,
  brandContext,
  renderModuleVisualization,
  generateModuleResults
}: AgentWorkflowLayoutProps) {
  const router = useRouter();
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
      
      // Generate module-specific results
      if (currentStep.module && generateModuleResults) {
        const results = generateModuleResults(currentStep.module);
        setModuleResults(prev => ({
          ...prev,
          [currentStep.module!]: results
        }));
      }
    }, 5000);
  };

  const handleApproveModule = (adjustments?: any) => {
    const updatedWorkflow = approveModuleStep(workflow, workflow.currentStep, adjustments);
    onWorkflowUpdate(updatedWorkflow);
    setActiveModule(null);
  };

  const calculateProgress = () => {
    const moduleSteps = workflow.steps.filter(s => s.module && Object.keys(moduleConfigs).includes(s.module));
    const completedSteps = moduleSteps.filter(s => s.status === 'approved' || s.status === 'completed' || s.status === 'review');
    return Math.round((completedSteps.length / moduleSteps.length) * 100) || 0;
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="space-y-6">
        {/* Back to Flow Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: zsColors.neutral.gray }}>
          <ChevronLeft size={16} />
          Back to Flow
        </Link>

        {/* Workflow Header */}
        <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${agentColor.primary}, ${agentColor.light})`
                }}>
                <AgentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                  {agentName} Workflow
                </h3>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Analyzing {brandContext?.brand_name || 'your brand'} in {brandContext?.therapeutic_area || 'therapeutic area'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: `${zsColors.primary.blue}20` }}>
                <Sun size={14} style={{ color: zsColors.primary.blue }} />
                <span className="text-xs font-medium" style={{ color: zsColors.primary.blue }}>
                  Module {workflow.currentStep} of {workflow.steps.filter(s => s.module).length}
                </span>
              </div>
              <div className="text-lg font-bold" style={{ color: zsColors.secondary.green }}>
                {calculateProgress()}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: zsColors.neutral.gray }}>Overall Progress</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: zsColors.secondary.green }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Module Progress and Reasoning - 5 columns */}
          <div className="lg:col-span-5 space-y-6">
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
                            {config.description}
                          </p>
                          <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
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
                agentName={`${currentModuleConfig.name} Agent Reasoning`}
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

          {/* Right: Module Visualization and Chat - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Module Visualization */}
            {activeModule && moduleResults[activeModule] && (
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
                
                {renderModuleVisualization(activeModule, moduleResults[activeModule])}

                {currentStep?.status === 'review' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => handleApproveModule()}
                    className="mt-4 w-full py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${zsColors.secondary.green}, ${zsColors.secondary.teal})` 
                    }}
                  >
                    Approve & Continue
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Chat Interface */}
            {currentStep?.status === 'review' && currentModuleConfig && (
              <div className="h-[500px]">
                <ModuleChatInterface
                  moduleId={currentModuleConfig.id}
                  moduleName={currentModuleConfig.name}
                  moduleColor={currentModuleConfig.color}
                  moduleResults={moduleResults[currentModuleConfig.id]}
                  onApprove={handleApproveModule}
                  onAdjust={(adjustments) => handleApproveModule(adjustments)}
                  initialMessage={`The ${currentModuleConfig.name} analysis is complete. You can review the results, ask questions, or request adjustments before approving.`}
                />
              </div>
            )}

            {/* Welcome message when no module is active */}
            {!activeModule && (
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: zsColors.neutral.white }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${agentColor.primary}20` }}>
                  <AgentIcon className="w-8 h-8" style={{ color: agentColor.primary }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: zsColors.neutral.charcoal }}>
                  {agentName} Ready
                </h3>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  The workflow will begin processing modules automatically. You'll be able to review and approve each module's results through the chat interface.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}