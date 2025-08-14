'use client';

import { FileCheck } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { ContentSupplyChain } from '@/components/agents/ContentSupplyChain';

export default function ContentSupplyChainAgent() {
  return (
    <StandardAgentViewLight
      agentId="content"
      agentName="Content Supply Chain"
      agentIcon={FileCheck}
      agentColor="from-sky-500 to-blue-500"
      overview={{
        position: "Fourth in flow - Content Lifecycle Management. Parent agent with three sub-agents for planning, generation, and approval.",
        purpose: "End-to-end content lifecycle management with integrated sub-agents for content planning, generation (Adobe integration), and approval (Veeva PromoMats integration).",
        reasoning: [
          "Content Planning: Identifies gaps and retirement opportunities",
          "Content Generation: Creates blueprints with Adobe Creative Cloud",
          "Content Approval: MLR review engine with Veeva PromoMats sync",
          "Automated compliance checking and scoring",
          "Human-in-the-loop review for edge cases"
        ],
        tools: [
          "MLR Compliance Checker",
          "Content Library Manager",
          "Gap Analysis Engine",
          "Approval Workflow System",
          "Content-Barrier Mapper",
          "Production Coordinator"
        ],
        actions: [
          "Reviewing 147 content assets",
          "Checking MLR compliance",
          "Mapping content to barriers",
          "Identifying 12 content gaps",
          "Processing approval queue"
        ],
        keyMetrics: [
          { label: "Total Assets", value: "147" },
          { label: "Approval Rate", value: "72%" },
          { label: "Content Gaps", value: "12" },
          { label: "Avg Approval Time", value: "3.2 days" },
          { label: "Coverage Score", value: "83%" },
          { label: "Compliance Rate", value: "94%" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Budget Planning Agent",
          data: [
            { label: "Field Budget", value: "$6M allocated" },
            { label: "Digital Budget", value: "$3.75M allocated" },
            { label: "Email Budget", value: "$2.25M allocated" },
            { label: "Content Needs", value: "147 assets required" }
          ]
        },
        parameters: [
          {
            name: "MLR Strictness Level",
            type: "select",
            value: "Standard",
            options: ["Relaxed", "Standard", "Strict", "Maximum"]
          },
          {
            name: "Auto-Approval Threshold (%)",
            type: "slider",
            value: 95,
            min: 85,
            max: 100
          },
          {
            name: "Content Refresh Frequency",
            type: "select",
            value: "Quarterly",
            options: ["Monthly", "Quarterly", "Semi-Annual", "Annual"]
          },
          {
            name: "Barrier Coverage Priority",
            type: "select",
            value: "Formulary First",
            options: ["Equal Weight", "Formulary First", "Referral First", "Side Effects First"]
          },
          {
            name: "Channel Content Ratio",
            type: "select",
            value: "Budget-Proportional",
            options: ["Equal Distribution", "Budget-Proportional", "Field-Heavy", "Digital-Heavy"]
          },
          {
            name: "Include Competitive Claims",
            type: "toggle",
            value: false
          },
          {
            name: "Fast-Track Priority Content",
            type: "toggle",
            value: true
          },
          {
            name: "Gap Analysis Frequency",
            type: "select",
            value: "Weekly",
            options: ["Daily", "Weekly", "Bi-Weekly", "Monthly"]
          }
        ],
        constraints: [
          "All content must pass MLR compliance check",
          "Minimum 3 assets per barrier per channel",
          "Maximum 30-day approval timeline",
          "Content expiration after 12 months",
          "Channel-specific formatting requirements"
        ]
      }}
      analytics={{
        models: [
          {
            name: "MLR Compliance Predictor",
            description: "ML model that predicts likelihood of MLR approval based on content features",
            accuracy: 92
          },
          {
            name: "Content Effectiveness Model",
            description: "Predicts content engagement rates based on historical performance",
            accuracy: 85
          },
          {
            name: "Gap Detection Algorithm",
            description: "Identifies missing content coverage across barriers and channels",
            accuracy: 94
          }
        ],
        algorithms: [
          "Natural Language Processing",
          "Compliance Rule Engine",
          "Semantic Similarity",
          "Gap Analysis Matrix",
          "Approval Prediction"
        ],
        reasoning: {
          steps: [
            {
              step: "Budget Analysis",
              description: "Review channel budgets to determine content volume requirements"
            },
            {
              step: "Content Inventory",
              description: "Catalog existing approved content and assess current coverage"
            },
            {
              step: "Barrier Mapping",
              description: "Map each content piece to relevant barriers and channels"
            },
            {
              step: "Compliance Check",
              description: "Run automated MLR compliance assessment on all content"
            },
            {
              step: "Gap Identification",
              description: "Identify missing content by barrier-channel combinations"
            },
            {
              step: "Production Planning",
              description: "Prioritize new content creation based on gaps and budget"
            }
          ]
        },
        visualizations: <ContentSupplyChain />
      }}
      outputs={{
        downstream: {
          destination: "AI Orchestration Agent",
          data: [
            { label: "Approved Content", value: "147 MLR-approved" },
            { label: "Content-Barrier Map", value: "Complete mapping" },
            { label: "Gap Analysis", value: "12 gaps identified" },
            { label: "Channel Assets", value: "All 6 channels" },
            { label: "Compliance Status", value: "94% compliant" }
          ]
        },
        recommendations: [
          "Prioritize formulary barrier content creation (4 gaps)",
          "Fast-track digital assets for email campaign",
          "Update side effect management materials",
          "Create peer discussion guides for speaker programs",
          "Refresh outdated clinical data presentations"
        ],
        impact: [
          { metric: "Content Coverage", change: "+23%" },
          { metric: "Approval Speed", change: "+45%" },
          { metric: "Compliance Rate", change: "+8%" },
          { metric: "Content Utilization", change: "+37%" }
        ]
      }}
    />
  );
}