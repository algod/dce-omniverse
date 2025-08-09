'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  ChevronRight, Zap, Database, Activity, ArrowRight, BarChart3,
  Target, DollarSign, TrendingDown, CheckCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { zsColors } from '@/lib/design-system/zs-colors';

// Enhanced agent data with business metrics
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
    businessImpact: '+$45M opportunity identified',
    efficiency: '32% better targeting',
    output: {
      title: '423 Prioritized HCPs',
      items: ['Opportunity scores', 'Barrier profiles', 'Engagement plans'],
      dataPackage: '423 HCPs → $45M potential'
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
    businessImpact: '3.2x ROI achieved',
    efficiency: '28% cost reduction',
    output: {
      title: '$15M Optimized Budget',
      items: ['Budget allocation', 'ROI projections', 'Engagement frequency'],
      dataPackage: '$15M allocation → 3.2x ROI'
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
    businessImpact: '60% faster approval',
    efficiency: '45% gap reduction',
    output: {
      title: '147 Approved Assets',
      items: ['MLR-approved assets', 'Content-barrier map', 'Gap analysis'],
      dataPackage: '147 compliant assets'
    }
  },
  {
    id: 'orchestration',
    name: 'AI Orchestration',
    icon: Brain,
    description: 'Journey optimization & NBA generation',
    color: zsColors.agents.orchestration,
    reasoning: 'Trains models, optimizes sequences',
    tools: ['BERT Training', 'Journey Optimizer', 'NBA Engine'],
    actions: ['Training on 125K samples', 'Optimizing journeys', 'Generating NBAs'],
    businessImpact: '125K NBAs generated',
    efficiency: '38% journey optimization',
    output: {
      title: 'Optimized Journeys',
      items: ['Optimized paths', 'NBA recommendations', 'Model predictions'],
      dataPackage: '125K NBAs → Better journeys'
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
    businessImpact: '89% suggestion adoption',
    efficiency: '25% rep productivity',
    output: {
      title: '7 Active Triggers',
      items: ['Triggered actions', 'Priority rankings', 'Performance metrics'],
      dataPackage: '7 smart triggers activated'
    }
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'Pre-call planning & field intelligence',
    color: zsColors.agents.copilot,
    reasoning: 'Synthesizes intelligence, generates guidance',
    tools: ['Intelligence Aggregator', 'Coaching Generator', 'Territory Manager'],
    actions: ['Preparing 445 calls', 'Generating coaching', 'Collecting feedback'],
    businessImpact: '445 optimized calls',
    efficiency: '42% time saved',
    output: {
      title: 'Field Intelligence',
      items: ['Call plans', 'Coaching scenarios', 'Territory insights'],
      dataPackage: 'Field insights → Validation'
    }
  }
];

// Connection descriptions
const connections = [
  { from: 0, to: 1, label: '423 HCPs + Barriers', detail: 'Prioritized customers with opportunity scores' },
  { from: 1, to: 2, label: '$15M Budget Mix', detail: 'Optimized channel allocation' },
  { from: 2, to: 3, label: '147 Assets', detail: 'MLR-approved content library' },
  { from: 3, to: 4, label: '125K NBAs', detail: 'Next best action recommendations' },
  { from: 4, to: 5, label: '7 Triggers', detail: 'Active field suggestions' }
];

// Feedback loops
const feedbackLoops = [
  { 
    from: 'copilot', 
    to: 'customer', 
    label: 'Barrier Validation',
    example: 'Rep notes: Dr. Smith concerned about side effects → Updates B002 barrier',
    color: zsColors.secondary.teal
  },
  { 
    from: 'copilot', 
    to: 'orchestration', 
    label: 'Journey Optimization',
    example: 'Call outcome: Referral established → Optimizes sequence',
    color: zsColors.secondary.orange
  },
  { 
    from: 'copilot', 
    to: 'suggestions', 
    label: 'Trigger Refinement',
    example: 'Rep feedback: Too many alerts → Adjusts sensitivity',
    color: zsColors.primary.blue
  }
];

export function FlowVisualizationEnhanced() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [continuousFlow, setContinuousFlow] = useState(0);
  const [presentationFlow, setPresentationFlow] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [businessMetrics, setBusinessMetrics] = useState({
    revenue: 0,
    roi: 0,
    efficiency: 0,
    hcps: 0
  });
  const [dataPackets, setDataPackets] = useState<Array<{id: string, from: number, to: number, progress: number}>>([]);

  // Continuous animation effect
  useEffect(() => {
    // Main flow animation (continuous)
    const flowInterval = setInterval(() => {
      if (!isPresentationMode) {
        setContinuousFlow(prev => (prev + 1) % 6);
        
        // Add data packet
        setDataPackets(prev => {
          const newPackets = prev.filter(p => p.progress < 100);
          if (Math.random() > 0.3) {
            const connectionIndex = Math.floor(Math.random() * connections.length);
            newPackets.push({
              id: `packet-${Date.now()}`,
              from: connections[connectionIndex].from,
              to: connections[connectionIndex].to,
              progress: 0
            });
          }
          return newPackets;
        });
      }
    }, 3000);

    // Feedback loop animation
    const feedbackInterval = setInterval(() => {
      setActiveFeedback(prev => (prev + 1) % 3);
    }, 8000);

    // Business metrics counter
    const metricsInterval = setInterval(() => {
      setBusinessMetrics(prev => ({
        revenue: Math.min(prev.revenue + 2.5, 45),
        roi: Math.min(prev.roi + 0.16, 3.2),
        efficiency: Math.min(prev.efficiency + 1.4, 28),
        hcps: Math.min(prev.hcps + 142, 2847)
      }));
    }, 500);

    // Data packet movement
    const packetInterval = setInterval(() => {
      setDataPackets(prev => 
        prev.map(packet => ({
          ...packet,
          progress: Math.min(packet.progress + 5, 100)
        }))
      );
    }, 100);

    return () => {
      clearInterval(flowInterval);
      clearInterval(feedbackInterval);
      clearInterval(metricsInterval);
      clearInterval(packetInterval);
    };
  }, [isPresentationMode]);

  // Presentation mode animation
  const startPresentationMode = () => {
    setIsPresentationMode(true);
    setPresentationFlow(0);
    const interval = setInterval(() => {
      setPresentationFlow(prev => {
        if (prev >= agents.length - 1) {
          clearInterval(interval);
          setIsPresentationMode(false);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div className="relative min-h-screen p-8" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${zsColors.primary.navy}20 35px, ${zsColors.primary.navy}20 70px)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with business impact metrics */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-2"
            style={{ color: zsColors.neutral.charcoal }}
          >
            DCE OmniVerse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-4"
            style={{ color: zsColors.neutral.darkGray }}
          >
            AI-Powered Omnichannel Intelligence Transforming Pharmaceutical Engagement
          </motion.p>
          
          {/* Live business metrics bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            <div className="flex items-center gap-2">
              <DollarSign size={20} style={{ color: zsColors.semantic.success }} />
              <span className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                ${businessMetrics.revenue.toFixed(1)}M Revenue Potential
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} style={{ color: zsColors.secondary.orange }} />
              <span className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                {businessMetrics.roi.toFixed(1)}x ROI
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={20} style={{ color: zsColors.primary.blue }} />
              <span className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                {businessMetrics.efficiency.toFixed(0)}% Efficiency Gain
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} style={{ color: zsColors.secondary.teal }} />
              <span className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>
                {businessMetrics.hcps.toLocaleString()} HCPs Optimized
              </span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={startPresentationMode}
            disabled={isPresentationMode}
            className="px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            style={{ 
              backgroundColor: isPresentationMode ? zsColors.neutral.gray : zsColors.primary.navy,
              color: zsColors.neutral.white,
              boxShadow: zsColors.shadows.navy,
              cursor: isPresentationMode ? 'not-allowed' : 'pointer'
            }}
          >
            <Zap size={20} />
            {isPresentationMode ? 'Presentation Running...' : 'Enhanced Presentation Mode'}
          </motion.button>
        </div>

        {/* Agent Flow Grid */}
        <div className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {/* Connection lines with labels */}
            {connections.map((conn, idx) => {
              const fromAgent = agents[conn.from];
              const toAgent = agents[conn.to];
              const isActive = continuousFlow === conn.from || presentationFlow === conn.from;
              
              // Calculate positions based on grid layout
              const fromCol = conn.from % 3;
              const fromRow = Math.floor(conn.from / 3);
              const toCol = conn.to % 3;
              const toRow = Math.floor(conn.to / 3);
              
              return (
                <g key={`conn-${idx}`}>
                  <motion.line
                    x1={`${33.33 * fromCol + 30}%`}
                    y1={`${50 * fromRow + 25}%`}
                    x2={`${33.33 * toCol + 3}%`}
                    y2={`${50 * toRow + 25}%`}
                    stroke={isActive ? zsColors.primary.blue : zsColors.neutral.lightGray}
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? "0" : "5,5"}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                      opacity: isActive ? 1 : 0.3
                    }}
                    transition={{ duration: 2 }}
                  />
                  {isActive && (
                    <motion.text
                      x={`${(33.33 * fromCol + 33.33 * toCol) / 2 + 16.66}%`}
                      y={`${(50 * fromRow + 50 * toRow) / 2 + 25}%`}
                      fill={zsColors.neutral.darkGray}
                      fontSize="12"
                      fontWeight="600"
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {conn.label}
                    </motion.text>
                  )}
                </g>
              );
            })}
            
            {/* Feedback loops */}
            {feedbackLoops.map((loop, idx) => {
              const isActive = activeFeedback === idx;
              return (
                <g key={`feedback-${idx}`}>
                  <motion.path
                    d={
                      idx === 0 ? "M 90% 75% Q 10% 75% 10% 25%" : // Copilot to Customer
                      idx === 1 ? "M 90% 75% Q 50% 50% 66% 75%" : // Copilot to Orchestration
                      "M 90% 75% Q 70% 60% 33% 75%" // Copilot to Suggestions
                    }
                    stroke={loop.color}
                    strokeWidth={isActive ? 3 : 2}
                    fill="none"
                    strokeDasharray={isActive ? "0" : "5,5"}
                    opacity={isActive ? 0.8 : 0.2}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: isActive ? 1 : 0.5,
                      opacity: isActive ? 0.8 : 0.2
                    }}
                    transition={{ duration: 2 }}
                  />
                  {isActive && (
                    <motion.text
                      x={idx === 0 ? "25%" : idx === 1 ? "70%" : "60%"}
                      y={idx === 0 ? "50%" : "65%"}
                      fill={loop.color}
                      fontSize="11"
                      fontWeight="600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {loop.label}
                    </motion.text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-3 gap-8 relative">
            {agents.map((agent, index) => {
              const isActive = continuousFlow === index || presentationFlow === index;
              const isPulsing = (continuousFlow === index && !isPresentationMode) || (presentationFlow === index && isPresentationMode);
              
              return (
                <div key={agent.id} className="relative">
                  <Link href={`/agents/${agent.id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isPulsing ? [1, 1.02, 1] : 1
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        scale: {
                          duration: 2,
                          repeat: isPulsing ? Infinity : 0
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      onHoverStart={() => setActiveAgent(agent.id)}
                      onHoverEnd={() => setActiveAgent(null)}
                      className="relative rounded-xl p-6 transition-all cursor-pointer"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `2px solid ${isActive ? agent.color.primary : zsColors.neutral.lightGray}`,
                        boxShadow: activeAgent === agent.id ? zsColors.shadows.lg : zsColors.shadows.md,
                        ...(isActive && {
                          boxShadow: `0 0 20px ${agent.color.primary}40, ${zsColors.shadows.lg}`
                        })
                      }}
                    >
                      {/* Active glow effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{ backgroundColor: agent.color.primary }}
                          animate={{ opacity: [0.05, 0.1, 0.05] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {/* Business impact badge */}
                      <motion.div
                        className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: zsColors.semantic.success,
                          color: zsColors.neutral.white
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: isActive ? 1 : 0 }}
                        transition={{ type: "spring" }}
                      >
                        {agent.businessImpact}
                      </motion.div>

                      {/* Agent Icon with activity indicator */}
                      <div className="relative z-10 w-16 h-16 rounded-lg p-3 mb-4" style={{
                        background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
                        boxShadow: isActive ? `0 4px 14px 0 ${agent.color.primary}40` : 'none'
                      }}>
                        <agent.icon className="w-full h-full text-white" />
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                            style={{ backgroundColor: zsColors.semantic.success }}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>

                      {/* Agent Details */}
                      <h3 className="relative z-10 text-lg font-semibold mb-2" style={{ color: zsColors.neutral.charcoal }}>
                        {agent.name}
                      </h3>
                      <p className="relative z-10 text-sm mb-2" style={{ color: zsColors.neutral.gray }}>
                        {agent.description}
                      </p>
                      
                      {/* Efficiency metric */}
                      <div className="relative z-10 flex items-center gap-2 mb-3">
                        <BarChart3 size={14} style={{ color: agent.color.primary }} />
                        <span className="text-xs font-semibold" style={{ color: agent.color.primary }}>
                          {agent.efficiency}
                        </span>
                      </div>

                      {/* Output preview */}
                      <AnimatePresence>
                        {(activeAgent === agent.id || isActive) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative z-10"
                          >
                            <div className="pt-3 space-y-2" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
                              <div className="flex items-start gap-2">
                                <Database size={14} style={{ color: zsColors.secondary.teal }} className="mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                                    Output:
                                  </p>
                                  <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                                    {agent.output.dataPackage}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Processing indicator */}
                      {isActive && (
                        <div className="absolute bottom-2 right-2">
                          <motion.div
                            className="flex gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: agent.color.primary }}
                                animate={{ 
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                              />
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example Data Flow Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 rounded-xl p-4"
          style={{ 
            backgroundColor: zsColors.neutral.white,
            border: `1px solid ${zsColors.neutral.lightGray}`,
            boxShadow: zsColors.shadows.sm
          }}
        >
          <div className="flex items-center gap-4">
            <AlertCircle size={20} style={{ color: zsColors.secondary.orange }} />
            <div className="flex-1 overflow-hidden">
              <motion.div
                className="flex gap-8"
                animate={{ x: [0, -100, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-sm whitespace-nowrap" style={{ color: zsColors.neutral.darkGray }}>
                  <strong>Live Example:</strong> Rep notes &ldquo;Dr. Smith concerned about side effects&rdquo; → Updates B002 barrier weight → Triggers content recommendation → Generates coaching scenario
                </span>
                <span className="text-sm whitespace-nowrap" style={{ color: zsColors.neutral.darkGray }}>
                  <strong>Territory Update:</strong> &ldquo;Formulary approved at Regional Medical Center&rdquo; → Updates B004 status → Triggers immediate engagement → Schedules follow-up calls
                </span>
                <span className="text-sm whitespace-nowrap" style={{ color: zsColors.neutral.darkGray }}>
                  <strong>Call Outcome:</strong> &ldquo;Referral pathway established&rdquo; → Reduces B001 barrier → Optimizes journey sequence → Updates success probability
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Business Value Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 grid grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Agents', value: '6', icon: Brain, color: zsColors.primary.navy },
            { label: 'Data Connections', value: '8+', icon: Activity, color: zsColors.primary.blue },
            { label: 'Feedback Loops', value: '3', icon: ArrowRight, color: zsColors.secondary.teal },
            { label: 'Success Rate', value: '89%', icon: CheckCircle, color: zsColors.semantic.success }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              className="rounded-lg p-4 text-center"
              style={{ 
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`,
                boxShadow: zsColors.shadows.sm
              }}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon size={24} style={{ color: stat.color }} className="mx-auto mb-2" />
              <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}