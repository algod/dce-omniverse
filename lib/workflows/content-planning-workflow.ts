import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export const contentPlanningWorkflow: Workflow = {
  id: 'content-planning',
  name: 'Content Planning Workflow',
  description: 'Assess content inventory and identify gaps for new content development',
  trigger: 'What content gaps exist in our current library?',
  steps: [
    {
      agent: 'content-planning',
      action: 'Inventory Analysis',
      status: 'pending',
      module: 'inventory',
      reasoning: [
        'Accessing current content asset library',
        'Cataloging assets by type and channel',
        'Analyzing content age and usage metrics',
        'Identifying outdated or underperforming assets',
        'Creating comprehensive inventory report'
      ],
      data: {
        tools: ['Content Library Scanner', 'Asset Metadata Analyzer', 'Usage Tracker'],
        metrics: ['Total Assets', 'Asset Age', 'Usage Frequency', 'Performance Score']
      }
    },
    {
      agent: 'content-planning',
      action: 'Microsegment Mapping',
      status: 'pending',
      module: 'mapping',
      reasoning: [
        'Mapping content to customer microsegments',
        'Linking assets to barrier types',
        'Analyzing message theme coverage',
        'Identifying communication objectives',
        'Creating content-segment matrix'
      ],
      data: {
        tools: ['Segment Mapper', 'Message Theme Analyzer', 'Barrier Content Linker'],
        metrics: ['Segment Coverage', 'Theme Distribution', 'Barrier Alignment', 'Gap Score']
      }
    },
    {
      agent: 'content-planning',
      action: 'Gap Assessment',
      status: 'pending',
      module: 'gaps',
      reasoning: [
        'Identifying content gaps by message theme',
        'Analyzing channel-specific gaps',
        'Evaluating microsegment coverage',
        'Prioritizing gap severity',
        'Generating gap heat map'
      ],
      data: {
        tools: ['Gap Analysis Engine', 'Coverage Calculator', 'Priority Scorer'],
        metrics: ['Gap Count', 'Severity Score', 'Coverage %', 'Priority Rank']
      }
    },
    {
      agent: 'content-planning',
      action: 'Quality Review',
      status: 'pending',
      module: 'quality',
      reasoning: [
        'Evaluating content quality scores',
        'Checking MLR compliance readiness',
        'Assessing engagement metrics',
        'Identifying refresh candidates',
        'Rating content effectiveness'
      ],
      data: {
        tools: ['Quality Scorer', 'MLR Compliance Checker', 'Engagement Analyzer'],
        metrics: ['Quality Score', 'Compliance Rate', 'Engagement Rate', 'Refresh Priority']
      }
    },
    {
      agent: 'content-planning',
      action: 'Planning Strategy',
      status: 'pending',
      module: 'strategy',
      reasoning: [
        'Developing content creation timeline',
        'Planning MLR review schedule',
        'Setting Veeva PromoMats integration',
        'Defining retirement schedule',
        'Creating actionable content roadmap'
      ],
      data: {
        tools: ['Timeline Planner', 'MLR Scheduler', 'Integration Manager', 'Roadmap Builder'],
        metrics: ['New Assets Planned', 'Review Timeline', 'Retirement Count', 'Integration Status']
      }
    }
  ],
  currentStep: 0
};

export function executeContentPlanningStep(workflow: Workflow, stepIndex: number): Workflow {
  const updatedWorkflow = { ...workflow };
  if (stepIndex >= 0 && stepIndex < updatedWorkflow.steps.length) {
    updatedWorkflow.steps[stepIndex].status = 'active';
    updatedWorkflow.currentStep = stepIndex;
  }
  return updatedWorkflow;
}