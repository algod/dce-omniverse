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
        let streamingMessage: Message = {
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

  // Get personalized welcome message for each agent
  const getWelcomeMessage = (agentId: string, agentName: string): string => {
    const welcomeMessages: Record<string, string> = {
      'customer': `Hello! I'm Dr. Sarah Chen, your Customer Planning Agent. I'm here to help you with HCP barrier analysis, opportunity scoring, and strategic customer prioritization. I have deep insights into our 2,847 HCPs across therapeutic areas. What would you like to explore?`,
      
      'budget': `Hi there! I'm Michael Rodriguez, your Budget Planning Agent. I specialize in ROI optimization across our $47M promotional budget and multi-channel attribution modeling. I can help you maximize returns and allocate spend strategically. What budget questions can I assist with?`,
      
      'content': `Greetings! I'm Jennifer Park, your Content Review Agent. I manage our 1,247 promotional materials with 96% MLR first-pass approval rates. I can help with compliance reviews, content-barrier mapping, and regulatory guidance. How can I support your content needs?`,
      
      'orchestration': `Welcome! I'm Dr. Alex Kim, your AI Orchestration Agent. I optimize customer journeys for 2,847 HCPs using advanced ML models and provide Next Best Action recommendations with 87% accuracy. What customer journey challenges shall we tackle?`,
      
      'suggestions': `Hello! I'm Maria Gonzalez, your Field Suggestion Design Agent. I create intelligent field guidance for 245 reps with 73% suggestion effectiveness rates. I can help optimize triggers, analyze feedback, and improve field performance. What field challenges can I help solve?`,
      
      'copilot': `Hey there! I'm David Thompson, your Field Copilot Agent. With 15 years of pharma sales experience, I provide call preparation, territory insights, and coaching support to 245 reps. Ready to enhance your field performance? What can I help you with?`
    };
    
    return welcomeMessages[agentId] || `Hello! I'm the ${agentName}. I'm here to help you with pharmaceutical insights and analysis. What would you like to explore?`;
  };

  return (
    <div className="flex flex-col h-full rounded-lg" style={{
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: message.role === 'user' ? zsColors.neutral.offWhite : zsColors.neutral.white,
                    color: zsColors.neutral.charcoal,
                    ...(message.role === 'agent' && {
                      border: `1px solid ${zsColors.neutral.lightGray}`,
                      ...(message.isFallback && {
                        borderColor: zsColors.accent.orange,
                        backgroundColor: '#FFF7ED'
                      })
                    })
                  }}
                >
                  <div className="flex items-start gap-2">
                    <p className="text-sm whitespace-pre-wrap flex-1">{message.content}</p>
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
                <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
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
            className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ 
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              color: zsColors.neutral.charcoal
            }}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
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