'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Bot, ArrowRight, Brain, Loader2, Workflow as WorkflowIcon } from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import Link from 'next/link';
import { WorkflowVisualization } from '@/components/WorkflowVisualization';
import { CustomerPlanningWorkflow } from '@/components/agents/CustomerPlanningWorkflow';
import { detectWorkflow, executeWorkflowStep, Workflow } from '@/lib/workflows/customer-priority-workflow';
import { detectContentWorkflow } from '@/lib/workflows/content-approval-workflow';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentRoute?: string;
}

const agentRoutes = {
  customer: {
    name: 'Customer Planning',
    keywords: ['customer', 'hcp', 'barrier', 'priorit', 'segment', 'persona', 'performance', 'potential', 'microsegment'],
    color: zsColors.agents.customer
  },
  engagement: {
    name: 'Engagement Planning',
    keywords: ['budget', 'resource', 'allocation', 'roi', 'marketing', 'mix', 'channel', 'spend', 'engagement'],
    color: zsColors.agents.budget
  },
  'content-planning': {
    name: 'Content Planning',
    keywords: ['content', 'planning', 'gap', 'inventory', 'assessment', 'analysis', 'theme', 'mapping'],
    color: { primary: '#8B5CF6', light: '#A78BFA' }
  },
  'content-generation': {
    name: 'Content Generation',
    keywords: ['generate', 'create', 'asset', 'variant', 'blueprint', 'derivative', 'develop'],
    color: { primary: '#6366F1', light: '#818CF8' }
  },
  'content-approval': {
    name: 'Content Approval',
    keywords: ['mlr', 'approval', 'review', 'veeva', 'compliance', 'approve', 'reject'],
    color: { primary: '#10B981', light: '#34D399' }
  },
  orchestration: {
    name: 'Orchestration',
    keywords: ['journey', 'sequence', 'nba', 'next best', 'path', 'optimize', 'orchestrate'],
    color: zsColors.agents.orchestration
  },
  activation: {
    name: 'Digital Activation',
    keywords: ['activate', 'execute', 'campaign', 'vendor', 'launch', 'deploy', 'digital'],
    color: { primary: '#14B8A6', light: '#5EEAD4' }
  },
  suggestions: {
    name: 'Field Suggestions',
    keywords: ['field', 'suggestion', 'trigger', 'hq', 'recommendation', 'action', 'priority'],
    color: { primary: '#F59E0B', light: '#FBBf24' }
  },
  copilot: {
    name: 'Field Copilot',
    keywords: ['field', 'rep', 'call', 'pre-call', 'coaching', 'schedule', 'email', 'copilot'],
    color: zsColors.agents.copilot
  }
};

export default function OmniAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the Omni Agent, your Master Orchestrator for the DCE OmniVerse. I can execute complex workflows like customer prioritization or content approval. How can I orchestrate your agents today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [showCustomerPlanning, setShowCustomerPlanning] = useState(false);
  const [brandContext, setBrandContext] = useState<any>(null);

  const detectAgentRoute = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    
    for (const [agentId, agent] of Object.entries(agentRoutes)) {
      if (agent.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return agentId;
      }
    }
    
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Check for workflow first
    const workflow = detectWorkflow(input) || detectContentWorkflow(input);
    
    // Extract brand context if it's a customer planning workflow
    if (workflow && workflow.id === 'customer-priority') {
      const extractedContext = {
        therapeutic_area: 'Oncology',
        brand_name: 'BrandX',
        objectives: ['Increase market share', 'Improve HCP engagement', 'Optimize resource allocation']
      };
      setBrandContext(extractedContext);
    }
    
    if (workflow) {
      setActiveWorkflow(workflow);
      
      if (workflow.id === 'customer-priority') {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Perfect! I understand you want to identify priority customers. I'll activate the Customer Planning Agent which will guide you through 5 comprehensive modules:\n\n1. **Persona Analysis** - Barrier inferencing\n2. **Performance Metrics** - Historical KPI analysis\n3. **Potential Prediction** - ML-based opportunity forecasting\n4. **Preference Mapping** - Channel and content affinity\n5. **Microsegmentation** - Strategic prioritization\n\nLet me start the workflow now...`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
        setShowCustomerPlanning(true);
        
        // Start workflow execution
        setTimeout(() => {
          const updatedWorkflow = executeWorkflowStep(workflow, 0);
          setActiveWorkflow(updatedWorkflow);
        }, 1500);
      } else {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Excellent! I've detected the ${workflow.name}. I'll orchestrate all necessary agents to complete this workflow. Let me start by activating the required agents in sequence.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
        
        // Start workflow execution
        setTimeout(() => {
          const updatedWorkflow = executeWorkflowStep(workflow, 0);
          setActiveWorkflow(updatedWorkflow);
        }, 1000);
      }
    } else {
      // Detect which agent to route to
      const route = detectAgentRoute(input);
      setActiveRoute(route);

      // Simulate processing
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: route 
            ? `I understand you need help with ${agentRoutes[route as keyof typeof agentRoutes].name}. I\'m activating that agent now to assist you with your request.`
            : 'I\'m analyzing your request to determine the best agent to help you. Could you provide more details about what you\'re trying to accomplish?',
          timestamp: new Date(),
          agentRoute: route || undefined
        };

        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);

        // Show routing animation
        if (route) {
          setTimeout(() => {
            setActiveRoute(null);
          }, 3000);
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: zsColors.neutral.offWhite }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: zsColors.neutral.lightGray }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #6B46C1, #9F7AEA)',
                  boxShadow: '0 4px 12px rgba(107, 70, 193, 0.3)'
                }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                  Omni Agent
                </h1>
                <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                  Intelligent routing & orchestration across all agents
                </p>
              </div>
            </div>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: zsColors.neutral.white,
                  color: zsColors.neutral.darkGray,
                  border: `1px solid ${zsColors.neutral.lightGray}`
                }}
              >
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Customer Planning Workflow Display */}
        {showCustomerPlanning && activeWorkflow && activeWorkflow.id === 'customer-priority' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <CustomerPlanningWorkflow
              workflow={activeWorkflow}
              onWorkflowUpdate={setActiveWorkflow}
              brandContext={brandContext}
            />
          </motion.div>
        )}
        
        {/* Active Workflow Display for other workflows */}
        {activeWorkflow && activeWorkflow.id !== 'customer-priority' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <WorkflowVisualization 
              workflow={activeWorkflow}
              onStepClick={(step, index) => {
                // Simulate step progression
                const updated = executeWorkflowStep(activeWorkflow, index);
                setActiveWorkflow(updated);
              }}
            />
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg overflow-hidden"
              style={{ backgroundColor: zsColors.neutral.white }}>
              
              {/* Messages */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: 'linear-gradient(135deg, #6B46C1, #9F7AEA)'
                        }}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                      <div className="rounded-lg p-4"
                        style={{
                          backgroundColor: message.role === 'user' 
                            ? zsColors.primary.blue 
                            : zsColors.neutral.offWhite,
                          color: message.role === 'user' 
                            ? 'white' 
                            : zsColors.neutral.charcoal
                        }}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.agentRoute && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 flex items-center gap-2"
                          >
                            <ArrowRight size={16} />
                            <span className="text-xs font-medium">
                              Routing to {agentRoutes[message.agentRoute as keyof typeof agentRoutes].name}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs mt-1 px-2" style={{ color: zsColors.neutral.gray }}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(135deg, #6B46C1, #9F7AEA)'
                      }}>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                      <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                        Analyzing your request...
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4" style={{ borderColor: zsColors.neutral.lightGray }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything about DCE OmniVerse..."
                    className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      borderColor: zsColors.neutral.lightGray,
                      backgroundColor: zsColors.neutral.offWhite
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isProcessing}
                    className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #6B46C1, #9F7AEA)',
                      color: 'white'
                    }}
                  >
                    <Send size={18} />
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Routes Visualization */}
          <div className="space-y-6">
            <div className="rounded-xl p-6"
              style={{ 
                backgroundColor: zsColors.neutral.white,
                boxShadow: zsColors.shadows.md
              }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                Available Agents
              </h3>
              
              <div className="space-y-3">
                {Object.entries(agentRoutes).map(([agentId, agent]) => (
                  <motion.div
                    key={agentId}
                    animate={{
                      scale: activeRoute === agentId ? 1.05 : 1,
                      opacity: activeRoute === agentId ? 1 : (activeRoute ? 0.5 : 1)
                    }}
                    className="rounded-lg p-3 border transition-all"
                    style={{
                      borderColor: activeRoute === agentId 
                        ? agent.color.primary 
                        : zsColors.neutral.lightGray,
                      backgroundColor: activeRoute === agentId 
                        ? `${agent.color.primary}10` 
                        : zsColors.neutral.white
                    }}
                  >
                    <Link href={`/agents/${agentId === 'engagement' ? 'budget' : agentId}`}>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light || agent.color.primary})`
                          }}>
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                            {agent.name}
                          </p>
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                            {agent.keywords.slice(0, 3).join(', ')}...
                          </p>
                        </div>
                        {activeRoute === agentId && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 size={16} style={{ color: agent.color.primary }} />
                          </motion.div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Workflow Examples */}
            <div className="rounded-xl p-6"
              style={{ 
                backgroundColor: zsColors.neutral.white,
                boxShadow: zsColors.shadows.md
              }}>
              <div className="flex items-center gap-2 mb-4">
                <WorkflowIcon size={18} style={{ color: zsColors.primary.blue }} />
                <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                  Workflow Examples
                </h3>
              </div>
              
              <div className="space-y-2">
                {[
                  { query: "Who should be my priority customers?", type: 'workflow' },
                  { query: "Run weekly ops for content approval", type: 'workflow' },
                  { query: "How should I allocate my marketing budget?", type: 'agent' },
                  { query: "Optimize customer journey sequences", type: 'agent' },
                  { query: "Activate campaign across channels", type: 'agent' },
                  { query: "Help me prepare for my next call", type: 'agent' }
                ].map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    onClick={() => setInput(item.query)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                    style={{
                      backgroundColor: zsColors.neutral.offWhite,
                      color: zsColors.neutral.darkGray
                    }}
                  >
                    {item.type === 'workflow' && (
                      <WorkflowIcon size={14} style={{ color: zsColors.primary.blue }} />
                    )}
                    {item.query}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}