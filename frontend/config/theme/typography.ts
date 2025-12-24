/**
 * ============================================
 * TYPOGRAPHY SYSTEM - HEALTHCARE DESIGN SYSTEM
 * ============================================
 */

export const typography = {
  /**
   * Font Families
   */
  fontFamily: {
    sans: ['Inter', 'Roboto', 'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    display: ['Space Grotesk', 'Inter', 'sans-serif'],
    body: ['Be Vietnam Pro', 'Inter', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
  },

  /**
   * Heading Variants - Sử dụng trong components
   */
  headings: {
    h1: {
      fontSize: '3rem',           // 48px
      lineHeight: '1.167',        // 56px
      fontWeight: '700',
      letterSpacing: '-0.02em',
      fontFamily: 'var(--font-display)',
    },
    h2: {
      fontSize: '2.25rem',        // 36px
      lineHeight: '1.222',        // 44px
      fontWeight: '600',
      letterSpacing: '-0.015em',
      fontFamily: 'var(--font-display)',
    },
    h3: {
      fontSize: '1.875rem',       // 30px
      lineHeight: '1.267',        // 38px
      fontWeight: '600',
      letterSpacing: '-0.01em',
      fontFamily: 'var(--font-sans)',
    },
    h4: {
      fontSize: '1.5rem',         // 24px
      lineHeight: '1.333',        // 32px
      fontWeight: '600',
      letterSpacing: '-0.005em',
      fontFamily: 'var(--font-sans)',
    },
    h5: {
      fontSize: '1.25rem',        // 20px
      lineHeight: '1.4',          // 28px
      fontWeight: '600',
      letterSpacing: '0',
      fontFamily: 'var(--font-sans)',
    },
    h6: {
      fontSize: '1.125rem',       // 18px
      lineHeight: '1.556',        // 28px
      fontWeight: '600',
      letterSpacing: '0',
      fontFamily: 'var(--font-sans)',
    },
  },

  /**
   * Body Text Variants
   */
  body: {
    xlarge: {
      fontSize: '1.25rem',        // 20px
      lineHeight: '1.6',          // 32px
      fontWeight: '400',
    },
    large: {
      fontSize: '1.125rem',       // 18px
      lineHeight: '1.556',        // 28px
      fontWeight: '400',
    },
    base: {
      fontSize: '1rem',           // 16px
      lineHeight: '1.5',          // 24px
      fontWeight: '400',
    },
    small: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.429',        // 20px
      fontWeight: '400',
    },
    xsmall: {
      fontSize: '0.75rem',        // 12px
      lineHeight: '1.333',        // 16px
      fontWeight: '400',
    },
  },

  /**
   * Specialized Text Styles
   */
  label: {
    large: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.429',        // 20px
      fontWeight: '600',
      letterSpacing: '0.01em',
      textTransform: 'uppercase' as const,
    },
    base: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.429',        // 20px
      fontWeight: '500',
      letterSpacing: '0',
    },
    small: {
      fontSize: '0.75rem',        // 12px
      lineHeight: '1.333',        // 16px
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
  },

  caption: {
    base: {
      fontSize: '0.75rem',        // 12px
      lineHeight: '1.333',        // 16px
      fontWeight: '400',
      letterSpacing: '0.015em',
    },
    small: {
      fontSize: '0.6875rem',      // 11px
      lineHeight: '1.455',        // 16px
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
  },

  overline: {
    fontSize: '0.75rem',          // 12px
    lineHeight: '2',              // 24px
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },

  /**
   * Code & Mono Text
   */
  code: {
    inline: {
      fontSize: '0.875em',        // 14px (relative to parent)
      fontFamily: 'var(--font-mono)',
      backgroundColor: 'hsl(var(--muted))',
      padding: '0.125rem 0.375rem',
      borderRadius: '0.25rem',
    },
    block: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.714',        // 24px
      fontFamily: 'var(--font-mono)',
      backgroundColor: 'hsl(var(--muted))',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  },

  /**
   * Medical/Healthcare Specific Typography
   */
  medical: {
    // Vital Signs Display (large numbers)
    vitalValue: {
      fontSize: '2.5rem',         // 40px
      lineHeight: '1.2',          // 48px
      fontWeight: '700',
      fontFamily: 'var(--font-display)',
      letterSpacing: '-0.02em',
    },
    vitalUnit: {
      fontSize: '1rem',           // 16px
      lineHeight: '1.5',
      fontWeight: '500',
      color: 'hsl(var(--foreground-muted))',
    },
    vitalLabel: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.429',
      fontWeight: '500',
      letterSpacing: '0.01em',
      textTransform: 'uppercase' as const,
    },

    // Patient Information
    patientName: {
      fontSize: '1.5rem',         // 24px
      lineHeight: '1.333',
      fontWeight: '600',
    },
    patientId: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.429',
      fontWeight: '500',
      fontFamily: 'var(--font-mono)',
      color: 'hsl(var(--foreground-muted))',
    },

    // Medical Notes
    note: {
      fontSize: '0.875rem',       // 14px
      lineHeight: '1.714',        // 24px
      fontWeight: '400',
      fontFamily: 'var(--font-body)',
    },

    // Timestamps
    timestamp: {
      fontSize: '0.75rem',        // 12px
      lineHeight: '1.333',
      fontWeight: '400',
      fontFamily: 'var(--font-mono)',
      color: 'hsl(var(--foreground-muted))',
    },
  },
} as const;

/**
 * Typography Utilities - CSS Classes
 */
export const typographyClasses = {
  // Headings
  h1: 'text-5xl font-bold leading-tight tracking-tight font-display',
  h2: 'text-4xl font-semibold leading-tight tracking-tight font-display',
  h3: 'text-3xl font-semibold leading-snug tracking-tight',
  h4: 'text-2xl font-semibold leading-snug',
  h5: 'text-xl font-semibold leading-normal',
  h6: 'text-lg font-semibold leading-normal',

  // Body
  'body-xlarge': 'text-xl leading-relaxed',
  'body-large': 'text-lg leading-relaxed',
  'body-base': 'text-base leading-normal',
  'body-small': 'text-sm leading-normal',
  'body-xsmall': 'text-xs leading-tight',

  // Labels
  'label-large': 'text-sm font-semibold uppercase tracking-wide',
  'label-base': 'text-sm font-medium',
  'label-small': 'text-xs font-medium tracking-wide',

  // Caption & Overline
  caption: 'text-xs leading-tight tracking-wide text-muted-foreground',
  overline: 'text-xs font-semibold uppercase tracking-widest leading-loose',

  // Medical
  'vital-value': 'text-5xl font-bold font-display tracking-tight',
  'vital-unit': 'text-base font-medium text-muted-foreground',
  'vital-label': 'text-sm font-medium uppercase tracking-wide',
  'patient-name': 'text-2xl font-semibold',
  'patient-id': 'text-sm font-medium font-mono text-muted-foreground',
  'medical-note': 'text-sm leading-relaxed font-body',
  'timestamp': 'text-xs font-mono text-muted-foreground',
};

/**
 * Responsive Typography Scales
 * Sử dụng với Tailwind responsive prefixes: sm:, md:, lg:, xl:
 */
export const responsiveTypography = {
  h1: {
    base: 'text-3xl md:text-4xl lg:text-5xl',
    lineHeight: 'leading-tight',
  },
  h2: {
    base: 'text-2xl md:text-3xl lg:text-4xl',
    lineHeight: 'leading-tight',
  },
  h3: {
    base: 'text-xl md:text-2xl lg:text-3xl',
    lineHeight: 'leading-snug',
  },
  hero: {
    base: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    lineHeight: 'leading-none md:leading-tight',
  },
};

/**
 * Line Clamp Utilities (for truncation)
 */
export const lineClamp = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  none: 'line-clamp-none',
};

export type Typography = typeof typography;
export type TypographyClasses = typeof typographyClasses;
