// Data package interfaces for inter-agent communication

// 1. Customer Planning → Budget Planning
export interface CustomerToBudgetPackage {
  timestamp: string;
  source: 'customer-planning';
  destination: 'budget-planning';
  data: {
    prioritizedHCPs: Array<{
      id: string;
      name: string;
      specialty: string;
      opportunityScore: number;
      barriers: string[];
      preferredChannels: string[];
    }>;
    barrierAnalysis: {
      B001_referralPathway: { count: number; severity: number };
      B002_sideEffects: { count: number; severity: number };
      B003_insurance: { count: number; severity: number };
      B004_formulary: { count: number; severity: number };
      B005_diagnostic: { count: number; severity: number };
    };
    engagementRecommendations: {
      field: number;
      digital: number;
      email: number;
      conferences: number;
    };
    totalOpportunity: number;
    segments: Array<{
      name: string;
      size: number;
      avgOpportunity: number;
    }>;
  };
}

// 2. Budget Planning → Content Review
export interface BudgetToContentPackage {
  timestamp: string;
  source: 'budget-planning';
  destination: 'content-review';
  data: {
    channelBudgets: {
      field: number;
      email: number;
      web: number;
      speakerPrograms: number;
      conferences: number;
      digital: number;
    };
    expectedROI: {
      overall: number;
      byChannel: Record<string, number>;
    };
    engagementFrequency: {
      weekly: number;
      monthly: number;
      quarterly: number;
    };
    channelMix: Array<{
      channel: string;
      percentage: number;
      priority: number;
    }>;
    contentNeeds: {
      estimatedAssets: number;
      priorityThemes: string[];
      channelRequirements: Record<string, number>;
    };
  };
}

// 3. Content Review → AI Orchestration
export interface ContentToOrchestrationPackage {
  timestamp: string;
  source: 'content-review';
  destination: 'ai-orchestration';
  data: {
    approvedContent: Array<{
      id: string;
      title: string;
      type: string;
      barrier: string;
      channel: string;
      mlrStatus: 'approved' | 'pending' | 'rejected';
      effectiveness: number;
    }>;
    contentBarrierMap: Record<string, string[]>;
    gapAnalysis: {
      missingContent: Array<{
        barrier: string;
        channel: string;
        priority: 'high' | 'medium' | 'low';
      }>;
      coverageScore: number;
    };
    channelAssets: Record<string, Array<{
      assetId: string;
      title: string;
      engagementRate: number;
    }>>;
    complianceMetrics: {
      approvalRate: number;
      avgApprovalTime: number;
      pendingAssets: number;
    };
  };
}

// 4. AI Orchestration → Field Suggestions
export interface OrchestrationToSuggestionsPackage {
  timestamp: string;
  source: 'ai-orchestration';
  destination: 'field-suggestions';
  data: {
    optimizedJourneys: Array<{
      hcpId: string;
      journeyId: string;
      stages: Array<{
        stage: string;
        channel: string;
        content: string;
        timing: number;
      }>;
      predictedConversion: number;
    }>;
    nbaRecommendations: Array<{
      hcpId: string;
      currentStage: string;
      nextAction: string;
      confidence: number;
      expectedImpact: 'high' | 'medium' | 'low';
      timing: string;
    }>;
    modelPredictions: {
      conversionProbabilities: Record<string, number>;
      engagementScores: Record<string, number>;
      barrierResolution: Record<string, number>;
    };
    sequenceRankings: Array<{
      sequence: string;
      effectiveness: number;
      avgTimeToConversion: number;
      successRate: number;
    }>;
    modelMetrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
    };
  };
}

// 5. Field Suggestions → Field Copilot
export interface SuggestionsToCopilotPackage {
  timestamp: string;
  source: 'field-suggestions';
  destination: 'field-copilot';
  data: {
    activeSuggestions: Array<{
      id: string;
      hcpId: string;
      trigger: string;
      priority: number;
      action: string;
      expiresAt: string;
      status: 'new' | 'viewed' | 'accepted' | 'rejected';
    }>;
    priorityActions: Array<{
      territory: string;
      repId: string;
      actions: Array<{
        hcpId: string;
        action: string;
        urgency: 'immediate' | 'thisWeek' | 'thisMonth';
        reason: string;
      }>;
    }>;
    performanceMetrics: {
      completionRate: number;
      avgResponseTime: number;
      successfulOutcomes: number;
      feedbackScore: number;
    };
    feedbackRequired: Array<{
      suggestionId: string;
      hcpId: string;
      question: string;
      options: string[];
    }>;
    triggerMetrics: Record<string, {
      fired: number;
      accepted: number;
      successful: number;
    }>;
  };
}

// 6. Field Copilot → Customer Planning (Feedback Loop)
export interface CopilotToCustomerPackage {
  timestamp: string;
  source: 'field-copilot';
  destination: 'customer-planning';
  data: {
    fieldInsights: Array<{
      hcpId: string;
      repId: string;
      insight: string;
      category: 'barrier' | 'opportunity' | 'preference' | 'feedback';
      confidence: number;
    }>;
    barrierUpdates: {
      newBarriers: Array<{
        hcpId: string;
        barrier: string;
        severity: number;
        evidence: string;
      }>;
      resolvedBarriers: Array<{
        hcpId: string;
        barrier: string;
        resolutionMethod: string;
      }>;
    };
    engagementOutcomes: Array<{
      hcpId: string;
      channel: string;
      outcome: 'positive' | 'neutral' | 'negative';
      prescriptionChange: number;
      notes: string;
    }>;
    customerFeedback: Array<{
      hcpId: string;
      feedback: string;
      sentiment: number;
      actionRequired: boolean;
    }>;
    territoryMetrics: {
      callsCompleted: number;
      emailsOpened: number;
      contentShared: number;
      prescriptionsInfluenced: number;
    };
  };
}

// Master Flow State
export interface AgentFlowState {
  currentStep: number;
  completedSteps: string[];
  dataPackages: {
    customerToBudget?: CustomerToBudgetPackage;
    budgetToContent?: BudgetToContentPackage;
    contentToOrchestration?: ContentToOrchestrationPackage;
    orchestrationToSuggestions?: OrchestrationToSuggestionsPackage;
    suggestionsToCopilot?: SuggestionsToCopilotPackage;
    copilotToCustomer?: CopilotToCustomerPackage;
  };
  status: 'idle' | 'processing' | 'complete' | 'error';
  lastUpdate: string;
}

// Helper function to validate data package
export function validateDataPackage(packageType: string, data: any): boolean {
  // Add validation logic here
  return true;
}

// Helper function to transform data between agents
export function transformDataPackage(source: string, destination: string, data: any): any {
  // Add transformation logic here
  return data;
}