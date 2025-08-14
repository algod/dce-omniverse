'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Package, Zap, CheckCircle } from 'lucide-react';
import { useAgentData } from '@/lib/contexts/AgentDataContext';
import { zsColors } from '@/lib/design-system/zs-colors';

interface DataPacket {
  id: string;
  from: string;
  to: string;
  label: string;
  position: { x: number; y: number };
  color: string;
}

export function DataFlowIndicator() {
  const { dataFlowEvents } = useAgentData();
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [showFlowStatus, setShowFlowStatus] = useState(false);

  // Agent positions on the screen (approximate)
  const agentPositions: Record<string, { x: number; y: number }> = {
    'omni': { x: 50, y: 20 },
    'customer': { x: 20, y: 50 },
    'engagement': { x: 35, y: 50 },
    'content-planning': { x: 50, y: 50 },
    'content-generation': { x: 65, y: 50 },
    'content-approval': { x: 80, y: 50 },
    'orchestration': { x: 20, y: 70 },
    'activation': { x: 35, y: 70 },
    'suggestions': { x: 50, y: 70 },
    'copilot': { x: 65, y: 70 }
  };

  // Create animated data packets when events occur
  useEffect(() => {
    if (dataFlowEvents.length > 0) {
      const latestEvent = dataFlowEvents[dataFlowEvents.length - 1];
      
      const fromPos = agentPositions[latestEvent.from] || { x: 50, y: 50 };
      const toPos = agentPositions[latestEvent.to] || { x: 50, y: 50 };
      
      const packet: DataPacket = {
        id: latestEvent.id,
        from: latestEvent.from,
        to: latestEvent.to,
        label: getDataLabel(latestEvent.from, latestEvent.to),
        position: fromPos,
        color: getAgentColor(latestEvent.from)
      };
      
      setDataPackets(prev => [...prev, packet]);
      
      // Animate packet movement
      setTimeout(() => {
        setDataPackets(prev => 
          prev.map(p => 
            p.id === packet.id 
              ? { ...p, position: toPos }
              : p
          )
        );
      }, 100);
      
      // Remove packet after animation
      setTimeout(() => {
        setDataPackets(prev => prev.filter(p => p.id !== packet.id));
      }, 3000);
    }
  }, [dataFlowEvents]);

  const getDataLabel = (from: string, to: string): string => {
    const labels: Record<string, string> = {
      'customer-engagement': 'Microsegments',
      'engagement-content-planning': 'Budget Plans',
      'content-planning-content-generation': 'Content Gaps',
      'content-generation-content-approval': 'Generated Assets',
      'content-approval-orchestration': 'Approved Content',
      'orchestration-activation': 'Journey Plans',
      'activation-suggestions': 'Campaign Data',
      'suggestions-copilot': 'Field Actions',
      'copilot-customer': 'Field Insights'
    };
    
    return labels[`${from}-${to}`] || 'Data Package';
  };

  const getAgentColor = (agentId: string): string => {
    const colors: Record<string, string> = {
      'customer': zsColors.agents.customer.primary,
      'engagement': zsColors.agents.budget.primary,
      'content-planning': '#8B5CF6',
      'content-generation': '#6366F1',
      'content-approval': '#10B981',
      'orchestration': zsColors.agents.orchestration.primary,
      'activation': '#14B8A6',
      'suggestions': '#F59E0B',
      'copilot': zsColors.agents.copilot.primary
    };
    
    return colors[agentId] || zsColors.primary.blue;
  };

  return (
    <>
      {/* Floating Data Flow Status */}
      <AnimatePresence>
        {dataFlowEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 z-50"
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-4 max-w-sm"
              style={{ border: `1px solid ${zsColors.neutral.lightGray}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={20} style={{ color: zsColors.secondary.green }} />
                </motion.div>
                <h4 className="font-semibold text-sm" style={{ color: zsColors.neutral.charcoal }}>
                  Agent Data Flow Active
                </h4>
              </div>
              
              <div className="space-y-2">
                {dataFlowEvents.slice(-3).reverse().map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Package size={14} style={{ color: getAgentColor(event.from) }} />
                    <span style={{ color: zsColors.neutral.darkGray }}>
                      {event.from}
                    </span>
                    <ArrowRight size={12} style={{ color: zsColors.neutral.gray }} />
                    <span style={{ color: zsColors.neutral.darkGray }}>
                      {event.to}
                    </span>
                    <CheckCircle size={12} style={{ color: zsColors.secondary.green }} />
                  </motion.div>
                ))}
              </div>
              
              <button
                onClick={() => setShowFlowStatus(!showFlowStatus)}
                className="mt-3 text-xs text-center w-full py-1 rounded"
                style={{ 
                  backgroundColor: zsColors.neutral.offWhite,
                  color: zsColors.neutral.gray 
                }}
              >
                {showFlowStatus ? 'Hide' : 'Show'} Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Data Packets */}
      <AnimatePresence>
        {dataPackets.map(packet => (
          <motion.div
            key={packet.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              left: `${packet.position.x}%`,
              top: `${packet.position.y}%`
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: `${packet.position.x}%`,
              top: `${packet.position.y}%`
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed z-40 pointer-events-none"
            style={{
              transform: 'translate(-50%, -50%)'
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="relative"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ 
                  backgroundColor: packet.color,
                  opacity: 0.3,
                  width: '60px',
                  height: '60px',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%'
                }}
              />
              
              {/* Data packet icon */}
              <div
                className="relative bg-white rounded-full p-3 shadow-lg"
                style={{ 
                  border: `2px solid ${packet.color}`
                }}
              >
                <Package size={24} style={{ color: packet.color }} />
              </div>
              
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap"
              >
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full bg-white shadow-md"
                  style={{ 
                    color: packet.color,
                    border: `1px solid ${packet.color}30`
                  }}
                >
                  {packet.label}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Flow Status Details Modal */}
      <AnimatePresence>
        {showFlowStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
            onClick={() => setShowFlowStatus(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                Agent Data Flow History
              </h3>
              
              <div className="space-y-3">
                {dataFlowEvents.map((event, idx) => (
                  <div 
                    key={event.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: zsColors.neutral.offWhite }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${getAgentColor(event.from)}20`,
                            color: getAgentColor(event.from)
                          }}
                        >
                          <Package size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                            {event.from} → {event.to}
                          </p>
                          <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <CheckCircle size={16} style={{ color: zsColors.secondary.green }} />
                    </div>
                    
                    <div className="mt-2 p-2 rounded bg-white">
                      <p className="text-xs font-mono" style={{ color: zsColors.neutral.darkGray }}>
                        {JSON.stringify(event.data, null, 2).substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowFlowStatus(false)}
                className="mt-4 w-full py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: zsColors.primary.blue,
                  color: 'white'
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}