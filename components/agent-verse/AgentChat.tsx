'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RotateCw, HelpCircle, Settings, Zap } from 'lucide-react';
import Button from '@/components/design-system/Button';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AGENT_CONTEXTS } from '@/lib/ai/system-prompts';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isFallback?: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface AgentChatProps {
  agentId: string;
  agentName: string;
  agentColor: string;
  onSendMessage?: (message: string) => Promise<string>;
  onRerun?: (params: any) => void;
  contextData?: any; // Data from visualization panels
  suggestedQueries?: string[];
  parameters?: {
    label: string;
    key: string;
    type: 'text' | 'number' | 'select' | 'slider';
    value: any;
    options?: any[];
    min?: number;
    max?: number;
    step?: number;
  }[];
}

export function AgentChat({
  agentId,
  agentName,
  agentColor,
  onSendMessage,
  onRerun,
  contextData,
  suggestedQueries = [],
  parameters = []
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [params, setParams] = useState<any>({});
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [awaitingUserInput, setAwaitingUserInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize parameters
    const initialParams: any = {};
    parameters.forEach(param => {
      initialParams[param.key] = param.value;
    });
    setParams(initialParams);
  }, [parameters]);

  useEffect(() => {
    // Initialize chat with agent-specific welcome message and quick actions
    const initializeChat = async () => {
      try {
        const response = await fetch(`/api/agents/chat/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setQuickActions(data.quickActions || []);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }

      // Set personalized welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'agent',
        content: getWelcomeMessage(agentId, agentName),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    };

    initializeChat();
  }, [agentId, agentName]);

  const handleSend = useCallback(async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Use new AI-powered agent endpoint with streaming
      const response = await fetch(`/api/agents/chat/${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory,
          contextData,
          stream: true
        })
      });

      if (response.ok) {
        // Handle streaming response
        const agentMessageId = (Date.now() + 1).toString();
        const streamingMessage: Message = {
          id: agentMessageId,
          role: 'agent',
          content: '',
          timestamp: new Date(),
          isStreaming: true
        };

        setMessages(prev => [...prev, streamingMessage]);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.chunk) {
                accumulatedContent += data.chunk;
                setMessages(prev => prev.map(msg => 
                  msg.id === agentMessageId 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming chunk:', parseError);
            }
          }
        }

        // Finalize streaming message
        setMessages(prev => prev.map(msg => 
          msg.id === agentMessageId 
            ? { 
                ...msg, 
                isStreaming: false,
                actions: onRerun ? [{
                  label: 'Re-run Analysis',
                  action: () => handleRerun()
                }] : []
              }
            : msg
        ));

        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', parts: [{ text: messageToSend }] },
          { role: 'model', parts: [{ text: accumulatedContent }] }
        ]);
        
        // Generate context-aware clarifying questions
        generateClarifyingQuestions(messageToSend, accumulatedContent);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'I apologize, but I encountered an issue processing your request. Please try again, and I\'ll do my best to assist you.',
        timestamp: new Date(),
        isFallback: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [agentId, input, isProcessing, conversationHistory, contextData, onRerun]);

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const handleRerun = () => {
    if (onRerun) {
      onRerun(params);
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [key]: value }));
  };

  // Get professional welcome message for each agent
  const generateClarifyingQuestions = async (userMessage: string, agentResponse: string) => {
    const currentTab = contextData?.currentTab || 'overview';
    const questions = getContextualQuestions(agentId, userMessage, currentTab);
    setClarifyingQuestions(questions.slice(0, 3)); // Show max 3 questions
    
    // Randomly ask a clarifying question (30% chance)
    if (Math.random() < 0.3 && questions.length > 0) {
      setTimeout(() => {
        askClarifyingQuestion(questions[Math.floor(Math.random() * questions.length)]);
      }, 2000);
    }
  };
  
  const getContextualQuestions = (agentId: string, userMessage: string, currentTab: string): string[] => {
    const baseQuestions: Record<string, Record<string, string[]>> = {
      customer: {
        overview: [
          "Would you like to focus on a specific therapeutic area?",
          "Are there particular barriers you're most concerned about?",
          "What's your current HCP engagement strategy?"
        ],
        inputs: [
          "Should we adjust barrier weights based on recent market changes?",
          "Do you want to include digital-only HCP engagement?",
          "What's your preferred opportunity threshold for this analysis?"
        ],
        analytics: [
          "Would you like to see the model's confidence intervals?",
          "Should we run sensitivity analysis on these parameters?",
          "Do you want to compare against previous quarters?"
        ]
      },
      budget: {
        inputs: [
          "Are there seasonal factors we should consider?",
          "Do you have preferred channels based on past performance?",
          "What's your risk tolerance for budget reallocation?"
        ]
      },
      // Add more agent-specific questions
    };
    
    return baseQuestions[agentId]?.[currentTab] || [];
  };
  
  const askClarifyingQuestion = (question: string) => {
    const clarifyingMessage: Message = {
      id: Date.now().toString(),
      role: 'agent',
      content: `I have a follow-up question to help optimize the analysis: ${question}`,
      timestamp: new Date(),
      actions: [
        {
          label: 'Answer this',
          action: () => setInput(question)
        },
        {
          label: 'Skip for now',
          action: () => setClarifyingQuestions([])
        }
      ]
    };
    
    setMessages(prev => [...prev, clarifyingMessage]);
    setAwaitingUserInput(true);
  };

  const getWelcomeMessage = (agentId: string, agentName: string): string => {
    const welcomeMessages: Record<string, string> = {
      'customer': `Welcome to the Customer Planning Agent. I specialize in HCP barrier analysis, opportunity scoring, and strategic customer prioritization across our 2,847 HCPs. I can help you identify high-value opportunities and develop barrier-specific engagement strategies. What would you like to explore?`,
      
      'budget': `Welcome to the Budget Planning Agent. I focus on ROI optimization across our $47M promotional budget using advanced attribution modeling. I can help you maximize returns through strategic multi-channel allocation and spend efficiency analysis. What budget optimization questions can I assist with?`,
      
      'content': `Welcome to the Content Review Agent. I manage our 1,247 promotional materials with expertise in MLR compliance and 96% first-pass approval rates. I can assist with compliance reviews, content-barrier mapping, and regulatory guidance for pharmaceutical marketing materials. How can I support your content strategy?`,
      
      'orchestration': `Welcome to the AI Orchestration Agent. I specialize in customer journey optimization for 2,847 HCPs using advanced ML models and provide Next Best Action recommendations with 87% prediction accuracy. I can help design personalized engagement sequences that maximize conversion potential. What customer journey challenges shall we address?`,
      
      'suggestions': `Welcome to the Field Suggestion Design Agent. I create intelligent field guidance systems for 245 sales representatives with 73% suggestion adoption rates. I can help optimize trigger configurations, analyze field feedback patterns, and improve suggestion effectiveness across territories. What field optimization challenges can I help solve?`,
      
      'copilot': `Welcome to the Field Copilot Agent. I provide comprehensive field support including call preparation, territory insights, and coaching guidance for pharmaceutical sales teams. I specialize in HCP interaction optimization and performance enhancement across all therapeutic areas. How can I support your field activities today?`
    };
    
    return welcomeMessages[agentId] || `Welcome to the ${agentName}. I'm here to provide professional pharmaceutical insights and analysis. What would you like to explore?`;
  };

  return (
    <div className="flex flex-col h-full min-h-[75vh] rounded-lg" style={{
      backgroundColor: zsColors.neutral.white,
      border: `1px solid ${zsColors.neutral.lightGray}`,
      boxShadow: zsColors.shadows.sm
    }}>
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between"
        style={{ 
          backgroundColor: zsColors.neutral.white,
          borderBottom: `1px solid ${zsColors.neutral.lightGray}`
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: agentColor }}
          >
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: zsColors.neutral.charcoal }}>{agentName}</h3>
            <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Interactive Q&A</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {parameters.length > 0 && (
            <button
              onClick={() => setShowParameters(!showParameters)}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <Settings size={16} style={{ color: zsColors.neutral.gray }} />
            </button>
          )}
          <button className="p-2 rounded-lg transition-colors hover:bg-gray-100">
            <HelpCircle size={16} style={{ color: zsColors.neutral.gray }} />
          </button>
        </div>
      </div>

      {/* Parameters Panel */}
      <AnimatePresence>
        {showParameters && parameters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ borderBottom: `1px solid ${zsColors.neutral.lightGray}` }}
          >
            <div className="p-4" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold" style={{ color: zsColors.neutral.darkGray }}>Analysis Parameters</h4>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<RotateCw size={14} />}
                  onClick={handleRerun}
                >
                  Re-run
                </Button>
              </div>
              <div className="space-y-3">
                {parameters.map(param => (
                  <div key={param.key}>
                    <label className="text-xs mb-1 block" style={{ color: zsColors.neutral.gray }}>
                      {param.label}
                    </label>
                    {param.type === 'slider' ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={params[param.key] || param.value}
                          onChange={(e) => handleParameterChange(param.key, Number(e.target.value))}
                          className="flex-1"
                          style={{ accentColor: agentColor }}
                        />
                        <span className="text-sm font-medium w-12 text-right" style={{ color: zsColors.neutral.darkGray }}>
                          {params[param.key] || param.value}
                        </span>
                      </div>
                    ) : param.type === 'select' ? (
                      <select
                        value={params[param.key] || param.value}
                        onChange={(e) => handleParameterChange(param.key, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: zsColors.neutral.white,
                          border: `1px solid ${zsColors.neutral.lightGray}`,
                          color: zsColors.neutral.charcoal
                        }}
                      >
                        {param.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type}
                        value={params[param.key] || param.value}
                        onChange={(e) => handleParameterChange(param.key, param.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: zsColors.neutral.white,
                          border: `1px solid ${zsColors.neutral.lightGray}`,
                          color: zsColors.neutral.charcoal
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[50vh]" style={{ overflowWrap: 'break-word' }}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: message.role === 'agent' ? agentColor : zsColors.neutral.lightGray,
                  color: message.role === 'agent' ? zsColors.neutral.white : zsColors.neutral.darkGray
                }}
              >
                {message.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div
                  className="px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: message.role === 'user' ? zsColors.neutral.offWhite : zsColors.neutral.white,
                    color: zsColors.neutral.charcoal,
                    ...(message.role === 'agent' && {
                      border: `1px solid ${zsColors.neutral.lightGray}`,
                      boxShadow: zsColors.shadows.sm,
                      ...(message.isFallback && {
                        borderColor: zsColors.secondary.orange,
                        backgroundColor: '#FFF7ED'
                      })
                    })
                  }}
                >
                  <div className="flex items-start gap-2">
                    <p className="text-sm whitespace-pre-wrap flex-1" style={{ wordBreak: 'break-word', lineHeight: '1.5' }}>{message.content}</p>
                    {message.isStreaming && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex-shrink-0 mt-1"
                      >
                        <Sparkles size={14} style={{ color: agentColor }} />
                      </motion.div>
                    )}
                  </div>
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="ghost"
                        onClick={action.action}
                        style={{ color: agentColor }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs mt-2" style={{ color: zsColors.neutral.gray }}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: agentColor }}
              >
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg" style={{
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}>
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: zsColors.neutral.gray }}
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: zsColors.neutral.gray }}
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: zsColors.neutral.gray }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Suggested Queries */}
      {(quickActions.length > 0 || suggestedQueries.length > 0) && (
        <div className="px-4 py-3" style={{
          borderTop: `1px solid ${zsColors.neutral.lightGray}`,
          backgroundColor: zsColors.neutral.offWhite
        }}>
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} style={{ color: agentColor }} />
                <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>Quick Actions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 text-xs rounded-lg transition-all duration-200 hover:shadow-sm"
                    style={{
                      backgroundColor: agentColor,
                      color: zsColors.neutral.white,
                      opacity: isProcessing ? 0.5 : 1
                    }}
                    disabled={isProcessing}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Queries */}
          {suggestedQueries.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: zsColors.neutral.gray }} />
                <span className="text-xs" style={{ color: zsColors.neutral.gray }}>Sample Questions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(query)}
                    className="px-3 py-1 text-xs rounded-full transition-colors hover:bg-white"
                    style={{
                      backgroundColor: zsColors.neutral.white,
                      border: `1px solid ${zsColors.neutral.lightGray}`,
                      color: zsColors.neutral.darkGray
                    }}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="p-4" style={{ borderTop: `1px solid ${zsColors.neutral.lightGray}` }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or request an action..."
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              color: zsColors.neutral.charcoal
            }}
            disabled={isProcessing}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            icon={<Send size={16} />}
            style={{ 
              backgroundColor: agentColor,
              color: zsColors.neutral.white
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}