const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./config/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /**
       * ========================================
       * COLORS - Healthcare Design System
       * ========================================
       */
      colors: {
        // Base CSS Variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary (Sky Blue)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
        },

        // Secondary (Teal)
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          dark: "hsl(var(--secondary-dark))",
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },

        // Accent
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--accent-hover))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // Status Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          foreground: "hsl(var(--success-foreground))",
          50: '#F0FDF4',
          500: '#22C55E',
          700: '#15803D',
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
          foreground: "hsl(var(--warning-foreground))",
          50: '#FFFBEB',
          500: '#FBBF24',
          700: '#B45309',
        },

        error: {
          DEFAULT: "hsl(var(--error))",
          light: "hsl(var(--error-light))",
          foreground: "hsl(var(--error-foreground))",
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },

        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
          foreground: "hsl(var(--info-foreground))",
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
        },

        // Destructive (legacy support)
        destructive: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },

        // Muted & Disabled
        muted: {
          DEFAULT: "hsl(var(--muted))",
          hover: "hsl(var(--muted-hover))",
          foreground: "hsl(var(--muted-foreground))",
        },

        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
        },

        // Card & Surfaces
        card: {
          DEFAULT: "hsl(var(--card))",
          hover: "hsl(var(--card-hover))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },

        // Popover & Dropdown
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          border: "hsl(var(--popover-border))",
        },

        dropdown: {
          DEFAULT: "hsl(var(--dropdown))",
          hover: "hsl(var(--dropdown-hover))",
        },

        // Layout Components
        sidebar: {
          bg: "hsl(var(--sidebar-bg))",
          hover: "hsl(var(--sidebar-hover))",
          active: "hsl(var(--sidebar-active))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
        },

        header: {
          bg: "hsl(var(--header-bg))",
          border: "hsl(var(--header-border))",
          foreground: "hsl(var(--header-foreground))",
        },

        // Medical/Healthcare Specific
        vital: {
          normal: "hsl(var(--vital-normal))",
          elevated: "hsl(var(--vital-elevated))",
          critical: "hsl(var(--vital-critical))",
          low: "hsl(var(--vital-low))",
        },

        signal: {
          ecg: "hsl(var(--ecg-signal))",
          ppg: "hsl(var(--ppg-signal))",
          pcg: "hsl(var(--pcg-signal))",
          spo2: "hsl(var(--spo2-signal))",
        },
      },

      /**
       * ========================================
       * TYPOGRAPHY
       * ========================================
       */
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.0125em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.0125em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.0375em' }],
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.05em' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.05em' }],
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Roboto", "Open Sans", ...fontFamily.sans],
        display: ["var(--font-space-grotesk)", "var(--font-sans)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "var(--font-sans)", "sans-serif"],
        mono: ["Fira Code", "Consolas", "Monaco", ...fontFamily.mono],
      },

      /**
       * ========================================
       * SPACING & LAYOUT
       * ========================================
       */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        // Standard shadows
        soft: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        subtle: '0 4px 15px -2px rgba(0, 0, 0, 0.05)',
        
        // Healthcare specific shadows
        card: '0 10px 30px -5px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
        'card-hover': '0 20px 40px -10px rgba(14, 165, 233, 0.15), 0 8px 12px -4px rgba(14, 165, 233, 0.1)',
        glow: '0 0 20px rgba(14, 165, 233, 0.5)',
      },

      /**
       * ========================================
       * ANIMATIONS
       * ========================================
       */
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      /**
       * ========================================
       * Z-INDEX
       * ========================================
       */
      zIndex: {
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        notification: '1080',
      },

      /**
       * ========================================
       * CONTAINER
       * ========================================
       */
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '2.5rem',
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")]
};
