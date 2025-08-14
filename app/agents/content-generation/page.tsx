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
        fromUpstream: [
          "Content gap analysis from Content Planning",
          "Message theme priorities by segment",
          "Channel-specific requirements",
          "Timeline constraints for development"
        ],
        userInputs: [
          "Content templates and guidelines",
          "Brand voice and tone specifications",
          "Clinical data and references",
          "Visual asset requirements"
        ],
        businessRules: [
          "Each blueprint generates 3-5 content variants",
          "All content must include ISI and safety information",
          "Digital assets require responsive design",
          "Content must be tagged for Veeva PromoMats"
        ]
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