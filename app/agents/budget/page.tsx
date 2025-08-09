'use client';

import { TrendingUp } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { BudgetPlanningVisualization } from '@/components/agents/BudgetPlanningVisualization';

export default function BudgetPlanningAgent() {
  return (
    <StandardAgentViewLight
      agentId="budget"
      agentName="Budget Planning Agent"
      agentIcon={TrendingUp}
      agentColor="from-blue-600 to-blue-700"
      overview={{
        position: "Second in flow - Resource Allocation. Receives prioritized HCP data from Customer Planning and determines optimal budget allocation across channels.",
        purpose: "Optimize budget allocation across promotional channels with ROI maximization. Uses impact attribution analysis and response curves to find the optimal channel mix for maximum impact.",
        reasoning: [
          "Analyzes historical response curves for each channel",
          "Detects channel saturation points and diminishing returns",
          "Optimizes budget allocation with business constraints",
          "Calculates ROI and mROI for each scenario",
          "Breaks down to quarterly HCP-level engagement plans"
        ],
        tools: [
          "Channel Response Modeler",
          "ROI Optimization Engine",
          "Budget Allocation Simulator",
          "Performance Attribution System",
          "Saturation Analysis Tool",
          "What-If Scenario Planner"
        ],
        actions: [
          "Optimizing $15M budget across 6 channels",
          "Calculating marginal ROI for each channel",
          "Finding optimal allocation mix",
          "Running saturation analysis",
          "Generating quarterly plans"
        ],
        keyMetrics: [
          { label: "Total Budget", value: "$15M" },
          { label: "Expected ROI", value: "3.2x" },
          { label: "Channels", value: "6" },
          { label: "Optimization", value: "92%" },
          { label: "Saturation", value: "18%" },
          { label: "Efficiency", value: "87%" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Customer Planning Agent",
          data: [
            { label: "Prioritized HCPs", value: "423 high-opportunity" },
            { label: "Total Opportunity", value: "$45M" },
            { label: "Barrier Distribution", value: "Formulary 38%, Referral 27%" },
            { label: "Channel Preferences", value: "Field 62%, Digital 38%" }
          ]
        },
        parameters: [
          {
            name: "Total Budget",
            type: "slider",
            value: 15000000,
            min: 5000000,
            max: 30000000
          },
          {
            name: "Field Force Allocation (%)",
            type: "slider",
            value: 40,
            min: 20,
            max: 60
          },
          {
            name: "Digital Allocation (%)",
            type: "slider",
            value: 25,
            min: 10,
            max: 40
          },
          {
            name: "Email Allocation (%)",
            type: "slider",
            value: 15,
            min: 5,
            max: 25
          },
          {
            name: "Conference Allocation (%)",
            type: "slider",
            value: 10,
            min: 5,
            max: 20
          },
          {
            name: "Speaker Programs (%)",
            type: "slider",
            value: 10,
            min: 5,
            max: 20
          },
          {
            name: "Optimization Goal",
            type: "select",
            value: "Maximum ROI",
            options: ["Maximum ROI", "Maximum Reach", "Balanced Approach", "Quick Wins"]
          },
          {
            name: "Include Saturation Constraints",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "Channel allocations must sum to 100%",
          "Minimum $1M per active channel",
          "Field force capacity: 5,000 calls/quarter",
          "Digital reach limit: 2,000 HCPs",
          "Conference budget cap: $3M"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Response Curve Model",
            description: "Non-linear regression model for channel response curves based on 3 years of data",
            accuracy: 91
          },
          {
            name: "Attribution Model",
            description: "Multi-touch attribution using Shapley values to assign credit across channels",
            accuracy: 88
          },
          {
            name: "Optimization Algorithm",
            description: "Genetic algorithm for budget optimization with constraint satisfaction",
            accuracy: 93
          }
        ],
        algorithms: [
          "Non-linear Regression",
          "Genetic Algorithm",
          "Shapley Value Attribution",
          "Monte Carlo Simulation",
          "Gradient Descent"
        ],
        reasoning: {
          steps: [
            {
              step: "Historical Analysis",
              description: "Analyze 3 years of channel performance data to build response curves"
            },
            {
              step: "Saturation Detection",
              description: "Identify diminishing returns points for each channel"
            },
            {
              step: "Constraint Application",
              description: "Apply business rules and capacity constraints"
            },
            {
              step: "Optimization Run",
              description: "Execute genetic algorithm to find optimal allocation"
            },
            {
              step: "ROI Calculation",
              description: "Calculate expected ROI and mROI for recommended allocation"
            },
            {
              step: "Plan Generation",
              description: "Break down annual budget into quarterly HCP-level plans"
            }
          ]
        },
        visualizations: <BudgetPlanningVisualization />
      }}
      outputs={{
        downstream: {
          destination: "Content Review Agent",
          data: [
            { label: "Field Budget", value: "$6M (40%)" },
            { label: "Digital Budget", value: "$3.75M (25%)" },
            { label: "Email Budget", value: "$2.25M (15%)" },
            { label: "Expected ROI", value: "3.2x overall" },
            { label: "Content Needs", value: "147 assets required" }
          ]
        },
        recommendations: [
          "Allocate 40% to field force for high-touch HCP engagement",
          "Increase digital spend by 15% to capture medium-opportunity HCPs",
          "Reduce conference allocation due to saturation",
          "Implement quarterly rebalancing based on performance",
          "Create channel-specific content for optimal engagement"
        ],
        impact: [
          { metric: "ROI", change: "+3.2x" },
          { metric: "HCP Reach", change: "+45%" },
          { metric: "Cost Efficiency", change: "+28%" },
          { metric: "Channel Saturation", change: "-15%" }
        ]
      }}
    />
  );
}