'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, Search, Sparkles, CheckSquare, 
  AlertTriangle, ThumbsUp, ThumbsDown, 
  Palette, Shield, Upload, BarChart3
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

interface SubAgent {
  id: string;
  name: string;
  icon: any;
  description: string;
  status: 'idle' | 'active' | 'completed';
  color: { primary: string; light: string };
  integration?: string;
}

const subAgents: SubAgent[] = [
  {
    id: 'planning',
    name: 'Content Planning',
    icon: Search,
    description: 'Identifies content gaps and retirement opportunities',
    status: 'idle',
    color: { primary: '#8B5CF6', light: '#A78BFA' }
  },
  {
    id: 'generation',
    name: 'Content Generation',
    icon: Sparkles,
    description: 'Creates new content blueprints and variants',
    status: 'idle',
    color: { primary: '#3B82F6', light: '#60A5FA' },
    integration: 'Adobe Creative Cloud'
  },
  {
    id: 'approval',
    name: 'Content Approval',
    icon: CheckSquare,
    description: 'MLR review and compliance verification',
    status: 'idle',
    color: { primary: '#10B981', light: '#34D399' },
    integration: 'Veeva PromoMats'
  }
];

export function ContentSupplyChain() {
  const [activeSubAgent, setActiveSubAgent] = useState<string | null>(null);
  const [subAgentStatuses, setSubAgentStatuses] = useState<Record<string, SubAgent['status']>>(
    subAgents.reduce((acc, agent) => ({ ...acc, [agent.id]: 'idle' }), {})
  );
  const [mlrResults, setMlrResults] = useState({
    autoApprove: 42,
    humanReview: 78,
    decline: 36,
    total: 156
  });
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const activateSubAgent = (agentId: string) => {
    setActiveSubAgent(agentId);
    setSubAgentStatuses(prev => ({ ...prev, [agentId]: 'active' }));
    
    // Simulate processing
    setTimeout(() => {
      setSubAgentStatuses(prev => ({ ...prev, [agentId]: 'completed' }));
      setActiveSubAgent(null);
    }, 3000);
  };

  const getSubAgentContent = (agentId: string) => {
    switch (agentId) {
      case 'planning':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Content Gap Analysis
                </h4>
                <div className="space-y-2">
                  {[
                    { type: 'Barrier-specific content', gap: 23 },
                    { type: 'Channel optimization', gap: 15 },
                    { type: 'Persona messaging', gap: 18 },
                    { type: 'Competitive response', gap: 12 }
                  ].map((item) => (
                    <div key={item.type} className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>{item.type}</span>
                      <span className="font-medium" style={{ color: zsColors.secondary.orange }}>
                        {item.gap} assets needed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
                <h4 className="text-sm font-medium mb-3" style={{ color: zsColors.neutral.darkGray }}>
                  Retirement Candidates
                </h4>
                <div className="space-y-2">
                  {[
                    { reason: 'Low engagement', count: 28 },
                    { reason: 'Outdated claims', count: 15 },
                    { reason: 'Expired studies', count: 9 },
                    { reason: 'Brand evolution', count: 7 }
                  ].map((item) => (
                    <div key={item.reason} className="flex justify-between text-xs">
                      <span style={{ color: zsColors.neutral.gray }}>{item.reason}</span>
                      <span className="font-medium" style={{ color: '#EF4444' }}>
                        {item.count} assets
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'generation':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: '#EA580C' }}>
              <div className="flex items-center gap-3 mb-3">
                <Palette size={20} style={{ color: '#EA580C' }} />
                <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                  Adobe Creative Cloud Integration
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'Email Templates', count: 12, status: 'In Progress' },
                  { type: 'Web Banners', count: 8, status: 'Queued' },
                  { type: 'Social Media', count: 15, status: 'Review' }
                ].map((item) => (
                  <div key={item.type} className="text-center p-3 rounded-lg bg-white">
                    <p className="text-2xl font-bold" style={{ color: '#EA580C' }}>{item.count}</p>
                    <p className="text-xs" style={{ color: zsColors.neutral.gray }}>{item.type}</p>
                    <p className="text-xs mt-1" style={{ color: zsColors.neutral.darkGray }}>{item.status}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <h4 className="text-sm font-medium mb-2" style={{ color: zsColors.neutral.darkGray }}>
                Content Variants Generated
              </h4>
              <div className="space-y-1">
                {['Headlines: 45 variations', 'Body copy: 23 versions', 'CTAs: 18 options', 'Images: 67 assets'].map((item) => (
                  <div key={item} className="text-xs flex items-center gap-2">
                    <CheckSquare size={12} style={{ color: zsColors.secondary.green }} />
                    <span style={{ color: zsColors.neutral.gray }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'approval':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: '#00539B' }}>
              <div className="flex items-center gap-3 mb-3">
                <Shield size={20} style={{ color: '#00539B' }} />
                <h4 className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                  Veeva PromoMats Integration
                </h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={16} className="text-green-600" />
                    <span className="text-sm font-medium">Auto-Approved</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{mlrResults.autoApprove}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-600" />
                    <span className="text-sm font-medium">Human Review</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{mlrResults.humanReview}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2">
                    <ThumbsDown size={16} className="text-red-600" />
                    <span className="text-sm font-medium">Declined</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{mlrResults.decline}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <div className="flex items-center justify-center gap-2">
                <Upload size={16} style={{ color: '#00539B' }} />
                <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
                  Syncing with Veeva PromoMats...
                </span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Parent Agent Overview */}
      <div className="rounded-xl p-6" style={{ backgroundColor: zsColors.neutral.white }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${zsColors.agents.content.primary}, ${zsColors.agents.content.light})`
              }}>
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Content Supply Chain
              </h3>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                End-to-end content lifecycle management
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => activateSubAgent('planning')}
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-white font-medium"
            style={{ background: `linear-gradient(135deg, ${zsColors.primary.blue}, ${zsColors.primary.navy})` }}
          >
            <Sparkles size={16} />
            Run Workflow
          </motion.button>
        </div>

        {/* Sub-Agents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subAgents.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div
                className="rounded-lg border p-4 cursor-pointer transition-all"
                style={{
                  borderColor: subAgentStatuses[agent.id] === 'completed' 
                    ? agent.color.primary 
                    : subAgentStatuses[agent.id] === 'active'
                    ? agent.color.light
                    : zsColors.neutral.lightGray,
                  backgroundColor: subAgentStatuses[agent.id] === 'active'
                    ? `${agent.color.primary}10`
                    : zsColors.neutral.white
                }}
                onClick={() => {
                  if (subAgentStatuses[agent.id] !== 'active') {
                    activateSubAgent(agent.id);
                  }
                  setShowDetails(showDetails === agent.id ? null : agent.id);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.light})`,
                      opacity: subAgentStatuses[agent.id] === 'idle' ? 0.5 : 1
                    }}>
                    <agent.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {agent.name}
                    </h4>
                    <p className="text-xs mb-2" style={{ color: zsColors.neutral.gray }}>
                      {agent.description}
                    </p>
                    
                    {agent.integration && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: `${agent.color.primary}20`,
                          color: agent.color.primary
                        }}>
                        <Upload size={10} />
                        {agent.integration}
                      </div>
                    )}
                  </div>
                </div>

                {subAgentStatuses[agent.id] === 'active' && (
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={16} style={{ color: agent.color.primary }} />
                  </motion.div>
                )}
                
                {subAgentStatuses[agent.id] === 'completed' && (
                  <div className="absolute top-2 right-2">
                    <CheckSquare size={16} style={{ color: agent.color.primary }} />
                  </div>
                )}
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {showDetails === agent.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    {getSubAgentContent(agent.id)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MLR Review Dashboard */}
      {(subAgentStatuses.approval === 'active' || subAgentStatuses.approval === 'completed') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              MLR Review Dashboard
            </h3>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} style={{ color: zsColors.neutral.gray }} />
              <span className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Real-time Analysis
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
              <p className="text-3xl font-bold" style={{ color: zsColors.primary.blue }}>
                {mlrResults.total}
              </p>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>Total Assets</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-3xl font-bold text-green-600">
                {Math.round((mlrResults.autoApprove / mlrResults.total) * 100)}%
              </p>
              <p className="text-sm text-green-700">Auto-Approved</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50">
              <p className="text-3xl font-bold text-orange-600">
                {Math.round((mlrResults.humanReview / mlrResults.total) * 100)}%
              </p>
              <p className="text-sm text-orange-700">Need Review</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50">
              <p className="text-3xl font-bold text-red-600">
                {Math.round((mlrResults.decline / mlrResults.total) * 100)}%
              </p>
              <p className="text-sm text-red-700">Declined</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}