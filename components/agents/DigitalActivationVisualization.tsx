'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Send, CheckCircle2, AlertTriangle, 
  Clock, Activity, Users, ArrowRight,
  Cloud, Database, Globe, Mail
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';

export function DigitalActivationVisualization() {
  const [selectedVendor, setSelectedVendor] = useState(0);
  
  // Execution vendors
  const vendors = [
    { 
      name: 'Salesforce Marketing Cloud',
      type: 'Email',
      status: 'active',
      campaigns: 12,
      successRate: 96,
      latency: 0.8,
      volume: '45K/hour'
    },
    {
      name: 'Adobe Campaign',
      type: 'Web',
      status: 'active',
      campaigns: 8,
      successRate: 94,
      latency: 1.2,
      volume: '30K/hour'
    },
    {
      name: 'Veeva CRM',
      type: 'Field',
      status: 'active',
      campaigns: 15,
      successRate: 98,
      latency: 0.5,
      volume: '10K/hour'
    },
    {
      name: 'ON24',
      type: 'Virtual',
      status: 'active',
      campaigns: 5,
      successRate: 92,
      latency: 1.5,
      volume: '5K/hour'
    },
    {
      name: 'Cvent',
      type: 'Conference',
      status: 'maintenance',
      campaigns: 2,
      successRate: 88,
      latency: 2.0,
      volume: '2K/hour'
    }
  ];

  // Active campaigns
  const activeCampaigns = [
    { id: 'CAM-001', name: 'Champions Email Series', vendor: 'Salesforce', status: 'running', progress: 78 },
    { id: 'CAM-002', name: 'Growers Field Engagement', vendor: 'Veeva CRM', status: 'running', progress: 45 },
    { id: 'CAM-003', name: 'Virtual Speaker Program', vendor: 'ON24', status: 'scheduled', progress: 0 },
    { id: 'CAM-004', name: 'Web Personalization', vendor: 'Adobe', status: 'running', progress: 92 }
  ];

  // Execution metrics
  const executionMetrics = [
    { metric: 'Total Activations', value: '8,541', change: '+23%', positive: true },
    { metric: 'Success Rate', value: '94%', change: '+5%', positive: true },
    { metric: 'Avg Latency', value: '1.2s', change: '-0.3s', positive: true },
    { metric: 'Failed Requests', value: '142', change: '-18%', positive: true }
  ];

  // Channel distribution
  const channelDistribution = [
    { channel: 'Email', percentage: 35, color: zsColors.primary.blue },
    { channel: 'Field', percentage: 28, color: zsColors.secondary.green },
    { channel: 'Web', percentage: 20, color: zsColors.secondary.orange },
    { channel: 'Virtual', percentage: 12, color: zsColors.secondary.purple },
    { channel: 'Conference', percentage: 5, color: zsColors.secondary.orange }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': case 'running': return zsColors.secondary.green;
      case 'scheduled': return zsColors.primary.blue;
      case 'maintenance': return zsColors.secondary.orange;
      case 'error': return zsColors.secondary.red;
      default: return zsColors.neutral.gray;
    }
  };

  const getChannelIcon = (type: string) => {
    switch(type) {
      case 'Email': return Mail;
      case 'Web': return Globe;
      case 'Field': return Users;
      case 'Virtual': return Cloud;
      default: return Database;
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {executionMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl p-4"
            style={{ backgroundColor: zsColors.neutral.white }}
          >
            <p className="text-xs mb-1" style={{ color: zsColors.neutral.gray }}>
              {metric.metric}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
                {metric.value}
              </p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full`}
                style={{ 
                  backgroundColor: metric.positive ? `${zsColors.secondary.green}20` : `${zsColors.secondary.red}20`,
                  color: metric.positive ? zsColors.secondary.green : zsColors.secondary.red
                }}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vendor Integration Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: zsColors.neutral.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Execution Vendor Status
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Activity size={14} style={{ color: zsColors.secondary.green }} />
            <span style={{ color: zsColors.neutral.gray }}>Real-time monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {vendors.map((vendor, index) => {
            const Icon = getChannelIcon(vendor.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border cursor-pointer transition-all"
                style={{ 
                  borderColor: selectedVendor === index 
                    ? zsColors.primary.blue 
                    : zsColors.neutral.lightGray,
                  backgroundColor: selectedVendor === index 
                    ? `${zsColors.primary.blue}05` 
                    : zsColors.neutral.offWhite
                }}
                onClick={() => setSelectedVendor(index)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getStatusColor(vendor.status)}20`,
                        color: getStatusColor(vendor.status)
                      }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                        {vendor.name}
                      </h4>
                      <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                        {vendor.type} Channel
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${getStatusColor(vendor.status)}20`,
                      color: getStatusColor(vendor.status)
                    }}>
                    {vendor.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p style={{ color: zsColors.neutral.gray }}>Campaigns</p>
                    <p className="font-bold" style={{ color: zsColors.neutral.darkGray }}>
                      {vendor.campaigns}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: zsColors.neutral.gray }}>Success</p>
                    <p className="font-bold" style={{ color: zsColors.secondary.green }}>
                      {vendor.successRate}%
                    </p>
                  </div>
                  <div>
                    <p style={{ color: zsColors.neutral.gray }}>Latency</p>
                    <p className="font-bold" style={{ color: zsColors.neutral.darkGray }}>
                      {vendor.latency}s
                    </p>
                  </div>
                  <div>
                    <p style={{ color: zsColors.neutral.gray }}>Volume</p>
                    <p className="font-bold" style={{ color: zsColors.primary.blue }}>
                      {vendor.volume}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Send size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Active Campaigns
            </h3>
          </div>

          <div className="space-y-3">
            {activeCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg"
                style={{ backgroundColor: zsColors.neutral.offWhite }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono px-2 py-1 rounded mr-2"
                      style={{ 
                        backgroundColor: zsColors.neutral.lightGray,
                        color: zsColors.neutral.darkGray
                      }}>
                      {campaign.id}
                    </span>
                    <span className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                      {campaign.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${getStatusColor(campaign.status)}20`,
                      color: getStatusColor(campaign.status)
                    }}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span style={{ color: zsColors.neutral.gray }}>Vendor:</span>
                  <span style={{ color: zsColors.neutral.darkGray }}>{campaign.vendor}</span>
                </div>

                {campaign.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: zsColors.neutral.gray }}>Progress</span>
                      <span style={{ color: zsColors.neutral.darkGray }}>{campaign.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: zsColors.neutral.lightGray }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: zsColors.primary.blue }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: zsColors.neutral.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity size={20} style={{ color: zsColors.primary.navy }} />
            <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
              Channel Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {channelDistribution.map((item, index) => (
              <motion.div
                key={item.channel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: zsColors.neutral.charcoal }}>
                    {item.channel}
                  </span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: zsColors.neutral.lightGray }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: `${zsColors.primary.blue}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: zsColors.neutral.charcoal }}>
                  Total Active Channels
                </p>
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                  All channels operational
                </p>
              </div>
              <div className="text-2xl font-bold" style={{ color: zsColors.primary.blue }}>
                5/5
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Execution Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{ backgroundColor: `${zsColors.secondary.green}05` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} style={{ color: zsColors.secondary.green }} />
            <div>
              <h3 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Execution Pipeline
              </h3>
              <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
                Real-time campaign activation across all vendors
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['Receive', 'Transform', 'Route', 'Execute', 'Monitor'].map((step, index) => (
              <div key={step} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: index <= 3 ? zsColors.secondary.green : zsColors.neutral.lightGray,
                    color: index <= 3 ? zsColors.neutral.white : zsColors.neutral.darkGray
                  }}
                >
                  {step}
                </motion.div>
                {index < 4 && (
                  <ArrowRight size={14} style={{ color: zsColors.neutral.gray, margin: '0 4px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}