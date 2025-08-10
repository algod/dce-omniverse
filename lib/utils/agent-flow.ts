// Agent flow navigation utilities
import { zsColors } from '@/lib/design-system/zs-colors';
import { Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon } from 'lucide-react';

export interface AgentInfo {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: any;
  path: string;
}

// Define all agents in the flow
export const AGENTS: Record<string, AgentInfo> = {
  customer: {
    id: 'customer',
    name: 'Customer Planning',
    icon: Users,
    description: 'Barrier analysis & HCP prioritization',
    color: zsColors.agents.customer,
    path: '/agents/customer'
  },
  budget: {
    id: 'budget',
    name: 'Budget Planning',
    icon: TrendingUp,
    description: 'Multi-channel ROI optimization',
    color: zsColors.agents.budget,
    path: '/agents/budget'
  },
  content: {
    id: 'content',
    name: 'Content Review',
    icon: FileCheck,
    description: 'MLR compliance & content strategy',
    color: zsColors.agents.content,
    path: '/agents/content'
  },
  orchestration: {
    id: 'orchestration',
    name: 'AI Orchestration',
    icon: Brain,
    description: 'Customer journey optimization & NBA',
    color: zsColors.agents.orchestration,
    path: '/agents/orchestration'
  },
  suggestions: {
    id: 'suggestions',
    name: 'Field Suggestions',
    icon: Lightbulb,
    description: 'Intelligent trigger-based recommendations',
    color: zsColors.agents.suggestions,
    path: '/agents/suggestions'
  },
  copilot: {
    id: 'copilot',
    name: 'Field Copilot',
    icon: HeadphonesIcon,
    description: 'AI-powered rep assistance & coaching',
    color: zsColors.agents.copilot,
    path: '/agents/copilot'
  }
};

// Define the agent flow relationships
const AGENT_FLOW_MAP: Record<string, string[]> = {
  customer: ['budget'],           // Customer Planning → Budget Planning
  budget: ['content'],            // Budget Planning → Content Review
  content: ['orchestration'],     // Content Review → AI Orchestration
  orchestration: ['suggestions'], // AI Orchestration → Field Suggestions (primary)
  suggestions: ['copilot'],       // Field Suggestions → Field Copilot
  copilot: ['customer']          // Field Copilot → Customer Planning (feedback loop)
};

// Alternative paths for certain agents
const ALTERNATIVE_PATHS: Record<string, string[]> = {
  orchestration: ['copilot'],     // AI Orchestration can also go directly to Field Copilot
  copilot: ['orchestration']      // Field Copilot can feed back to Orchestration
};

/**
 * Get the next logical agents in the flow
 */
export function getNextLogicalAgents(currentAgentId: string): AgentInfo[] {
  const nextAgentIds = AGENT_FLOW_MAP[currentAgentId] || [];
  const alternativeIds = ALTERNATIVE_PATHS[currentAgentId] || [];
  
  // Combine primary and alternative paths
  const allNextAgentIds = [...new Set([...nextAgentIds, ...alternativeIds])];
  
  return allNextAgentIds
    .map(id => AGENTS[id])
    .filter(agent => agent !== undefined);
}

/**
 * Get the previous agents that lead to the current one
 */
export function getPreviousAgents(currentAgentId: string): AgentInfo[] {
  const previousAgentIds: string[] = [];
  
  // Find agents that point to the current agent
  Object.entries(AGENT_FLOW_MAP).forEach(([agentId, nextIds]) => {
    if (nextIds.includes(currentAgentId)) {
      previousAgentIds.push(agentId);
    }
  });
  
  // Also check alternative paths
  Object.entries(ALTERNATIVE_PATHS).forEach(([agentId, nextIds]) => {
    if (nextIds.includes(currentAgentId) && !previousAgentIds.includes(agentId)) {
      previousAgentIds.push(agentId);
    }
  });
  
  return previousAgentIds
    .map(id => AGENTS[id])
    .filter(agent => agent !== undefined);
}

/**
 * Determine if an agent is the start of the flow
 */
export function isFlowStart(agentId: string): boolean {
  return agentId === 'customer';
}

/**
 * Determine if an agent is the end of the main flow
 */
export function isFlowEnd(agentId: string): boolean {
  return agentId === 'copilot';
}

/**
 * Get agent phase in the flow
 */
export function getAgentPhase(agentId: string): 'Planning' | 'Orchestration' | 'Execution' {
  if (['customer', 'budget', 'content'].includes(agentId)) {
    return 'Planning';
  }
  if (agentId === 'orchestration') {
    return 'Orchestration';
  }
  return 'Execution';
}

/**
 * Get agent sequence number in the flow
 */
export function getAgentSequence(agentId: string): number {
  const sequenceMap: Record<string, number> = {
    customer: 1,
    budget: 2,
    content: 3,
    orchestration: 4,
    suggestions: 5,
    copilot: 6
  };
  return sequenceMap[agentId] || 0;
}

/**
 * Get flow navigation message
 */
export function getFlowNavigationMessage(currentAgentId: string): string {
  const phase = getAgentPhase(currentAgentId);
  const nextAgents = getNextLogicalAgents(currentAgentId);
  
  if (nextAgents.length === 0) {
    return 'You have completed the agent flow. Return to Customer Planning to start a new cycle.';
  }
  
  if (phase === 'Planning') {
    return 'Continue to the next planning step to build your strategy.';
  }
  
  if (phase === 'Orchestration') {
    return 'Proceed to execution phase to activate your optimized journeys.';
  }
  
  return 'Complete the execution cycle and gather feedback for continuous improvement.';
}