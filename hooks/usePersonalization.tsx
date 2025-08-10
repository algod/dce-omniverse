'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultAgent: string;
  favoriteAgents: string[];
  dashboardLayout: 'grid' | 'list' | 'compact';
  chartType: 'line' | 'bar' | 'area';
  autoSave: boolean;
  autoSaveInterval: number;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  shortcuts: Record<string, string>;
  recentActions: Array<{
    action: string;
    timestamp: Date;
    context?: any;
  }>;
  savedScenarios: Array<{
    id: string;
    name: string;
    data: any;
    timestamp: Date;
  }>;
  customDashboards: Array<{
    id: string;
    name: string;
    widgets: any[];
  }>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  defaultAgent: 'customer',
  favoriteAgents: [],
  dashboardLayout: 'grid',
  chartType: 'line',
  autoSave: true,
  autoSaveInterval: 30000,
  notifications: {
    email: true,
    push: false,
    inApp: true
  },
  shortcuts: {},
  recentActions: [],
  savedScenarios: [],
  customDashboards: []
};

export function usePersonalization() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        try {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
        } catch {
          return DEFAULT_PREFERENCES;
        }
      }
    }
    return DEFAULT_PREFERENCES;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Track user actions for personalization
  const trackAction = useCallback((action: string, context?: any) => {
    setPreferences(prev => ({
      ...prev,
      recentActions: [
        { action, timestamp: new Date(), context },
        ...prev.recentActions.slice(0, 49) // Keep last 50 actions
      ]
    }));
  }, []);

  // Update preference
  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Add favorite agent
  const addFavoriteAgent = useCallback((agentId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteAgents: [...new Set([...prev.favoriteAgents, agentId])]
    }));
  }, []);

  // Remove favorite agent
  const removeFavoriteAgent = useCallback((agentId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteAgents: prev.favoriteAgents.filter(id => id !== agentId)
    }));
  }, []);

  // Save scenario
  const saveScenario = useCallback((name: string, data: any) => {
    const scenario = {
      id: Date.now().toString(),
      name,
      data,
      timestamp: new Date()
    };
    
    setPreferences(prev => ({
      ...prev,
      savedScenarios: [scenario, ...prev.savedScenarios.slice(0, 19)] // Keep last 20
    }));
    
    return scenario.id;
  }, []);

  // Delete scenario
  const deleteScenario = useCallback((id: string) => {
    setPreferences(prev => ({
      ...prev,
      savedScenarios: prev.savedScenarios.filter(s => s.id !== id)
    }));
  }, []);

  // Add custom shortcut
  const addShortcut = useCallback((key: string, action: string) => {
    setPreferences(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [key]: action
      }
    }));
  }, []);

  // Create custom dashboard
  const createDashboard = useCallback((name: string, widgets: any[]) => {
    const dashboard = {
      id: Date.now().toString(),
      name,
      widgets
    };
    
    setPreferences(prev => ({
      ...prev,
      customDashboards: [...prev.customDashboards, dashboard]
    }));
    
    return dashboard.id;
  }, []);

  // Get personalized recommendations
  const getRecommendations = useCallback(() => {
    const recommendations = [];
    
    // Analyze recent actions
    const actionCounts = preferences.recentActions.reduce((acc, action) => {
      acc[action.action] = (acc[action.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Most used features
    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);
    
    // Time-based recommendations
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      recommendations.push({
        type: 'time',
        message: 'Good morning! Review overnight alerts and priority HCPs',
        action: 'viewAlerts'
      });
    } else if (currentHour < 17) {
      recommendations.push({
        type: 'time',
        message: 'Afternoon check: Review field feedback and adjust campaigns',
        action: 'reviewFeedback'
      });
    } else {
      recommendations.push({
        type: 'time',
        message: 'End of day: Review performance metrics and plan for tomorrow',
        action: 'viewMetrics'
      });
    }
    
    // Feature recommendations based on usage
    if (!preferences.favoriteAgents.length) {
      recommendations.push({
        type: 'feature',
        message: 'Add your frequently used agents to favorites for quick access',
        action: 'manageFavorites'
      });
    }
    
    if (!preferences.shortcuts || Object.keys(preferences.shortcuts).length < 3) {
      recommendations.push({
        type: 'feature',
        message: 'Set up keyboard shortcuts for faster navigation',
        action: 'configureShortcuts'
      });
    }
    
    return {
      topActions,
      recommendations
    };
  }, [preferences]);

  // Apply performance optimizations
  const applyPerformanceSettings = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Reduce motion for better performance
      if (preferences.dashboardLayout === 'compact') {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
      } else {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
      }
      
      // Lazy load images
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          img.setAttribute('loading', 'lazy');
        });
      }
    }
  }, [preferences.dashboardLayout]);

  useEffect(() => {
    applyPerformanceSettings();
    setIsLoading(false);
  }, [applyPerformanceSettings]);

  return {
    preferences,
    isLoading,
    updatePreference,
    addFavoriteAgent,
    removeFavoriteAgent,
    saveScenario,
    deleteScenario,
    addShortcut,
    createDashboard,
    trackAction,
    getRecommendations
  };
}