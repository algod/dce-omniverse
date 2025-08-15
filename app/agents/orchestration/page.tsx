'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Brain } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { OrchestrationVisualization } from '@/components/agents/OrchestrationVisualization';
import { OrchestrationWorkflow } from '@/components/agents/workflows/OrchestrationWorkflow';
import { aiOrchestrationWorkflow } from '@/lib/workflows/ai-orchestration-workflow';
import { executeWorkflowStep } from '@/lib/workflows/workflow-utils';

function OrchestrationAgentContent() {
  const searchParams = useSearchParams();
  const [workflowMode, setWorkflowMode] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(aiOrchestrationWorkflow);
  const [brandContext] = useState({
    therapeutic_area: 'Oncology',
    brand_name: 'BrandX'
  });
  
  useEffect(() => {
    if (searchParams.get('workflow') === 'active') {
      setWorkflowMode(true);
      const updated = executeWorkflowStep(activeWorkflow, 1);
      setActiveWorkflow(updated);
    }
  }, [searchParams]);

  const handleStartWorkflow = () => {
    setWorkflowMode(true);
    const updated = executeWorkflowStep(activeWorkflow, 1);
    setActiveWorkflow(updated);
  };

  if (workflowMode) {
    return <OrchestrationWorkflow brandContext={brandContext} />;
  }

  return (
    <StandardAgentViewLight
      agentId="orchestration"
      agentName="AI Orchestration Agent"
      agentIcon={Brain}
      agentColor="from-orange-500 to-orange-600"
      overview={{
        position: "Fourth in flow - Journey Optimization. Receives approved content from Content Review Agent and generates optimal customer journeys with Next Best Action recommendations.",
        purpose: "Customer journey optimization and Next Best Action recommendations using BERT model for behavior prediction and genetic algorithms for sequence optimization. Creates explainable AI recommendations for field execution.",
        reasoning: [
          "Trains BERT model on customer behavior patterns",
          "Uses genetic algorithms for journey sequence optimization",
          "Performs automated feature engineering",
          "Calculates SHAP values for explainability",
          "Generates confidence scores for all recommendations"
        ],
        tools: [
          "BERT Model Training Platform",
          "Journey Optimization Engine",
          "NBA Recommendation System",
          "Explainability Framework",
          "Feature Engineering Pipeline",
          "Model Performance Monitor"
        ],
        actions: [
          "Training on 125K customer samples",
          "Optimizing 250 customer journeys",
          "Generating NBA recommendations",
          "Calculating feature importance",
          "Creating explainable insights"
        ],
        keyMetrics: [
          { label: "Model Accuracy", value: "89.2%" },
          { label: "Active Journeys", value: "250" },
          { label: "NBA Generated", value: "423" },
          { label: "Avg Confidence", value: "87%" },
          { label: "F1 Score", value: "0.89" },
          { label: "Processing Time", value: "1.2s" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Content Review Agent",
          data: [
            { label: "Approved Content", value: "147 MLR-approved assets" },
            { label: "Content-Barrier Map", value: "Complete coverage" },
            { label: "Gap Analysis", value: "12 gaps identified" },
            { label: "Channel Assets", value: "6 channels mapped" }
          ]
        },
        parameters: [
          {
            name: "Model Training Frequency",
            type: "select",
            value: "Weekly",
            options: ["Daily", "Weekly", "Bi-weekly", "Monthly"]
          },
          {
            name: "Journey Complexity",
            type: "select",
            value: "Optimized",
            options: ["Simple", "Standard", "Optimized", "Advanced"]
          },
          {
            name: "Feature Engineering Depth",
            type: "slider",
            value: 3,
            min: 1,
            max: 5
          },
          {
            name: "Confidence Threshold (%)",
            type: "slider",
            value: 75,
            min: 60,
            max: 95
          },
          {
            name: "Max Journey Steps",
            type: "select",
            value: "7",
            options: ["5", "7", "10", "15"]
          },
          {
            name: "Include Cross-Channel",
            type: "toggle",
            value: true
          },
          {
            name: "Explainability Mode",
            type: "select",
            value: "SHAP",
            options: ["SHAP", "LIME", "Both", "None"]
          },
          {
            name: "Real-time Updates",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "Model retraining requires minimum 10K new samples",
          "Journey steps cannot exceed channel budget limits",
          "NBA recommendations must have >70% confidence",
          "Explainability required for all high-impact decisions",
          "Cross-channel journeys need content availability check"
        ]
      }}
      analytics={{
        models: [
          {
            name: "BERT Behavior Model",
            description: "Transformer-based model for predicting HCP behavior patterns and engagement likelihood",
            accuracy: 89.2
          },
          {
            name: "Genetic Algorithm Optimizer",
            description: "Evolutionary algorithm for finding optimal journey sequences across channels",
            accuracy: 91.5
          },
          {
            name: "SHAP Explainability Engine",
            description: "Provides interpretable explanations for all NBA recommendations",
            accuracy: 94
          }
        ],
        algorithms: [
          "BERT Architecture",
          "Genetic Algorithms",
          "SHAP Values",
          "Feature Engineering",
          "Ensemble Methods",
          "Reinforcement Learning"
        ],
        reasoning: {
          steps: [
            {
              step: "Data Preparation",
              description: "Aggregate content, budget, and customer data from upstream agents"
            },
            {
              step: "Feature Engineering",
              description: "Create derived features including interaction patterns and temporal signals"
            },
            {
              step: "Model Training",
              description: "Train BERT model on historical engagement data with transfer learning"
            },
            {
              step: "Journey Optimization",
              description: "Apply genetic algorithm to find optimal multi-channel sequences"
            },
            {
              step: "NBA Generation",
              description: "Generate ranked Next Best Actions with confidence scores"
            },
            {
              step: "Explainability Analysis",
              description: "Calculate SHAP values to explain recommendations"
            }
          ]
        },
        visualizations: <OrchestrationVisualization onStartWorkflow={handleStartWorkflow} />
      }}
      outputs={{
        downstream: {
          destination: "Field Suggestions Agent",
          data: [
            { label: "Optimized Journeys", value: "250 active paths" },
            { label: "NBA Recommendations", value: "423 actions" },
            { label: "Model Predictions", value: "89% confidence avg" },
            { label: "Sequence Rankings", value: "Top 5 per HCP" },
            { label: "Feature Importance", value: "6 key drivers" }
          ]
        },
        recommendations: [
          "Deploy Email → Field → Speaker sequence for formulary barriers",
          "Prioritize digital touchpoints for awareness stage HCPs",
          "Implement 3-touch journey for high-opportunity targets",
          "Use peer discussions for referral pathway barriers",
          "Schedule re-engagement for stalled conversions"
        ],
        impact: [
          { metric: "Conversion Rate", change: "+33%" },
          { metric: "Journey Efficiency", change: "+45%" },
          { metric: "Model Accuracy", change: "+12%" },
          { metric: "Time to Action", change: "-28%" }
        ]
      }}
    />
  );
}

export default function OrchestrationAgent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrchestrationAgentContent />
    </Suspense>
  );
}