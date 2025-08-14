'use client';

import { FileCheck } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { ContentApprovalVisualization } from '@/components/agents/ContentApprovalVisualization';

export default function ContentApprovalAgent() {
  return (
    <StandardAgentViewLight
      agentId="content-approval"
      agentName="Content Approval Agent"
      agentIcon={FileCheck}
      agentColor="from-emerald-600 to-emerald-700"
      overview={{
        position: "Sixth in flow - MLR Review. Receives generated content from Content Generation and ensures compliance.",
        purpose: "Defines content approval standards, runs MLR review engine, and manages human-in-the-loop approval with Veeva PromoMats integration.",
        reasoning: [
          "Establishes MLR approval standards and criteria",
          "Runs automated compliance scoring for each asset",
          "Categorizes content: auto-approve, manual review, decline",
          "Provides specific improvement recommendations",
          "Manages human-in-the-loop review workflow",
          "Integrates approved content with Veeva PromoMats"
        ],
        tools: [
          "MLR Review Engine",
          "Compliance Scoring System",
          "Veeva PromoMats Integration",
          "Approval Workflow Manager",
          "Recommendation Generator",
          "Human Review Interface"
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Content Generation Agent",
          data: [
            { label: "Assets Received", value: "147 generated pieces" },
            { label: "Pre-Check Pass Rate", value: "94% compliant" },
            { label: "Quality Score", value: "8.2/10 average" },
            { label: "Variants Created", value: "142 variations" }
          ]
        },
        parameters: [
          {
            name: "Auto-Approval Threshold (%)",
            type: "slider",
            value: 95,
            min: 90,
            max: 100
          },
          {
            name: "Manual Review Range (%)",
            type: "slider",
            value: 85,
            min: 75,
            max: 94
          },
          {
            name: "MLR Scoring Weight - Clinical",
            type: "slider",
            value: 30,
            min: 20,
            max: 40
          },
          {
            name: "MLR Scoring Weight - Safety",
            type: "slider",
            value: 25,
            min: 15,
            max: 35
          },
          {
            name: "MLR Scoring Weight - Regulatory",
            type: "slider",
            value: 20,
            min: 10,
            max: 30
          },
          {
            name: "Review Priority Mode",
            type: "select",
            value: "Risk-Based",
            options: ["Risk-Based", "Segment-Priority", "Channel-Priority", "FIFO"]
          },
          {
            name: "Human Review Capacity",
            type: "select",
            value: "Standard",
            options: ["Limited", "Standard", "Enhanced", "Maximum"]
          },
          {
            name: "Veeva Sync Frequency",
            type: "select",
            value: "Real-time",
            options: ["Real-time", "Hourly", "Daily", "Manual"]
          },
          {
            name: "Enable Fast-Track Review",
            type: "toggle",
            value: false
          },
          {
            name: "Auto-Sync to Veeva",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "MLR scoring weights must sum to 100%",
          "Auto-approval threshold cannot be below 90%",
          "Human review capacity: max 50 assets/day",
          "Veeva sync must complete within 24 hours",
          "All declined assets must have recommendations"
        ]
      }}
      outputs={{
        downstream: {
          destination: "AI Orchestration Agent",
          data: [
            { label: "Approved Assets", value: "106 MLR-approved" },
            { label: "Pending Review", value: "26 in queue" },
            { label: "Declined Assets", value: "15 with feedback" },
            { label: "Review Time", value: "4.2 hours avg" },
            { label: "Veeva Sync", value: "100% success" }
          ]
        },
        recommendations: [
          "Auto-approve 106 high-scoring assets",
          "Queue 26 assets for human review",
          "Provide recommendations for 15 declined assets",
          "Sync all approved content to Veeva PromoMats",
          "Expedite critical barrier content reviews"
        ],
        impact: [
          { metric: "Approval Rate", change: "+72%" },
          { metric: "Review Time", change: "-6 hours" },
          { metric: "Compliance Score", change: "+96%" },
          { metric: "Content Velocity", change: "+45%" }
        ]
      }}
      analytics={{
        models: [
          {
            name: "MLR Scoring Model",
            description: "Deep learning model that evaluates content compliance across clinical, safety, and regulatory dimensions",
            accuracy: 96
          },
          {
            name: "Risk Assessment Algorithm",
            description: "Identifies high-risk content requiring human review based on historical approval patterns",
            accuracy: 93
          },
          {
            name: "Approval Prediction Engine",
            description: "Predicts likelihood of approval and suggests specific improvements for borderline content",
            accuracy: 91
          }
        ],
        algorithms: [
          "Deep Learning Classification",
          "Risk Scoring Framework",
          "Pattern Recognition",
          "Natural Language Analysis",
          "Recommendation Engine",
          "Workflow Automation"
        ],
        reasoning: {
          steps: [
            {
              step: "Initial Assessment",
              description: "Receive content from generation agent and perform initial compliance scan"
            },
            {
              step: "MLR Scoring",
              description: "Apply multi-dimensional scoring across clinical accuracy, safety, and regulatory compliance"
            },
            {
              step: "Risk Evaluation",
              description: "Assess content risk level and determine review pathway requirements"
            },
            {
              step: "Categorization",
              description: "Sort content into auto-approve, manual review, or decline categories"
            },
            {
              step: "Human Routing",
              description: "Queue manual review items and assign to appropriate reviewers"
            },
            {
              step: "Veeva Integration",
              description: "Sync approved content to Veeva PromoMats with proper tagging and metadata"
            }
          ]
        },
        visualizations: <ContentApprovalVisualization />
      }}
      visualizationComponent={ContentApprovalVisualization}
    />
  );
}