'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, TrendingUp, Target, Heart, Layers, ChevronRight, 
  CheckCircle, AlertCircle, BarChart3, Users, Brain, Sparkles
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface Module {
  id: string;
  name: string;
  icon: any;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  color: { primary: string; light: string };
}

const modules: Module[] = [
  {
    id: 'persona',
    name: 'Persona Analysis',
    icon: User,
    description: 'Barrier inferencing and HCP classification based on prescribing patterns',
    status: 'pending',
    color: { primary: '#8B5CF6', light: '#A78BFA' }
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    icon: TrendingUp,
    description: 'Historical brand and competitor writing behavior analysis',
    status: 'pending',
    color: { primary: '#3B82F6', light: '#60A5FA' }
  },
  {
    id: 'potential',
    name: 'Potential Prediction',
    icon: Target,
    description: 'ML-based breadth and depth opportunity forecasting',
    status: 'pending',
    color: { primary: '#10B981', light: '#34D399' }
  },
  {
    id: 'preference',
    name: 'Preference Mapping',
    icon: Heart,
    description: 'Channel, content type, and cadence affinity analysis',
    status: 'pending',
    color: { primary: '#F59E0B', light: '#FBBf24' }
  },
  {
    id: 'microsegmentation',
    name: 'Microsegmentation',
    icon: Layers,
    description: 'Combine all factors to assign HCPs to microsegments',
    status: 'pending',
    color: { primary: '#EF4444', light: '#F87171' }
  }
];

export function CustomerPlanningModules() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, Module['status']>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: 'pending' }), {})
  );
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const runModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setModuleStatuses(prev => ({ ...prev, [moduleId]: 'processing' }));
    
    // Simulate processing
    setTimeout(() => {
      setModuleStatuses(prev => ({ ...prev, [moduleId]: 'completed' }));
      setActiveModule(null);
      
      // Auto-expand to show results
      setExpandedModule(moduleId);
      
      // Auto-proceed to next module
      const currentIndex = modules.findIndex(m => m.id === moduleId);
      if (currentIndex < modules.length - 1) {
        setTimeout(() => {
          runModule(modules[currentIndex + 1].id);
        }, 1000);
      }
    }, 2000);
  };

  const getModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case 'persona':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Barrier Distribution
                </h4>
                <div className="space-y-2">
                  {['Referral Pathways (28%)', 'Side Effects (22%)', 'Insurance (20%)', 'Formulary (18%)', 'Diagnostic (12%)'].map((barrier, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: zsColors.neutral.gray }}>{barrier.split('(')[0]}</span>
                      <span className="text-xs font-medium" style={{ color: zsColors.primary.blue }}>{barrier.match(/\((.*?)\)/)?.[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Persona Types Identified
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Early Adopters: 423 HCPs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Cautious Prescribers: 892 HCPs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Access Challenged: 1,532 HCPs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <p className="text-2xl font-bold" style={{ color: zsColors.primary.blue }}>D4</p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Current Decile</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <p className="text-2xl font-bold" style={{ color: zsColors.secondary.green }}>+12%</p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>6-Month Growth</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <p className="text-2xl font-bold" style={{ color: zsColors.secondary.orange }}>68%</p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Market Share</p>
              </div>
            </div>
          </div>
        );
      
      case 'potential':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Opportunity Prediction Model Results
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Depth Opportunity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium">$285K</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Breadth Opportunity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium">$142K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'preference':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Channel Preferences
                </h4>
                <div className="space-y-1">
                  {['Field (High)', 'Email (Medium)', 'Web (Low)', 'Virtual (Medium)'].map((pref, i) => (
                    <div key={i} className="text-xs" style={{ color: zsColors.neutral.gray }}>{pref}</div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-xs font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                  Content Affinity
                </h4>
                <div className="space-y-1">
                  {['Clinical Data', 'Case Studies', 'Guidelines', 'Patient Resources'].map((content, i) => (
                    <div key={i} className="text-xs" style={{ color: zsColors.neutral.gray }}>{content}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'microsegmentation':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                Microsegment Assignment Results
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'Champions', count: 127, color: '#10B981' },
                  { name: 'Growers', count: 296, color: '#3B82F6' },
                  { name: 'Maintainers', count: 843, color: '#F59E0B' },
                  { name: 'Converters', count: 1081, color: '#8B5CF6' },
                  { name: 'Defenders', count: 500, color: '#EF4444' }
                ].map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: segment.color }}></div>
                      <span className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                        {segment.name}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                      {segment.count} HCPs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Pipeline */}
      <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
            Customer Planning Modules
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => runModule('persona')}
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
            style={{
              background: `linear-gradient(135deg, ${zsColors.primary.blue}, ${zsColors.primary.navy})`,
              color: 'white'
            }}
          >
            <Brain size={16} />
            Run Analysis
          </motion.button>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="rounded-lg border transition-all cursor-pointer"
                style={{
                  borderColor: moduleStatuses[module.id] === 'completed' 
                    ? module.color.primary 
                    : zsColors.neutral.lightGray,
                  backgroundColor: moduleStatuses[module.id] === 'processing' 
                    ? `${module.color.primary}10` 
                    : zsColors.neutral.white
                }}
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${module.color.primary}, ${module.color.light})`,
                          opacity: moduleStatuses[module.id] === 'pending' ? 0.5 : 1
                        }}
                      >
                        <module.icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
                          {module.name}
                        </h4>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {moduleStatuses[module.id] === 'completed' && (
                        <CheckCircle size={20} style={{ color: module.color.primary }} />
                      )}
                      {moduleStatuses[module.id] === 'processing' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={20} style={{ color: module.color.primary }} />
                        </motion.div>
                      )}
                      {moduleStatuses[module.id] === 'pending' && (
                        <AlertCircle size={20} style={{ color: zsColors.neutral.gray }} />
                      )}
                      
                      <motion.div
                        animate={{ rotate: expandedModule === module.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={20} style={{ color: zsColors.neutral.gray }} />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedModule === module.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t"
                      style={{ borderColor: zsColors.neutral.lightGray }}
                    >
                      <div className="p-4">
                        {getModuleContent(module.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {index < modules.length - 1 && (
                <div className="flex justify-center py-2">
                  <motion.div
                    animate={{ opacity: moduleStatuses[module.id] === 'completed' ? 1 : 0.3 }}
                    className="w-0.5 h-8"
                    style={{ backgroundColor: module.color.primary }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      {Object.values(moduleStatuses).every(status => status === 'completed') && (
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
              Analysis Complete
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.primary.blue }}>2,847</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>HCPs Analyzed</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.secondary.green }}>5</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Microsegments Created</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.secondary.orange }}>423</p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Priority Targets</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}