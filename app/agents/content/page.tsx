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
        fromUpstream: [
          "Generated content assets from Content Generation",
          "Quality scores and compliance pre-checks",
          "Asset metadata and tagging",
          "Channel optimization requirements"
        ],
        userInputs: [
          "MLR approval standards",
          "Compliance thresholds",
          "Review priority criteria",
          "Veeva PromoMats configuration"
        ],
        businessRules: [
          "Assets scoring >95% can be auto-approved",
          "Manual review required for 85-95% scores",
          "Assets <85% are auto-declined with recommendations",
          "All approvals sync to Veeva PromoMats within 24 hours"
        ]
      }}
      outputs={{
        toDownstream: [
          "MLR-approved content assets (106 approved)",
          "Declined assets with improvement recommendations (15)",
          "Assets pending human review (26)",
          "Veeva PromoMats integration status"
        ],
        metrics: [
          "Auto-approval rate: 72%",
          "Manual review required: 18%", 
          "Decline rate: 10%",
          "Average review time: 4.2 hours",
          "Veeva sync success: 100%"
        ],
        actions: [
          "Auto-approve 106 high-scoring assets",
          "Queue 26 assets for human review",
          "Provide recommendations for 15 declined assets",
          "Sync all approved content to Veeva PromoMats"
        ]
      }}
      visualizationComponent={ContentApprovalVisualization}
    />
  );
}