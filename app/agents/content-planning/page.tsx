'use client';

import { FileSearch } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { ContentPlanningVisualization } from '@/components/agents/ContentPlanningVisualization';

export default function ContentPlanningAgent() {
  return (
    <StandardAgentViewLight
      agentId="content-planning"
      agentName="Content Planning Agent"
      agentIcon={FileSearch}
      agentColor="from-purple-600 to-purple-700"
      overview={{
        position: "Fourth in flow - Content Strategy. Receives engagement plans from Engagement Planning and determines content needs.",
        purpose: "Determines the current state of content asset inventory, identifies gaps, and creates a strategic plan for content development and retirement.",
        reasoning: [
          "Maps customer microsegments to communication objectives",
          "Analyzes existing content inventory by message theme",
          "Identifies content gaps by channel and segment",
          "Evaluates quality of available content assets",
          "Develops timeline for content creation and MLR approval",
          "Prioritizes content development based on impact"
        ],
        tools: [
          "Content Inventory Analyzer",
          "Message Theme Mapper",
          "Gap Analysis Engine",
          "Quality Assessment Tool",
          "Content Calendar Generator",
          "MLR Timeline Predictor"
        ]
      }}
      businessInputs={{
        fromUpstream: [
          "Customer microsegments from Customer Planning",
          "Budget allocation by channel from Engagement Planning",
          "Engagement frequency plans by segment"
        ],
        userInputs: [
          "Message theme priorities",
          "Content quality standards",
          "MLR approval timelines",
          "Content retirement criteria"
        ],
        businessRules: [
          "Each microsegment requires 3-5 distinct message themes",
          "Content must align with barrier-specific messaging",
          "MLR approval typically requires 4-6 weeks",
          "Content refresh cycle every 6-12 months"
        ]
      }}
      outputs={{
        toDownstream: [
          "Content gap analysis report",
          "Content development priorities",
          "Message theme mapping matrix",
          "Timeline for content creation"
        ],
        metrics: [
          "Content coverage by segment: 73%",
          "Identified content gaps: 47 assets",
          "Average content quality score: 7.8/10",
          "Estimated MLR approval time: 5.2 weeks"
        ],
        actions: [
          "Develop 23 new content assets for high-priority gaps",
          "Retire 15 outdated assets",
          "Update 31 existing assets with new clinical data",
          "Fast-track MLR for 8 critical assets"
        ]
      }}
      visualizationComponent={ContentPlanningVisualization}
    />
  );
}