'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Star, StarOff, Clock, TrendingUp, 
  LayoutGrid, List, Square, Zap, ChevronRight,
  Plus, X, Edit2, Save, User, Bell, Keyboard
} from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { AnimatedCard, AnimatedButton } from '@/components/ui/AnimatedCard';
import { usePersonalization } from '@/hooks/usePersonalization';
import { performanceMonitor } from '@/utils/performance';
import Link from 'next/link';

interface PersonalizedDashboardProps {
  agents: Array<{
    id: string;
    name: string;
    icon: any;
    color: string;
    metrics?: {
      label: string;
      value: string | number;
      trend?: 'up' | 'down' | 'neutral';
    }[];
  }>;
}

export function PersonalizedDashboard({ agents }: PersonalizedDashboardProps) {
  const {
    preferences,
    updatePreference,
    addFavoriteAgent,
    removeFavoriteAgent,
    trackAction,
    getRecommendations
  } = usePersonalization();

  const [showSettings, setShowSettings] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [recommendations, setRecommendations] = useState<any>({ topActions: [], recommendations: [] });

  useEffect(() => {
    // Track dashboard view
    trackAction('viewDashboard');
    
    // Get performance metrics
    const score = performanceMonitor.getPerformanceScore();
    setPerformanceScore(score);
    
    // Get personalized recommendations
    const recs = getRecommendations();
    setRecommendations(recs);
  }, [trackAction, getRecommendations]);

  const favoriteAgents = agents.filter(agent => 
    preferences.favoriteAgents.includes(agent.id)
  );

  const recentAgents = agents.filter(agent => 
    preferences.recentActions
      .filter(action => action.action === 'viewAgent')
      .map(action => action.context?.agentId)
      .includes(agent.id)
  ).slice(0, 3);

  const toggleFavorite = (agentId: string) => {
    if (preferences.favoriteAgents.includes(agentId)) {
      removeFavoriteAgent(agentId);
    } else {
      addFavoriteAgent(agentId);
    }
    trackAction('toggleFavorite', { agentId });
  };

  const layoutOptions = [
    { id: 'grid', icon: LayoutGrid, label: 'Grid' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'compact', icon: Square, label: 'Compact' }
  ];

  const getLayoutClass = () => {
    switch (preferences.dashboardLayout) {
      case 'list': return 'flex flex-col space-y-4';
      case 'compact': return 'grid grid-cols-2 md:grid-cols-4 gap-2';
      default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  const getCardSize = () => {
    switch (preferences.dashboardLayout) {
      case 'list': return 'p-6';
      case 'compact': return 'p-3';
      default: return 'p-5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Performance Score */}
      <AnimatedCard 
        className="p-6 bg-white rounded-xl border"
        style={{ borderColor: zsColors.neutral.lightGray }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${zsColors.primary.blue}, ${zsColors.primary.navy})`,
                boxShadow: `0 4px 12px ${zsColors.primary.blue}30`
              }}
            >
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: zsColors.neutral.charcoal }}>
                Your Personalized Dashboard
              </h2>
              <p className="text-sm" style={{ color: zsColors.neutral.gray }}>
                Optimized for your workflow
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Performance Score */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs" style={{ color: zsColors.neutral.gray }}>Performance</p>
                <p className="text-2xl font-bold" 
                  style={{ 
                    color: performanceScore > 80 
                      ? zsColors.semantic.success 
                      : performanceScore > 60 
                      ? zsColors.semantic.warning 
                      : zsColors.semantic.error
                  }}
                >
                  {performanceScore}
                </p>
              </div>
              <Zap size={20} style={{ 
                color: performanceScore > 80 
                  ? zsColors.semantic.success 
                  : performanceScore > 60 
                  ? zsColors.semantic.warning 
                  : zsColors.semantic.error
              }} />
            </div>
            
            {/* Settings Button */}
            <AnimatedButton
              onClick={() => setShowSettings(!showSettings)}
              variant="secondary"
              size="sm"
            >
              <Settings size={16} />
              Settings
            </AnimatedButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-1">
              <Star size={16} style={{ color: zsColors.secondary.orange }} />
              <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                Favorites
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {preferences.favoriteAgents.length}
            </p>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-1">
              <Clock size={16} style={{ color: zsColors.primary.blue }} />
              <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                Recent
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {recentAgents.length}
            </p>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-1">
              <Keyboard size={16} style={{ color: zsColors.secondary.green }} />
              <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                Shortcuts
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {Object.keys(preferences.shortcuts).length}
            </p>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: zsColors.neutral.offWhite }}>
            <div className="flex items-center justify-between mb-1">
              <TrendingUp size={16} style={{ color: zsColors.semantic.success }} />
              <span className="text-xs font-medium" style={{ color: zsColors.neutral.darkGray }}>
                Actions
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: zsColors.neutral.charcoal }}>
              {preferences.recentActions.length}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.recommendations.length > 0 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: zsColors.primary.blue + '10' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: zsColors.primary.blue }}>
              Personalized Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations.recommendations.slice(0, 3).map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-0.5" style={{ color: zsColors.primary.blue }} />
                  <p className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                    {rec.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatedCard>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnimatedCard 
              className="p-6 bg-white rounded-xl border"
              style={{ borderColor: zsColors.neutral.lightGray }}
            >
              <h3 className="text-base font-semibold mb-4" style={{ color: zsColors.neutral.charcoal }}>
                Dashboard Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Layout Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: zsColors.neutral.darkGray }}>
                    Dashboard Layout
                  </label>
                  <div className="flex gap-2">
                    {layoutOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          updatePreference('dashboardLayout', option.id as any);
                          trackAction('changeLayout', { layout: option.id });
                        }}
                        className={`flex-1 p-3 rounded-lg border transition-all ${
                          preferences.dashboardLayout === option.id 
                            ? 'border-2' 
                            : ''
                        }`}
                        style={{
                          borderColor: preferences.dashboardLayout === option.id 
                            ? zsColors.primary.blue 
                            : zsColors.neutral.lightGray,
                          backgroundColor: preferences.dashboardLayout === option.id 
                            ? zsColors.primary.blue + '10'
                            : zsColors.neutral.white
                        }}
                      >
                        <option.icon size={20} style={{ 
                          color: preferences.dashboardLayout === option.id 
                            ? zsColors.primary.blue 
                            : zsColors.neutral.gray 
                        }} />
                        <span className="text-xs mt-1 block" style={{ 
                          color: preferences.dashboardLayout === option.id 
                            ? zsColors.primary.blue 
                            : zsColors.neutral.gray 
                        }}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-save Settings */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: zsColors.neutral.darkGray }}>
                    Auto-save Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) => updatePreference('autoSave', e.target.checked)}
                        className="rounded"
                        style={{ accentColor: zsColors.primary.blue }}
                      />
                      <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                        Enable auto-save
                      </span>
                    </label>
                    {preferences.autoSave && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: zsColors.neutral.gray }}>
                          Interval:
                        </span>
                        <select
                          value={preferences.autoSaveInterval}
                          onChange={(e) => updatePreference('autoSaveInterval', Number(e.target.value))}
                          className="text-xs px-2 py-1 rounded border"
                          style={{ 
                            borderColor: zsColors.neutral.lightGray,
                            color: zsColors.neutral.charcoal
                          }}
                        >
                          <option value={15000}>15 seconds</option>
                          <option value={30000}>30 seconds</option>
                          <option value={60000}>1 minute</option>
                          <option value={300000}>5 minutes</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: zsColors.neutral.darkGray }}>
                    Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.inApp}
                        onChange={(e) => updatePreference('notifications', {
                          ...preferences.notifications,
                          inApp: e.target.checked
                        })}
                        className="rounded"
                        style={{ accentColor: zsColors.primary.blue }}
                      />
                      <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                        In-app notifications
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => updatePreference('notifications', {
                          ...preferences.notifications,
                          email: e.target.checked
                        })}
                        className="rounded"
                        style={{ accentColor: zsColors.primary.blue }}
                      />
                      <span className="text-sm" style={{ color: zsColors.neutral.darkGray }}>
                        Email notifications
                      </span>
                    </label>
                  </div>
                </div>

                {/* Default Agent */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: zsColors.neutral.darkGray }}>
                    Default Agent
                  </label>
                  <select
                    value={preferences.defaultAgent}
                    onChange={(e) => updatePreference('defaultAgent', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border"
                    style={{ 
                      borderColor: zsColors.neutral.lightGray,
                      color: zsColors.neutral.charcoal
                    }}
                  >
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite Agents */}
      {favoriteAgents.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
            Favorite Agents
          </h3>
          <div className={getLayoutClass()}>
            {favoriteAgents.map(agent => (
              <AnimatedCard
                key={agent.id}
                className={`bg-white rounded-lg border ${getCardSize()}`}
                style={{ borderColor: zsColors.neutral.lightGray }}
                hoverScale={1.02}
              >
                <Link href={`/agents/${agent.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: agent.color + '20' }}
                      >
                        <agent.icon size={20} style={{ color: agent.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                          {agent.name}
                        </h4>
                        {agent.metrics && preferences.dashboardLayout !== 'compact' && (
                          <div className="mt-2 space-y-1">
                            {agent.metrics.slice(0, 2).map((metric, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span style={{ color: zsColors.neutral.gray }}>{metric.label}:</span>
                                <span style={{ color: zsColors.neutral.darkGray }}>{metric.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(agent.id);
                      }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Star size={16} style={{ 
                        color: zsColors.secondary.orange,
                        fill: zsColors.secondary.orange
                      }} />
                    </button>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* Recent Agents */}
      {recentAgents.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
            Recently Visited
          </h3>
          <div className={getLayoutClass()}>
            {recentAgents.map(agent => (
              <AnimatedCard
                key={agent.id}
                className={`bg-white rounded-lg border ${getCardSize()}`}
                style={{ borderColor: zsColors.neutral.lightGray }}
                hoverScale={1.02}
              >
                <Link href={`/agents/${agent.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: agent.color + '20' }}
                      >
                        <agent.icon size={20} style={{ color: agent.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                          {agent.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: zsColors.neutral.gray }}>
                          <Clock size={10} className="inline mr-1" />
                          Recently visited
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(agent.id);
                      }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {preferences.favoriteAgents.includes(agent.id) ? (
                        <Star size={16} style={{ 
                          color: zsColors.secondary.orange,
                          fill: zsColors.secondary.orange
                        }} />
                      ) : (
                        <StarOff size={16} style={{ color: zsColors.neutral.gray }} />
                      )}
                    </button>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* All Agents */}
      <div>
        <h3 className="text-base font-semibold mb-3" style={{ color: zsColors.neutral.charcoal }}>
          All Agents
        </h3>
        <div className={getLayoutClass()}>
          {agents.map(agent => (
            <AnimatedCard
              key={agent.id}
              className={`bg-white rounded-lg border ${getCardSize()}`}
              style={{ borderColor: zsColors.neutral.lightGray }}
              hoverScale={1.02}
            >
              <Link href={`/agents/${agent.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: agent.color + '20' }}
                    >
                      <agent.icon size={20} style={{ color: agent.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm" style={{ color: zsColors.neutral.charcoal }}>
                        {agent.name}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(agent.id);
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    {preferences.favoriteAgents.includes(agent.id) ? (
                      <Star size={16} style={{ 
                        color: zsColors.secondary.orange,
                        fill: zsColors.secondary.orange
                      }} />
                    ) : (
                      <StarOff size={16} style={{ color: zsColors.neutral.gray }} />
                    )}
                  </button>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}