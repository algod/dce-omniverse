'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Define the structure of data passed between agents
interface AgentData {
  // Customer Planning outputs
  customerPlanning?: {
    prioritizedHCPs: number;
    microsegments: string[];
    totalOpportunity: string;
    barriers: Record<string, number>;
    channelPreferences: Record<string, number>;
    timestamp?: string;
  };
  
  // Engagement Planning outputs
  engagementPlanning?: {
    totalBudget: string;
    channelAllocation: Record<string, string>;
    expectedROI: string;
    segmentPlans: Record<string, any>;
    timestamp?: string;
  };
  
  // Content Planning outputs
  contentPlanning?: {
    contentGaps: number;
    priorityAssets: string[];
    messageThemes: string[];
    timeline: string;
    timestamp?: string;
  };
  
  // Content Generation outputs
  contentGeneration?: {
    generatedAssets: number;
    variants: number;
    qualityScore: number;
    complianceRate: number;
    timestamp?: string;
  };
  
  // Content Approval outputs
  contentApproval?: {
    approvedAssets: number;
    pendingReview: number;
    declined: number;
    veevaSync: boolean;
    timestamp?: string;
  };
  
  // Orchestration outputs
  orchestration?: {
    journeyPlans: number;
    nbaRecommendations: number;
    modelAccuracy: number;
    sequences: any[];
    timestamp?: string;
  };
  
  // Digital Activation outputs
  digitalActivation?: {
    activeCampaigns: number;
    vendorsIntegrated: number;
    successRate: number;
    executionStatus: Record<string, string>;
    timestamp?: string;
  };
  
  // Field Suggestions outputs
  fieldSuggestions?: {
    activeTrigers: number;
    prioritizedActions: string[];
    completionRate: number;
    feedbackScore: number;
    timestamp?: string;
  };
  
  // Field Copilot outputs (feeds back to Customer Planning)
  fieldCopilot?: {
    fieldInsights: string[];
    barrierFeedback: Record<string, any>;
    engagementOutcomes: Record<string, any>;
    newOpportunities: number;
    timestamp?: string;
  };
}

// Define data flow events
interface DataFlowEvent {
  from: string;
  to: string;
  data: any;
  timestamp: string;
  id: string;
}

interface AgentDataContextType {
  agentData: AgentData;
  updateAgentData: (agentId: string, data: any) => void;
  getUpstreamData: (agentId: string) => any;
  getDownstreamImpact: (agentId: string, changes: any) => any;
  dataFlowEvents: DataFlowEvent[];
  addDataFlowEvent: (event: Omit<DataFlowEvent, 'id' | 'timestamp'>) => void;
  clearDataFlowEvents: () => void;
  isDataAvailable: (agentId: string) => boolean;
}

const AgentDataContext = createContext<AgentDataContextType | undefined>(undefined);

// Define agent dependencies
const AGENT_DEPENDENCIES: Record<string, string[]> = {
  'customer': [], // No dependencies, starts the flow
  'engagement': ['customer'],
  'content-planning': ['engagement'],
  'content-generation': ['content-planning'],
  'content-approval': ['content-generation'],
  'orchestration': ['content-approval'],
  'activation': ['orchestration'],
  'suggestions': ['activation'],
  'copilot': ['suggestions'],
};

// Define agent flow order
const AGENT_FLOW_ORDER = [
  'customer',
  'engagement',
  'content-planning',
  'content-generation',
  'content-approval',
  'orchestration',
  'activation',
  'suggestions',
  'copilot'
];

export function AgentDataProvider({ children }: { children: React.ReactNode }) {
  const [agentData, setAgentData] = useState<AgentData>({});
  const [dataFlowEvents, setDataFlowEvents] = useState<DataFlowEvent[]>([]);

  // Initialize with mock data for demo
  useEffect(() => {
    const mockData: AgentData = {
      customerPlanning: {
        prioritizedHCPs: 423,
        microsegments: ['Champions', 'Growers', 'Converters', 'Maintainers', 'Defenders'],
        totalOpportunity: '$45M',
        barriers: {
          'Formulary': 38,
          'Referral Pathways': 27,
          'Side Effects': 20,
          'Insurance': 10,
          'Diagnostic': 5
        },
        channelPreferences: {
          'Field': 62,
          'Digital': 38
        },
        timestamp: new Date().toISOString()
      }
    };
    setAgentData(mockData);
  }, []);

  const updateAgentData = useCallback((agentId: string, data: any) => {
    setAgentData(prev => {
      const updated = {
        ...prev,
        [agentId]: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };
      
      // Find downstream agents
      const currentIndex = AGENT_FLOW_ORDER.indexOf(agentId);
      if (currentIndex >= 0 && currentIndex < AGENT_FLOW_ORDER.length - 1) {
        const nextAgent = AGENT_FLOW_ORDER[currentIndex + 1];
        
        // Create data flow event
        const event: DataFlowEvent = {
          from: agentId,
          to: nextAgent,
          data: data,
          timestamp: new Date().toISOString(),
          id: `${agentId}-${nextAgent}-${Date.now()}`
        };
        
        setDataFlowEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
      }
      
      return updated;
    });
  }, []);

  const getUpstreamData = useCallback((agentId: string) => {
    const dependencies = AGENT_DEPENDENCIES[agentId] || [];
    const upstreamData: Record<string, any> = {};
    
    dependencies.forEach(dep => {
      const depKey = dep.replace('-', '') + 'Planning';
      if (agentData[depKey as keyof AgentData]) {
        upstreamData[dep] = agentData[depKey as keyof AgentData];
      }
    });
    
    return upstreamData;
  }, [agentData]);

  const getDownstreamImpact = useCallback((agentId: string, changes: any) => {
    const currentIndex = AGENT_FLOW_ORDER.indexOf(agentId);
    const downstreamAgents = AGENT_FLOW_ORDER.slice(currentIndex + 1);
    
    // Calculate impact on downstream agents
    const impacts: Record<string, any> = {};
    
    downstreamAgents.forEach(agent => {
      // Simulate impact calculation
      impacts[agent] = {
        affected: true,
        severity: currentIndex < 3 ? 'high' : 'medium',
        description: `Changes in ${agentId} will affect ${agent}'s inputs`,
        estimatedChange: Math.round(Math.random() * 30) + '%'
      };
    });
    
    return impacts;
  }, []);

  const addDataFlowEvent = useCallback((event: Omit<DataFlowEvent, 'id' | 'timestamp'>) => {
    const newEvent: DataFlowEvent = {
      ...event,
      id: `${event.from}-${event.to}-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setDataFlowEvents(prev => [...prev.slice(-9), newEvent]);
  }, []);

  const clearDataFlowEvents = useCallback(() => {
    setDataFlowEvents([]);
  }, []);

  const isDataAvailable = useCallback((agentId: string) => {
    const dependencies = AGENT_DEPENDENCIES[agentId] || [];
    
    if (dependencies.length === 0) return true; // No dependencies
    
    return dependencies.every(dep => {
      const depKey = dep.replace('-', '') + (dep === 'customer' ? 'Planning' : '');
      return agentData[depKey as keyof AgentData] !== undefined;
    });
  }, [agentData]);

  return (
    <AgentDataContext.Provider
      value={{
        agentData,
        updateAgentData,
        getUpstreamData,
        getDownstreamImpact,
        dataFlowEvents,
        addDataFlowEvent,
        clearDataFlowEvents,
        isDataAvailable
      }}
    >
      {children}
    </AgentDataContext.Provider>
  );
}

export function useAgentData() {
  const context = useContext(AgentDataContext);
  if (context === undefined) {
    throw new Error('useAgentData must be used within an AgentDataProvider');
  }
  return context;
}

// Helper hook to get data for a specific agent
export function useAgentDataFlow(agentId: string) {
  const { 
    agentData, 
    updateAgentData, 
    getUpstreamData, 
    getDownstreamImpact,
    isDataAvailable 
  } = useAgentData();
  
  const currentAgentData = agentData[agentId as keyof AgentData];
  const upstreamData = getUpstreamData(agentId);
  const dataAvailable = isDataAvailable(agentId);
  
  const updateData = useCallback((data: any) => {
    updateAgentData(agentId, data);
  }, [agentId, updateAgentData]);
  
  const previewDownstreamImpact = useCallback((changes: any) => {
    return getDownstreamImpact(agentId, changes);
  }, [agentId, getDownstreamImpact]);
  
  return {
    currentData: currentAgentData,
    upstreamData,
    updateData,
    previewDownstreamImpact,
    dataAvailable
  };
}