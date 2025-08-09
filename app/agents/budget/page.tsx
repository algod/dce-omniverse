'use client';

import { DollarSign } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { BudgetPlanningVisualization } from '@/components/agents/BudgetPlanningVisualization';

export default function BudgetPlanningAgent() {
  const agentData = {
    agentId: 'budget',
    agentName: 'Budget Planning Agent',
    agentColor: colors.agents.budget,
    agentIcon: DollarSign,
    overview: `The Budget Planning Agent optimizes promotional budget allocation across multiple channels using advanced ROI modeling and response curves. 
    It receives prioritized HCP lists from the Customer Planning Agent and determines the optimal channel mix to maximize impact while respecting constraints 
    and avoiding saturation points.`,
    
    businessInputs: [
      {
        label: 'Prioritized HCP List',
        description: 'Ranked HCPs with opportunity scores from Customer Planning Agent',
        type: 'Upstream Data'
      },
      {
        label: 'Channel Constraints',
        description: 'Minimum and maximum budget limits for each promotional channel',
        type: 'Business Rules'
      },
      {
        label: 'Historical Response Data',
        description: '24 months of channel performance data including reach, frequency, and conversion metrics',
        type: 'Historical Data'
      },
      {
        label: 'Total Budget',
        description: 'Overall promotional budget available for allocation across all channels',
        type: 'Financial Input'
      },
      {
        label: 'Optimization Scenarios',
        description: 'Different strategic scenarios to model (e.g., maximize reach, maximize ROI, balanced approach)',
        type: 'Strategic Input'
      }
    ],
    
    outputs: [
      {
        label: 'Optimal Channel Budgets',
        description: 'Recommended budget allocation for each promotional channel',
        format: 'Financial Report'
      },
      {
        label: 'ROI Projections',
        description: 'Expected return on investment and marginal ROI for each channel',
        format: 'Analytics Dashboard'
      },
      {
        label: 'Quarterly Breakdown',
        description: 'Budget distribution across quarters aligned with business cycles',
        format: 'Timeline View'
      },
      {
        label: 'HCP Engagement Plan',
        description: 'Frequency and channel mix recommendations for each HCP segment',
        format: 'Engagement Matrix'
      },
      {
        label: 'Saturation Analysis',
        description: 'Channel saturation levels and diminishing returns indicators',
        format: 'Warning Report'
      }
    ],
    
    analytics: [
      {
        title: 'Budget Allocation Pie',
        description: 'Visual breakdown of budget across all channels',
        type: 'chart' as const
      },
      {
        title: 'ROI Waterfall',
        description: 'Incremental ROI contribution by channel',
        type: 'chart' as const
      },
      {
        title: 'Response Curves',
        description: 'Investment vs response relationship for optimization',
        type: 'chart' as const
      },
      {
        title: 'Channel Performance Matrix',
        description: 'Comparative analysis of all channels',
        type: 'table' as const
      }
    ],
    
    downstreamUsage: [
      {
        agent: 'Content Review Agent',
        usage: 'Receives channel allocation to ensure adequate content exists for each funded channel'
      },
      {
        agent: 'Orchestration Agent',
        usage: 'Uses budget constraints to design feasible customer journeys within allocated resources'
      },
      {
        agent: 'Field Suggestions Agent',
        usage: 'Aligns field activity volume with field force budget allocation'
      }
    ],
    
    capabilities: [
      'Analyzes historical channel performance data',
      'Calculates ROI and mROI for each channel',
      'Identifies saturation points and diminishing returns',
      'Optimizes budget allocation across 6+ channels',
      'Generates quarterly spending plans',
      'Provides what-if scenario analysis',
      'Tracks budget utilization in real-time'
    ],
    
    parameters: [
      {
        label: 'Total Budget',
        key: 'total_budget',
        type: 'number',
        value: 15000000
      },
      {
        label: 'Field Sales Min %',
        key: 'field_min',
        type: 'slider',
        value: 25,
        min: 0,
        max: 50,
        step: 5
      },
      {
        label: 'Digital Max %',
        key: 'digital_max',
        type: 'slider',
        value: 30,
        min: 10,
        max: 50,
        step: 5
      },
      {
        label: 'ROI Threshold',
        key: 'roi_threshold',
        type: 'slider',
        value: 2.5,
        min: 1,
        max: 5,
        step: 0.5
      },
      {
        label: 'Optimization Goal',
        key: 'optimization_goal',
        type: 'select',
        value: 'balanced',
        options: ['maximize_roi', 'maximize_reach', 'balanced', 'minimize_risk']
      },
      {
        label: 'Include Conferences',
        key: 'include_conferences',
        type: 'select',
        value: 'yes',
        options: ['yes', 'no']
      },
      {
        label: 'Risk Tolerance',
        key: 'risk_tolerance',
        type: 'select',
        value: 'medium',
        options: ['low', 'medium', 'high']
      }
    ],
    
    suggestedQueries: [
      'What is the optimal budget allocation for $15M?',
      'Show me ROI impact of shifting $500K from conferences to digital',
      'Which channels are approaching saturation?',
      'How should I adjust budget for Q4 formulary season?',
      'What is the marginal ROI for each channel?'
    ],
    
    visualizationComponent: <BudgetPlanningVisualization />
  };

  return <AgentView {...agentData} />;
}