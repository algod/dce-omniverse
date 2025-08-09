'use client';

import { Users } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { CustomerPlanningVisualization } from '@/components/agents/CustomerPlanningVisualization';

export default function CustomerPlanningAgent() {
  const agentData = {
    agentId: 'customer',
    agentName: 'Customer Planning Agent',
    agentColor: colors.agents.customer,
    agentIcon: Users,
    overview: `The Customer Planning Agent uses advanced barrier analysis to prioritize high-opportunity Healthcare Professionals (HCPs). 
    It analyzes secondary data and field feedback to identify the 5 primary barriers preventing HCP adoption, predicts sales opportunities, 
    and generates targeted engagement strategies through "The Play" framework.`,
    
    businessInputs: [
      {
        label: 'Brand Objectives',
        description: 'Strategic priorities and goals for the brand, including target market share and growth objectives',
        type: 'Strategic Input'
      },
      {
        label: 'Barrier Confirmation',
        description: 'Validation of the 5 primary barriers affecting HCP prescribing behavior in your therapeutic area',
        type: 'Field Intelligence'
      },
      {
        label: 'Importance Weights',
        description: 'Relative importance scoring for each barrier based on brand strategy and market dynamics',
        type: 'Configuration'
      },
      {
        label: 'HCP Universe',
        description: 'Complete list of target HCPs with prescribing history and practice characteristics',
        type: 'Data Input'
      }
    ],
    
    outputs: [
      {
        label: 'Prioritized HCP List',
        description: 'Ranked list of HCPs with opportunity scores based on barrier analysis and sales potential',
        format: 'CSV/JSON'
      },
      {
        label: 'Barrier Analysis Report',
        description: 'Detailed breakdown of barriers by HCP, segment, and territory with severity scores',
        format: 'Interactive Dashboard'
      },
      {
        label: 'Engagement Recommendations',
        description: 'Specific engagement strategies tailored to each HCP\'s primary barriers',
        format: 'Action Plan'
      },
      {
        label: 'The Play Framework',
        description: '5-question engagement strategy for each barrier type to guide field interactions',
        format: 'Field Guide'
      }
    ],
    
    analytics: [
      {
        title: 'Barrier Prevalence Heatmap',
        description: 'Visual representation of barrier distribution across HCP segments',
        type: 'heatmap' as const
      },
      {
        title: 'Opportunity Scatter Plot',
        description: 'HCP positioning based on sales depth vs breadth potential',
        type: 'chart' as const
      },
      {
        title: 'Barrier Distribution',
        description: 'Breakdown of barrier types by segment and priority',
        type: 'chart' as const
      },
      {
        title: 'HCP Scoring Matrix',
        description: 'Comprehensive scoring table with all evaluation criteria',
        type: 'table' as const
      }
    ],
    
    downstreamUsage: [
      {
        agent: 'Budget Planning Agent',
        usage: 'Uses prioritized HCP list and opportunity scores to optimize channel budget allocation for maximum impact on high-value targets'
      },
      {
        agent: 'Content Review Agent',
        usage: 'Maps barrier analysis to content themes, ensuring appropriate messaging exists for each identified barrier'
      },
      {
        agent: 'Orchestration Agent',
        usage: 'Leverages barrier profiles to design personalized customer journeys and determine next best actions'
      }
    ],
    
    capabilities: [
      'Analyzes 5 primary barriers affecting HCP adoption',
      'Predicts sales depth and breadth opportunities',
      'Segments HCPs by barrier profile and potential',
      'Generates barrier-specific engagement strategies',
      'Creates "The Play" framework for field execution',
      'Tracks barrier resolution over time'
    ],
    
    parameters: [
      {
        label: 'Referral Pathway Weight',
        key: 'barrier_b001',
        type: 'slider',
        value: 30,
        min: 0,
        max: 100,
        step: 5
      },
      {
        label: 'Side Effects Weight',
        key: 'barrier_b002',
        type: 'slider',
        value: 25,
        min: 0,
        max: 100,
        step: 5
      },
      {
        label: 'Insurance Coverage Weight',
        key: 'barrier_b003',
        type: 'slider',
        value: 20,
        min: 0,
        max: 100,
        step: 5
      },
      {
        label: 'Formulary Approval Weight',
        key: 'barrier_b004',
        type: 'slider',
        value: 15,
        min: 0,
        max: 100,
        step: 5
      },
      {
        label: 'Diagnostic Tool Weight',
        key: 'barrier_b005',
        type: 'slider',
        value: 10,
        min: 0,
        max: 100,
        step: 5
      },
      {
        label: 'Analysis Depth',
        key: 'depth',
        type: 'select',
        value: 'comprehensive',
        options: ['quick', 'standard', 'comprehensive', 'exhaustive']
      },
      {
        label: 'Minimum Opportunity Score',
        key: 'min_score',
        type: 'number',
        value: 50
      }
    ],
    
    suggestedQueries: [
      'Which barriers are most prevalent in my territory?',
      'Show me high-opportunity HCPs with referral pathway barriers',
      'What is the recommended engagement strategy for Dr. Smith?',
      'How many HCPs have multiple barriers?',
      'Generate "The Play" for insurance coverage barriers'
    ],
    
    visualizationComponent: <CustomerPlanningVisualization />
  };

  return <AgentView {...agentData} />;
}