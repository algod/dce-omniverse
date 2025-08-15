import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export const aiOrchestrationWorkflow: Workflow = {
  id: 'ai-orchestration',
  name: 'AI Orchestration Workflow',
  description: 'Customer journey optimization and Next Best Action recommendations using AI models',
  trigger: 'Optimize customer journeys with AI',
  steps: [
    {
      agent: 'orchestration',
      action: 'Journey Mapping',
      status: 'pending',
      module: 'journey',
      reasoning: [
        'Designing customer journey frameworks',
        'Mapping touchpoint sequences',
        'Identifying decision points',
        'Creating journey templates',
        'Setting optimization objectives'
      ],
      data: {
        tools: ['Journey Designer', 'Touchpoint Mapper', 'Decision Tree Builder'],
        metrics: ['Journey Templates', 'Touchpoints Mapped', 'Decision Points', 'Optimization Goals']
      }
    },
    {
      agent: 'orchestration',
      action: 'Model Training',
      status: 'pending',
      module: 'training',
      reasoning: [
        'Training BERT model on customer behavior',
        'Processing historical engagement data',
        'Feature engineering for predictions',
        'Validating model performance',
        'Tuning hyperparameters'
      ],
      data: {
        tools: ['BERT Trainer', 'Feature Engineer', 'Model Validator', 'Hyperparameter Tuner'],
        metrics: ['Model Accuracy', 'F1 Score', 'Training Loss', 'Validation Score']
      }
    },
    {
      agent: 'orchestration',
      action: 'Sequence Optimization',
      status: 'pending',
      module: 'optimization',
      reasoning: [
        'Applying genetic algorithms',
        'Optimizing engagement sequences',
        'Balancing reach and frequency',
        'Minimizing journey friction',
        'Maximizing conversion probability'
      ],
      data: {
        tools: ['Genetic Algorithm Engine', 'Sequence Optimizer', 'Conversion Predictor'],
        metrics: ['Optimization Score', 'Sequence Efficiency', 'Predicted Conversion', 'Journey Length']
      }
    },
    {
      agent: 'orchestration',
      action: 'NBA Generation',
      status: 'pending',
      module: 'nba',
      reasoning: [
        'Generating Next Best Actions',
        'Creating explainable recommendations',
        'Prioritizing actions by impact',
        'Personalizing for each HCP',
        'Setting action thresholds'
      ],
      data: {
        tools: ['NBA Generator', 'Explainability Engine', 'Impact Calculator', 'Personalization Engine'],
        metrics: ['NBAs Generated', 'Explainability Score', 'Impact Prediction', 'Personalization Level']
      }
    },
    {
      agent: 'orchestration',
      action: 'Performance Validation',
      status: 'pending',
      module: 'validation',
      reasoning: [
        'Validating journey effectiveness',
        'Measuring prediction accuracy',
        'Calculating ROI impact',
        'Testing against control groups',
        'Generating performance report'
      ],
      data: {
        tools: ['Performance Validator', 'A/B Test Analyzer', 'ROI Calculator', 'Report Generator'],
        metrics: ['Journey Performance', 'Prediction Accuracy', 'ROI Lift', 'Statistical Significance']
      }
    }
  ],
  currentStep: 0
};