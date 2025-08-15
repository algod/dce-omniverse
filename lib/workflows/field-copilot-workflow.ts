import { Workflow, WorkflowStep } from './engagement-planning-workflow';

export const fieldCopilotWorkflow: Workflow = {
  id: 'field-copilot',
  name: 'Field Copilot Workflow',
  description: 'AI assistant supporting field activities with personalized guidance',
  trigger: 'Prepare field engagement support',
  steps: [
    {
      agent: 'copilot',
      action: 'Territory Analysis',
      status: 'pending',
      module: 'territory',
      reasoning: [
        'Analyzing territory performance metrics',
        'Identifying growth opportunities',
        'Assessing competitive landscape',
        'Evaluating market dynamics',
        'Creating territory insights'
      ],
      data: {
        tools: ['Territory Analyzer', 'Opportunity Finder', 'Competitive Intelligence', 'Market Scanner'],
        metrics: ['Territory Score', 'Growth Potential', 'Market Share', 'Opportunity Count']
      }
    },
    {
      agent: 'copilot',
      action: 'HCP Assessment',
      status: 'pending',
      module: 'assessment',
      reasoning: [
        'Deep-diving into HCP profiles',
        'Analyzing prescribing patterns',
        'Identifying barriers and preferences',
        'Reviewing engagement history',
        'Creating personalized insights'
      ],
      data: {
        tools: ['HCP Profiler', 'Pattern Analyzer', 'Barrier Detector', 'History Reviewer'],
        metrics: ['Profile Completeness', 'Barrier Score', 'Engagement Level', 'Preference Match']
      }
    },
    {
      agent: 'copilot',
      action: 'Pre-call Planning',
      status: 'pending',
      module: 'planning',
      reasoning: [
        'Generating customized pre-call plans',
        'Identifying key discussion points',
        'Preparing objection responses',
        'Selecting relevant materials',
        'Creating call objectives'
      ],
      data: {
        tools: ['Plan Generator', 'Discussion Builder', 'Objection Handler', 'Material Selector'],
        metrics: ['Plans Generated', 'Discussion Points', 'Materials Selected', 'Objectives Set']
      }
    },
    {
      agent: 'copilot',
      action: 'Content Preparation',
      status: 'pending',
      module: 'content',
      reasoning: [
        'Selecting relevant content assets',
        'Customizing talking points',
        'Preparing clinical data',
        'Creating follow-up materials',
        'Organizing presentation flow'
      ],
      data: {
        tools: ['Content Curator', 'Talking Point Generator', 'Data Compiler', 'Flow Organizer'],
        metrics: ['Content Selected', 'Talking Points', 'Data Points', 'Flow Score']
      }
    },
    {
      agent: 'copilot',
      action: 'Execution Support',
      status: 'pending',
      module: 'execution',
      reasoning: [
        'Providing real-time coaching',
        'Offering response suggestions',
        'Tracking call progress',
        'Capturing feedback and notes',
        'Scheduling follow-up actions'
      ],
      data: {
        tools: ['Real-time Coach', 'Response Suggester', 'Progress Tracker', 'Note Taker'],
        metrics: ['Coaching Sessions', 'Suggestions Used', 'Call Success Rate', 'Follow-ups Scheduled']
      }
    }
  ],
  currentStep: 0
};