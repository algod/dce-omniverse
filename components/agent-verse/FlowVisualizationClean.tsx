'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Activity, Target, Sparkles, ArrowUpRight, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { zsColors } from '@/lib/design-system/zs-colors';
import { useUserMode } from '@/lib/contexts/UserModeContext';
import { UserModeToggle } from '@/components/ui/UserModeToggle';

// Master Orchestrator
const omniAgent = {
  id: 'omni',
  name: 'Omni Agent',
  icon: Sparkles,
  description: 'Master Orchestrator - Intelligent routing & coordination',
  color: { primary: '#6B46C1', light: '#9F7AEA' },
  story: 'Controls and coordinates all specialized agents',
  outputs: 'Orchestrated multi-agent workflows',
  sequence: 0
};

// Specialized agents
const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Microsegmentation & prioritization',
    color: zsColors.agents.customer,
    story: 'Classifies customers by persona, performance, potential, preference',
    outputs: 'Priority target list with microsegments',
    sequence: 1
  },
  {
    id: 'engagement',
    name: 'Engagement Planning',
    icon: TrendingUp,
    description: 'Resource allocation & marketing mix',
    color: zsColors.agents.budget,
    story: 'Optimizes budget by microsegment × channel',
    outputs: 'Optimal resource allocation strategy',
    sequence: 2
  },
  {
    id: 'content',
    name: 'Content Supply Chain',
    icon: FileCheck,
    description: 'Planning, generation & approval',
    color: zsColors.agents.content,
    story: 'End-to-end content lifecycle management',
    outputs: 'Approved content with MLR compliance',
    sequence: 3
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    icon: Brain,
    description: 'Customer journey optimization',
    color: zsColors.agents.orchestration,
    story: 'Determines optimal engagement sequences',
    outputs: 'Personalized customer journeys',
    sequence: 4
  },
  {
    id: 'activation',
    name: 'Digital Activation',
    icon: Zap,
    description: 'Execution vendor integration',
    color: { primary: '#10B981', light: '#34D399' },
    story: 'Activates recommendations through AgentVerse',
    outputs: 'Executed campaigns across channels',
    sequence: 5
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'AI-powered field assistance',
    color: zsColors.agents.copilot,
    story: 'Empowers reps with real-time insights',
    outputs: 'Pre-call plans, coaching & insights',
    sequence: 6
  }
];


// Agent flow connections
const flowConnections = [
  // Sequential flow
  { from: 'omni', to: 'customer', label: 'Customer Query', type: 'main' },
  { from: 'customer', to: 'engagement', label: 'Microsegments', type: 'main' },
  { from: 'engagement', to: 'content', label: 'Resource Plan', type: 'main' },
  { from: 'content', to: 'orchestration', label: 'Content Assets', type: 'main' },
  { from: 'orchestration', to: 'activation', label: 'Journey Plans', type: 'main' },
  { from: 'activation', to: 'copilot', label: 'Field Actions', type: 'main' },
  // Feedback loops
  { from: 'copilot', to: 'customer', label: 'Field Insights', type: 'feedback' },
  { from: 'activation', to: 'orchestration', label: 'Performance', type: 'feedback' }
];

export function FlowVisualizationClean() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  const [showOmniConnections, setShowOmniConnections] = useState(true);
  const { isAgentEnabled } = useUserMode();

  // Sequential flow animation
  useEffect(() => {
    const flowInterval = setInterval(() => {
      setFlowStep(prev => (prev + 1) % agents.length);
      setActiveAgent(agents[flowStep]?.id || null);
    }, 3000);

    return () => {
      clearInterval(flowInterval);
    };
  }, [flowStep]);

  return (
    <div className="relative min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Elegant gradient background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg, ${zsColors.agents.customer.primary}10, ${zsColors.agents.orchestration.primary}08, ${zsColors.agents.copilot.primary}10)`
        }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header - DCE OmniVerse Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Sparkles size={28} style={{ color: zsColors.secondary.orange }} />
            <h1 className="text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${zsColors.primary.navy}, ${zsColors.primary.blue})`
              }}>
              DCE OmniVerse
            </h1>
            <Sparkles size={28} style={{ color: zsColors.secondary.orange }} />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl mb-4 font-medium"
            style={{ color: zsColors.neutral.darkGray }}
          >
            Intelligent Agent Flow for Pharmaceutical Excellence
          </motion.p>
        </div>

        {/* User Mode Toggle */}
        <div className="flex justify-center mb-8">
          <UserModeToggle />
        </div>

        {/* Omni Agent - Master Orchestrator */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-8">
            <Link href="/agents/omni">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
                onHoverStart={() => setShowOmniConnections(true)}
                onHoverEnd={() => setShowOmniConnections(false)}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl blur-2xl"
                  style={{ background: `radial-gradient(circle, ${omniAgent.color.primary}40, transparent)` }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Main card */}
                <motion.div
                  className="relative bg-white rounded-3xl p-8 shadow-2xl border-2"
                  style={{ 
                    borderColor: omniAgent.color.primary,
                    background: `linear-gradient(135deg, white, ${omniAgent.color.primary}05)`
                  }}
                >
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${omniAgent.color.primary}, ${omniAgent.color.light})`
                      }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-3xl font-bold mb-2" style={{ color: omniAgent.color.primary }}>
                        {omniAgent.name}
                      </h2>
                      <p className="text-lg font-medium mb-1" style={{ color: zsColors.neutral.charcoal }}>
                        Master Orchestrator
                      </p>
                      <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                        {omniAgent.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      className="flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${zsColors.secondary.green}20` }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: zsColors.secondary.green }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-xs font-medium" style={{ color: zsColors.secondary.green }}>
                        Active
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          </div>
          
          {/* Connection lines to agents */}
          <AnimatePresence>
            {showOmniConnections && (
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: -1 }}
              >
                {agents.map((agent, index) => {
                  const angle = (index * 360) / agents.length;
                  const x = 50 + 30 * Math.cos((angle * Math.PI) / 180);
                  const y = 20 + 15 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <motion.line
                      key={agent.id}
                      x1="50%"
                      y1="20%"
                      x2={`${x}%`}
                      y2={`${y}%`}
                      stroke={omniAgent.color.primary}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  );
                })}
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Specialized Agents Grid */}
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium" style={{ color: zsColors.neutral.darkGray }}>
              Specialized Agents
            </h3>
            <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
              Orchestrated and coordinated by the Omni Agent
            </p>
          </div>
          
          {/* Agent Grid - responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <AgentCard
                  agent={agent}
                  isActive={activeAgent === agent.id}
                  sequence={agent.sequence}
                  onHover={setActiveAgent}
                />
              </motion.div>
            ))}
          </div>

          {/* Feedback Loop Visualization */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="relative">
              <svg className="w-full h-24" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id="feedbackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={zsColors.agents.copilot.primary} stopOpacity="0.6" />
                    <stop offset="50%" stopColor={zsColors.secondary.orange} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={zsColors.agents.customer.primary} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                <motion.path
                  d="M 85 15 Q 50 5 15 15"
                  stroke="url(#feedbackGradient)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="3,2"
                  animate={{ 
                    strokeDashoffset: [0, -20],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 3, repeat: Infinity }
                  }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium px-4 py-1 rounded-full"
                  style={{ 
                    color: zsColors.neutral.darkGray,
                    backgroundColor: zsColors.neutral.white + 'E0',
                    backdropFilter: 'blur(4px)'
                  }}>
                  Continuous Learning & Feedback Loop
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// Agent Card Component
interface AgentCardProps {
  agent: any;
  isActive: boolean;
  sequence: number;
  onHover: (agentId: string | null) => void;
}

function AgentCard({ agent, isActive, sequence, onHover }: AgentCardProps) {
  const { isAgentEnabled } = useUserMode();
  const isEnabled = isAgentEnabled(agent.id);
  
  const CardContent = (
    
      <motion.div
        whileHover={isEnabled ? { 
          scale: 1.02,
          transition: { duration: 0.2 }
        } : {}}
        onHoverStart={() => isEnabled && onHover(agent.id)}
        onHoverEnd={() => isEnabled && onHover(null)}
        className={`group relative rounded-xl p-6 h-full transition-all border ${
          isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        style={{
          backgroundColor: zsColors.neutral.white,
          borderColor: isActive && isEnabled ? agent.color.primary : zsColors.neutral.lightGray + '80',
          boxShadow: isActive && isEnabled ? zsColors.shadows.lg : zsColors.shadows.sm,
          opacity: isEnabled ? 1 : 0.4,
          ...(isActive && isEnabled && {
            background: `linear-gradient(135deg, ${zsColors.neutral.white}, ${agent.color.primary}06)`
          })
        }}
      >
        {/* Sequence number */}
        <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: agent.color.primary }}>
          {sequence}
        </div>

        {/* Active pulse */}
        {isActive && isEnabled && (
          <div className="absolute top-3 left-3">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color.primary }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className={`w-14 h-14 rounded-lg p-3 mb-4 transition-all ${
            isEnabled ? 'group-hover:scale-105' : ''
          }`}
            style={{
              background: isEnabled 
                ? `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`
                : `linear-gradient(135deg, ${zsColors.neutral.gray}, ${zsColors.neutral.lightGray})`,
              boxShadow: isActive && isEnabled ? `0 6px 20px ${agent.color.primary}30` : '0 3px 10px rgba(0,0,0,0.1)'
            }}
          >
            <agent.icon className="w-full h-full text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2" 
                style={{ color: zsColors.neutral.charcoal }}>
              {agent.name}
            </h3>
            <p className="text-sm mb-3 line-clamp-2" 
               style={{ color: zsColors.neutral.gray }}>
              {agent.description}
            </p>
            <p className="text-xs font-medium line-clamp-2 mb-3" 
               style={{ color: agent.color.primary }}>
              {agent.story}
            </p>
            
            <div className="p-2 rounded-lg bg-gray-50">
              <p className="text-xs" style={{ color: zsColors.neutral.darkGray }}>
                <strong>Output:</strong> {agent.outputs}
              </p>
            </div>
          </div>

          {isEnabled && (
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-3 flex justify-end"
              style={{ color: agent.color.primary }}
            >
              <ArrowUpRight size={18} />
            </motion.div>
          )}
        </div>
      </motion.div>
  );
  
  return isEnabled ? (
    <Link href={`/agents/${agent.id}`}>
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}

