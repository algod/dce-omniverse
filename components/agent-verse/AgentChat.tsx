'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RotateCw, HelpCircle, Settings } from 'lucide-react';
import Button from '@/components/design-system/Button';
import { colors } from '@/lib/design-system/colors';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface AgentChatProps {
  agentId: string;
  agentName: string;
  agentColor: string;
  onSendMessage: (message: string) => Promise<string>;
  onRerun?: (params: any) => void;
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
  suggestedQueries = [],
  parameters = []
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: `Hello! I'm the ${agentName} agent. I can help you analyze data, answer questions, and adjust parameters. What would you like to explore?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [params, setParams] = useState<any>({});
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

    try {
      const response = await onSendMessage(input);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        actions: onRerun ? [
          {
            label: 'Re-run Analysis',
            action: () => handleRerun()
          }
        ] : []
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleRerun = () => {
    if (onRerun) {
      onRerun(params);
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div 
        className="px-4 py-3 border-b border-gray-200 flex items-center justify-between"
        style={{ backgroundColor: `${agentColor}08` }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: agentColor }}
          >
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agentName}</h3>
            <p className="text-xs text-gray-600">Interactive Q&A</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {parameters.length > 0 && (
            <button
              onClick={() => setShowParameters(!showParameters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={16} className="text-gray-600" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle size={16} className="text-gray-600" />
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
            className="border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Analysis Parameters</h4>
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
                    <label className="text-xs text-gray-600 mb-1 block">
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
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {params[param.key] || param.value}
                        </span>
                      </div>
                    ) : param.type === 'select' ? (
                      <select
                        value={params[param.key] || param.value}
                        onChange={(e) => handleParameterChange(param.key, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: agentColor }}
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
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: agentColor }}
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
                  backgroundColor: message.role === 'agent' ? agentColor : colors.gray[200],
                  color: message.role === 'agent' ? 'white' : colors.gray[600]
                }}
              >
                {message.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                <p className="text-xs text-gray-500 mt-1">
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
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {suggestedQueries.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">Suggested queries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-gray-400 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or request an action..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ borderColor: agentColor }}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            icon={<Send size={16} />}
            style={{ backgroundColor: agentColor }}
            className="text-white"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}