'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { CustomerPlanningInteractive } from '@/components/agents/CustomerPlanningInteractive';
import { CustomerPlanningWorkflow } from '@/components/agents/CustomerPlanningWorkflow';
import { customerPriorityWorkflow, executeWorkflowStep } from '@/lib/workflows/customer-priority-workflow';
import { useAgentDataFlow } from '@/lib/contexts/AgentDataContext';
import { DownstreamImpactPreview } from '@/components/agent-verse/DownstreamImpactPreview';
import { motion } from 'framer-motion';

export default function CustomerPlanningAgent() {
  const [workflowMode, setWorkflowMode] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(customerPriorityWorkflow);
  const [brandContext] = useState({
    therapeutic_area: 'Oncology',
    brand_name: 'BrandX',
    objectives: ['Increase market share', 'Improve HCP engagement', 'Optimize resource allocation']
  });
  
  // Data flow integration
  const { currentData, upstreamData, updateData, dataAvailable, previewDownstreamImpact } = useAgentDataFlow('customer');
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  const handleStartWorkflow = () => {
    setWorkflowMode(true);
    // Start the workflow from the first customer planning module
    const updated = executeWorkflowStep(activeWorkflow, 1);
    setActiveWorkflow(updated);
    
    // Prepare changes for preview
    const changes = {
      prioritizedHCPs: 423,
      microsegments: ['Champions', 'Growers', 'Converters', 'Maintainers', 'Defenders'],
      totalOpportunity: '$45M',
      barriers: {
        'Formulary': 38,
        'Referral Pathways': 27,
        'Side Effects': 20,
        'Insurance': 10,
        'Diagnostic': 5
      },
      channelPreferences: {
        'Field': 62,
        'Digital': 38
      }
    };
    
    setPendingChanges(changes);
    
    // Update data flow when workflow completes
    updateData(changes);
  };

  if (workflowMode) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#F5F5F5' }}>
        <CustomerPlanningWorkflow
          workflow={activeWorkflow}
          onWorkflowUpdate={setActiveWorkflow}
          brandContext={brandContext}
        />
        {pendingChanges && (
          <DownstreamImpactPreview
            sourceAgent="Customer Planning"
            changes={pendingChanges}
            impacts={previewDownstreamImpact(pendingChanges)}
            onConfirm={() => {
              updateData(pendingChanges);
              setPendingChanges(null);
            }}
            onCancel={() => setPendingChanges(null)}
          />
        )}
      </div>
    );
  }

  return (
    <StandardAgentViewLight
      agentId="customer"
      agentName="Customer Planning Agent"
      agentIcon={Users}
      agentColor="from-blue-900 to-blue-800"
      overview={{
        position: "Start of flow - Intelligence Gathering. This is the first agent in the DCE OmniVerse flow, responsible for analyzing customer data and identifying opportunities.",
        purpose: "Prioritize high-opportunity HCPs using barrier analysis to identify and resolve the 5 primary barriers preventing HCP adoption. This agent analyzes secondary data and field feedback to create targeted engagement strategies.",
        reasoning: [
          "Analyzes 5 primary barriers affecting HCP prescribing behavior",
          "Predicts sales depth and breadth opportunities using ML models",
          "Segments HCPs based on opportunity scores and barrier profiles",
          "Generates 'The Play' framework for barrier-specific engagement"
        ],
        tools: [
          "HCP Segmentation Engine",
          "Barrier Analysis Toolkit",
          "Prescribing Data Processor",
          "Opportunity Scoring Calculator",
          "Referral Network Analyzer",
          "Field Feedback Integrator"
        ],
        actions: [
          "Analyzing 2,847 HCPs across territories",
          "Identifying and scoring barriers for each HCP",
          "Calculating opportunity scores (depth vs breadth)",
          "Prioritizing customers for field/digital promotion",
          "Generating engagement recommendations"
        ],
        keyMetrics: [
          { label: "Total HCPs", value: "2,847" },
          { label: "High Opportunity", value: "423" },
          { label: "Barriers Identified", value: "5" },
          { label: "Avg Opportunity", value: "$185K" },
          { label: "Coverage", value: "87%" },
          { label: "Confidence", value: "92%" }
        ]
      }}
      businessInputs={{
        parameters: [
          {
            name: "Barrier Weight - Referral Pathway (B001)",
            type: "slider",
            value: 25,
            min: 0,
            max: 100
          },
          {
            name: "Barrier Weight - Side Effects (B002)",
            type: "slider",
            value: 20,
            min: 0,
            max: 100
          },
          {
            name: "Barrier Weight - Insurance (B003)",
            type: "slider",
            value: 20,
            min: 0,
            max: 100
          },
          {
            name: "Barrier Weight - Formulary (B004)",
            type: "slider",
            value: 20,
            min: 0,
            max: 100
          },
          {
            name: "Barrier Weight - Diagnostic (B005)",
            type: "slider",
            value: 15,
            min: 0,
            max: 100
          },
          {
            name: "Opportunity Threshold",
            type: "select",
            value: "High",
            options: ["Very High", "High", "Medium", "Low"]
          },
          {
            name: "Include Digital-Only HCPs",
            type: "toggle",
            value: true
          },
          {
            name: "Minimum Prescribing Volume",
            type: "number",
            value: 10
          }
        ],
        constraints: [
          "Barrier weights must sum to 100%",
          "Minimum 500 HCPs must be prioritized",
          "Field force capacity: 200 calls/month",
          "Digital engagement limit: 1,000 HCPs/month",
          "Must align with brand strategy priorities"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Barrier Prediction Model",
            description: "Random Forest model trained on 24 months of prescribing data to predict barrier presence",
            accuracy: 89
          },
          {
            name: "Opportunity Scoring Model",
            description: "Gradient Boosting model for calculating depth vs breadth opportunities",
            accuracy: 87
          },
          {
            name: "Segmentation Algorithm",
            description: "K-means clustering for HCP segmentation based on behavior patterns",
            accuracy: 85
          }
        ],
        algorithms: [
          "Random Forest",
          "Gradient Boosting",
          "K-means Clustering",
          "Collaborative Filtering",
          "Time Series Analysis"
        ],
        reasoning: {
          steps: [
            {
              step: "Data Collection",
              description: "Gather HCP prescribing data, patient claims, referral networks, and field feedback"
            },
            {
              step: "Barrier Detection",
              description: "Apply ML models to identify which of the 5 barriers affect each HCP"
            },
            {
              step: "Opportunity Calculation",
              description: "Calculate potential revenue opportunity for depth (current patients) and breadth (new patients)"
            },
            {
              step: "Prioritization",
              description: "Rank HCPs by opportunity score weighted by barrier resolution probability"
            },
            {
              step: "Engagement Planning",
              description: "Generate specific engagement recommendations based on barrier profiles"
            }
          ]
        },
        visualizations: <CustomerPlanningInteractive onStartWorkflow={handleStartWorkflow} />
      }}
      outputs={{
        downstream: {
          destination: "Budget Planning Agent",
          data: [
            { label: "Prioritized HCPs", value: "423 high-opportunity" },
            { label: "Total Opportunity", value: "$45M potential" },
            { label: "Primary Barriers", value: "Formulary (38%), Referral (27%)" },
            { label: "Channel Preferences", value: "Field (62%), Digital (38%)" },
            { label: "Engagement Frequency", value: "2.3 touches/month avg" }
          ]
        },
        recommendations: [
          "Focus field force on 423 high-opportunity HCPs with formulary barriers",
          "Deploy digital campaigns for 1,245 medium-opportunity HCPs",
          "Create barrier-specific content for top 3 barriers",
          "Increase speaker programs in territories with referral pathway barriers",
          "Monitor and adjust barrier weights monthly based on outcomes"
        ],
        impact: [
          { metric: "Revenue Potential", change: "+$45M" },
          { metric: "HCP Engagement", change: "+32%" },
          { metric: "Barrier Resolution", change: "+28%" },
          { metric: "ROI Improvement", change: "+3.2x" }
        ]
      }}
    />
  );
}