'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight, Brain, Cpu, Database, MessageSquare } from 'lucide-react';
import Card from '@/components/design-system/Card';
import Button from '@/components/design-system/Button';
import { colors } from '@/lib/design-system/colors';
import Link from 'next/link';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  position: number;
  totalAgents: number;
  capabilities: string[];
  metrics?: {
    label: string;
    value: string | number;
  }[];
  status?: 'idle' | 'processing' | 'complete' | 'error';
  onClick?: () => void;
}

export function AgentCard({
  id,
  name,
  description,
  icon: Icon,
  color,
  position,
  totalAgents,
  capabilities,
  metrics = [],
  status = 'idle',
  onClick
}: AgentCardProps) {
  const statusColors = {
    idle: colors.gray[400],
    processing: colors.warning.main,
    complete: colors.success.main,
    error: colors.error.main
  };

  const statusLabels = {
    idle: 'Ready',
    processing: 'Processing',
    complete: 'Complete',
    error: 'Error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        variant="interactive"
        className="relative overflow-hidden cursor-pointer h-full"
        onClick={onClick}
      >
        {/* Position Indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: color }}
        >
          <div className="absolute left-0 top-0 bottom-0 flex items-center px-3">
            <span className="text-xs text-white font-semibold">
              {position}/{totalAgents}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColors[status] }}
            />
            <span className="text-xs text-gray-600">{statusLabels[status]}</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Agent Capabilities
            </span>
          </div>
          <div className="space-y-1">
            {capabilities.slice(0, 3).map((capability, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className="w-1 h-1 rounded-full mt-1.5"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        {metrics.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Database size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Key Metrics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {metrics.slice(0, 4).map((metric, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-sm font-semibold" style={{ color }}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Flow Indicators */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {position > 1 && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Cpu size={12} />
                  <span>Receives from {position - 1}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {position < totalAgents && (
                <div className="flex items-center gap-1 text-gray-500">
                  <span>Sends to {position + 1}</span>
                  <ArrowRight size={12} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />

        {/* Action Button */}
        <div className="mt-4">
          <Link href={`/agents/${id}`}>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<MessageSquare size={14} />}
              style={{ borderColor: color, color }}
              className="hover:bg-opacity-10"
            >
              Interact with Agent
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}