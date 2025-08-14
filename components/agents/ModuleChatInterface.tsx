'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, CheckCircle, HelpCircle } from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface Message {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'adjust' | 'approve' | 'explain';
    label: string;
    data?: any;
  }[];
}

interface ModuleChatInterfaceProps {
  moduleId: string;
  moduleName: string;
  moduleColor: { primary: string; light: string };
  onApprove: () => void;
  onAdjust: (data: any) => void;
  initialMessage?: string;
}

export function ModuleChatInterface({
  moduleId,
  moduleName,
  moduleColor,
  onApprove,
  onAdjust,
  initialMessage
}: ModuleChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage || `Starting ${moduleName} analysis. I'll process the data and show you the results in real-time.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSend = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand your question about ${input.toLowerCase()}. Let me adjust the analysis accordingly.`,
        timestamp: new Date(),
        actions: [
          { type: 'adjust', label: 'Apply Changes', data: { query: input } },
          { type: 'explain', label: 'Why this matters', data: { context: input } }
        ]
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleAction = (action: any) => {
    if (action.type === 'approve') {
      onApprove();
    } else if (action.type === 'adjust') {
      onAdjust(action.data);
    } else if (action.type === 'explain') {
      setShowExplanation(true);
      const explainMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `This analysis is important because it helps identify key patterns in your customer base, enabling more targeted and effective engagement strategies.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, explainMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: zsColors.neutral.lightGray }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${moduleColor.primary}, ${moduleColor.light})` }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-medium" style={{ color: zsColors.neutral.charcoal }}>
              {moduleName} Assistant
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onApprove}
            className="px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{
              backgroundColor: `${zsColors.secondary.green}20`,
              color: zsColors.secondary.green
            }}
          >
            <CheckCircle size={16} />
            Approve & Continue
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role !== 'user' && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: message.role === 'system' 
                      ? zsColors.neutral.lightGray 
                      : `${moduleColor.primary}20`
                  }}>
                  {message.role === 'system' ? (
                    <HelpCircle size={16} style={{ color: zsColors.neutral.darkGray }} />
                  ) : (
                    <Bot size={16} style={{ color: moduleColor.primary }} />
                  )}
                </div>
              )}

              <div className={`max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div className="rounded-lg p-3"
                  style={{
                    backgroundColor: message.role === 'user' 
                      ? moduleColor.primary 
                      : message.role === 'system'
                      ? zsColors.neutral.offWhite
                      : zsColors.neutral.white,
                    color: message.role === 'user' ? 'white' : zsColors.neutral.charcoal,
                    border: message.role === 'assistant' ? `1px solid ${zsColors.neutral.lightGray}` : 'none'
                  }}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.actions && (
                    <div className="flex gap-2 mt-3">
                      {message.actions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAction(action)}
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: action.type === 'approve' 
                              ? `${zsColors.secondary.green}20`
                              : action.type === 'adjust'
                              ? `${moduleColor.primary}20`
                              : zsColors.neutral.offWhite,
                            color: action.type === 'approve'
                              ? zsColors.secondary.green
                              : action.type === 'adjust'
                              ? moduleColor.primary
                              : zsColors.neutral.darkGray
                          }}
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs mt-1 px-1" style={{ color: zsColors.neutral.gray }}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: zsColors.neutral.lightGray }}>
                  <User size={16} style={{ color: zsColors.neutral.darkGray }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${moduleColor.primary}20` }}>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: moduleColor.primary }} />
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Processing your request...
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: zsColors.neutral.lightGray }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask questions or request adjustments..."
            className="flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2"
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
            className="px-4 py-2 rounded-lg disabled:opacity-50"
            style={{
              backgroundColor: moduleColor.primary,
              color: 'white'
            }}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}