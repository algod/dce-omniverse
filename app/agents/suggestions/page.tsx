'use client';

import { Lightbulb } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { FieldSuggestionsVisualization } from '@/components/agents/FieldSuggestionsVisualization';

export default function FieldSuggestionsAgent() {
  return (
    <StandardAgentViewLight
      agentId="suggestions"
      agentName="Field Suggestions Agent"
      agentIcon={Lightbulb}
      agentColor="from-cyan-500 to-teal-500"
      overview={{
        position: "Fifth in flow - Field Enablement. Receives NBA recommendations from the AI Orchestration Agent and generates prioritized field suggestions for representatives.",
        purpose: "Design and monitor field suggestions aligned with brand objectives. Balances trigger volume, quality, and field capacity while incorporating feedback through the 40/40/20 prioritization system.",
        reasoning: [
          "Configures 7 trigger types with dynamic thresholds",
          "Monitors field feedback and adoption rates",
          "Adjusts triggers based on performance metrics",
          "Implements 40/40/20 prioritization (rep feedback/strategic priority/behavior severity)",
          "Ensures suggestion quality while managing volume"
        ],
        tools: [
          "Trigger Configuration Console",
          "Feedback Processing Engine",
          "Performance Analytics Platform",
          "Volume Management System",
          "Priority Scoring Engine",
          "Adoption Tracking System"
        ],
        actions: [
          "Configuring 7 trigger types",
          "Processing 892 feedback points",
          "Adjusting sensitivity thresholds",
          "Generating priority scores",
          "Monitoring adoption rates"
        ],
        keyMetrics: [
          { label: "Active Triggers", value: "7" },
          { label: "Weekly Suggestions", value: "127" },
          { label: "Completion Rate", value: "72%" },
          { label: "Feedback Score", value: "4.2/5" },
          { label: "Adoption Rate", value: "68%" },
          { label: "Avg Response Time", value: "2.4 hrs" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "AI Orchestration Agent",
          data: [
            { label: "NBA Recommendations", value: "423 optimized actions" },
            { label: "Journey Sequences", value: "156 active paths" },
            { label: "Model Predictions", value: "89% confidence avg" },
            { label: "Conversion Probabilities", value: "72% expected" }
          ]
        },
        parameters: [
          {
            name: "Trigger 1: Speaker Program Follow-up",
            type: "slider",
            value: 85,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 2: Low Fulfillment Rate",
            type: "slider",
            value: 70,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 3: Positive Payer Coverage",
            type: "slider",
            value: 75,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 4: Slowed Prescribing",
            type: "slider",
            value: 65,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 5: Single Prescription",
            type: "slider",
            value: 60,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 6: Email Engagement",
            type: "slider",
            value: 80,
            min: 50,
            max: 100
          },
          {
            name: "Trigger 7: Early Indicators",
            type: "slider",
            value: 55,
            min: 50,
            max: 100
          },
          {
            name: "Weekly Volume Cap",
            type: "select",
            value: "20",
            options: ["10", "15", "20", "25", "30"]
          },
          {
            name: "Prioritization Method",
            type: "select",
            value: "40-40-20",
            options: ["40-40-20", "Equal Weight", "Rep Priority", "Strategic Only"]
          },
          {
            name: "Suppression Rules",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "Maximum 20 suggestions per rep per week",
          "14-day expiration on all suggestions",
          "Suppression for recently contacted HCPs",
          "40/40/20 weighting must be maintained",
          "Emergency override for critical triggers"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Trigger Optimization Model",
            description: "Machine learning model to optimize trigger sensitivity based on outcomes",
            accuracy: 87
          },
          {
            name: "Feedback Analysis Model",
            description: "NLP model to process and categorize rep feedback",
            accuracy: 84
          },
          {
            name: "Volume Prediction Model",
            description: "Forecasts suggestion volume based on trigger settings",
            accuracy: 90
          }
        ],
        algorithms: [
          "Sensitivity Analysis",
          "Feedback Loop Integration",
          "Priority Scoring",
          "Volume Optimization",
          "Performance Tracking"
        ],
        reasoning: {
          steps: [
            {
              step: "NBA Integration",
              description: "Receive and process Next Best Actions from Orchestration Agent"
            },
            {
              step: "Trigger Evaluation",
              description: "Evaluate all 7 triggers against current HCP data"
            },
            {
              step: "Priority Calculation",
              description: "Apply 40/40/20 weighting to generate priority scores"
            },
            {
              step: "Volume Management",
              description: "Apply caps and suppression rules to manage suggestion volume"
            },
            {
              step: "Performance Monitoring",
              description: "Track completion rates and feedback for continuous improvement"
            },
            {
              step: "Threshold Adjustment",
              description: "Dynamically adjust trigger sensitivities based on performance"
            }
          ]
        },
        visualizations: <FieldSuggestionsVisualization />
      }}
      outputs={{
        downstream: {
          destination: "Field Copilot Agent",
          data: [
            { label: "Active Suggestions", value: "127 this week" },
            { label: "Priority Actions", value: "45 immediate" },
            { label: "Performance Metrics", value: "72% completion" },
            { label: "Feedback Required", value: "23 items" },
            { label: "Trigger Performance", value: "All monitored" }
          ]
        },
        recommendations: [
          "Increase speaker program follow-up sensitivity to 90%",
          "Reduce early indicator threshold to capture more opportunities",
          "Implement weekly review of trigger performance",
          "Add suppression for HCPs contacted in last 48 hours",
          "Focus on formulary and referral barrier triggers"
        ],
        impact: [
          { metric: "Suggestion Quality", change: "+28%" },
          { metric: "Rep Adoption", change: "+42%" },
          { metric: "Completion Rate", change: "+15%" },
          { metric: "Time to Action", change: "-35%" }
        ]
      }}
    />
  );
}