'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Database, Activity, ArrowRight, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const agents = [
  {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Barrier analysis & HCP prioritization',
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-500/10 to-blue-600/10',
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
    color: 'from-green-500 to-green-600',
    bgGradient: 'from-green-500/10 to-green-600/10',
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
    color: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-500/10 to-purple-600/10',
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
    color: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-500/10 to-orange-600/10',
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
    color: 'from-teal-500 to-teal-600',
    bgGradient: 'from-teal-500/10 to-teal-600/10',
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
    color: 'from-red-500 to-red-600',
    bgGradient: 'from-red-500/10 to-red-600/10',
    reasoning: 'Synthesizes intelligence, generates guidance',
    tools: ['Intelligence Aggregator', 'Coaching Generator', 'Territory Manager'],
    actions: ['Preparing 445 calls', 'Generating coaching', 'Optimizing territories'],
    output: {
      title: 'Field Insights',
      items: ['Call plans', 'Coaching scenarios', 'Territory optimization']
    }
  }
];

export function FlowVisualization() {
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white/5 bg-grid" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ 
              x: Math.random() * 1920,
              y: Math.random() * 1080
            }}
            animate={{
              x: Math.random() * 1920,
              y: Math.random() * 1080
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
          >
            DCE OmniVerse Agent-Verse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            6 Intelligent Agents Working in Perfect Harmony
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={startFlowAnimation}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            <Zap size={20} />
            Visualize Flow
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
                    <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <ArrowRight className="absolute -right-2 -top-2.5 text-purple-400" size={20} />
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
                    <div className="w-full h-full bg-gradient-to-b from-purple-400 to-orange-400" />
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
                          <polygon points="0 0, 10 3.5, 0 7" fill="#60A5FA" />
                        </marker>
                      </defs>
                      <path
                        d="M 90 100 Q 10 100 10 10 Q 10 -80 90 -80"
                        stroke="#60A5FA"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                      />
                    </svg>
                    <span className="absolute -left-32 top-0 text-xs text-blue-400 whitespace-nowrap">
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
                    className={`relative bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer ${
                      flowStep === index ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900' : ''
                    }`}
                  >
                    {/* Glowing Effect */}
                    {flowStep === index && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Agent Icon */}
                    <div className={`relative z-10 w-16 h-16 rounded-lg bg-gradient-to-r ${agent.color} p-3 mb-4`}>
                      <agent.icon className="w-full h-full text-white" />
                      {flowStep === index && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-white/30"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Agent Details */}
                    <h3 className="relative z-10 text-lg font-semibold text-white mb-2">{agent.name}</h3>
                    <p className="relative z-10 text-sm text-gray-400 mb-3">{agent.description}</p>

                    {/* Reasoning & Tools Preview */}
                    <AnimatePresence>
                      {activeAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative z-10"
                        >
                          <div className="pt-3 border-t border-gray-700 space-y-2">
                            <div className="flex items-start gap-2">
                              <Brain size={14} className="text-blue-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-300">Reasoning:</p>
                                <p className="text-xs text-gray-500">{agent.reasoning}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Database size={14} className="text-green-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-300">Tools:</p>
                                <p className="text-xs text-gray-500">{agent.tools.join(', ')}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Activity size={14} className="text-purple-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-gray-300">Current Action:</p>
                                <p className="text-xs text-gray-500">{agent.actions[0]}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Output Indicator */}
                    <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1.5 border border-gray-700">
                      <ChevronRight size={14} className="text-gray-400" />
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
          className="mt-12 bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Business Process Flow</h2>
          <div className="flex items-center justify-between">
            {agents.map((agent, index) => (
              <div key={agent.id} className="flex-1 relative">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    flowStep >= index ? 'bg-gradient-to-r ' + agent.color + ' text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < agents.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-gray-700">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: flowStep > index ? 1 : 0 }}
                        style={{ transformOrigin: 'left' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">{agent.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}