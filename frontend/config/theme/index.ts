/**
 * ============================================
 * HEALTHCARE DESIGN SYSTEM - THEME CONFIGURATION
 * ============================================
 * 
 * Phiên bản: 1.0.0
 * Mục đích: Cung cấp hệ thống design tokens toàn diện cho ứng dụng Healthcare
 * Hỗ trợ: Light/Dark mode, Đa ngôn ngữ, Responsive, 3 User Roles
 */

export const theme = {
  /**
   * ===========================
   * 1. COLOR SYSTEM
   * ===========================
   */
  colors: {
    // Primary Colors - Xanh dương Healthcare chuyên nghiệp
    primary: {
      50: '#E0F2FE',   // Sky 100 - Very Light
      100: '#BAE6FD',  // Sky 200
      200: '#7DD3FC',  // Sky 300
      300: '#38BDF8',  // Sky 400
      400: '#0EA5E9',  // Sky 500 - Main Primary
      500: '#0284C7',  // Sky 600
      600: '#0369A1',  // Sky 700
      700: '#075985',  // Sky 800
      800: '#0C4A6E',  // Sky 900 - Very Dark
      900: '#082F49',  // Sky 950
    },

    // Secondary Colors - Xanh ngọc (Teal) cho accent
    secondary: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',  // Main Secondary
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },

    // Success - Xanh lá
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',  // Main Success
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },

    // Warning - Vàng/Cam
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',  // Main Warning
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },

    // Error - Đỏ
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',  // Main Error
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },

    // Info - Xanh dương nhạt
    info: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',  // Main Info
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },

    // Neutral - Slate cho text và backgrounds
    neutral: {
      50: '#F8FAFC',   // Background Light
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',  // Text Secondary
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',  // Text Primary Dark
      950: '#020617',  // Background Dark
    },

    // Semantic Colors cho UI States
    states: {
      online: '#22C55E',
      offline: '#94A3B8',
      busy: '#F59E0B',
      critical: '#EF4444',
      stable: '#14B8A6',
      normal: '#0EA5E9',
    }
  },

  /**
   * ===========================
   * 2. TYPOGRAPHY SYSTEM
   * ===========================
   */
  typography: {
    // Font Families
    fontFamily: {
      sans: ['Inter', 'Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
      display: ['Space Grotesk', 'Inter', 'sans-serif'],
      body: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
      mono: ['Fira Code', 'Courier New', 'monospace'],
    },

    // Font Sizes (rem based)
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.0125em' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],           // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],        // 18px
      xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.0125em' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],   // 24px
      '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.025em' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.0375em' }],  // 36px
      '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.05em' }],        // 48px
      '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.05em' }],    // 60px
    },

    // Font Weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // Heading Styles (với kích thước cố định cho consistency)
    headings: {
      h1: {
        fontSize: '3rem',       // 48px
        lineHeight: '3.5rem',
        fontWeight: '700',
        letterSpacing: '-0.05em',
      },
      h2: {
        fontSize: '2.25rem',    // 36px
        lineHeight: '2.75rem',
        fontWeight: '600',
        letterSpacing: '-0.0375em',
      },
      h3: {
        fontSize: '1.875rem',   // 30px
        lineHeight: '2.375rem',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h4: {
        fontSize: '1.5rem',     // 24px
        lineHeight: '2rem',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h5: {
        fontSize: '1.25rem',    // 20px
        lineHeight: '1.875rem',
        fontWeight: '600',
        letterSpacing: '-0.0125em',
      },
      h6: {
        fontSize: '1.125rem',   // 18px
        lineHeight: '1.75rem',
        fontWeight: '600',
        letterSpacing: '0',
      },
    },

    // Body Text Styles
    body: {
      large: {
        fontSize: '1.125rem',   // 18px
        lineHeight: '1.75rem',
        fontWeight: '400',
      },
      base: {
        fontSize: '1rem',       // 16px
        lineHeight: '1.5rem',
        fontWeight: '400',
      },
      small: {
        fontSize: '0.875rem',   // 14px
        lineHeight: '1.25rem',
        fontWeight: '400',
      },
    },

    // Caption & Label
    caption: {
      fontSize: '0.75rem',      // 12px
      lineHeight: '1rem',
      fontWeight: '400',
      letterSpacing: '0.025em',
    },
    label: {
      fontSize: '0.875rem',     // 14px
      lineHeight: '1.25rem',
      fontWeight: '500',
      letterSpacing: '0.0125em',
    },
  },

  /**
   * ===========================
   * 3. SPACING & LAYOUT SYSTEM
   * ===========================
   */
  spacing: {
    // Base spacing scale (8px grid)
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Container & Grid
  container: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%',
    },
    padding: {
      mobile: '1rem',    // 16px
      tablet: '2rem',    // 32px
      desktop: '2.5rem', // 40px
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },

  // Shadow System (cho Elevation)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    // Healthcare specific shadows
    card: '0 10px 30px -5px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
    cardHover: '0 20px 40px -10px rgba(14, 165, 233, 0.15), 0 8px 12px -4px rgba(14, 165, 233, 0.1)',
    soft: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgba(14, 165, 233, 0.5)',
  },

  /**
   * ===========================
   * 4. BREAKPOINTS (Responsive)
   * ===========================
   */
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px', // Extra large
  },

  /**
   * ===========================
   * 5. Z-INDEX LAYERS
   * ===========================
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },

  /**
   * ===========================
   * 6. ANIMATION & TRANSITIONS
   * ===========================
   */
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  /**
   * ===========================
   * 7. COMPONENT SPECIFIC TOKENS
   * ===========================
   */
  components: {
    // Sidebar
    sidebar: {
      width: '288px',      // 18rem
      widthCollapsed: '80px',
      padding: '1.5rem',
    },

    // Header/TopNav
    header: {
      height: '72px',
      padding: '1rem 2rem',
    },

    // Button Heights
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
    },

    // Input Heights
    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
    },

    // Card
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
      borderRadius: '0.75rem', // 12px
    },
  },
} as const;

export type Theme = typeof theme;

// Export individual sections for easier imports
export const { colors, typography, spacing, shadows, breakpoints } = theme;
