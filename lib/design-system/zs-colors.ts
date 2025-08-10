// ZS-inspired color system based on official ZS design
export const zsColors = {
  // Primary Colors - ZS Navy/Blue Theme
  primary: {
    navy: '#002B5C',        // Deep Navy Blue (Primary)
    blue: '#0075BE',        // Bright Blue (Secondary)
    lightBlue: '#00A3E0',   // Light Blue (Accent)
    navyBg: '#f0f4f8',      // Light navy background
  },
  
  // Secondary Colors
  secondary: {
    orange: '#FF9800',      // Orange (Warning)
    green: '#4CAF50',       // Green (Success)
    red: '#F44336',         // Red (Error)
    teal: '#00BCD4',        // Teal (Info)
    blue: '#0075BE',        // Blue (Secondary)
    purple: '#9C27B0',      // Purple (Accent)
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F5F5F5',    // Surface
    lightGray: '#E0E0E0',   // Light Gray
    gray: '#757575',        // Text Secondary
    darkGray: '#424242',    // Text Primary Dark
    charcoal: '#212121',    // Text Primary
    black: '#000000',
  },
  
  // Agent-specific colors (using ZS palette)
  agents: {
    customer: {
      primary: '#002B5C',   // Navy (Start of flow)
      light: '#0075BE',
      bg: '#f0f4f8',
      gradient: 'from-blue-900 to-blue-800'
    },
    budget: {
      primary: '#0075BE',   // Bright Blue
      light: '#00A3E0',
      bg: '#f0f8ff',
      gradient: 'from-blue-600 to-blue-700'
    },
    content: {
      primary: '#00A3E0',   // Light Blue
      light: '#4FC3F7',
      bg: '#e6f7ff',
      gradient: 'from-sky-500 to-blue-500'
    },
    orchestration: {
      primary: '#FF9800',   // Orange (AI/ML emphasis)
      light: '#FFB74D',
      bg: '#fff3e0',
      gradient: 'from-orange-500 to-orange-600'
    },
    suggestions: {
      primary: '#00BCD4',   // Teal (Info/Suggestions)
      light: '#4DD0E1',
      bg: '#e0f7fa',
      gradient: 'from-cyan-500 to-teal-500'
    },
    copilot: {
      primary: '#4CAF50',   // Green (Success/Execution)
      light: '#66BB6A',
      bg: '#e8f5e9',
      gradient: 'from-green-500 to-green-600'
    }
  },
  
  // Semantic Colors
  semantic: {
    success: '#4CAF50',     // Green
    warning: '#FF9800',     // Orange
    error: '#F44336',       // Red
    info: '#00BCD4'         // Teal
  },
  
  // Shadows for light theme
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    navy: '0 4px 14px 0 rgba(0, 43, 92, 0.25)',
    blue: '0 4px 14px 0 rgba(0, 117, 190, 0.25)'
  }
};

// Helper function to get agent color by ID
export function getAgentColor(agentId: string) {
  const agentColorMap: Record<string, typeof zsColors.agents.customer> = {
    customer: zsColors.agents.customer,
    budget: zsColors.agents.budget,
    content: zsColors.agents.content,
    orchestration: zsColors.agents.orchestration,
    suggestions: zsColors.agents.suggestions,
    copilot: zsColors.agents.copilot
  };
  
  return agentColorMap[agentId] || zsColors.agents.customer;
}

// CSS variables for global usage
export const zsCssVariables = `
  :root {
    /* Primary Colors */
    --zs-navy: ${zsColors.primary.navy};
    --zs-blue: ${zsColors.primary.blue};
    --zs-light-blue: ${zsColors.primary.lightBlue};
    --zs-navy-bg: ${zsColors.primary.navyBg};
    
    /* Secondary Colors */
    --zs-orange: ${zsColors.secondary.orange};
    --zs-green: ${zsColors.secondary.green};
    --zs-red: ${zsColors.secondary.red};
    --zs-teal: ${zsColors.secondary.teal};
    
    /* Neutral Colors */
    --zs-white: ${zsColors.neutral.white};
    --zs-off-white: ${zsColors.neutral.offWhite};
    --zs-light-gray: ${zsColors.neutral.lightGray};
    --zs-gray: ${zsColors.neutral.gray};
    --zs-dark-gray: ${zsColors.neutral.darkGray};
    --zs-charcoal: ${zsColors.neutral.charcoal};
    --zs-black: ${zsColors.neutral.black};
  }
`;