import { Workflow } from './customer-priority-workflow';

export const contentApprovalWorkflow: Workflow = {
  id: 'content-approval',
  name: 'Weekly Content Approval Operations',
  description: 'Automated MLR review and content approval workflow',
  trigger: 'Run weekly ops for content approval',
  steps: [
    {
      agent: 'omni',
      action: 'Parse request and activate Content Approval Agent',
      status: 'pending'
    },
    {
      agent: 'content',
      action: 'Content Planning - Identify opportunities',
      status: 'pending',
      data: {
        module: 'planning',
        details: 'Analyzing content gaps and retirement opportunities'
      }
    },
    {
      agent: 'content',
      action: 'Define MLR standards and compliance rules',
      status: 'pending',
      data: {
        module: 'standards',
        details: 'Setting approval criteria and compliance guidelines'
      }
    },
    {
      agent: 'content',
      action: 'Run MLR Review Engine',
      status: 'pending',
      data: {
        module: 'mlr-engine',
        details: 'Scoring 156 content assets for compliance',
        categories: {
          autoApprove: 42,
          humanReview: 78,
          decline: 36
        }
      }
    },
    {
      agent: 'content',
      action: 'Human-in-the-loop review',
      status: 'pending',
      data: {
        module: 'human-review',
        details: 'Review 78 assets requiring human judgment',
        interface: 'Interactive review dashboard'
      }
    },
    {
      agent: 'content',
      action: 'Content Generation - Create new assets',
      status: 'pending',
      data: {
        module: 'generation',
        details: 'Generate content blueprints with Adobe integration',
        integration: 'Adobe Creative Cloud'
      }
    },
    {
      agent: 'content',
      action: 'Final Approval - Veeva PromoMats sync',
      status: 'pending',
      data: {
        module: 'approval',
        details: 'Push approved content to Veeva PromoMats',
        integration: 'Veeva PromoMats API'
      }
    },
    {
      agent: 'orchestration',
      action: 'Update content in customer journeys',
      status: 'pending',
      data: {
        details: 'Refresh journey sequences with new content'
      }
    },
    {
      agent: 'omni',
      action: 'Generate approval report and metrics',
      status: 'pending'
    }
  ],
  currentStep: 0
};

export function detectContentWorkflow(query: string): Workflow | null {
  const lowerQuery = query.toLowerCase();
  
  if (
    (lowerQuery.includes('content') && lowerQuery.includes('approval')) ||
    (lowerQuery.includes('mlr') && lowerQuery.includes('review')) ||
    (lowerQuery.includes('weekly') && lowerQuery.includes('ops'))
  ) {
    return { ...contentApprovalWorkflow };
  }
  
  return null;
}