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
  moduleResults?: any;
}

export function ModuleChatInterface({
  moduleId,
  moduleName,
  moduleColor,
  onApprove,
  onAdjust,
  initialMessage,
  moduleResults
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

  const generateContextualResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Persona Analysis responses
    if (moduleId === 'persona') {
      if (lowerQuery.includes('barrier') && (lowerQuery.includes('top') || lowerQuery.includes('main'))) {
        const barriers = moduleResults?.barriers_identified || {};
        const topBarriers = Object.entries(barriers)
          .sort((a: any, b: any) => b[1].percentage - a[1].percentage)
          .slice(0, 3);
        
        return {
          content: `Based on my analysis of 2,847 HCPs in your territory, the top 3 barriers are:\n\n1. **${topBarriers[0]?.[0]}** - Affecting ${topBarriers[0]?.[1]?.percentage || 0}% of HCPs\n2. **${topBarriers[1]?.[0]}** - Affecting ${topBarriers[1]?.[1]?.percentage || 0}% of HCPs\n3. **${topBarriers[2]?.[0]}** - Affecting ${topBarriers[2]?.[1]?.percentage || 0}% of HCPs\n\nThese barriers represent the primary obstacles preventing HCP adoption. Would you like me to adjust the barrier weights or dive deeper into any specific barrier?`,
          actions: [
            { type: 'adjust', label: 'Adjust Barrier Weights', data: { adjustment: 'barrier_weights' } },
            { type: 'explain', label: 'Explain Impact', data: { context: 'barrier_impact' } }
          ]
        };
      }
      if (lowerQuery.includes('adjust') || lowerQuery.includes('weight')) {
        return {
          content: `I can adjust the relative importance of each barrier based on your field insights. Current weights are:\n\n• Referral Pathways: 25%\n• Side Effects: 20%\n• Insurance: 20%\n• Formulary: 20%\n• Diagnostic: 15%\n\nWhich barrier weight would you like to modify? Increasing weight for barriers with higher field-observed impact will improve targeting accuracy.`,
          actions: [
            { type: 'adjust', label: 'Increase Formulary Weight', data: { barrier: 'formulary', change: '+5%' } },
            { type: 'adjust', label: 'Decrease Diagnostic Weight', data: { barrier: 'diagnostic', change: '-5%' } }
          ]
        };
      }
    }
    
    // Performance Metrics responses
    if (moduleId === 'performance') {
      if (lowerQuery.includes('kpi') || lowerQuery.includes('metric')) {
        return {
          content: `I've selected the following KPIs based on your brand objectives:\n\n• **Market Share** - Currently at 68%\n• **Growth Rate** - 12% over last 6 months\n• **Prescription Volume** - D4 decile performance\n• **Patient Retention** - Tracking longitudinal adherence\n\nThese metrics align with your goal to increase market share and improve HCP engagement. Should I adjust the KPI selection or add custom metrics?`,
          actions: [
            { type: 'adjust', label: 'Add Custom KPI', data: { action: 'add_kpi' } },
            { type: 'explain', label: 'Why These KPIs', data: { context: 'kpi_selection' } }
          ]
        };
      }
    }
    
    // Potential Prediction responses
    if (moduleId === 'potential') {
      if (lowerQuery.includes('opportunity') || lowerQuery.includes('revenue')) {
        const depth = moduleResults?.depth_opportunity || '$285K';
        const breadth = moduleResults?.breadth_opportunity || '$142K';
        const total = moduleResults?.total_opportunity || '$427K';
        
        return {
          content: `The ML model has identified significant opportunities:\n\n**Depth Opportunity**: ${depth}\n• Increase prescription frequency among current prescribers\n• Focus on Champions and Growers segments\n\n**Breadth Opportunity**: ${breadth}\n• Expand prescriber base to new HCPs\n• Target Converters with barrier-specific messaging\n\n**Total Opportunity**: ${total}\n• Model confidence: 94%\n• High-opportunity HCPs: 423\n\nWould you like to adjust the model parameters or see the breakdown by microsegment?`,
          actions: [
            { type: 'adjust', label: 'Adjust Model Sensitivity', data: { parameter: 'sensitivity' } },
            { type: 'explain', label: 'View by Segment', data: { view: 'segment_breakdown' } }
          ]
        };
      }
    }
    
    // Preference Mapping responses
    if (moduleId === 'preference') {
      if (lowerQuery.includes('channel') || lowerQuery.includes('frequency')) {
        return {
          content: `Based on engagement analysis, here's the optimal channel mix:\n\n**Channel Preferences**:\n• Field: 85% affinity - High-value face-to-face interactions\n• Email: 65% affinity - Clinical updates and case studies\n• Virtual: 55% affinity - Webinars and online programs\n• Web: 40% affinity - Self-service resources\n\n**Optimal Frequency**: 2.3 touches/month\n• Champions: 3.5 touches/month\n• Growers: 2.8 touches/month\n• Converters: 2.1 touches/month\n\nShould I adjust these preferences based on your field feedback?`,
          actions: [
            { type: 'adjust', label: 'Modify Channel Mix', data: { action: 'channel_mix' } },
            { type: 'explain', label: 'Frequency Rationale', data: { context: 'frequency_logic' } }
          ]
        };
      }
    }
    
    // Microsegmentation responses
    if (moduleId === 'microsegmentation') {
      if (lowerQuery.includes('segment') || lowerQuery.includes('priorit')) {
        return {
          content: `I've created 5 distinct microsegments with 3 strategic options:\n\n**Option 1: Growth Focus** (+45% expected impact)\n• Prioritize Champions, Growers, Converters\n• 423 high-opportunity HCPs\n• Aggressive growth strategy\n\n**Option 2: Efficiency Focus** (+32% ROI)\n• Focus on Champions, Maintainers, Defenders\n• 500 HCPs with lower cost-to-serve\n• Maximize ROI with existing resources\n\n**Option 3: Balanced Approach** (+28% overall)\n• Distribute across all segments\n• 650 HCPs with mixed strategies\n• Risk-mitigated approach\n\n**Recommendation**: Based on your objectives, I recommend the Growth Focus strategy.`,
          actions: [
            { type: 'adjust', label: 'Select Growth Focus', data: { strategy: 'growth' } },
            { type: 'adjust', label: 'Select Efficiency Focus', data: { strategy: 'efficiency' } },
            { type: 'adjust', label: 'Select Balanced', data: { strategy: 'balanced' } }
          ]
        };
      }
    }
    
    // Default contextual response
    return {
      content: `I understand your question about ${query.toLowerCase()}. Based on the ${moduleName} analysis, I can help you explore the data, adjust parameters, or explain the methodology.\n\nWhat specific aspect would you like to focus on?`,
      actions: [
        { type: 'adjust', label: 'Modify Parameters', data: { query: input } },
        { type: 'explain', label: 'Explain Analysis', data: { context: moduleId } }
      ]
    };
  };

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

    // Generate contextual AI response
    setTimeout(() => {
      const response = generateContextualResponse(input);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions
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
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
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