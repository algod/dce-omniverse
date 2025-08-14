'use client';

import { HeadphonesIcon } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { FieldCopilotVisualization } from '@/components/agents/FieldCopilotVisualization';

export default function FieldCopilotAgent() {
  return (
    <StandardAgentViewLight
      agentId="copilot"
      agentName="Field Copilot Agent"
      agentIcon={HeadphonesIcon}
      agentColor="from-green-500 to-green-600"
      hideSequentialWorkflow={true}
      overview={{
        position: "End of flow - Execution Support. This is the final agent in the DCE OmniVerse flow, providing AI-powered assistance to field representatives. It synthesizes all upstream intelligence and sends feedback back to Customer Planning to complete the loop.",
        purpose: "AI assistant for sales reps supporting field activities. Provides pre-call planning, virtual coaching, territory insights, and email assistance. Captures field feedback and insights to continuously improve the system.",
        reasoning: [
          "Synthesizes intelligence from all upstream agents",
          "Generates contextual pre-call planning summaries",
          "Provides virtual coaching scenarios",
          "Assists with scheduling and email drafting",
          "Captures and processes field feedback for system improvement"
        ],
        tools: [
          "Intelligence Aggregator",
          "Pre-Call Planning Engine",
          "Coaching Scenario Generator",
          "Email/Calendar Assistant",
          "Territory Management System",
          "Feedback Processing Engine"
        ],
        actions: [
          "Preparing 445 pre-call plans",
          "Generating coaching scenarios",
          "Optimizing territory coverage",
          "Drafting follow-up emails",
          "Processing field feedback"
        ],
        keyMetrics: [
          { label: "Active Reps", value: "248" },
          { label: "Calls Planned", value: "445" },
          { label: "Emails Drafted", value: "380" },
          { label: "Coaching Sessions", value: "580" },
          { label: "Success Rate", value: "78%" },
          { label: "Feedback Score", value: "4.6/5" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Field Suggestions Agent",
          data: [
            { label: "Active Suggestions", value: "127 for this week" },
            { label: "Priority Actions", value: "45 immediate" },
            { label: "Trigger Alerts", value: "7 types active" },
            { label: "Performance Metrics", value: "72% completion rate" }
          ]
        },
        parameters: [
          {
            name: "Pre-Call Depth",
            type: "select",
            value: "Comprehensive",
            options: ["Basic", "Standard", "Comprehensive", "Executive"]
          },
          {
            name: "Coaching Intensity",
            type: "slider",
            value: 3,
            min: 1,
            max: 5
          },
          {
            name: "Territory Coverage Focus",
            type: "select",
            value: "High-Opportunity",
            options: ["High-Opportunity", "Balanced", "Wide Coverage", "Strategic Accounts"]
          },
          {
            name: "Email Tone",
            type: "select",
            value: "Professional",
            options: ["Formal", "Professional", "Conversational", "Technical"]
          },
          {
            name: "Include Competitive Intel",
            type: "toggle",
            value: true
          },
          {
            name: "Real-Time Alerts",
            type: "toggle",
            value: true
          },
          {
            name: "Feedback Collection Mode",
            type: "select",
            value: "Continuous",
            options: ["Manual", "Daily", "Weekly", "Continuous"]
          }
        ],
        constraints: [
          "Maximum 20 pre-call plans per rep per week",
          "Coaching sessions limited to 30 minutes",
          "Email drafts must comply with MLR guidelines",
          "Territory optimization runs weekly",
          "Feedback must be anonymized"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Context Synthesis Model",
            description: "Aggregates data from all upstream agents to create comprehensive HCP context",
            accuracy: 91
          },
          {
            name: "Coaching Effectiveness Model",
            description: "Personalizes coaching scenarios based on rep performance patterns",
            accuracy: 86
          },
          {
            name: "Territory Optimization Algorithm",
            description: "Optimizes call routes and timing for maximum efficiency",
            accuracy: 88
          }
        ],
        algorithms: [
          "Natural Language Generation",
          "Context Aggregation",
          "Route Optimization",
          "Sentiment Analysis",
          "Performance Prediction"
        ],
        reasoning: {
          steps: [
            {
              step: "Intelligence Gathering",
              description: "Collect and synthesize data from all upstream agents"
            },
            {
              step: "Context Generation",
              description: "Create comprehensive HCP profiles with barriers, opportunities, and history"
            },
            {
              step: "Pre-Call Planning",
              description: "Generate tailored talking points and objection handling strategies"
            },
            {
              step: "Coaching Customization",
              description: "Create personalized coaching scenarios based on rep needs"
            },
            {
              step: "Territory Optimization",
              description: "Optimize call schedules and routes for efficiency"
            },
            {
              step: "Feedback Processing",
              description: "Capture field insights and send back to Customer Planning"
            }
          ]
        },
        visualizations: <FieldCopilotVisualization />
      }}
      outputs={{
        downstream: {
          destination: "Customer Planning Agent (Feedback Loop)",
          data: [
            { label: "Field Insights", value: "892 new observations" },
            { label: "Barrier Updates", value: "47 newly identified" },
            { label: "Engagement Outcomes", value: "78% positive" },
            { label: "Customer Feedback", value: "4.6/5 average" },
            { label: "Territory Metrics", value: "87% coverage achieved" }
          ]
        },
        recommendations: [
          "Focus pre-call planning on formulary barrier discussions",
          "Increase coaching for objection handling techniques",
          "Optimize Tuesday/Thursday for high-value HCP calls",
          "Prepare side effect management materials for next week",
          "Schedule peer-to-peer discussions for complex cases"
        ],
        impact: [
          { metric: "Call Success Rate", change: "+34%" },
          { metric: "Rep Confidence", change: "+42%" },
          { metric: "Territory Coverage", change: "+28%" },
          { metric: "Email Response Rate", change: "+56%" }
        ]
      }}
    />
  );
}