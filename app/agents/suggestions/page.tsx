'use client';

import { Lightbulb } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { FieldSuggestionsVisualization } from '@/components/agents/FieldSuggestionsVisualization';

export default function FieldSuggestionsAgent() {
  const agentData = {
    agentId: 'suggestions',
    agentName: 'Field Suggestion Design Agent',
    agentColor: colors.agents.suggestions,
    agentIcon: Lightbulb,
    overview: `The Field Suggestion Design Agent creates and monitors intelligent field suggestions aligned with brand objectives. 
    It features 7 configurable trigger types with sensitivity analysis, implements a 40/40/20 prioritization system 
    (rep feedback, strategic priority, behavior severity), and includes performance monitoring with proactive adjustments.`,
    
    businessInputs: [
      {
        label: 'Brand Strategic Priorities',
        description: 'Current brand objectives and strategic focus areas that should drive suggestion prioritization',
        type: 'Strategic Input'
      },
      {
        label: 'Trigger Configuration',
        description: 'Setup and sensitivity settings for the 7 field suggestion trigger types',
        type: 'Configuration'
      },
      {
        label: 'Rep Feedback Data',
        description: 'Historical rep feedback on suggestion relevance, timing, and effectiveness',
        type: 'Field Intelligence'
      },
      {
        label: 'Behavioral Data',
        description: 'HCP behavioral patterns and change indicators from prescribing and engagement data',
        type: 'Data Input'
      }
    ],
    
    outputs: [
      {
        label: 'Intelligent Field Suggestions',
        description: 'Prioritized, time-sensitive suggestions delivered to field reps with 14-day expiration',
        format: 'Mobile Notifications'
      },
      {
        label: 'Trigger Performance Report',
        description: 'Analysis of trigger effectiveness, acceptance rates, and ROI by trigger type',
        format: 'Performance Dashboard'
      },
      {
        label: 'Prioritization Analytics',
        description: '40/40/20 scoring breakdown showing rep feedback, strategic alignment, and behavior severity',
        format: 'Scoring Matrix'
      },
      {
        label: 'Feedback Loop Insights',
        description: 'Rep acceptance patterns and suggestion optimization recommendations',
        format: 'Insights Report'
      }
    ],
    
    analytics: [
      {
        title: '7 Trigger Types Performance',
        description: 'Comparative analysis of trigger effectiveness, volume, and conversion rates',
        type: 'chart' as const
      },
      {
        title: '40/40/20 Prioritization System',
        description: 'Breakdown of prioritization factors and their contribution to suggestion scoring',
        type: 'chart' as const
      },
      {
        title: 'Field Feedback Loop',
        description: 'Rep acceptance rates, completion rates, and effectiveness scores over time',
        type: 'chart' as const
      },
      {
        title: 'Performance by Trigger',
        description: 'ROI and conversion metrics for each trigger type with acceptance rates',
        type: 'chart' as const
      }
    ],
    
    downstreamUsage: [
      {
        agent: 'Field Copilot Agent',
        usage: 'Receives prioritized suggestions to integrate into rep workflow and provide contextual guidance'
      },
      {
        agent: 'Customer Planning Agent',
        usage: 'Uses suggestion outcomes to refine HCP prioritization and barrier analysis'
      },
      {
        agent: 'Budget Planning Agent',
        usage: 'Leverages suggestion ROI data to optimize resource allocation for field activities'
      }
    ],
    
    capabilities: [
      '7 configurable trigger types with sensitivity analysis',
      '40/40/20 prioritization system with feedback integration',
      'Real-time suggestion monitoring and adjustment',
      '20 suggestions/week limit with smart throttling',
      '14-day expiration with suppression rules',
      'ROI tracking and performance optimization'
    ],
    
    parameters: [
      {
        label: 'Rep Feedback Weight',
        key: 'rep_feedback_weight',
        type: 'slider',
        value: 40,
        min: 20,
        max: 60,
        step: 5
      },
      {
        label: 'Strategic Priority Weight',
        key: 'strategic_weight',
        type: 'slider',
        value: 40,
        min: 20,
        max: 60,
        step: 5
      },
      {
        label: 'Behavior Severity Weight',
        key: 'behavior_weight',
        type: 'slider',
        value: 20,
        min: 10,
        max: 40,
        step: 5
      },
      {
        label: 'Weekly Suggestion Limit',
        key: 'weekly_limit',
        type: 'slider',
        value: 20,
        min: 10,
        max: 30,
        step: 2
      },
      {
        label: 'Trigger Sensitivity Threshold',
        key: 'sensitivity_threshold',
        type: 'slider',
        value: 0.75,
        min: 0.5,
        max: 0.95,
        step: 0.05
      },
      {
        label: 'Expiration Period (Days)',
        key: 'expiration_days',
        type: 'select',
        value: '14',
        options: ['7', '14', '21', '28']
      },
      {
        label: 'Minimum ROI Threshold',
        key: 'min_roi',
        type: 'number',
        value: 1.5
      }
    ],
    
    suggestedQueries: [
      'Which trigger types have the highest ROI?',
      'Show me the 40/40/20 prioritization breakdown',
      'How has rep feedback influenced suggestion quality?',
      'What is the current weekly suggestion volume by rep?',
      'Which triggers need sensitivity adjustments?'
    ],
    
    visualizationComponent: <FieldSuggestionsVisualization />
  };

  return <AgentView {...agentData} />;
}