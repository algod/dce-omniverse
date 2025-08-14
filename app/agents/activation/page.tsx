'use client';

import { Zap } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';

export default function DigitalActivationAgent() {
  return (
    <StandardAgentViewLight
      agentId="activation"
      agentName="Digital Activation Agent"
      agentIcon={Zap}
      agentColor="from-green-600 to-green-700"
      overview={{
        position: "Sixth in flow - Campaign Execution. Receives journey plans from Orchestration and activates recommendations through execution vendors.",
        purpose: "Activates the recommendations from orchestration engine to execution vendors through the AgentVerse ecosystem.",
        reasoning: [
          "Translates journey plans into executable campaigns",
          "Integrates with execution vendor APIs",
          "Coordinates multi-channel activation",
          "Monitors campaign performance",
          "Adjusts execution based on real-time feedback"
        ],
        tools: [
          "Vendor Integration Hub",
          "Campaign Activation Engine",
          "AgentVerse Connector",
          "Performance Monitor",
          "Real-time Optimizer",
          "Execution Dashboard"
        ],
        actions: [
          "Activating campaigns across 6 channels",
          "Syncing with vendor platforms",
          "Monitoring execution status",
          "Tracking performance metrics",
          "Optimizing in real-time"
        ],
        keyMetrics: [
          { label: "Active Campaigns", value: "42" },
          { label: "Channels Active", value: "6" },
          { label: "Vendors Integrated", value: "8" },
          { label: "Success Rate", value: "94%" },
          { label: "Response Time", value: "1.2s" },
          { label: "Coverage", value: "98%" }
        ]
      }}
      businessInputs={{
        upstream: {
          source: "Orchestration Agent",
          data: [
            { label: "Journey Plans", value: "2,847 personalized" },
            { label: "Content Assets", value: "156 approved" },
            { label: "Timing Sequences", value: "Optimized" },
            { label: "Channel Mix", value: "Personalized" },
            { label: "NBA Recommendations", value: "8,541 actions" }
          ]
        },
        parameters: [
          {
            name: "Activation Mode",
            type: "select",
            value: "Automated",
            options: ["Automated", "Semi-Automated", "Manual Review", "Test Mode"]
          },
          {
            name: "Vendor Priority",
            type: "select",
            value: "Performance-Based",
            options: ["Performance-Based", "Cost-Based", "Round-Robin", "Custom"]
          },
          {
            name: "Real-time Optimization",
            type: "toggle",
            value: true
          },
          {
            name: "Failure Threshold",
            type: "slider",
            value: 5,
            min: 1,
            max: 20
          },
          {
            name: "Batch Size",
            type: "number",
            value: 100
          }
        ],
        constraints: [
          "Vendor API rate limits apply",
          "Maximum 10,000 activations per hour",
          "Compliance review required for certain content",
          "Budget caps per vendor",
          "Geographic restrictions for some channels"
        ]
      }}
      analytics={{
        models: [
          {
            name: "Vendor Selection Model",
            description: "ML model for optimal vendor selection based on performance history",
            accuracy: 91
          },
          {
            name: "Timing Optimization",
            description: "Predictive model for optimal activation timing",
            accuracy: 88
          }
        ],
        algorithms: [
          "Vendor Routing Algorithm",
          "Load Balancing",
          "Performance Tracking",
          "Error Recovery",
          "Real-time Optimization"
        ],
        reasoning: {
          steps: [
            {
              step: "Journey Reception",
              description: "Receive optimized customer journeys from Orchestration"
            },
            {
              step: "Vendor Mapping",
              description: "Map channels to appropriate execution vendors"
            },
            {
              step: "Campaign Creation",
              description: "Transform journeys into vendor-specific campaigns"
            },
            {
              step: "Activation",
              description: "Execute campaigns through vendor APIs"
            },
            {
              step: "Monitoring",
              description: "Track execution status and performance metrics"
            }
          ]
        },
        visualizations: (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-4">AgentVerse Activation Dashboard</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-600">42</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-600">1.2s</p>
              </div>
            </div>
          </div>
        )
      }}
      outputs={{
        downstream: {
          destination: "Field Copilot Agent",
          data: [
            { label: "Active Campaigns", value: "42 running" },
            { label: "Field Actions", value: "156 scheduled" },
            { label: "Performance Data", value: "Real-time" },
            { label: "Next Best Actions", value: "Updated hourly" },
            { label: "Success Metrics", value: "94% completion" }
          ]
        },
        recommendations: [
          "Prioritize high-performing vendors for critical campaigns",
          "Implement fallback vendors for redundancy",
          "Optimize batch sizes based on vendor capacity",
          "Monitor and adjust timing for maximum engagement",
          "Regularly review vendor performance metrics"
        ],
        impact: [
          { metric: "Campaign Velocity", change: "+45%" },
          { metric: "Execution Success", change: "+28%" },
          { metric: "Cost Efficiency", change: "+22%" },
          { metric: "Time to Market", change: "-35%" }
        ]
      }}
    />
  );
}