import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export const fieldSuggestionsWorkflow: Workflow = {
  id: 'field-suggestions',
  name: 'Field Suggestions Workflow',
  description: 'Design and monitor field suggestions aligned with brand objectives',
  trigger: 'Configure field suggestion triggers and monitoring',
  steps: [
    {
      agent: 'suggestions',
      action: 'Trigger Configuration',
      status: 'pending',
      module: 'triggers',
      reasoning: [
        'Setting up 7 trigger types',
        'Defining trigger thresholds',
        'Configuring activation rules',
        'Setting volume constraints',
        'Establishing suppression logic'
      ],
      data: {
        tools: ['Trigger Configurator', 'Threshold Setter', 'Rule Engine', 'Volume Controller'],
        metrics: ['Triggers Configured', 'Threshold Values', 'Rules Active', 'Volume Limits']
      }
    },
    {
      agent: 'suggestions',
      action: 'Sensitivity Analysis',
      status: 'pending',
      module: 'sensitivity',
      reasoning: [
        'Optimizing trigger sensitivity',
        'Balancing signal vs noise',
        'Testing threshold variations',
        'Analyzing false positive rates',
        'Fine-tuning detection parameters'
      ],
      data: {
        tools: ['Sensitivity Analyzer', 'Signal Processor', 'False Positive Detector'],
        metrics: ['Sensitivity Score', 'Signal-to-Noise Ratio', 'False Positive Rate', 'Detection Accuracy']
      }
    },
    {
      agent: 'suggestions',
      action: 'Priority Mapping',
      status: 'pending',
      module: 'priority',
      reasoning: [
        'Applying 40/40/20 prioritization',
        'Weighting rep feedback (40%)',
        'Factoring strategic priority (40%)',
        'Assessing behavior severity (20%)',
        'Creating priority matrix'
      ],
      data: {
        tools: ['Priority Calculator', 'Weight Optimizer', 'Matrix Builder'],
        metrics: ['Priority Scores', 'Weight Distribution', 'Matrix Completeness', 'Balance Score']
      }
    },
    {
      agent: 'suggestions',
      action: 'Feedback Integration',
      status: 'pending',
      module: 'feedback',
      reasoning: [
        'Collecting field feedback',
        'Analyzing adoption patterns',
        'Identifying improvement areas',
        'Processing sentiment analysis',
        'Updating trigger parameters'
      ],
      data: {
        tools: ['Feedback Collector', 'Adoption Analyzer', 'Sentiment Processor', 'Parameter Updater'],
        metrics: ['Feedback Volume', 'Adoption Rate', 'Sentiment Score', 'Improvement Areas']
      }
    },
    {
      agent: 'suggestions',
      action: 'Suggestion Deployment',
      status: 'pending',
      module: 'deployment',
      reasoning: [
        'Deploying suggestions to field',
        'Setting expiration timelines',
        'Monitoring completion rates',
        'Tracking performance metrics',
        'Generating effectiveness reports'
      ],
      data: {
        tools: ['Deployment Engine', 'Expiration Manager', 'Performance Tracker', 'Report Builder'],
        metrics: ['Suggestions Deployed', 'Completion Rate', 'Performance Score', 'ROI Impact']
      }
    }
  ],
  currentStep: 0
};