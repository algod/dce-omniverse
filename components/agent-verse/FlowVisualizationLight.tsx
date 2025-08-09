'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Database, Activity, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { zsColors } from '@/lib/design-system/zs-colors';

const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Barrier analysis & HCP prioritization',
    color: zsColors.agents.customer,
    reasoning: 'Analyzes 5 barriers, predicts opportunities',
    tools: ['HCP Segmentation', 'Barrier Analysis', 'Opportunity Scoring'],
    actions: ['Prioritizing 2,847 HCPs', 'Identifying barriers', 'Calculating scores'],
    output: {
      title: 'Prioritized HCPs',
      items: ['Opportunity scores', 'Barrier profiles', 'Engagement plans']
    }
  },
  {
    id: 'budget',
    name: 'Budget Planning',
    icon: TrendingUp,
    description: 'ROI optimization & channel allocation',
    color: zsColors.agents.budget,
    reasoning: 'Optimizes response curves, detects saturation',
    tools: ['Channel Optimizer', 'ROI Calculator', 'Budget Simulator'],
    actions: ['Allocating $15M budget', 'Calculating mROI', 'Finding optimal mix'],
    output: {
      title: 'Channel Budgets',
      items: ['Budget allocation', 'ROI projections', 'Engagement frequency']
    }
  },
  {
    id: 'content',
    name: 'Content Review',
    icon: FileCheck,
    description: 'MLR compliance & gap analysis',
    color: zsColors.agents.content,
    reasoning: 'Maps content to barriers, ensures compliance',
    tools: ['MLR Checker', 'Content Library', 'Gap Analyzer'],
    actions: ['Reviewing 147 assets', 'Checking compliance', 'Finding gaps'],
    output: {
      title: 'Approved Content',
      items: ['MLR-approved assets', 'Content-barrier map', 'Gap analysis']
    }
  },
  {
    id: 'orchestration',
    name: 'AI Orchestration',
    icon: Brain,
    description: 'BERT model & journey optimization',
    color: zsColors.agents.orchestration,
    reasoning: 'Trains BERT model, optimizes sequences',
    tools: ['BERT Training', 'Journey Optimizer', 'NBA Engine'],
    actions: ['Training on 125K samples', 'Optimizing journeys', 'Generating NBAs'],
    output: {
      title: 'Customer Journeys',
      items: ['Optimized paths', 'NBA recommendations', 'Model predictions']
    }
  },
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    icon: Lightbulb,
    description: 'Trigger configuration & monitoring',
    color: zsColors.agents.suggestions,
    reasoning: 'Analyzes triggers, integrates feedback',
    tools: ['Trigger Console', 'Feedback Processor', 'Performance Analytics'],
    actions: ['Configuring 7 triggers', 'Processing feedback', 'Adjusting thresholds'],
    output: {
      title: 'Active Suggestions',
      items: ['Triggered actions', 'Priority rankings', 'Performance metrics']
    }
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'Pre-call planning & coaching',
    color: zsColors.agents.copilot,
    reasoning: 'Synthesizes intelligence, generates guidance',
    tools: ['Intelligence Aggregator', 'Coaching Generator', 'Territory Manager'],
    actions: ['Preparing 445 calls', 'Generating coaching', 'Optimizing territories'],
    output: {
      title: 'Field Insights',
      items: ['Call plans', 'Coaching scenarios', 'Territory optimization']
    }
  }
];

export function FlowVisualizationLight() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate the flow
  const startFlowAnimation = () => {
    setIsAnimating(true);
    setFlowStep(0);
    const interval = setInterval(() => {
      setFlowStep(prev => {
        if (prev >= agents.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Clean geometric pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${zsColors.primary.navy}20 35px, ${zsColors.primary.navy}20 70px)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
            style={{ color: zsColors.neutral.charcoal }}
          >
            DCE OmniVerse Agent Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl"
            style={{ color: zsColors.neutral.darkGray }}
          >
            6 Intelligent Agents Optimizing Pharmaceutical Omnichannel Strategy
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={startFlowAnimation}
            className="mt-6 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            style={{ 
              backgroundColor: zsColors.primary.navy,
              color: zsColors.neutral.white,
              boxShadow: zsColors.shadows.navy
            }}
          >
            <Zap size={20} />
            Visualize Business Flow
          </motion.button>
        </div>

        {/* Agent Flow */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <div key={agent.id} className="relative">
                {/* Connection Line */}
                {index < agents.length - 1 && index % 3 !== 2 && (
                  <motion.div
                    className="absolute top-1/2 -right-4 w-8 h-0.5"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ 
                      scaleX: flowStep > index ? 1 : 0,
                      opacity: flowStep > index ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="h-full" style={{ backgroundColor: zsColors.primary.blue }} />
                    <ArrowRight className="absolute -right-2 -top-2.5" size={20} style={{ color: zsColors.primary.blue }} />
                  </motion.div>
                )}

                {/* Connection to next row */}
                {index === 2 && (
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 h-8"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ 
                      scaleY: flowStep > index ? 1 : 0,
                      opacity: flowStep > index ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full h-full" style={{ 
                      background: `linear-gradient(180deg, ${zsColors.agents.content.primary}, ${zsColors.agents.orchestration.primary})`
                    }} />
                  </motion.div>
                )}

                {/* Feedback Loop */}
                {index === 5 && (
                  <motion.div
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: flowStep === agents.length - 1 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <svg width="100" height="200" className="absolute -left-24 -top-24">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill={zsColors.secondary.teal} />
                        </marker>
                      </defs>
                      <path
                        d="M 90 100 Q 10 100 10 10 Q 10 -80 90 -80"
                        stroke={zsColors.secondary.teal}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                      />
                    </svg>
                    <span className="absolute -left-32 top-0 text-xs whitespace-nowrap font-medium" style={{ color: zsColors.secondary.teal }}>
                      Feedback Loop
                    </span>
                  </motion.div>
                )}

                <Link href={`/agents/${agent.id}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => setActiveAgent(agent.id)}
                    onHoverEnd={() => setActiveAgent(null)}
                    className="relative rounded-xl p-6 transition-all cursor-pointer"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${flowStep === index ? agent.color.primary : zsColors.neutral.lightGray}`,
                      boxShadow: activeAgent === agent.id ? zsColors.shadows.lg : zsColors.shadows.md,
                      ...(flowStep === index && {
                        boxShadow: `0 0 0 2px ${agent.color.primary}20, ${zsColors.shadows.lg}`
                      })
                    }}
                  >
                    {/* Glowing Effect */}
                    {flowStep === index && (
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-10"
                        style={{ backgroundColor: agent.color.primary }}
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Agent Icon */}
                    <div className="relative z-10 w-16 h-16 rounded-lg p-3 mb-4" style={{
                      background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
                      boxShadow: flowStep === index ? `0 4px 14px 0 ${agent.color.primary}40` : 'none'
                    }}>
                      <agent.icon className="w-full h-full text-white" />
                    </div>

                    {/* Agent Details */}
                    <h3 className="relative z-10 text-lg font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>{agent.name}</h3>
                    <p className="relative z-10 text-sm mb-3" style={{ color: zsColors.neutral.gray }}>{agent.description}</p>

                    {/* Reasoning & Tools Preview */}
                    <AnimatePresence>
                      {activeAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative z-10"
                        >
                          <div className="pt-3 space-y-2" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                            <div className="flex items-start gap-2">
                              <Brain size={14} style={{ color: agent.color.primary }} className="mt-0.5" />
                              <div>
                                <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Reasoning:</p>
                                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>{agent.reasoning}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Database size={14} style={{ color: zsColors.secondary.teal }} className="mt-0.5" />
                              <div>
                                <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Tools:</p>
                                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>{agent.tools.join(', ')}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Activity size={14} style={{ color: zsColors.primary.blue }} className="mt-0.5" />
                              <div>
                                <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Current Action:</p>
                                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>{agent.actions[0]}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Output Indicator */}
                    <div className="absolute -bottom-2 -right-2 rounded-full p-1.5" 
                      style={{ 
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}>
                      <ChevronRight size={14} style={{ color: zsColors.primary.navy }} />
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Flow Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-xl p-6"
          style={{ 
            backgroundColor: zsColors.neutral.white,
            border: `1px solid ${zsColors.neutral.lightGray}`,
            boxShadow: zsColors.shadows.md
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>Business Process Flow</h2>
          <div className="flex items-center justify-between">
            {agents.map((agent, index) => (
              <div key={agent.id} className="flex-1 relative">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ 
                      backgroundColor: flowStep >= index ? agent.color.primary : zsColors.neutral.lightGray,
                      color: zsColors.neutral.white
                    }}>
                    {index + 1}
                  </div>
                  {index < agents.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: zsColors.neutral.lightGray }}>
                      <motion.div
                        className="h-full"
                        style={{ 
                          background: `linear-gradient(90deg, ${agent.color.primary}, ${agents[index + 1].color.primary})`,
                          transformOrigin: 'left'
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: flowStep > index ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: zsColors.neutral.gray }}>{agent.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}