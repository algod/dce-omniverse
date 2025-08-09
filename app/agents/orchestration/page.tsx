'use client';

import { Network } from 'lucide-react';
import { AgentView } from '@/components/agent-verse/AgentView';
import { colors } from '@/lib/design-system/colors';
import { OrchestrationVisualization } from '@/components/agents/OrchestrationVisualization';

export default function OrchestrationAgent() {
  const agentData = {
    agentId: 'orchestration',
    agentName: 'AI-based Orchestration Agent',
    agentColor: colors.agents.orchestration,
    agentIcon: Network,
    overview: `The AI-based Orchestration Agent optimizes customer journeys using advanced machine learning techniques. 
    It employs BERT-style models to predict customer behavior, genetic algorithms to optimize journey sequences, 
    and provides explainable Next Best Action recommendations with visual journey mapping.`,
    
    businessInputs: [
      {
        label: 'Customer Journey Mapping',
        description: 'Define the stages and touchpoints in your customer journey from awareness to advocacy',
        type: 'Configuration'
      },
      {
        label: 'Historical Engagement Data',
        description: 'Past interaction data across all channels including field, digital, and event engagement',
        type: 'Data Input'
      },
      {
        label: 'Behavior Prediction Models',
        description: 'BERT model configuration and training parameters for customer behavior prediction',
        type: 'AI Configuration'
      },
      {
        label: 'Optimization Objectives',
        description: 'Business goals and constraints for genetic algorithm optimization (ROI, engagement, conversion)',
        type: 'Strategic Input'
      }
    ],
    
    outputs: [
      {
        label: 'Optimized Journey Paths',
        description: 'Genetically optimized customer journey sequences with highest predicted success rates',
        format: 'Interactive Journey Map'
      },
      {
        label: 'Next Best Actions',
        description: 'Real-time, personalized action recommendations with impact probability and timing',
        format: 'Action Dashboard'
      },
      {
        label: 'BERT Model Performance',
        description: 'Continuous model performance monitoring with accuracy, precision, and F1 score metrics',
        format: 'Performance Dashboard'
      },
      {
        label: 'Journey Analytics',
        description: 'Customer progression analytics with conversion rates and engagement metrics by stage',
        format: 'Analytics Report'
      }
    ],
    
    analytics: [
      {
        title: 'Customer Journey Funnel',
        description: 'Visual progression through journey stages with completion and engagement rates',
        type: 'chart' as const
      },
      {
        title: 'BERT Model Performance',
        description: 'Real-time tracking of model accuracy, precision, recall, and F1 scores',
        type: 'chart' as const
      },
      {
        title: 'Genetic Algorithm Optimization',
        description: 'Evolution of journey optimization showing fitness scores and diversity metrics',
        type: 'chart' as const
      },
      {
        title: 'Next Best Actions Matrix',
        description: 'Scatter plot of action recommendations by success probability and expected impact',
        type: 'chart' as const
      }
    ],
    
    downstreamUsage: [
      {
        agent: 'Field Copilot Agent',
        usage: 'Receives next best action recommendations to provide contextual guidance and call planning for field reps'
      },
      {
        agent: 'Content Review Agent',
        usage: 'Uses journey stage insights to ensure appropriate content is available for each customer touchpoint'
      },
      {
        agent: 'Budget Planning Agent',
        usage: 'Leverages journey optimization results to allocate budget to highest-impact touchpoints and channels'
      }
    ],
    
    capabilities: [
      'BERT-based customer behavior prediction with 94% accuracy',
      'Genetic algorithm journey optimization across 8+ touchpoints',
      'Real-time Next Best Action recommendations',
      'Explainable AI with visual journey mapping',
      'Cross-channel orchestration and timing optimization',
      'Continuous model performance monitoring and improvement'
    ],
    
    parameters: [
      {
        label: 'BERT Model Learning Rate',
        key: 'bert_learning_rate',
        type: 'number',
        value: 0.001
      },
      {
        label: 'Genetic Algorithm Generations',
        key: 'ga_generations',
        type: 'slider',
        value: 25,
        min: 10,
        max: 50,
        step: 5
      },
      {
        label: 'Population Diversity Threshold',
        key: 'diversity_threshold',
        type: 'slider',
        value: 0.35,
        min: 0.1,
        max: 0.8,
        step: 0.05
      },
      {
        label: 'Journey Optimization Objective',
        key: 'optimization_objective',
        type: 'select',
        value: 'conversion_rate',
        options: ['conversion_rate', 'engagement_score', 'roi_maximization', 'time_efficiency']
      },
      {
        label: 'NBA Minimum Confidence',
        key: 'nba_confidence',
        type: 'slider',
        value: 0.75,
        min: 0.5,
        max: 0.95,
        step: 0.05
      },
      {
        label: 'Journey Stage Weighting',
        key: 'stage_weighting',
        type: 'select',
        value: 'equal',
        options: ['equal', 'funnel_weighted', 'conversion_focused', 'engagement_focused']
      }
    ],
    
    suggestedQueries: [
      'What is the optimal journey path for high-value HCPs?',
      'Show me the BERT model performance over time',
      'Which next best actions have the highest success probability?',
      'How has genetic algorithm optimization improved journey performance?',
      'What are the top 3 recommended actions for Dr. Johnson?'
    ],
    
    visualizationComponent: <OrchestrationVisualization />
  };

  return <AgentView {...agentData} />;
}