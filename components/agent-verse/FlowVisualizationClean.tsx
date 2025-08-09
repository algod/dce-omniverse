'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Activity, Target, Sparkles, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { zsColors } from '@/lib/design-system/zs-colors';

// Enhanced agent data with conceptual storytelling
const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Understanding barriers & opportunities',
    color: zsColors.agents.customer,
    story: 'Discovers what prevents prescribing',
    impact: 'Smarter targeting',
    pulse: 'Analyzing patterns...'
  },
  {
    id: 'budget',
    name: 'Budget Planning',
    icon: TrendingUp,
    description: 'Optimizing resource allocation',
    color: zsColors.agents.budget,
    story: 'Invests where it matters most',
    impact: 'Maximum ROI',
    pulse: 'Optimizing spend...'
  },
  {
    id: 'content',
    name: 'Content Review',
    icon: FileCheck,
    description: 'Ensuring compliant messaging',
    color: zsColors.agents.content,
    story: 'Crafts the right message',
    impact: 'Faster approval',
    pulse: 'Reviewing assets...'
  },
  {
    id: 'orchestration',
    name: 'AI Orchestration',
    icon: Brain,
    description: 'Personalizing customer journeys',
    color: zsColors.agents.orchestration,
    story: 'Predicts the best path forward',
    impact: 'Smarter engagement',
    pulse: 'Learning patterns...'
  },
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    icon: Lightbulb,
    description: 'Guiding field actions',
    color: zsColors.agents.suggestions,
    story: 'Knows when to engage',
    impact: 'Timely actions',
    pulse: 'Monitoring triggers...'
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'Empowering field teams',
    color: zsColors.agents.copilot,
    story: 'Supports every conversation',
    impact: 'Better outcomes',
    pulse: 'Coaching reps...'
  }
];

// Conceptual connections for storytelling
const connectionStory = [
  { from: 0, to: 1, concept: 'Priorities inform investment' },
  { from: 1, to: 2, concept: 'Budget shapes content needs' },
  { from: 2, to: 3, concept: 'Content enables journeys' },
  { from: 3, to: 4, concept: 'Intelligence drives action' },
  { from: 4, to: 5, concept: 'Insights empower teams' }
];

// Feedback story
const feedbackStory = [
  { concept: 'Field insights validate barriers', color: zsColors.secondary.teal },
  { concept: 'Real outcomes improve predictions', color: zsColors.secondary.orange },
  { concept: 'Rep feedback refines suggestions', color: zsColors.primary.blue }
];

export function FlowVisualizationClean() {
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const [flowPosition, setFlowPosition] = useState(0);
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);
  const [feedbackPulse, setFeedbackPulse] = useState(0);
  const [storyPhase, setStoryPhase] = useState(0);

  // Continuous subtle animation
  useEffect(() => {
    // Gentle flow animation
    const flowInterval = setInterval(() => {
      setFlowPosition(prev => (prev + 1) % 6);
    }, 4000);

    // Story phase rotation
    const storyInterval = setInterval(() => {
      setStoryPhase(prev => (prev + 1) % 3);
    }, 6000);

    // Feedback pulse
    const feedbackInterval = setInterval(() => {
      setFeedbackPulse(prev => (prev + 1) % 3);
    }, 8000);

    return () => {
      clearInterval(flowInterval);
      clearInterval(storyInterval);
      clearInterval(feedbackInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at top right, ${zsColors.primary.navy}, transparent),
                       radial-gradient(circle at bottom left, ${zsColors.primary.blue}, transparent)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Clean header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles size={24} style={{ color: zsColors.secondary.orange }} />
            <h1 className="text-5xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              DCE OmniVerse
            </h1>
            <Sparkles size={24} style={{ color: zsColors.secondary.orange }} />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-2"
            style={{ color: zsColors.neutral.darkGray }}
          >
            Where AI Agents Unite to Transform Pharmaceutical Engagement
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm"
            style={{ color: zsColors.neutral.gray }}
          >
            Six intelligent agents working in harmony to optimize every interaction
          </motion.p>
        </div>

        {/* Story indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`
            }}
          >
            <Activity size={16} style={{ color: zsColors.primary.blue }} />
            <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
              {storyPhase === 0 && "Discovering insights from every interaction"}
              {storyPhase === 1 && "Orchestrating personalized engagement strategies"}
              {storyPhase === 2 && "Empowering teams with intelligent guidance"}
            </span>
          </div>
        </motion.div>

        {/* Clean agent grid with subtle connections */}
        <div className="relative">
          {/* Subtle connection lines - no text overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={zsColors.primary.blue} stopOpacity="0.1" />
                <stop offset="50%" stopColor={zsColors.primary.blue} stopOpacity="0.3" />
                <stop offset="100%" stopColor={zsColors.primary.blue} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Horizontal connections */}
            {[0, 1, 3, 4].map(idx => {
              const isActive = flowPosition === idx || flowPosition === idx + 1;
              return (
                <motion.line
                  key={`h-${idx}`}
                  x1={idx < 2 ? `${33.33 * (idx % 3) + 30}%` : `${33.33 * (idx % 3) + 30}%`}
                  y1={idx < 3 ? "25%" : "75%"}
                  x2={idx < 2 ? `${33.33 * ((idx + 1) % 3) + 3}%` : `${33.33 * ((idx + 1) % 3) + 3}%`}
                  y2={idx < 3 ? "25%" : "75%"}
                  stroke="url(#connectionGradient)"
                  strokeWidth={isActive ? 3 : 1.5}
                  opacity={isActive ? 0.6 : 0.2}
                  strokeDasharray={isActive ? "0" : "8,4"}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    opacity: isActive ? [0.2, 0.6, 0.2] : 0.2
                  }}
                  transition={{ 
                    pathLength: { duration: 2 },
                    opacity: { duration: 2, repeat: Infinity }
                  }}
                />
              );
            })}
            
            {/* Vertical connection */}
            <motion.line
              x1="96.66%"
              y1="35%"
              x2="96.66%"
              y2="65%"
              stroke="url(#connectionGradient)"
              strokeWidth={flowPosition === 2 || flowPosition === 3 ? 3 : 1.5}
              opacity={flowPosition === 2 || flowPosition === 3 ? 0.6 : 0.2}
              strokeDasharray={flowPosition === 2 || flowPosition === 3 ? "0" : "8,4"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            
            {/* Elegant feedback loop */}
            <motion.path
              d="M 90% 75% Q 50% 90% 10% 75% Q -5% 50% 10% 25%"
              stroke={zsColors.secondary.teal}
              strokeWidth="1.5"
              fill="none"
              opacity={0.15}
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: feedbackPulse === 0 ? [0.15, 0.3, 0.15] : 0.15
              }}
              transition={{ 
                pathLength: { duration: 3 },
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
          </svg>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {agents.map((agent, index) => {
              const isActive = flowPosition === index;
              const isPulsing = isActive;
              
              return (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isPulsing ? [1, 1.01, 1] : 1
                    }}
                    transition={{ 
                      opacity: { delay: index * 0.1 },
                      y: { delay: index * 0.1 },
                      scale: { duration: 3, repeat: isPulsing ? Infinity : 0 }
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    onHoverStart={() => setActiveAgent(index)}
                    onHoverEnd={() => setActiveAgent(null)}
                    className="group relative rounded-xl p-5 transition-all cursor-pointer h-full"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${isActive ? agent.color.primary + '40' : zsColors.neutral.lightGray}`,
                      boxShadow: activeAgent === index ? zsColors.shadows.lg : zsColors.shadows.sm
                    }}
                  >
                    {/* Subtle active glow */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ 
                          background: `radial-gradient(circle at center, ${agent.color.primary}08, transparent)`
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    {/* Agent Icon */}
                    <div className="relative z-10 flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg p-2.5 transition-all group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
                          boxShadow: isActive ? `0 4px 12px ${agent.color.primary}30` : 'none'
                        }}
                      >
                        <agent.icon className="w-full h-full text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                          {agent.name}
                        </h3>
                        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          {agent.description}
                        </p>
                      </div>
                    </div>

                    {/* Story element */}
                    <div className="relative z-10 mb-2">
                      <p className="text-sm font-medium" style={{ color: agent.color.primary }}>
                        {agent.story}
                      </p>
                    </div>

                    {/* Impact indicator */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: agent.color.primary + '10',
                          color: agent.color.primary
                        }}
                      >
                        {agent.impact}
                      </span>
                      
                      {/* Activity pulse */}
                      {isActive && (
                        <motion.span
                          className="text-xs"
                          style={{ color: zsColors.neutral.gray }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {agent.pulse}
                        </motion.span>
                      )}
                    </div>

                    {/* Subtle hover indicator */}
                    <motion.div
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: agent.color.primary }}
                    >
                      <ArrowUpRight size={16} />
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Connection story (appears on hover or periodically) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`
            }}
          >
            <ChevronRight size={16} style={{ color: zsColors.primary.blue }} />
            <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
              {connectionStory[Math.min(flowPosition, connectionStory.length - 1)].concept}
            </span>
          </div>
        </motion.div>

        {/* Feedback loop story */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: feedbackStory[feedbackPulse].color,
                boxShadow: `0 0 8px ${feedbackStory[feedbackPulse].color}40`
              }}
            />
            <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
              {feedbackStory[feedbackPulse].concept}
            </span>
          </div>
        </motion.div>

        {/* Value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Unified Intelligence', icon: Brain, description: 'Connected insights' },
            { label: 'Continuous Learning', icon: Activity, description: 'Adaptive system' },
            { label: 'Optimized Outcomes', icon: Target, description: 'Better results' }
          ].map((value, idx) => (
            <motion.div
              key={value.label}
              className="text-center p-4 rounded-lg"
              style={{ 
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}
              whileHover={{ scale: 1.02 }}
            >
              <value.icon size={24} style={{ color: zsColors.primary.navy }} className="mx-auto mb-2" />
              <p className="text-sm font-semibold mb-1" style={{ color: zsColors.neutral.charcoal }}>
                {value.label}
              </p>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}