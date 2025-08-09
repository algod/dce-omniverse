'use client';

import { motion } from 'framer-motion';
import { 
  Users, DollarSign, FileText, Network, Lightbulb, HeadphonesIcon,
  ChevronRight, Activity, Database, Brain, Target, Sparkles
} from 'lucide-react';
import { colors } from '@/lib/design-system/colors';
import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: any;
  color: string;
  position: { x: number; y: number };
}

const agents: Agent[] = [
  {
    id: 'customer',
    name: 'Customer Planning',
    shortName: 'Customer',
    description: 'Barrier analysis & HCP prioritization',
    icon: Users,
    color: colors.agents.customer,
    position: { x: 0, y: 0 }
  },
  {
    id: 'budget',
    name: 'Budget Planning',
    shortName: 'Budget',
    description: 'Channel allocation & ROI optimization',
    icon: DollarSign,
    color: colors.agents.budget,
    position: { x: 200, y: 0 }
  },
  {
    id: 'content',
    name: 'Content Review',
    shortName: 'Content',
    description: 'MLR compliance & gap analysis',
    icon: FileText,
    color: colors.agents.content,
    position: { x: 400, y: 0 }
  },
  {
    id: 'orchestration',
    name: 'Omnichannel Orchestration',
    shortName: 'Orchestration',
    description: 'Journey optimization & NBA',
    icon: Network,
    color: colors.agents.orchestration,
    position: { x: 600, y: 0 }
  },
  {
    id: 'suggestions',
    name: 'Field Suggestions',
    shortName: 'Suggestions',
    description: 'Trigger design & monitoring',
    icon: Lightbulb,
    color: colors.agents.suggestions,
    position: { x: 800, y: 0 }
  },
  {
    id: 'copilot',
    name: 'Field Copilot',
    shortName: 'Copilot',
    description: 'Rep assistance & coaching',
    icon: HeadphonesIcon,
    color: colors.agents.copilot,
    position: { x: 1000, y: 0 }
  }
];

interface AgentFlowDiagramProps {
  selectedAgent?: string;
  onAgentSelect?: (agentId: string) => void;
  compact?: boolean;
}

export function AgentFlowDiagram({ selectedAgent, onAgentSelect, compact = false }: AgentFlowDiagramProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<boolean>(true);

  const handleAgentClick = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId);
    }
  };

  const AgentNode = ({ agent, index }: { agent: Agent; index: number }) => {
    const Icon = agent.icon;
    const isSelected = selectedAgent === agent.id;
    const isHovered = hoveredAgent === agent.id;
    const isActive = isSelected || isHovered;

    return (
      <motion.div
        key={agent.id}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* Connection Line */}
        {index < agents.length - 1 && (
          <motion.div
            className="absolute top-1/2 left-full w-20 h-0.5 -translate-y-1/2 z-0"
            style={{ backgroundColor: colors.gray[300] }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
          >
            {activeFlow && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                animate={{
                  x: [-100, 100],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.3,
                  ease: "linear"
                }}
              />
            )}
            <ChevronRight 
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </motion.div>
        )}

        {/* Agent Card */}
        <motion.div
          className={`relative bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all ${
            compact ? 'p-3 w-32' : 'p-4 w-40'
          }`}
          style={{
            borderColor: isActive ? agent.color : colors.gray[200],
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={() => setHoveredAgent(agent.id)}
          onMouseLeave={() => setHoveredAgent(null)}
          onClick={() => handleAgentClick(agent.id)}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Agent Icon */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto"
            style={{ backgroundColor: `${agent.color}15` }}
          >
            <Icon size={24} style={{ color: agent.color }} />
          </div>

          {/* Agent Info */}
          <div className="text-center">
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {compact ? agent.shortName : agent.name}
            </h3>
            {!compact && (
              <p className="text-xs text-gray-600 mt-1">
                {agent.description}
              </p>
            )}
          </div>

          {/* Position Indicator */}
          <div className="absolute -top-2 -right-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: agent.color }}
            >
              {index + 1}
            </div>
          </div>

          {/* Active Indicator */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2"
              style={{ borderColor: agent.color }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>

        {/* Hover Tooltip */}
        {isHovered && !compact && (
          <motion.div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10 w-48"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xs">
              <div className="font-semibold mb-1">Data Flow:</div>
              {index > 0 && (
                <div className="mb-1">
                  <span className="text-gray-400">From:</span> {agents[index - 1].name}
                </div>
              )}
              {index < agents.length - 1 && (
                <div>
                  <span className="text-gray-400">To:</span> {agents[index + 1].name}
                </div>
              )}
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`relative ${compact ? 'py-4' : 'py-8'}`}>
      {/* Header */}
      {!compact && (
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            DCE OmniVerse Agent Flow
          </h2>
          <p className="text-gray-600">
            Connected intelligence through barrier-led engagement
          </p>
        </motion.div>
      )}

      {/* Flow Diagram */}
      <div className={`flex items-center justify-center ${compact ? 'gap-4' : 'gap-8'} overflow-x-auto pb-4`}>
        {agents.map((agent, index) => (
          <AgentNode key={agent.id} agent={agent} index={index} />
        ))}
      </div>

      {/* Legend */}
      {!compact && (
        <motion.div
          className="mt-8 flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Database size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Data Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">AI Reasoning</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Barrier Resolution</span>
          </div>
        </motion.div>
      )}

      {/* Feedback Loop Indicator */}
      {!compact && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="absolute left-0 flex items-center gap-2 -top-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-xs text-gray-600">Continuous Feedback Loop</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}