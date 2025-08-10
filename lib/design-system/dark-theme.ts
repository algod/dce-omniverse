// Dark mode color palette for DCE OmniVerse
export const darkTheme = {
  // Primary colors
  primary: {
    navy: '#1e3a5f',      // Lighter navy for dark mode
    blue: '#4da3e8',      // Brighter blue for contrast
    orange: '#ff9847',    // Warmer orange
  },
  
  // Secondary colors
  secondary: {
    teal: '#4dd0e1',
    purple: '#ab7ff0',
    green: '#66bb6a',
    orange: '#ffb74d',
    pink: '#f48fb1',
    blue: '#64b5f6',
  },
  
  // Neutral colors for dark mode
  neutral: {
    white: '#0a0f1c',       // Deep dark background
    offWhite: '#111827',    // Slightly lighter dark
    lightGray: '#1f2937',   // Dark gray
    gray: '#6b7280',        // Medium gray
    darkGray: '#d1d5db',    // Light gray for text
    charcoal: '#f3f4f6',    // Near white for primary text
  },
  
  // Agent colors (slightly adjusted for dark mode)
  agents: {
    customer: {
      primary: '#60a5fa',
      light: '#93bbfc',
      dark: '#3b82f6',
    },
    budget: {
      primary: '#34d399',
      light: '#6ee7b7',
      dark: '#10b981',
    },
    content: {
      primary: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    orchestration: {
      primary: '#a78bfa',
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    suggestions: {
      primary: '#f472b6',
      light: '#f9a8d4',
      dark: '#ec4899',
    },
    copilot: {
      primary: '#14b8a6',
      light: '#5eead4',
      dark: '#0d9488',
    },
  },
  
  // Status colors for dark mode
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#c62828',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  
  // Shadow adjustments for dark mode
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.6)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.7)',
  },
};

// Helper function to get theme based on dark mode
import { zsColors } from './zs-colors';

export function getThemeColors(isDarkMode: boolean) {
  if (isDarkMode) {
    return darkTheme;
  }
  // Return the original zsColors
  return zsColors;
}