'use client';

import { HeadphonesIcon } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { FieldCopilotVisualization } from '@/components/agents/FieldCopilotVisualization';

export default function FieldCopilotAgent() {
  const agentData = {
    agentId: 'copilot',
    agentName: 'Field Copilot Agent',
    agentColor: colors.agents.copilot,
    agentIcon: HeadphonesIcon,
    overview: `The Field Copilot Agent serves as an AI assistant for sales reps, supporting all field activities with intelligent guidance. 
    It provides comprehensive pre-call planning with HCP insights, territory and region summaries, virtual coaching simulators, 
    and call scheduling with email drafting assistance through an intuitive chat interface.`,
    
    businessInputs: [
      {
        label: 'HCP Profile Data',
        description: 'Comprehensive HCP information including specialty, prescribing patterns, and engagement history',
        type: 'Data Input'
      },
      {
        label: 'Territory Configuration',
        description: 'Territory boundaries, targets, and performance metrics for personalized rep guidance',
        type: 'Configuration'
      },
      {
        label: 'Coaching Scenarios',
        description: 'Virtual training scenarios covering objection handling, clinical discussions, and closing techniques',
        type: 'Training Content'
      },
      {
        label: 'Messaging Templates',
        description: 'Approved email templates and clinical messaging for various rep activities',
        type: 'Content Library'
      }
    ],
    
    outputs: [
      {
        label: 'Pre-Call Intelligence',
        description: 'HCP readiness scores, barrier analysis, and recommended talking points for each call',
        format: 'Call Prep Dashboard'
      },
      {
        label: 'Territory Performance',
        description: 'Real-time territory metrics with targets and performance against goals',
        format: 'Performance Dashboard'
      },
      {
        label: 'AI-Generated Emails',
        description: 'Personalized email drafts with high engagement rates and compliance-approved messaging',
        format: 'Email Templates'
      },
      {
        label: 'Virtual Coaching Reports',
        description: 'Coaching session results with skill improvement tracking and confidence scores',
        format: 'Training Analytics'
      }
    ],
    
    analytics: [
      {
        title: 'Pre-Call Planning Intelligence',
        description: 'HCP readiness scores and recommended next actions for optimal call preparation',
        type: 'chart' as const
      },
      {
        title: 'Territory Performance Summary',
        description: 'Key metrics tracking with current vs target performance across all KPIs',
        type: 'chart' as const
      },
      {
        title: 'Virtual Coaching Performance',
        description: 'Training scenario success rates and skill improvement metrics by coaching type',
        type: 'chart' as const
      },
      {
        title: 'Email Assistance Analytics',
        description: 'Email drafting volume, engagement rates, and response metrics over time',
        type: 'chart' as const
      }
    ],
    
    downstreamUsage: [
      {
        agent: 'Customer Planning Agent',
        usage: 'Receives HCP prioritization and barrier insights to provide targeted pre-call intelligence'
      },
      {
        agent: 'Field Suggestions Agent',
        usage: 'Integrates field suggestions into workflow guidance and call planning recommendations'
      },
      {
        agent: 'Content Review Agent',
        usage: 'Accesses approved messaging and content for email drafting and call preparation materials'
      }
    ],
    
    capabilities: [
      'AI-powered pre-call planning with HCP insights',
      'Real-time territory performance monitoring',
      'Interactive virtual coaching simulator',
      'Intelligent email drafting with high engagement',
      'Call scheduling and follow-up automation',
      'Mobile-optimized PWA for field accessibility'
    ],
    
    parameters: [
      {
        label: 'HCP Readiness Threshold',
        key: 'readiness_threshold',
        type: 'slider',
        value: 70,
        min: 50,
        max: 90,
        step: 5
      },
      {
        label: 'Territory Update Frequency',
        key: 'update_frequency',
        type: 'select',
        value: 'daily',
        options: ['hourly', 'daily', 'weekly']
      },
      {
        label: 'Coaching Difficulty Level',
        key: 'coaching_level',
        type: 'select',
        value: 'adaptive',
        options: ['beginner', 'intermediate', 'advanced', 'adaptive']
      },
      {
        label: 'Email Personalization Level',
        key: 'personalization',
        type: 'slider',
        value: 80,
        min: 40,
        max: 100,
        step: 10
      },
      {
        label: 'Call Priority Scoring',
        key: 'priority_scoring',
        type: 'select',
        value: 'comprehensive',
        options: ['simple', 'standard', 'comprehensive', 'advanced']
      },
      {
        label: 'Response Time SLA (Hours)',
        key: 'response_sla',
        type: 'slider',
        value: 4,
        min: 1,
        max: 24,
        step: 1
      },
      {
        label: 'Offline Mode Duration (Days)',
        key: 'offline_duration',
        type: 'slider',
        value: 3,
        min: 1,
        max: 7,
        step: 1
      }
    ],
    
    suggestedQueries: [
      'Help me prepare for my call with Dr. Johnson',
      'Show me my territory performance this month',
      'Practice objection handling for competitive scenarios',
      'Draft a follow-up email for my speaker program attendees',
      'Which HCPs should I prioritize this week?'
    ],
    
    visualizationComponent: <FieldCopilotVisualization />
  };

  return <AgentView {...agentData} />;
}