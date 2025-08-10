'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Activity, Target, Sparkles, ArrowUpRight, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { zsColors } from '@/lib/design-system/zs-colors';

// Agents arranged in horizontal workflow sequence
const planningAgents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Barrier analysis & HCP prioritization',
    color: zsColors.agents.customer,
    story: 'Identifies barriers preventing prescribing',
    outputs: 'Prioritized HCPs with barrier profiles',
    phase: 'Planning',
    sequence: 1
  },
  {
    id: 'budget',
    name: 'Budget Planning', 
    icon: TrendingUp,
    description: 'Multi-channel ROI optimization',
    color: zsColors.agents.budget,
    story: 'Allocates resources for maximum impact',
    outputs: 'Optimal channel budget allocation',
    phase: 'Planning',
    sequence: 2
  },
  {
    id: 'content',
    name: 'Content Review',
    icon: FileCheck,
    description: 'MLR compliance & content strategy',
    color: zsColors.agents.content,
    story: 'Ensures compliant barrier-specific messaging',
    outputs: 'Approved content mapped to barriers',
    phase: 'Planning',
    sequence: 3
  }
];

const orchestrationAgent = {
  id: 'orchestration',
  name: 'AI Orchestration',
  icon: Brain,
  description: 'Customer journey optimization & NBA',
  color: zsColors.agents.orchestration,
  story: 'Synthesizes intelligence for personalized journeys',
  outputs: 'Optimized customer journeys & NBA recommendations',
  phase: 'Orchestration',
  sequence: 4
};

const executionAgents = [
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    icon: Lightbulb,
    description: 'Intelligent trigger-based recommendations',
    color: zsColors.agents.suggestions,
    story: 'Generates actionable field guidance',
    outputs: 'Prioritized suggestions with context',
    phase: 'Execution',
    sequence: 5
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'AI-powered rep assistance & coaching',
    color: zsColors.agents.copilot,
    story: 'Empowers every HCP interaction',
    outputs: 'Call plans, insights & feedback',
    phase: 'Execution',
    sequence: 6
  }
];

// Horizontal flow connections
const flowConnections = [
  // Sequential flow
  { from: 'customer', to: 'budget', label: 'HCP Priorities', type: 'main' },
  { from: 'budget', to: 'content', label: 'Budget Strategy', type: 'main' },
  { from: 'content', to: 'orchestration', label: 'Content Assets', type: 'main' },
  { from: 'orchestration', to: 'suggestions', label: 'Journey Plans', type: 'main' },
  { from: 'suggestions', to: 'copilot', label: 'Field Guidance', type: 'main' },
  // Feedback loops
  { from: 'copilot', to: 'orchestration', label: 'Performance Data', type: 'feedback' },
  { from: 'orchestration', to: 'customer', label: 'Insights', type: 'feedback' }
];

export function FlowVisualizationClean() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  
  // All agents in sequence order
  const allAgents = [
    ...planningAgents, 
    orchestrationAgent, 
    ...executionAgents
  ];

  // Sequential flow animation - horizontal progression
  useEffect(() => {
    const flowInterval = setInterval(() => {
      setFlowStep(prev => (prev + 1) % allAgents.length);
      setActiveAgent(allAgents[flowStep]?.id || null);
    }, 3000);

    return () => {
      clearInterval(flowInterval);
    };
  }, [flowStep]);

  const getCurrentPhaseDescription = () => {
    if (flowStep < 3) return "Planning Phase: Strategic Intelligence & Foundation";
    if (flowStep === 3) return "Orchestration Phase: AI-Powered Journey Optimization";
    return "Execution Phase: Field Support & Continuous Learning";
  };

  return (
    <div className="relative min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Elegant gradient background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg, ${zsColors.agents.customer.primary}10, ${zsColors.agents.orchestration.primary}08, ${zsColors.agents.copilot.primary}10)`
        }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base"
            style={{ color: zsColors.neutral.gray }}
          >
            Strategic Planning → AI Orchestration → Field Execution
          </motion.p>
        </div>

        {/* Current Phase Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `2px solid ${zsColors.primary.blue}20`,
              boxShadow: zsColors.shadows.md
            }}
          >
            <Activity size={20} style={{ color: zsColors.primary.blue }} />
            <span className="text-base font-semibold" style={{ color: zsColors.neutral.charcoal }}>
              {getCurrentPhaseDescription()}
            </span>
          </div>
        </motion.div>

        {/* Horizontal Flow Layout */}
        <div className="relative">
          {/* Main horizontal container - responsive */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-4">
            
            {/* Planning Phase Section - Left */}
            <motion.div 
              className="w-full lg:flex-1 lg:max-w-[400px]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: zsColors.agents.customer.primary }}>
                  Planning Phase
                </h2>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Intelligence & Strategy
                </p>
              </div>
              
              <div className="space-y-4">
                {planningAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <HorizontalAgentCard 
                      agent={agent}
                      isActive={activeAgent === agent.id}
                      sequence={index + 1}
                      onHover={setActiveAgent}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Flow Arrow - responsive */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col lg:flex-row items-center gap-2 px-4 lg:px-2"
            >
              <ArrowRight size={40} className="lg:block hidden" style={{ color: zsColors.primary.blue }} />
              <div className="w-10 h-10 lg:hidden rounded-full border-2 border-dashed flex items-center justify-center" 
                style={{ borderColor: zsColors.primary.blue }}>
                <div style={{ transform: 'rotate(90deg)' }}>
                  <ArrowRight size={24} style={{ color: zsColors.primary.blue }} />
                </div>
              </div>
              <span className="text-xs font-medium text-center" 
                style={{ color: zsColors.neutral.darkGray }}>
                <span className="lg:hidden block">Flows Down</span>
                <span className="hidden lg:block">Feeds Into</span>
              </span>
            </motion.div>

            {/* Orchestration Phase - Center */}
            <motion.div 
              className="w-full lg:flex-shrink-0 lg:w-[350px] max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: zsColors.agents.orchestration.primary }}>
                  AI Orchestration
                </h2>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Journey Optimization
                </p>
              </div>
              
              <CenterAgentCard 
                agent={orchestrationAgent}
                isActive={activeAgent === orchestrationAgent.id}
                onHover={setActiveAgent}
              />
            </motion.div>

            {/* Flow Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="flex flex-col items-center gap-2 px-4"
            >
              <ArrowRight size={40} style={{ color: zsColors.primary.blue }} />
              <span className="text-xs font-medium text-center whitespace-nowrap" 
                style={{ color: zsColors.neutral.darkGray }}>
                Enables
              </span>
            </motion.div>

            {/* Execution Phase Section - Right */}
            <motion.div 
              className="w-full lg:flex-1 lg:max-w-[400px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: zsColors.agents.copilot.primary }}>
                  Execution Phase
                </h2>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Field Support
                </p>
              </div>
              
              <div className="space-y-4">
                {executionAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 + index * 0.1 }}
                  >
                    <HorizontalAgentCard 
                      agent={agent}
                      isActive={activeAgent === agent.id}
                      sequence={index + 5}
                      onHover={setActiveAgent}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

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

// Horizontal Agent Card Component
interface HorizontalAgentCardProps {
  agent: any;
  isActive: boolean;
  sequence: number;
  onHover: (agentId: string | null) => void;
}

function HorizontalAgentCard({ agent, isActive, sequence, onHover }: HorizontalAgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => onHover(agent.id)}
        onHoverEnd={() => onHover(null)}
        className="group relative rounded-xl p-5 transition-all cursor-pointer border"
        style={{
          backgroundColor: zsColors.neutral.white,
          borderColor: isActive ? agent.color.primary : zsColors.neutral.lightGray + '80',
          boxShadow: isActive ? zsColors.shadows.lg : zsColors.shadows.sm,
          ...(isActive && {
            background: `linear-gradient(135deg, ${zsColors.neutral.white}, ${agent.color.primary}06)`
          })
        }}
      >
        {/* Sequence number */}
        <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: agent.color.primary }}>
          {sequence}
        </div>

        {/* Active pulse */}
        {isActive && (
          <div className="absolute top-3 right-3">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color.primary }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg p-2.5 flex-shrink-0 transition-all group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
              boxShadow: isActive ? `0 6px 20px ${agent.color.primary}30` : '0 3px 10px rgba(0,0,0,0.1)'
            }}
          >
            <agent.icon className="w-full h-full text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1 truncate" 
                style={{ color: zsColors.neutral.charcoal }}>
              {agent.name}
            </h3>
            <p className="text-xs mb-2 line-clamp-2" 
               style={{ color: zsColors.neutral.gray }}>
              {agent.description}
            </p>
            <p className="text-xs font-medium line-clamp-1" 
               style={{ color: agent.color.primary }}>
              {agent.story}
            </p>
          </div>

          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            style={{ color: agent.color.primary }}
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

// Center Agent Card Component  
interface CenterAgentCardProps {
  agent: any;
  isActive: boolean;
  onHover: (agentId: string | null) => void;
}

function CenterAgentCard({ agent, isActive, onHover }: CenterAgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => onHover(agent.id)}
        onHoverEnd={() => onHover(null)}
        className="group relative rounded-2xl p-8 transition-all cursor-pointer border-2"
        style={{
          backgroundColor: zsColors.neutral.white,
          borderColor: isActive ? agent.color.primary : zsColors.neutral.lightGray + '60',
          boxShadow: isActive ? zsColors.shadows.xl : zsColors.shadows.md,
          background: `linear-gradient(135deg, ${zsColors.neutral.white}, ${agent.color.primary}08)`
        }}
      >
        {/* Central position indicator */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: agent.color.primary }}>
            AI Core
          </div>
        </div>

        {/* Active glow effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at center, ${agent.color.primary}15, transparent)`
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl p-4 mx-auto mb-4 transition-all group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
              boxShadow: isActive ? `0 12px 32px ${agent.color.primary}40` : '0 6px 16px rgba(0,0,0,0.1)'
            }}
          >
            <agent.icon className="w-full h-full text-white" />
          </div>
          
          <h3 className="text-xl font-bold mb-3" 
              style={{ color: zsColors.neutral.charcoal }}>
            {agent.name}
          </h3>
          <p className="text-sm mb-3" style={{ color: zsColors.neutral.gray }}>
            {agent.description}
          </p>
          <p className="text-sm font-medium mb-4" style={{ color: agent.color.primary }}>
            {agent.story}
          </p>
          
          <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <p className="text-xs font-medium mb-1" style={{ color: zsColors.neutral.darkGray }}>
              Key Outputs:
            </p>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
              {agent.outputs}
            </p>
          </div>

          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity mt-3"
            style={{ color: agent.color.primary }}
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        {/* Active pulse indicator */}
        {isActive && (
          <div className="absolute top-4 right-4">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: agent.color.primary }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}
      </motion.div>
    </Link>
  );
}