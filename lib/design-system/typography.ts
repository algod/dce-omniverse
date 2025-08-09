// ZS-inspired typography system
export const typography = {
  // Font families
  fontFamily: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    body: '"Open Sans", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    mono: '"JetBrains Mono", "Roboto Mono", "SF Mono", "Monaco", "Consolas", monospace'
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem'  // 60px
  },
  
  // Font weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },
  
  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  
  // Text styles
  textStyles: {
    // Headings
    h1: {
      fontFamily: 'heading',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em'
    },
    h2: {
      fontFamily: 'heading',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em'
    },
    h3: {
      fontFamily: 'heading',
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '-0.025em'
    },
    h4: {
      fontFamily: 'heading',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontFamily: 'heading',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    h6: {
      fontFamily: 'heading',
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    
    // Body text
    bodyLarge: {
      fontFamily: 'body',
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.625,
      letterSpacing: '0'
    },
    body: {
      fontFamily: 'body',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    bodySmall: {
      fontFamily: 'body',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    
    // Special text
    label: {
      fontFamily: 'body',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
      textTransform: 'uppercase'
    },
    caption: {
      fontFamily: 'body',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.025em'
    },
    overline: {
      fontFamily: 'body',
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    button: {
      fontFamily: 'body',
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
      textTransform: 'none'
    },
    code: {
      fontFamily: 'mono',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0'
    }
  }
};

// Tailwind CSS class mappings
export const tailwindTypography = {
  fontFamily: {
    heading: typography.fontFamily.heading.split(','),
    body: typography.fontFamily.body.split(','),
    mono: typography.fontFamily.mono.split(',')
  },
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
  lineHeight: typography.lineHeight,
  letterSpacing: typography.letterSpacing
};

// Utility functions for applying text styles
export const getTextStyle = (style: keyof typeof typography.textStyles) => {
  const textStyle = typography.textStyles[style];
  return {
    fontFamily: typography.fontFamily[textStyle.fontFamily as keyof typeof typography.fontFamily],
    fontSize: textStyle.fontSize,
    fontWeight: textStyle.fontWeight,
    lineHeight: textStyle.lineHeight,
    letterSpacing: textStyle.letterSpacing,
    textTransform: (textStyle as any).textTransform || 'none'
  };
};

// CSS classes for text styles
export const textClasses = {
  h1: 'font-heading text-5xl font-bold leading-tight tracking-tight',
  h2: 'font-heading text-4xl font-semibold leading-snug tracking-tight',
  h3: 'font-heading text-3xl font-semibold leading-snug tracking-tight',
  h4: 'font-heading text-2xl font-semibold leading-normal tracking-tight',
  h5: 'font-heading text-xl font-semibold leading-normal',
  h6: 'font-heading text-lg font-semibold leading-normal',
  bodyLarge: 'font-body text-lg font-normal leading-relaxed',
  body: 'font-body text-base font-normal leading-normal',
  bodySmall: 'font-body text-sm font-normal leading-normal',
  label: 'font-body text-sm font-medium leading-normal tracking-wide uppercase',
  caption: 'font-body text-xs font-normal leading-normal tracking-wide',
  overline: 'font-body text-xs font-semibold leading-normal tracking-widest uppercase',
  button: 'font-body text-sm font-semibold leading-normal tracking-wide',
  code: 'font-mono text-sm font-normal leading-normal'
};

// CSS variables for global usage
export const cssVariables = `
  :root {
    --font-heading: ${typography.fontFamily.heading};
    --font-body: ${typography.fontFamily.body};
    --font-mono: ${typography.fontFamily.mono};
  }
`;