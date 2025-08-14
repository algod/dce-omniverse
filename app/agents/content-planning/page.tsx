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
        upstream: {
          source: "Engagement Planning Agent",
          data: [
            { label: "Champions Budget", value: "$3.2M allocated" },
            { label: "Growers Budget", value: "$2.8M allocated" },
            { label: "Converters Budget", value: "$2.1M allocated" },
            { label: "Channel Mix", value: "Field 40%, Digital 35%, Email 25%" }
          ]
        },
        parameters: [
          {
            name: "Content Quality Threshold (%)",
            type: "slider",
            value: 85,
            min: 70,
            max: 100
          },
          {
            name: "Gap Tolerance (%)",
            type: "slider",
            value: 15,
            min: 5,
            max: 30
          },
          {
            name: "Message Themes per Segment",
            type: "slider",
            value: 4,
            min: 3,
            max: 7
          },
          {
            name: "Content Refresh Cycle (months)",
            type: "select",
            value: "9",
            options: ["6", "9", "12", "18"]
          },
          {
            name: "MLR Timeline (weeks)",
            type: "select",
            value: "5",
            options: ["3", "4", "5", "6", "8"]
          },
          {
            name: "Priority Mode",
            type: "select",
            value: "Barrier-Focused",
            options: ["Barrier-Focused", "Channel-Optimized", "Segment-Priority", "Balanced"]
          },
          {
            name: "Include Competitive Analysis",
            type: "toggle",
            value: true
          },
          {
            name: "Auto-Retire Outdated Content",
            type: "toggle",
            value: true
          },
          {
            name: "Fast-Track Critical Assets",
            type: "toggle",
            value: false
          }
        ],
        constraints: [
          "Minimum 3 message themes per microsegment",
          "Content quality must exceed 80% threshold",
          "MLR approval timeline cannot exceed 8 weeks",
          "Budget must align with channel allocations",
          "Maximum 200 active assets per quarter"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Content Gap Analysis Model",
            description: "ML model that identifies content gaps by analyzing microsegment needs vs. available assets",
            accuracy: 87
          },
          {
            name: "Message Theme Mapper",
            description: "NLP-based model that maps communication objectives to optimal message themes",
            accuracy: 91
          },
          {
            name: "Quality Assessment Engine",
            description: "Deep learning model that evaluates content quality across multiple dimensions",
            accuracy: 89
          }
        ],
        algorithms: [
          "Natural Language Processing",
          "Gap Analysis Algorithm",
          "Content Clustering",
          "Quality Scoring Framework",
          "Timeline Optimization",
          "Priority Matrix Builder"
        ],
        reasoning: {
          steps: [
            {
              step: "Inventory Analysis",
              description: "Scan existing content library and categorize by segment, channel, and message theme"
            },
            {
              step: "Gap Detection",
              description: "Compare microsegment needs with available content to identify critical gaps"
            },
            {
              step: "Quality Evaluation",
              description: "Score existing content quality and identify assets requiring updates"
            },
            {
              step: "Priority Scoring",
              description: "Rank content development needs based on impact and urgency"
            },
            {
              step: "Timeline Generation",
              description: "Create optimal content development schedule considering MLR timelines"
            },
            {
              step: "Action Planning",
              description: "Generate specific recommendations for content creation and retirement"
            }
          ]
        },
        visualizations: <ContentPlanningVisualization />
      }}
      outputs={{
        downstream: {
          destination: "Content Generation Agent",
          data: [
            { label: "Content Gaps", value: "47 critical assets" },
            { label: "Priority Themes", value: "23 high-priority" },
            { label: "Quality Score", value: "7.8/10 average" },
            { label: "MLR Timeline", value: "5.2 weeks estimated" },
            { label: "Coverage Rate", value: "73% by segment" }
          ]
        },
        recommendations: [
          "Develop 23 new content assets for high-priority gaps",
          "Retire 15 outdated assets",
          "Update 31 existing assets with new clinical data",
          "Fast-track MLR for 8 critical assets",
          "Focus on formulary barrier content first"
        ],
        impact: [
          { metric: "Content Coverage", change: "+27%" },
          { metric: "Quality Score", change: "+1.2 pts" },
          { metric: "MLR Approval Time", change: "-2 weeks" },
          { metric: "Asset Efficiency", change: "+35%" }
        ]
      }}
      visualizationComponent={ContentPlanningVisualization}
    />
  );
}