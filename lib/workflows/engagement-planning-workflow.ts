export interface WorkflowStep {
  agent: string;
  action: string;
  status: 'pending' | 'active' | 'completed' | 'review' | 'approved';
  data?: any;
  module?: string;
  reasoning?: string[];
  userInput?: any;
  output?: any;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  currentStep: number;
  brandContext?: {
    therapeutic_area?: string;
    brand_name?: string;
    objectives?: string[];
    budget?: number;
  };
}

export const engagementPlanningWorkflow: Workflow = {
  id: 'engagement-planning',
  name: 'Engagement Planning Workflow',
  description: 'Optimal budget allocation across channels and customer microsegments with ROI maximization',
  trigger: 'How should I allocate my budget for maximum ROI?',
  steps: [
    {
      agent: 'engagement',
      action: 'Impact Attribution Analysis',
      status: 'pending',
      module: 'attribution',
      reasoning: [
        'Accessing historical channel performance data',
        'Analyzing response by customer microsegment',
        'Calculating channel-specific impact metrics',
        'Identifying high-performing channel × segment combinations',
        'Establishing baseline attribution model'
      ],
      data: {
        tools: ['Impact Attribution Engine', 'Channel Performance Analyzer', 'Microsegment Response Tracker'],
        metrics: ['Channel ROI', 'Segment Response Rate', 'Attribution Score', 'Engagement Effectiveness']
      }
    },
    {
      agent: 'engagement',
      action: 'Response Curve Analysis',
      status: 'pending',
      module: 'response',
      reasoning: [
        'Generating response curves for each channel',
        'Analyzing saturation points by microsegment',
        'Identifying diminishing returns thresholds',
        'Calculating optimal frequency caps',
        'Modeling cross-channel synergies'
      ],
      data: {
        tools: ['Response Curve Generator', 'Saturation Analysis Engine', 'Frequency Optimizer'],
        metrics: ['Saturation Point', 'Optimal Frequency', 'Response Rate', 'Incremental Lift']
      }
    },
    {
      agent: 'engagement',
      action: 'ROI Optimization',
      status: 'pending',
      module: 'optimization',
      reasoning: [
        'Running marketing mix analytics',
        'Applying business constraints',
        'Optimizing for maximum ROI',
        'Calculating marginal ROI (mROI)',
        'Generating allocation scenarios'
      ],
      data: {
        tools: ['Marketing Mix Model', 'ROI Calculator', 'Constraint Solver', 'Scenario Generator'],
        metrics: ['Expected ROI', 'mROI by Channel', 'Budget Efficiency', 'Optimization Score']
      }
    },
    {
      agent: 'engagement',
      action: 'Budget Allocation',
      status: 'pending',
      module: 'allocation',
      reasoning: [
        'Distributing budget across channels',
        'Allocating by customer microsegment',
        'Applying minimum/maximum constraints',
        'Balancing reach vs frequency',
        'Finalizing channel × segment matrix'
      ],
      data: {
        tools: ['Budget Allocator', 'Microsegment Optimizer', 'Resource Distribution Engine'],
        metrics: ['Channel Budget', 'Segment Budget', 'Coverage %', 'Efficiency Score']
      }
    },
    {
      agent: 'engagement',
      action: 'Engagement Planning',
      status: 'pending',
      module: 'planning',
      reasoning: [
        'Generating quarterly engagement plans',
        'Creating HCP-level engagement schedules',
        'Defining channel sequencing rules',
        'Setting frequency and timing parameters',
        'Producing actionable engagement calendar'
      ],
      data: {
        tools: ['Engagement Planner', 'Schedule Generator', 'Calendar Optimizer', 'Frequency Manager'],
        metrics: ['Planned Touches', 'Engagement Frequency', 'Coverage Rate', 'Plan Completeness']
      }
    }
  ],
  currentStep: 0,
  brandContext: {
    therapeutic_area: 'Oncology',
    brand_name: 'BrandX',
    budget: 15000000,
    objectives: ['Maximize ROI', 'Optimize channel mix', 'Improve engagement efficiency']
  }
};

export function executeWorkflowStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'active';
    updatedWorkflow.currentStep = stepIndex;
  }
  return updatedWorkflow;
}

export function processModuleStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'review';
  }
  return updatedWorkflow;
}

export function approveModuleStep(workflow: Workflow, stepIndex: number, adjustments?: any): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'approved';
    if (adjustments) {
      updatedWorkflow.steps[stepIndex].userInput = adjustments;
    }
    
    // Move to next step
    if (stepIndex + 1 < updatedWorkflow.steps.length) {
      updatedWorkflow.currentStep = stepIndex + 1;
      updatedWorkflow.steps[stepIndex + 1].status = 'active';
    }
  }
  return updatedWorkflow;
}