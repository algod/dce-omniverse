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
        fromUpstream: [
          "Optimized customer journeys from Orchestration",
          "NBA recommendations for each HCP",
          "Content assignments by channel",
          "Timing and sequencing rules"
        ],
        userInputs: [
          "Vendor API credentials",
          "Execution priority rules",
          "Budget caps per vendor",
          "Error handling preferences"
        ],
        businessRules: [
          "Maximum 10,000 activations per hour per vendor",
          "Automatic failover to backup vendors",
          "Real-time performance monitoring",
          "Email notifications for critical issues"
        ]
      }}
      outputs={{
        toDownstream: [
          "Execution status for all campaigns",
          "Performance metrics by vendor",
          "Issue logs and resolution status",
          "Field action schedules"
        ],
        metrics: [
          "Campaigns activated: 42",
          "Success rate: 94%",
          "Average latency: 1.2s",
          "Vendors integrated: 5",
          "Email notifications sent: 127"
        ],
        actions: [
          "Execute 42 campaigns across 5 vendors",
          "Monitor real-time performance",
          "Send completion notifications",
          "Handle 3 critical issues with failover"
        ]
      }}
      visualizationComponent={DigitalActivationVisualization}
    />
  );
}