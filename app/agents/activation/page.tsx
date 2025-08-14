'use client';

import { Zap } from 'lucide-react';
import { StandardAgentViewLight } from '@/components/agent-verse/StandardAgentViewLight';
import { DigitalActivationVisualization } from '@/components/agents/DigitalActivationVisualization';

export default function DigitalActivationAgent() {
  return (
    <StandardAgentViewLight
      agentId="activation"
      agentName="Digital Activation Agent"
      agentIcon={Zap}
      agentColor="from-green-600 to-green-700"
      overview={{
        position: "Eighth in flow - Campaign Execution. Receives journey plans from Orchestration and activates recommendations through execution vendors.",
        purpose: "Activates the recommendations from orchestration engine by integrating with execution partners such as Salesforce and third-party vendors.",
        reasoning: [
          "Integrates recommendations from orchestration engine",
          "Translates into files for activation with execution partners",
          "Raises issues that require user input",
          "Communicates execution completion via email",
          "Addresses tickets and queries from execution partners",
          "Monitors campaign performance in real-time"
        ],
        tools: [
          "Execution Partner API Hub",
          "File Translation Engine",
          "Issue Detection System",
          "Email Notification Service",
          "Ticket Management System",
          "Performance Monitor"
        ]
      }}
      businessInputs={{
        upstream: {
          source: "AI Orchestration Agent",
          data: [
            { label: "Optimized Journeys", value: "250 active paths" },
            { label: "NBA Actions", value: "423 recommendations" },
            { label: "Content Mapped", value: "147 assets assigned" },
            { label: "Confidence Score", value: "87% average" }
          ]
        },
        parameters: [
          {
            name: "Batch Size per Vendor",
            type: "slider",
            value: 1000,
            min: 100,
            max: 5000
          },
          {
            name: "Retry Limit",
            type: "slider",
            value: 3,
            min: 1,
            max: 5
          },
          {
            name: "API Timeout (seconds)",
            type: "slider",
            value: 30,
            min: 10,
            max: 60
          },
          {
            name: "Error Threshold (%)",
            type: "slider",
            value: 5,
            min: 1,
            max: 10
          },
          {
            name: "Execution Mode",
            type: "select",
            value: "Parallel",
            options: ["Sequential", "Parallel", "Priority-Based", "Load-Balanced"]
          },
          {
            name: "Vendor Priority",
            type: "select",
            value: "Performance-Based",
            options: ["Performance-Based", "Cost-Optimized", "Round-Robin", "Manual"]
          },
          {
            name: "Notification Level",
            type: "select",
            value: "Critical Only",
            options: ["All", "Critical Only", "Errors and Critical", "None"]
          },
          {
            name: "Enable Auto-Failover",
            type: "toggle",
            value: true
          },
          {
            name: "Real-time Monitoring",
            type: "toggle",
            value: true
          },
          {
            name: "Validate Before Send",
            type: "toggle",
            value: true
          }
        ],
        constraints: [
          "Maximum 10,000 activations per hour per vendor",
          "API rate limits must be respected",
          "Budget caps enforced per vendor",
          "Minimum 95% success rate required",
          "Critical issues trigger immediate alerts"
        ]
      }}
      outputs={{
        downstream: {
          destination: "Field Suggestions Agent",
          data: [
            { label: "Campaigns Activated", value: "42 live campaigns" },
            { label: "Success Rate", value: "94% execution" },
            { label: "Vendor Performance", value: "5 integrated" },
            { label: "Average Latency", value: "1.2s response" },
            { label: "Notifications Sent", value: "127 emails" }
          ]
        },
        recommendations: [
          "Execute 42 campaigns across 5 vendors",
          "Monitor real-time performance metrics",
          "Send completion notifications to stakeholders",
          "Handle 3 critical issues with automatic failover",
          "Optimize vendor allocation based on performance"
        ],
        impact: [
          { metric: "Campaign Reach", change: "+42%" },
          { metric: "Execution Speed", change: "+35%" },
          { metric: "Error Rate", change: "-6%" },
          { metric: "Vendor Efficiency", change: "+28%" }
        ]
      }}
      analytics={{
        models: [
          {
            name: "Format Translation Engine",
            description: "Converts orchestration outputs into vendor-specific formats for seamless integration",
            accuracy: 98
          },
          {
            name: "Error Detection Model",
            description: "ML model that predicts and prevents integration failures before they occur",
            accuracy: 91
          },
          {
            name: "Performance Optimization Algorithm",
            description: "Dynamically optimizes vendor selection and load balancing based on real-time performance",
            accuracy: 89
          }
        ],
        algorithms: [
          "Format Translation",
          "API Orchestration",
          "Error Pattern Recognition",
          "Load Balancing",
          "Retry Logic",
          "Performance Monitoring"
        ],
        reasoning: {
          steps: [
            {
              step: "Data Reception",
              description: "Receive journey plans and NBA recommendations from orchestration engine"
            },
            {
              step: "Format Translation",
              description: "Convert recommendations into vendor-specific file formats and API payloads"
            },
            {
              step: "Validation",
              description: "Validate data integrity and check against vendor requirements"
            },
            {
              step: "Vendor Routing",
              description: "Route activations to appropriate vendors based on performance and priority"
            },
            {
              step: "Execution Monitoring",
              description: "Monitor real-time execution status and handle errors with retry logic"
            },
            {
              step: "Notification & Reporting",
              description: "Send completion notifications and compile performance reports for stakeholders"
            }
          ]
        },
        visualizations: <DigitalActivationVisualization />
      }}
      visualizationComponent={DigitalActivationVisualization}
    />
  );
}