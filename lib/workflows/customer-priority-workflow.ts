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
    barriers_focus?: string[];
  };
}

export const customerPriorityWorkflow: Workflow = {
  id: 'customer-priority',
  name: 'Customer Prioritization Workflow',
  description: 'End-to-end workflow for identifying and prioritizing high-value customers',
  trigger: 'Who should be my priority customers?',
  steps: [
    {
      agent: 'omni',
      action: 'Understanding brand context and objectives',
      status: 'pending',
      module: 'initialization',
      reasoning: [
        'Parsing user query to identify brand context',
        'Extracting strategic objectives',
        'Determining relevant barriers for analysis',
        'Activating Customer Planning Agent'
      ]
    },
    {
      agent: 'customer',
      action: 'Persona Analysis - Barrier Inferencing',
      status: 'pending',
      module: 'persona',
      reasoning: [
        'Accessing comprehensive HCP database (2,847 HCPs)',
        'Analyzing prescribing patterns for barrier signals',
        'Running probabilistic barrier detection models',
        'Mapping HCPs to 5 primary barriers',
        'Calculating barrier prevalence and severity scores'
      ],
      data: {
        tools: ['Barrier Detection ML Model', 'Pattern Recognition Engine', 'HCP Behavioral Analytics'],
        metrics: ['Barrier Distribution', 'Severity Scores', 'Confidence Levels']
      }
    },
    {
      agent: 'customer',
      action: 'Performance Metrics - Historical Analysis',
      status: 'pending',
      module: 'performance',
      reasoning: [
        'Selecting KPIs based on brand objectives',
        'Processing 24 months of historical data',
        'Calculating market share and growth metrics',
        'Segmenting HCPs by performance quintiles',
        'Identifying performance trends and patterns'
      ],
      data: {
        tools: ['KPI Calculator', 'Trend Analysis Engine', 'Competitive Intelligence'],
        metrics: ['Market Share', 'Growth Rate', 'Prescription Volume', 'Patient Retention']
      }
    },
    {
      agent: 'customer',
      action: 'Potential Prediction - ML Modeling',
      status: 'pending',
      module: 'potential',
      reasoning: [
        'Configuring breadth and depth prediction models',
        'Feature engineering from historical data',
        'Training ensemble models (Random Forest + XGBoost)',
        'Calculating opportunity scores per HCP',
        'Validating predictions against holdout set'
      ],
      data: {
        tools: ['Predictive Analytics Suite', 'Model Tuning Framework', 'Opportunity Calculator'],
        metrics: ['Depth Opportunity ($)', 'Breadth Opportunity ($)', 'Confidence Score', 'Model Accuracy']
      }
    },
    {
      agent: 'customer',
      action: 'Preference Mapping - Affinity Analysis',
      status: 'pending',
      module: 'preference',
      reasoning: [
        'Analyzing historical engagement data',
        'Running collaborative filtering algorithms',
        'Scoring channel preferences (Field, Email, Virtual, Web)',
        'Mapping content type affinity',
        'Determining optimal cadence per HCP'
      ],
      data: {
        tools: ['Collaborative Filtering Engine', 'Engagement Analytics', 'Channel Optimizer'],
        metrics: ['Channel Affinity Scores', 'Content Preferences', 'Engagement Frequency', 'Response Rates']
      }
    },
    {
      agent: 'customer',
      action: 'Microsegmentation - Strategic Prioritization',
      status: 'pending',
      module: 'microsegmentation',
      reasoning: [
        'Combining all 4P factors (Persona, Performance, Potential, Preference)',
        'Applying clustering algorithms',
        'Creating 5 distinct microsegments',
        'Calculating segment value and effort scores',
        'Generating 3 prioritization options for user selection'
      ],
      data: {
        tools: ['Segmentation Engine', 'Priority Matrix Builder', 'ROI Calculator'],
        options: [
          {
            name: 'Growth Focus',
            segments: ['Champions', 'Growers', 'Converters'],
            impact: '+45% expected growth'
          },
          {
            name: 'Efficiency Focus',
            segments: ['Champions', 'Maintainers', 'Defenders'],
            impact: '+32% ROI improvement'
          },
          {
            name: 'Balanced Approach',
            segments: ['All segments with weighted priority'],
            impact: '+28% overall performance'
          }
        ]
      }
    },
    {
      agent: 'customer',
      action: 'Finalizing Priority Target List',
      status: 'pending',
      module: 'output',
      reasoning: [
        'Mapping each HCP to selected microsegments',
        'Generating engagement recommendations',
        'Creating territory-level plans',
        'Preparing handoff to downstream agents'
      ],
      output: {
        prioritized_hcps: 423,
        total_opportunity: '$45M',
        primary_barriers: ['Formulary (38%)', 'Referral (27%)'],
        next_steps: 'Route to Budget Planning Agent'
      }
    }
  ],
  currentStep: 0
};

export function detectWorkflow(query: string): Workflow | null {
  const lowerQuery = query.toLowerCase();
  
  if (
    (lowerQuery.includes('priority') || lowerQuery.includes('priorit')) && 
    (lowerQuery.includes('customer') || lowerQuery.includes('hcp'))
  ) {
    return { ...customerPriorityWorkflow };
  }
  
  // Also detect if user asks about customer planning or segmentation
  if (
    lowerQuery.includes('customer planning') ||
    lowerQuery.includes('segment') ||
    lowerQuery.includes('who should') ||
    lowerQuery.includes('target list')
  ) {
    return { ...customerPriorityWorkflow };
  }
  
  return null;
}

export function executeWorkflowStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  
  // Mark current step as active
  if (stepIndex < updatedWorkflow.steps.length) {
    const currentStep = updatedWorkflow.steps[stepIndex];
    
    // If it's a customer planning module, set to 'active' for processing
    if (currentStep.module && ['persona', 'performance', 'potential', 'preference', 'microsegmentation'].includes(currentStep.module)) {
      updatedWorkflow.steps[stepIndex].status = 'active';
    } else {
      updatedWorkflow.steps[stepIndex].status = 'active';
    }
    
    updatedWorkflow.currentStep = stepIndex;
  }
  
  // Mark previous steps as approved (for modules) or completed
  for (let i = 0; i < stepIndex; i++) {
    const step = updatedWorkflow.steps[i];
    if (step.status !== 'approved') {
      updatedWorkflow.steps[i].status = 'completed';
    }
  }
  
  return updatedWorkflow;
}

export function processModuleStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  
  if (stepIndex < updatedWorkflow.steps.length) {
    // Set current module to 'review' status for user approval
    updatedWorkflow.steps[stepIndex].status = 'review';
  }
  
  return updatedWorkflow;
}

export function approveModuleStep(workflow: Workflow, stepIndex: number, userInput?: any): Workflow {
  const updatedWorkflow = { ...workflow };
  
  if (stepIndex < updatedWorkflow.steps.length) {
    // Mark current module as approved
    updatedWorkflow.steps[stepIndex].status = 'approved';
    
    // Store user input if provided
    if (userInput) {
      updatedWorkflow.steps[stepIndex].userInput = userInput;
    }
    
    // Move to next step if available
    if (stepIndex + 1 < updatedWorkflow.steps.length) {
      updatedWorkflow.currentStep = stepIndex + 1;
      updatedWorkflow.steps[stepIndex + 1].status = 'active';
    }
  }
  
  return updatedWorkflow;
}

export function completeWorkflowStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  
  if (stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'completed';
    
    // Move to next step if available
    if (stepIndex + 1 < updatedWorkflow.steps.length) {
      updatedWorkflow.currentStep = stepIndex + 1;
      updatedWorkflow.steps[stepIndex + 1].status = 'active';
    }
  }
  
  return updatedWorkflow;
}