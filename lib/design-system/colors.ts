// ZS-inspired color palette for DCE OmniVerse
export const colors = {
  // Primary colors
  primary: {
    main: '#002B5C',    // Deep Navy Blue - main brand color
    light: '#1A4B7C',   // Lighter navy for hover states
    dark: '#001A3C',    // Darker navy for active states
    contrast: '#FFFFFF' // White text on primary
  },
  
  // Secondary colors
  secondary: {
    main: '#0075BE',    // Bright Blue - technology/innovation
    light: '#3395CE',   // Lighter blue for hover
    dark: '#00558E',    // Darker blue for active
    contrast: '#FFFFFF' // White text on secondary
  },
  
  // Accent colors
  accent: {
    main: '#00A3E0',    // Light Blue - clarity/communication
    light: '#33B8E8',   // Lighter accent
    dark: '#007DB0',    // Darker accent
    contrast: '#FFFFFF' // White text on accent
  },
  
  // Semantic colors
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    background: '#E8F5E9'
  },
  
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    background: '#FFF3E0'
  },
  
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    background: '#FFEBEE'
  },
  
  info: {
    main: '#00A3E0',
    light: '#4FC3F7',
    dark: '#0277BD',
    background: '#E1F5FE'
  },
  
  // Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  
  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    hint: '#9E9E9E',
    inverse: '#FFFFFF'
  },
  
  // Border colors
  border: {
    default: '#E0E0E0',
    light: '#F5F5F5',
    dark: '#BDBDBD',
    focus: '#0075BE'
  },
  
  // Agent-specific colors
  agents: {
    customer: '#002B5C',      // Navy - Foundation
    budget: '#0075BE',         // Bright Blue - Resources
    content: '#00A3E0',        // Light Blue - Communication
    orchestration: '#4CAF50',  // Green - Optimization
    suggestions: '#FF9800',    // Orange - Insights
    copilot: '#8B5CF6'        // Purple - Assistance
  },
  
  // Barrier colors
  barriers: {
    B001: '#E91E63', // Referral pathways - Pink
    B002: '#FF5722', // Side effects - Deep Orange
    B003: '#FF9800', // Insurance - Orange
    B004: '#FFC107', // Formulary - Amber
    B005: '#9C27B0'  // Diagnostic - Purple
  },
  
  // Chart colors (for data visualization)
  charts: {
    series1: '#002B5C',
    series2: '#0075BE',
    series3: '#00A3E0',
    series4: '#4CAF50',
    series5: '#FF9800',
    series6: '#8B5CF6',
    series7: '#E91E63',
    series8: '#607D8B'
  }
};

// Tailwind CSS class mappings
export const tailwindColors = {
  primary: {
    DEFAULT: colors.primary.main,
    light: colors.primary.light,
    dark: colors.primary.dark
  },
  secondary: {
    DEFAULT: colors.secondary.main,
    light: colors.secondary.light,
    dark: colors.secondary.dark
  },
  accent: {
    DEFAULT: colors.accent.main,
    light: colors.accent.light,
    dark: colors.accent.dark
  }
};

// Utility function to get agent color
export const getAgentColor = (agentId: string): string => {
  return colors.agents[agentId as keyof typeof colors.agents] || colors.primary.main;
};

// Utility function to get barrier color
export const getBarrierColor = (barrierId: string): string => {
  return colors.barriers[barrierId as keyof typeof colors.barriers] || colors.gray[500];
};

// CSS variables for global usage
export const cssVariables = `
  :root {
    --color-primary: ${colors.primary.main};
    --color-primary-light: ${colors.primary.light};
    --color-primary-dark: ${colors.primary.dark};
    --color-secondary: ${colors.secondary.main};
    --color-secondary-light: ${colors.secondary.light};
    --color-secondary-dark: ${colors.secondary.dark};
    --color-accent: ${colors.accent.main};
    --color-accent-light: ${colors.accent.light};
    --color-accent-dark: ${colors.accent.dark};
    --color-success: ${colors.success.main};
    --color-warning: ${colors.warning.main};
    --color-error: ${colors.error.main};
    --color-info: ${colors.info.main};
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-background: ${colors.background.default};
    --color-surface: ${colors.background.paper};
    --color-border: ${colors.border.default};
  }
`;