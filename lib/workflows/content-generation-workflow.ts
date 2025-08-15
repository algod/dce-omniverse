import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export const contentGenerationWorkflow: Workflow = {
  id: 'content-generation',
  name: 'Content Generation Workflow',
  description: 'Develop new content assets from blueprint to variants based on planning recommendations',
  trigger: 'Generate content to address identified gaps',
  steps: [
    {
      agent: 'content-generation',
      action: 'Blueprint Analysis',
      status: 'pending',
      module: 'blueprint',
      reasoning: [
        'Reviewing recommendations from Content Planning',
        'Analyzing content requirements by segment',
        'Identifying message themes to address',
        'Setting quality standards for generation',
        'Creating content development framework'
      ],
      data: {
        tools: ['Blueprint Analyzer', 'Requirements Parser', 'Standards Setter'],
        metrics: ['Requirements Count', 'Theme Coverage', 'Quality Targets', 'Asset Types']
      }
    },
    {
      agent: 'content-generation',
      action: 'Creative Development',
      status: 'pending',
      module: 'creative',
      reasoning: [
        'Generating base content assets',
        'Applying brand guidelines and tone',
        'Incorporating clinical data points',
        'Ensuring message consistency',
        'Creating compelling narratives'
      ],
      data: {
        tools: ['Content Generator', 'Brand Guideline Enforcer', 'Clinical Data Integrator'],
        metrics: ['Assets Created', 'Brand Compliance', 'Message Accuracy', 'Creative Score']
      }
    },
    {
      agent: 'content-generation',
      action: 'Variant Generation',
      status: 'pending',
      module: 'variants',
      reasoning: [
        'Creating content derivatives by channel',
        'Adapting for different segments',
        'Generating format variations',
        'Optimizing for engagement',
        'Ensuring consistency across variants'
      ],
      data: {
        tools: ['Variant Generator', 'Channel Optimizer', 'Format Converter'],
        metrics: ['Variants Created', 'Channel Coverage', 'Format Types', 'Consistency Score']
      }
    },
    {
      agent: 'content-generation',
      action: 'Quality Assessment',
      status: 'pending',
      module: 'quality',
      reasoning: [
        'Checking MLR compliance readiness',
        'Validating clinical accuracy',
        'Ensuring regulatory alignment',
        'Testing readability scores',
        'Verifying brand consistency'
      ],
      data: {
        tools: ['MLR Pre-checker', 'Compliance Validator', 'Readability Analyzer'],
        metrics: ['MLR Score', 'Compliance Rate', 'Readability Score', 'Accuracy Check']
      }
    },
    {
      agent: 'content-generation',
      action: 'Asset Finalization',
      status: 'pending',
      module: 'finalization',
      reasoning: [
        'Preparing assets for approval workflow',
        'Generating metadata and tags',
        'Creating asset documentation',
        'Packaging for Content Approval',
        'Setting up tracking parameters'
      ],
      data: {
        tools: ['Asset Packager', 'Metadata Generator', 'Documentation Creator'],
        metrics: ['Assets Finalized', 'Metadata Complete', 'Ready for Approval', 'Documentation Status']
      }
    }
  ],
  currentStep: 0
};