'use client';

import { Sparkles } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { ContentGenerationVisualization } from '@/components/agents/ContentGenerationVisualization';

export default function ContentGenerationAgent() {
  return (
    <StandardAgentViewLight
      agentId="content-generation"
      agentName="Content Generation Agent"
      agentIcon={Sparkles}
      agentColor="from-indigo-600 to-indigo-700"
      overview={{
        position: "Fifth in flow - Content Creation. Receives content gaps from Content Planning and generates new assets.",
        purpose: "Develops new content assets from blueprint to variants, creating high-quality materials that are likely to pass MLR approval and compliance standards.",
        reasoning: [
          "Translates content gaps into development blueprints",
          "Generates content variants for different segments",
          "Ensures compliance with regulatory guidelines",
          "Optimizes content for channel-specific requirements",
          "Creates derivative content from master assets",
          "Validates content quality before submission"
        ],
        tools: [
          "Content Blueprint Generator",
          "Variant Creation Engine",
          "Compliance Checker",
          "Channel Optimizer",
          "Quality Validation Tool",
          "Asset Tagging System"
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Content Planning Agent",
          data: [
            { label: "Identified Gaps", value: "47 critical assets" },
            { label: "Priority Themes", value: "Efficacy, Safety, Access" },
            { label: "Segment Focus", value: "Champions, Growers priority" },
            { label: "Timeline", value: "5 weeks for development" }
          ]
        },
        parameters: [
          {
            name: "Content Creativity Level",
            type: "slider",
            value: 70,
            min: 50,
            max: 100
          },
          {
            name: "Compliance Strictness (%)",
            type: "slider",
            value: 95,
            min: 80,
            max: 100
          },
          {
            name: "Variants per Blueprint",
            type: "slider",
            value: 4,
            min: 2,
            max: 7
          },
          {
            name: "Quality Target Score",
            type: "slider",
            value: 85,
            min: 70,
            max: 100
          },
          {
            name: "Generation Mode",
            type: "select",
            value: "Balanced",
            options: ["Speed-Optimized", "Quality-Focused", "Balanced", "Compliance-First"]
          },
          {
            name: "Content Tone",
            type: "select",
            value: "Professional-Engaging",
            options: ["Clinical-Formal", "Professional-Engaging", "Educational", "Empathetic"]
          },
          {
            name: "Template Source",
            type: "select",
            value: "Brand Guidelines",
            options: ["Brand Guidelines", "Best Performers", "Competitive Benchmark", "Custom"]
          },
          {
            name: "Include Clinical Data",
            type: "toggle",
            value: true
          },
          {
            name: "Auto-Generate Variants",
            type: "toggle",
            value: true
          },
          {
            name: "Pre-Check Compliance",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "All content must include ISI and safety information",
          "Compliance score must exceed 90% for submission",
          "Maximum 5 variants per blueprint",
          "Development time cannot exceed 6 weeks",
          "Must maintain brand consistency across all assets"
        ]
      }}
      analytics={{
        models: [
          {
            name: "GPT-4 Content Generation Model",
            description: "Advanced language model fine-tuned on pharmaceutical marketing content for compliant generation",
            accuracy: 92
          },
          {
            name: "Compliance Pre-Check Engine",
            description: "ML model that validates content against regulatory guidelines before submission",
            accuracy: 94
          },
          {
            name: "Variant Generation Algorithm",
            description: "Creates segment-specific content variants while maintaining core messaging integrity",
            accuracy: 88
          }
        ],
        algorithms: [
          "GPT-4 Fine-tuning",
          "Compliance Pattern Recognition",
          "Variant Generation",
          "Quality Scoring",
          "Channel Optimization",
          "Template Matching"
        ],
        reasoning: {
          steps: [
            {
              step: "Blueprint Creation",
              description: "Transform content gaps into detailed development blueprints with specifications"
            },
            {
              step: "Content Drafting",
              description: "Generate initial content using GPT-4 model with pharmaceutical fine-tuning"
            },
            {
              step: "Compliance Validation",
              description: "Run pre-check against regulatory guidelines and brand standards"
            },
            {
              step: "Variant Generation",
              description: "Create segment and channel-specific variants from master content"
            },
            {
              step: "Quality Assessment",
              description: "Score content quality across multiple dimensions including accuracy and engagement"
            },
            {
              step: "Asset Preparation",
              description: "Tag and prepare assets for downstream approval and Veeva integration"
            }
          ]
        },
        visualizations: <ContentGenerationVisualization />
      }}
      outputs={{
        toDownstream: [
          "Generated content assets (47 new pieces)",
          "Content variants by segment (142 total)",
          "Asset metadata and tagging",
          "Quality scores for each asset"
        ],
        metrics: [
          "Assets generated: 47 primary, 142 variants",
          "Average quality score: 8.2/10",
          "Compliance pre-check pass rate: 94%",
          "Channel optimization score: 87%"
        ],
        actions: [
          "Generate 23 email templates for Growers segment",
          "Create 15 field materials for Converters",
          "Develop 9 virtual engagement assets",
          "Produce 47 web content pieces for all segments"
        ]
      }}
      visualizationComponent={ContentGenerationVisualization}
    />
  );
}