'use client';

import { FileText } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { ContentReviewVisualization } from '@/components/agents/ContentReviewVisualization';

export default function ContentReviewAgent() {
  const agentData = {
    agentId: 'content',
    agentName: 'Content Review Agent',
    agentColor: colors.agents.content,
    agentIcon: FileText,
    overview: `The Content Review Agent manages the content lifecycle from creation through MLR approval, ensuring all materials align with identified barriers and channel requirements. 
    It receives barrier analysis from Customer Planning and budget allocations from Budget Planning to prioritize content development and accelerate approval processes.`,

    
    businessInputs: [
      {
        label: 'Barrier Analysis',
        description: 'Identified barriers and their prevalence from Customer Planning Agent',
        type: 'Upstream Data'
      },
      {
        label: 'Channel Budgets',
        description: 'Approved budget allocations per channel from Budget Planning Agent',
        type: 'Upstream Data'
      },
      {
        label: 'Message Themes',
        description: 'Brand-approved messaging themes and positioning statements',
        type: 'Brand Guidelines'
      },
      {
        label: 'MLR Requirements',
        description: 'Medical, Legal, and Regulatory review criteria and compliance rules',
        type: 'Compliance Rules'
      },
      {
        label: 'Content Library',
        description: 'Existing approved content assets and their performance metrics',
        type: 'Asset Repository'
      }
    ],

    
    outputs: [
      {
        label: 'Content-Barrier Mapping',
        description: 'Matrix showing which content addresses each identified barrier',
        format: 'Coverage Matrix'
      },
      {
        label: 'MLR Approval Status',
        description: 'Real-time status of all content in the MLR review process',
        format: 'Status Dashboard'
      },
      {
        label: 'Gap Analysis Report',
        description: 'Identified content gaps by barrier and channel with priority scores',
        format: 'Gap Report'
      },
      {
        label: 'Approved Content Library',
        description: 'Repository of MLR-approved content ready for distribution',
        format: 'Asset Library'
      },
      {
        label: 'Content Production Plan',
        description: 'Timeline and priorities for new content development',
        format: 'Project Plan'
      }
    ],

    
    analytics: [
      {
        title: 'Barrier Coverage Heatmap',
        description: 'Visual map of content coverage by barrier',
        type: 'heatmap' as const
      },
      {
        title: 'MLR Approval Pipeline',
        description: 'Status and timeline of content in review',
        type: 'chart' as const
      },
      {
        title: 'Content Gap Analysis',
        description: 'Gaps by channel and barrier priority',
        type: 'chart' as const
      },
      {
        title: 'Compliance Scorecard',
        description: 'MLR compliance metrics and trends',
        type: 'metric' as const
      }
    ],

    
    downstreamUsage: [
      {
        agent: 'Orchestration Agent',
        usage: 'Provides approved content for inclusion in personalized customer journeys'
      },
      {
        agent: 'Field Suggestions Agent',
        usage: 'Supplies field-ready materials aligned with triggered suggestions'
      },
      {
        agent: 'Field Copilot Agent',
        usage: 'Delivers approved content for rep use during customer interactions'
      }
    ],

    
    capabilities: [
      'Maps content themes to identified barriers',
      'Automates MLR compliance checking',
      'Identifies content gaps by channel and barrier',
      'Tracks approval pipeline and timelines',
      'Manages content library and versioning',
      'Generates content production priorities',
      'Monitors content performance metrics'
    ],

    
    parameters: [
      {
        label: 'MLR Compliance Threshold',
        key: 'mlr_threshold',
        type: 'slider',
        value: 85,
        min: 70,
        max: 100,
        step: 5
      },
      {
        label: 'Content Priority',
        key: 'priority',
        type: 'select',
        value: 'barrier_aligned',
        options: ['barrier_aligned', 'channel_focused', 'quick_wins', 'strategic']
      },
      {
        label: 'Review Speed',
        key: 'review_speed',
        type: 'select',
        value: 'standard',
        options: ['expedited', 'standard', 'thorough']
      },
      {
        label: 'Gap Tolerance',
        key: 'gap_tolerance',
        type: 'slider',
        value: 10,
        min: 0,
        max: 20,
        step: 5
      },
      {
        label: 'Auto-Retire Old Content',
        key: 'auto_retire',
        type: 'select',
        value: 'yes',
        options: ['yes', 'no']
      }
    ],
    
    suggestedQueries: [
      'Which content addresses referral pathway barriers?',
      'Show MLR approval status for pending assets',
      'What content gaps exist for email channel?',
      'How many assets are ready for field use?',
      'Which themes have the highest MLR approval rate?'
    ],
    
    visualizationComponent: <ContentReviewVisualization />
  };

  return <AgentView {...agentData} />;
}