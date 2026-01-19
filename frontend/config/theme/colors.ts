/**
 * ============================================
 * COLOR TOKENS - HEALTHCARE DESIGN SYSTEM
 * ============================================
 * 
 * CSS Variables cho Light & Dark Mode
 * Sử dụng HSL format để dễ dàng điều chỉnh saturation/lightness
 */

export const lightModeColors = {
  // Background Colors
  '--background': '210 40% 98%',        // #F8FAFC - Slate 50
  '--background-alt': '210 40% 96%',    // Slightly darker background
  '--surface': '0 0% 100%',             // Pure white for cards
  '--surface-hover': '210 40% 97%',     // Hover state
  
  // Foreground/Text Colors
  '--foreground': '222 47% 11%',        // #0F172A - Slate 900 (Primary text)
  '--foreground-muted': '215 16% 47%',  // #64748B - Slate 500 (Secondary text)
  '--foreground-subtle': '214 32% 91%', // Very light text
  
  // Primary Brand Colors (Blue Healthcare)
  '--primary': '199 89% 48%',           // #0EA5E9 - Sky 500
  '--primary-hover': '199 89% 42%',     // Darker on hover
  '--primary-active': '199 89% 38%',    // Even darker on active
  '--primary-foreground': '210 40% 98%', // Text on primary background
  '--primary-light': '199 89% 96%',     // #E0F2FE - Very light primary
  '--primary-dark': '199 89% 28%',      // Dark variant
  
  // Secondary Colors (Teal Accent)
  '--secondary': '174 84% 38%',         // #14B8A6 - Teal 500
  '--secondary-hover': '174 84% 32%',
  '--secondary-foreground': '0 0% 100%',
  '--secondary-light': '174 84% 94%',
  '--secondary-dark': '174 84% 25%',
  
  // Accent Colors
  '--accent': '217 91% 60%',            // #3B82F6 - Blue 500
  '--accent-hover': '217 91% 54%',
  '--accent-foreground': '0 0% 100%',
  
  // Status Colors
  '--success': '142 71% 45%',           // #22C55E - Green 500
  '--success-light': '142 71% 95%',
  '--success-foreground': '0 0% 100%',
  
  '--warning': '38 92% 50%',            // #FBBF24 - Yellow 400
  '--warning-light': '38 92% 95%',
  '--warning-foreground': '222 47% 11%',
  
  '--error': '0 84% 60%',               // #EF4444 - Red 500
  '--error-light': '0 84% 97%',
  '--error-foreground': '0 0% 100%',
  
  '--info': '217 91% 60%',              // #3B82F6 - Blue 500
  '--info-light': '217 91% 95%',
  '--info-foreground': '0 0% 100%',
  
  // UI Element Colors
  '--border': '214 32% 91%',            // #E2E8F0 - Slate 200
  '--border-hover': '215 25% 80%',
  '--border-focus': '199 89% 48%',      // Primary color on focus
  
  '--input': '214 32% 91%',
  '--input-hover': '215 25% 85%',
  '--input-focus': '199 89% 48%',
  
  '--ring': '199 89% 48%',              // Focus ring (primary)
  '--ring-offset': '0 0% 100%',
  
  // Card & Panel
  '--card': '0 0% 100%',
  '--card-hover': '210 40% 98%',
  '--card-foreground': '222 47% 11%',
  '--card-border': '214 32% 91%',
  
  // Muted/Disabled States
  '--muted': '210 40% 96%',
  '--muted-hover': '210 40% 93%',
  '--muted-foreground': '215 16% 47%',
  
  '--disabled': '214 32% 91%',
  '--disabled-foreground': '215 16% 65%',
  
  // Popover, Dropdown, Modal
  '--popover': '0 0% 100%',
  '--popover-foreground': '222 47% 11%',
  '--popover-border': '214 32% 91%',
  
  '--dropdown': '0 0% 100%',
  '--dropdown-hover': '210 40% 97%',
  
  // Sidebar & Navigation (Light mode uses darker tones)
  '--sidebar-bg': '222 47% 11%',        // Dark sidebar in light mode
  '--sidebar-hover': '217 33% 17%',
  '--sidebar-active': '199 89% 48%',
  '--sidebar-foreground': '210 40% 98%',
  '--sidebar-border': '217 33% 17%',
  
  // Header/TopNav
  '--header-bg': '0 0% 100%',
  '--header-border': '214 32% 91%',
  '--header-foreground': '222 47% 11%',
  
  // Medical/Healthcare Specific
  '--vital-normal': '174 84% 38%',      // Teal - Normal vitals
  '--vital-elevated': '38 92% 50%',     // Yellow - Warning
  '--vital-critical': '0 84% 60%',      // Red - Critical
  '--vital-low': '217 91% 60%',         // Blue - Low
  
  // Patient Status
  '--status-stable': '142 71% 45%',     // Green
  '--status-observation': '38 92% 50%', // Yellow
  '--status-critical': '0 84% 60%',     // Red
  '--status-discharged': '215 16% 47%', // Gray
  
  // ECG/Signal Colors
  '--ecg-signal': '142 71% 45%',        // Green for ECG trace
  '--ppg-signal': '0 84% 60%',          // Red for PPG
  '--pcg-signal': '217 91% 60%',        // Blue for PCG
  '--spo2-signal': '199 89% 48%',       // Sky for SpO2
};

export const darkModeColors = {
  // Background Colors
  '--background': '222 47% 11%',        // #0F172A - Slate 900
  '--background-alt': '217 33% 17%',    // Slate 800
  '--surface': '217 33% 17%',           // Slate 800 for cards
  '--surface-hover': '215 25% 27%',     // Lighter on hover
  
  // Foreground/Text Colors
  '--foreground': '210 40% 98%',        // #F8FAFC - Slate 50 (Primary text)
  '--foreground-muted': '215 16% 65%',  // Muted text
  '--foreground-subtle': '215 25% 27%', // Very subtle text
  
  // Primary Brand Colors
  '--primary': '199 89% 48%',           // #0EA5E9 - Sky 500 (same in dark)
  '--primary-hover': '199 89% 55%',     // Lighter on hover in dark mode
  '--primary-active': '199 89% 60%',
  '--primary-foreground': '222 47% 11%', // Dark text on primary
  '--primary-light': '199 89% 20%',     // Darker tint for dark mode
  '--primary-dark': '199 89% 65%',      // Lighter for dark mode
  
  // Secondary Colors
  '--secondary': '174 84% 38%',         // Teal
  '--secondary-hover': '174 84% 45%',
  '--secondary-foreground': '222 47% 11%',
  '--secondary-light': '174 84% 20%',
  '--secondary-dark': '174 84% 50%',
  
  // Accent
  '--accent': '217 91% 60%',            // Blue
  '--accent-hover': '217 91% 67%',
  '--accent-foreground': '222 47% 11%',
  
  // Status Colors (adjusted for dark mode)
  '--success': '142 71% 45%',
  '--success-light': '142 71% 20%',
  '--success-foreground': '222 47% 11%',
  
  '--warning': '38 92% 50%',
  '--warning-light': '38 92% 20%',
  '--warning-foreground': '222 47% 11%',
  
  '--error': '0 84% 60%',
  '--error-light': '0 84% 25%',
  '--error-foreground': '210 40% 98%',
  
  '--info': '217 91% 60%',
  '--info-light': '217 91% 25%',
  '--info-foreground': '222 47% 11%',
  
  // UI Elements
  '--border': '217 33% 17%',            // Slate 800
  '--border-hover': '215 25% 27%',
  '--border-focus': '199 89% 48%',
  
  '--input': '217 33% 17%',
  '--input-hover': '215 25% 27%',
  '--input-focus': '199 89% 48%',
  
  '--ring': '199 89% 48%',
  '--ring-offset': '222 47% 11%',
  
  // Card
  '--card': '217 33% 17%',
  '--card-hover': '215 25% 27%',
  '--card-foreground': '210 40% 98%',
  '--card-border': '215 25% 27%',
  
  // Muted
  '--muted': '217 33% 17%',
  '--muted-hover': '215 25% 27%',
  '--muted-foreground': '215 16% 65%',
  
  '--disabled': '217 33% 17%',
  '--disabled-foreground': '215 16% 47%',
  
  // Popover
  '--popover': '217 33% 17%',
  '--popover-foreground': '210 40% 98%',
  '--popover-border': '215 25% 27%',
  
  '--dropdown': '217 33% 17%',
  '--dropdown-hover': '215 25% 27%',
  
  // Sidebar (lighter in dark mode)
  '--sidebar-bg': '222 47% 11%',
  '--sidebar-hover': '217 33% 17%',
  '--sidebar-active': '199 89% 48%',
  '--sidebar-foreground': '210 40% 98%',
  '--sidebar-border': '217 33% 17%',
  
  // Header
  '--header-bg': '217 33% 17%',
  '--header-border': '215 25% 27%',
  '--header-foreground': '210 40% 98%',
  
  // Medical (same as light mode for consistency in charts)
  '--vital-normal': '174 84% 38%',
  '--vital-elevated': '38 92% 50%',
  '--vital-critical': '0 84% 60%',
  '--vital-low': '217 91% 60%',
  
  '--status-stable': '142 71% 45%',
  '--status-observation': '38 92% 50%',
  '--status-critical': '0 84% 60%',
  '--status-discharged': '215 16% 65%',
  
  '--ecg-signal': '142 71% 45%',
  '--ppg-signal': '0 84% 60%',
  '--pcg-signal': '217 91% 60%',
  '--spo2-signal': '199 89% 48%',
};

/**
 * Generate CSS string for color variables
 */
export function generateColorCSS(mode: 'light' | 'dark' = 'light') {
  const colors = mode === 'light' ? lightModeColors : darkModeColors;
  return Object.entries(colors)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Role-based color schemes (optional - for role-specific branding)
 */
export const roleColors = {
  patient: {
    primary: '199 89% 48%',      // Sky Blue
    accent: '217 91% 60%',       // Blue
    gradient: 'from-sky-500 to-blue-500',
  },
  doctor: {
    primary: '174 84% 38%',      // Teal
    accent: '142 71% 45%',       // Green
    gradient: 'from-teal-500 to-green-500',
  },
  admin: {
    primary: '262 83% 58%',      // Purple
    accent: '271 81% 56%',       // Violet
    gradient: 'from-purple-500 to-violet-500',
  },
};
