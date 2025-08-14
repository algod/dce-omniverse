'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, TrendingUp, Target, Heart, Layers, 
  Play, CheckCircle, Clock, MessageSquare, 
  ChevronRight, Brain, Sparkles, BarChart3
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { ModuleChatInterface } from './ModuleChatInterface';

interface Module {
  id: string;
  name: string;
  icon: any;
  description: string;
  status: 'pending' | 'processing' | 'review' | 'approved';
  color: { primary: string; light: string };
  details: string[];
}

const modules: Module[] = [
  {
    id: 'persona',
    name: 'Persona Analysis',
    icon: User,
    description: 'Barrier inferencing and HCP classification',
    status: 'pending',
    color: { primary: '#8B5CF6', light: '#A78BFA' },
    details: [
      'Determine relevant barriers for brand context',
      'Run customer-level barrier inferencing',
      'Calculate probabilistic barriers at HCP level',
      'Visualize distribution by barrier'
    ]
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    icon: TrendingUp,
    description: 'KPI selection and historical analysis',
    status: 'pending',
    color: { primary: '#3B82F6', light: '#60A5FA' },
    details: [
      'Select KPIs based on brand objectives',
      'Process historical prescribing data',
      'Calculate KPIs at HCP level',
      'Bucket HCPs by performance'
    ]
  },
  {
    id: 'potential',
    name: 'Potential Prediction',
    icon: Target,
    description: 'ML-based opportunity forecasting',
    status: 'pending',
    color: { primary: '#10B981', light: '#34D399' },
    details: [
      'Set up breadth & depth prediction models',
      'Tune and optimize model parameters',
      'Generate opportunity predictions',
      'Show HCP distribution by potential'
    ]
  },
  {
    id: 'preference',
    name: 'Preference Mapping',
    icon: Heart,
    description: 'Channel and content affinity analysis',
    status: 'pending',
    color: { primary: '#F59E0B', light: '#FBBf24' },
    details: [
      'Analyze historical engagement data',
      'Run collaborative filtering',
      'Score channel preferences',
      'Map content type affinity'
    ]
  },
  {
    id: 'microsegmentation',
    name: 'Microsegmentation',
    icon: Layers,
    description: 'Combine factors for final segments',
    status: 'pending',
    color: { primary: '#EF4444', light: '#F87171' },
    details: [
      'Combine all factor scores',
      'Create microsegment definitions',
      'Map HCPs to segments',
      'Present prioritization options'
    ]
  }
];

interface CustomerPlanningInteractiveProps {
  onStartWorkflow?: () => void;
}

export function CustomerPlanningInteractive({ onStartWorkflow }: CustomerPlanningInteractiveProps = {}) {
  const [currentModule, setCurrentModule] = useState<number>(-1);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, Module['status']>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: 'pending' }), {})
  );
  const [showChat, setShowChat] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [planShared, setPlanShared] = useState(false);

  useEffect(() => {
    // Auto-start plan sharing after component mounts
    setTimeout(() => {
      setPlanShared(true);
    }, 1000);
  }, []);

  const startAnalysis = () => {
    // If onStartWorkflow is provided, use the new workflow mode
    if (onStartWorkflow) {
      onStartWorkflow();
      return;
    }
    
    // Otherwise, use the existing interactive mode
    setExpandedView(true);
    setCurrentModule(0);
    setModuleStatuses(prev => ({ ...prev, [modules[0].id]: 'processing' }));
    setShowChat(true);
    
    // Simulate processing
    setTimeout(() => {
      setModuleStatuses(prev => ({ ...prev, [modules[0].id]: 'review' }));
    }, 3000);
  };

  const approveModule = (moduleId: string) => {
    setModuleStatuses(prev => ({ ...prev, [moduleId]: 'approved' }));
    
    // Move to next module
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      setCurrentModule(currentIndex + 1);
      setModuleStatuses(prev => ({ ...prev, [nextModule.id]: 'processing' }));
      
      setTimeout(() => {
        setModuleStatuses(prev => ({ ...prev, [nextModule.id]: 'review' }));
      }, 3000);
    } else {
      // All modules completed
      setShowChat(false);
    }
  };

  const getVisualization = (moduleId: string) => {
    switch (moduleId) {
      case 'persona':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Barrier Distribution Analysis
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { barrier: 'Referral Pathways', percentage: 28, color: '#8B5CF6' },
                { barrier: 'Side Effects', percentage: 22, color: '#3B82F6' },
                { barrier: 'Insurance', percentage: 20, color: '#10B981' },
                { barrier: 'Formulary', percentage: 18, color: '#F59E0B' },
                { barrier: 'Diagnostic', percentage: 12, color: '#EF4444' }
              ].map((item) => (
                <div key={item.barrier} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: zsColors.neutral.gray }}>{item.barrier}</span>
                    <span style={{ color: item.color }}>{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage * 3}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                <strong>2,847 HCPs</strong> analyzed across <strong>5 primary barriers</strong>
              </p>
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
              {[
                { label: 'High Performers', count: 423, color: zsColors.secondary.green },
                { label: 'Growth Potential', count: 892, color: zsColors.primary.blue },
                { label: 'Maintain', count: 1532, color: zsColors.secondary.orange }
              ].map((segment) => (
                <motion.div
                  key={segment.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: `${segment.color}10` }}
                >
                  <p className="text-2xl font-bold" style={{ color: segment.color }}>
                    {segment.count}
                  </p>
                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                    {segment.label}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                Key Performance Indicators
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Market Share', 'Growth Rate', 'Prescription Volume', 'Patient Retention'].map((kpi) => (
                  <div key={kpi} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={12} style={{ color: zsColors.secondary.green }} />
                    <span style={{ color: zsColors.neutral.gray }}>{kpi}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'potential':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Opportunity Prediction Model
            </h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Model Accuracy</span>
                <span className="text-sm font-bold" style={{ color: zsColors.secondary.green }}>94%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: zsColors.neutral.gray }}>Depth Opportunity</span>
                    <span style={{ color: zsColors.primary.blue }}>$285K avg</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: zsColors.neutral.gray }}>Breadth Opportunity</span>
                    <span style={{ color: zsColors.secondary.green }}>$142K avg</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border" style={{ borderColor: zsColors.neutral.lightGray }}>
              <p className="text-xl font-bold" style={{ color: zsColors.primary.blue }}>$427K</p>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Total Avg Opportunity</p>
            </div>
          </div>
        );
      
      case 'preference':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Engagement Preferences
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Channel Affinity
                </p>
                {[
                  { channel: 'Field', score: 85 },
                  { channel: 'Email', score: 65 },
                  { channel: 'Virtual', score: 55 },
                  { channel: 'Web', score: 40 }
                ].map((item) => (
                  <div key={item.channel} className="flex items-center gap-2 mb-2">
                    <span className="text-xs w-12" style={{ color: zsColors.neutral.gray }}>
                      {item.channel}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: zsColors.primary.blue }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Content Types
                </p>
                <div className="space-y-1">
                  {['Clinical Data', 'Case Studies', 'Guidelines', 'Patient Resources'].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zsColors.secondary.green }} />
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'microsegmentation':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Microsegment Prioritization Options
            </h4>
            <div className="space-y-3">
              {[
                { 
                  option: 'Option A: Growth Focus',
                  segments: ['Champions (127)', 'Growers (296)', 'Converters (1081)'],
                  impact: '+45% expected growth',
                  color: zsColors.secondary.green
                },
                { 
                  option: 'Option B: Efficiency Focus',
                  segments: ['Champions (127)', 'Maintainers (843)', 'Defenders (500)'],
                  impact: '+32% ROI improvement',
                  color: zsColors.primary.blue
                },
                { 
                  option: 'Option C: Balanced Approach',
                  segments: ['All segments with weighted priority'],
                  impact: '+28% overall performance',
                  color: zsColors.secondary.orange
                }
              ].map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: option.color }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                        {option.option}
                      </p>
                      <div className="mt-1">
                        {option.segments.map((segment) => (
                          <span key={segment} className="text-xs mr-2" style={{ color: zsColors.neutral.gray }}>
                            {segment}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium" style={{ color: option.color }}>
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
      {/* Plan Overview */}
      <AnimatePresence>
        {!expandedView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl p-6"
            style={{ backgroundColor: zsColors.neutral.white }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${zsColors.agents.customer.primary}, ${zsColors.agents.customer.light})`
                  }}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                    Customer Planning Analysis
                  </h3>
                  <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                    5 modules for comprehensive microsegmentation
                  </p>
                </div>
              </div>
              
              {planShared && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startAnalysis}
                  className="px-6 py-3 rounded-lg flex items-center gap-2 text-white font-medium"
                  style={{ background: `linear-gradient(135deg, ${zsColors.primary.blue}, ${zsColors.primary.navy})` }}
                >
                  <Play size={18} />
                  Start Analysis
                </motion.button>
              )}
            </div>

            {/* Plan of Action */}
            {planShared && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} style={{ color: zsColors.secondary.orange }} />
                  <p className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                    Plan of Action
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-lg border"
                      style={{ 
                        borderColor: zsColors.neutral.lightGray,
                        backgroundColor: zsColors.neutral.offWhite
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ 
                            background: `linear-gradient(135deg, ${module.color.primary}, ${module.color.light})`
                          }}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1" style={{ color: zsColors.neutral.charcoal }}>
                            {index + 1}. {module.name}
                          </h4>
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Module View */}
      {expandedView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left: Module Progress and Visualization */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                Analysis Progress
              </h3>
              
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={module.id}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          moduleStatuses[module.id] === 'approved' 
                            ? ''
                            : moduleStatuses[module.id] === 'processing' || moduleStatuses[module.id] === 'review'
                            ? 'animate-pulse'
                            : ''
                        }`}
                          style={{ 
                            background: moduleStatuses[module.id] === 'approved'
                              ? zsColors.secondary.green
                              : moduleStatuses[module.id] === 'pending'
                              ? zsColors.neutral.lightGray
                              : `linear-gradient(135deg, ${module.color.primary}, ${module.color.light})`
                          }}>
                          {moduleStatuses[module.id] === 'approved' ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : moduleStatuses[module.id] === 'processing' || moduleStatuses[module.id] === 'review' ? (
                            <module.icon className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5" style={{ color: zsColors.neutral.gray }} />
                          )}
                        </div>
                        
                        {moduleStatuses[module.id] === 'processing' && (
                          <motion.div
                            className="absolute inset-0 rounded-lg"
                            style={{ border: `2px solid ${module.color.primary}` }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                            {module.name}
                          </h4>
                          {moduleStatuses[module.id] === 'review' && (
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
                          {moduleStatuses[module.id] === 'approved' && 'Completed'}
                          {moduleStatuses[module.id] === 'processing' && 'Processing...'}
                          {moduleStatuses[module.id] === 'review' && 'Ready for review'}
                          {moduleStatuses[module.id] === 'pending' && 'Waiting'}
                        </p>
                      </div>
                    </div>
                    
                    {index < modules.length - 1 && (
                      <div className="ml-5 h-6 border-l-2 transition-all"
                        style={{ 
                          borderColor: moduleStatuses[module.id] === 'approved' 
                            ? zsColors.secondary.green
                            : zsColors.neutral.lightGray
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Module Visualization */}
            {currentModule >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6"
                style={{ backgroundColor: zsColors.neutral.white }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                    {modules[currentModule].name} Results
                  </h3>
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} style={{ color: zsColors.neutral.gray }} />
                    <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                      Live Analysis
                    </span>
                  </div>
                </div>
                
                {getVisualization(modules[currentModule].id)}
              </motion.div>
            )}
          </div>

          {/* Right: Chat Interface */}
          {showChat && currentModule >= 0 && (
            <div className="h-[600px]">
              <ModuleChatInterface
                moduleId={modules[currentModule].id}
                moduleName={modules[currentModule].name}
                moduleColor={modules[currentModule].color}
                onApprove={() => approveModule(modules[currentModule].id)}
                onAdjust={(data) => console.log('Adjust:', data)}
                initialMessage={`Starting ${modules[currentModule].name} analysis. I'm ${modules[currentModule].details.join(', ').toLowerCase()}. You can ask questions or request adjustments at any time.`}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Final Results */}
      {Object.values(moduleStatuses).every(status => status === 'approved') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6"
          style={{ 
            backgroundColor: zsColors.neutral.white,
            border: `2px solid ${zsColors.secondary.green}`
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} style={{ color: zsColors.secondary.green }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Analysis Complete - Microsegmentation Ready
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.primary.blue }}>2,847</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>HCPs Analyzed</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.secondary.green }}>5</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Microsegments</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.secondary.orange }}>94%</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Model Accuracy</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>423</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Priority Targets</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}