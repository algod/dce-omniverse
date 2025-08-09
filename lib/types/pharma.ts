// Comprehensive pharma data types for DCE OmniVerse

// HCP (Healthcare Professional) Types
export interface HCP {
  id: string;
  name: string;
  specialty: string;
  npi: string;
  degree: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  practice: {
    name: string;
    type: 'Hospital' | 'Private Practice' | 'Clinic' | 'Academic Medical Center';
    size: 'Small' | 'Medium' | 'Large';
  };
  tier: 'A' | 'B' | 'C' | 'D';
  segment: string;
  decile: number;
  territory: string;
  region: string;
  lastCallDate?: Date;
  nextScheduledCall?: Date;
}

// Barrier Types
export interface Barrier {
  id: string;
  name: string;
  description: string;
  category: 'Access' | 'Efficacy' | 'Safety' | 'Awareness' | 'Workflow';
  severity: 'Low' | 'Medium' | 'High';
  kpiMapping: string[];
  recommendedActions: string[];
  contentThemes: string[];
}

export const PHARMA_BARRIERS: Barrier[] = [
  {
    id: 'B001',
    name: 'No/challenging referral pathways',
    description: 'No clear referral pathways to get to the right specialist for particular disease state',
    category: 'Access',
    severity: 'High',
    kpiMapping: ['referral_volume', 'specialist_density', 'patient_journey_time'],
    recommendedActions: ['Map referral network', 'Provide specialist search tool', 'Alert patient navigator'],
    contentThemes: ['Referral Guidelines', 'Disease State Education', 'Specialist Network']
  },
  {
    id: 'B002',
    name: 'Managing side effects',
    description: 'Managing side effects is challenging, requiring additional resources and patient monitoring',
    category: 'Safety',
    severity: 'Medium',
    kpiMapping: ['discontinuation_rate', 'adverse_events', 'patient_adherence'],
    recommendedActions: ['Share management protocols', 'Provide nurse support', 'Patient education materials'],
    contentThemes: ['Side Effect Management', 'Patient Support Programs', 'Dosing Optimization']
  },
  {
    id: 'B003',
    name: 'Insurance denials',
    description: 'Insurance denials or restrictions due to administrative confusion over coding and reimbursement',
    category: 'Access',
    severity: 'High',
    kpiMapping: ['prior_auth_rate', 'denial_rate', 'time_to_approval'],
    recommendedActions: ['PA support team', 'Coding guides', 'Payer education'],
    contentThemes: ['Reimbursement Support', 'Prior Authorization', 'Payer Coverage']
  },
  {
    id: 'B004',
    name: 'Formulary restrictions',
    description: 'Product/brand not yet approved in organizational formulary',
    category: 'Access',
    severity: 'High',
    kpiMapping: ['formulary_status', 'p&t_meetings', 'institutional_adoption'],
    recommendedActions: ['P&T presentation', 'Value dossier', 'Peer advocacy'],
    contentThemes: ['Clinical Value', 'Economic Benefits', 'Formulary Support']
  },
  {
    id: 'B005',
    name: 'Diagnostic requirements',
    description: 'Requires a new diagnostic test/tool that is not widely recognized in the industry',
    category: 'Workflow',
    severity: 'Medium',
    kpiMapping: ['diagnostic_adoption', 'test_availability', 'lab_partnerships'],
    recommendedActions: ['Diagnostic education', 'Lab partnerships', 'Testing protocols'],
    contentThemes: ['Diagnostic Guidelines', 'Testing Protocols', 'Lab Support']
  }
];

// Prescribing Data Types
export interface PrescribingData {
  hcpId: string;
  period: string;
  totalRx: number;
  newRx: number;
  refills: number;
  brandRx: number;
  competitorRx: number;
  marketShare: number;
  trend: 'Increasing' | 'Stable' | 'Declining';
  avgDaysSupply: number;
  discontinuationRate: number;
  switchRate: number;
}

// Patient Data Types
export interface PatientMix {
  hcpId: string;
  totalPatients: number;
  newPatients: number;
  demographics: {
    ageGroups: {
      '18-34': number;
      '35-54': number;
      '55-64': number;
      '65+': number;
    };
    gender: {
      male: number;
      female: number;
    };
    insurance: {
      commercial: number;
      medicare: number;
      medicaid: number;
      cash: number;
    };
  };
  diseaseStage: {
    early: number;
    moderate: number;
    severe: number;
  };
  comorbidities: string[];
}

// Engagement Data Types
export interface Engagement {
  id: string;
  hcpId: string;
  date: Date;
  channel: 'Field' | 'Email' | 'Web' | 'Phone' | 'Virtual' | 'Conference' | 'Speaker Program';
  type: 'Detail' | 'Sample' | 'Education' | 'Service' | 'Event';
  duration?: number;
  content?: string[];
  response: 'Positive' | 'Neutral' | 'Negative' | 'No Response';
  nextAction?: string;
  cost?: number;
}

// Budget and Channel Types
export interface Channel {
  id: string;
  name: string;
  vendor: string;
  type: 'Personal' | 'Non-Personal' | 'Digital' | 'Event';
  currentBudget: number;
  proposedBudget: number;
  actualSpend: number;
  roi: number;
  mroi: number;
  responseCurve: {
    points: { spend: number; response: number }[];
    saturationPoint: number;
  };
  constraints: {
    min: number;
    max: number;
    fixedCost?: number;
  };
}

// Content Asset Types
export interface ContentAsset {
  id: string;
  title: string;
  type: 'Email' | 'Web' | 'Print' | 'Video' | 'Interactive' | 'IVA';
  theme: string;
  barrier?: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Live' | 'Expired' | 'Retired';
  createdDate: Date;
  approvedDate?: Date;
  expiryDate?: Date;
  mlrScore?: number;
  complianceIssues?: string[];
  performanceMetrics?: {
    impressions: number;
    clicks: number;
    engagement: number;
    conversions: number;
  };
  tags: string[];
}

// Field Suggestion Types
export interface FieldSuggestion {
  id: string;
  triggerId: string;
  triggerName: string;
  hcpId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Completed' | 'Dismissed' | 'Expired';
  createdDate: Date;
  expiryDate: Date;
  insight: string;
  recommendedAction: string;
  feedback?: {
    useful: boolean;
    reason?: string;
    completedDate?: Date;
  };
}

export interface FieldSuggestionTrigger {
  id: string;
  name: string;
  description: string;
  criteria: {
    metric: string;
    operator: '>' | '<' | '=' | '>=' | '<=' | 'between' | 'contains';
    value: any;
    lookbackDays?: number;
  }[];
  priority: number;
  isActive: boolean;
  maxWeeklyVolume: number;
  suppressionRules?: string[];
  sensitivity: {
    threshold: number;
    adjustment: number;
  };
}

// Customer Journey Types
export interface CustomerJourney {
  hcpId: string;
  stages: JourneyStage[];
  currentStage: string;
  predictedNextStage: string;
  completionProbability: number;
  recommendedSequence: TouchpointSequence[];
  barriers: string[];
}

export interface JourneyStage {
  name: 'Awareness' | 'Consideration' | 'Trial' | 'Adoption' | 'Advocacy';
  status: 'Not Started' | 'In Progress' | 'Completed';
  engagementLevel: 'Low' | 'Medium' | 'High';
  startDate?: Date;
  completionDate?: Date;
  touchpoints: number;
  keyActivities: string[];
}

export interface TouchpointSequence {
  step: number;
  channel: string;
  content: string;
  timing: string;
  expectedImpact: number;
  reasoning: string;
}

// Analytics and Metrics Types
export interface HCPOpportunity {
  hcpId: string;
  opportunityScore: number;
  depthOpportunity: number;
  breadthOpportunity: number;
  barriers: {
    barrierId: string;
    likelihood: number;
    impact: number;
  }[];
  priorityLevel: 'High' | 'Medium' | 'Low';
  recommendedChannels: string[];
  estimatedValue: number;
}

export interface PerformanceMetrics {
  period: string;
  kpi: string;
  actual: number;
  target: number;
  variance: number;
  trend: number[];
  forecast: number;
}

// AI Model Types
export interface ModelTrainingData {
  features: Record<string, any>;
  labels: any[];
  validationSplit: number;
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    [key: string]: any;
  };
}

export interface ModelExplainability {
  featureImportance: { feature: string; importance: number }[];
  predictions: {
    input: Record<string, any>;
    output: any;
    confidence: number;
    reasoning: string;
  }[];
  performanceMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc?: number;
  };
}

// Next Best Action Types
export interface NextBestAction {
  hcpId: string;
  actionId: string;
  action: string;
  channel: string;
  content?: string;
  timing: string;
  priority: number;
  expectedImpact: number;
  confidence: number;
  reasoning: string;
  alternativeActions?: {
    action: string;
    impact: number;
  }[];
}

// Territory and Region Types
export interface Territory {
  id: string;
  name: string;
  region: string;
  repId: string;
  repName: string;
  hcpCount: number;
  targetCalls: number;
  actualCalls: number;
  attainment: number;
  topOpportunities: string[];
  challenges: string[];
}

// Rep Performance Types
export interface RepPerformance {
  repId: string;
  period: string;
  callActivity: {
    target: number;
    actual: number;
    quality: number;
  };
  sales: {
    target: number;
    actual: number;
    growth: number;
  };
  engagement: {
    emailsSent: number;
    eventsHosted: number;
    samplesDistributed: number;
  };
  training: {
    modulesCompleted: number;
    certifications: string[];
    coachingSessions: number;
  };
}