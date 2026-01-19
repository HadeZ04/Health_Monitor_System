/**
 * ============================================
 * LANGUAGE & THEME SWITCHER - SHARED COMPONENT
 * ============================================
 * 
 * Component chung để chuyển đổi:
 * - Ngôn ngữ (EN/VI)
 * - Theme (Light/Dark)
 * 
 * FEATURES:
 * - Toggle buttons compact
 * - Persistent preferences (localStorage)
 * - Smooth transitions
 * - Icon indicators
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon, Globe, Languages } from 'lucide-react';

/**
 * TYPES
 */
export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark' | 'system';

export interface LanguageThemeSwitcherProps {
  /**
   * Current language (controlled)
   */
  language?: Language;
  
  /**
   * Language change handler
   */
  onLanguageChange?: (lang: Language) => void;
  
  /**
   * Current theme (controlled)
   */
  theme?: Theme;
  
  /**
   * Theme change handler
   */
  onThemeChange?: (theme: Theme) => void;
  
  /**
   * Show language switcher
   * @default true
   */
  showLanguage?: boolean;
  
  /**
   * Show theme switcher
   * @default true
   */
  showTheme?: boolean;
  
  /**
   * Layout orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * SIZE CONFIG
 */
const sizeConfig = {
  sm: {
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
    text: 'text-xs',
  },
  md: {
    button: 'h-9 w-9',
    icon: 'h-5 w-5',
    text: 'text-sm',
  },
  lg: {
    button: 'h-10 w-10',
    icon: 'h-6 w-6',
    text: 'text-base',
  },
};

/**
 * LANGUAGE OPTIONS
 */
const languageOptions: { value: Language; label: string; shortLabel: string }[] = [
  { value: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
  { value: 'en', label: 'English', shortLabel: 'EN' },
];

/**
 * COMPONENT
 */
export function LanguageThemeSwitcher({
  language: controlledLanguage,
  onLanguageChange,
  theme: controlledTheme,
  onThemeChange,
  showLanguage = true,
  showTheme = true,
  orientation = 'horizontal',
  size = 'md',
  className,
}: LanguageThemeSwitcherProps) {
  // Local state (when not controlled)
  const [localLanguage, setLocalLanguage] = useState<Language>('vi');
  const [localTheme, setLocalTheme] = useState<Theme>('light');

  const sizeStyle = sizeConfig[size];

  // Initialize from localStorage
  useEffect(() => {
    if (!controlledLanguage) {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang) setLocalLanguage(savedLang);
    }

    if (!controlledTheme) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setLocalTheme(savedTheme);
        applyTheme(savedTheme);
      }
    }
  }, [controlledLanguage, controlledTheme]);

  // Actual values (controlled or local)
  const language = controlledLanguage ?? localLanguage;
  const theme = controlledTheme ?? localTheme;

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setLocalLanguage(newLang);
      localStorage.setItem('language', newLang);
    }
  };

  // Handle theme change
  const handleThemeChange = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else {
      setLocalTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {/* Language Switcher */}
      {showLanguage && (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className={cn(
                'flex items-center justify-center rounded-md font-medium transition-all',
                sizeStyle.button,
                sizeStyle.text,
                language === option.value
                  ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
              title={option.label}
              aria-label={`Switch to ${option.label}`}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>
      )}

      {/* Theme Switcher */}
      {showTheme && (
        <button
          onClick={handleThemeChange}
          className={cn(
            'flex items-center justify-center rounded-lg transition-colors',
            'bg-slate-100 dark:bg-slate-800',
            'hover:bg-slate-200 dark:hover:bg-slate-700',
            'text-slate-600 dark:text-slate-400',
            sizeStyle.button
          )}
          title={theme === 'light' ? 'Chuyển sang Dark mode' : 'Chuyển sang Light mode'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Sun className={sizeStyle.icon} />
          ) : (
            <Moon className={sizeStyle.icon} />
          )}
        </button>
      )}
    </div>
  );
}

/**
 * STANDALONE COMPONENTS
 */

// Language Switcher Only
export function LanguageSwitcher({
  language,
  onLanguageChange,
  size = 'md',
  className,
}: Pick<LanguageThemeSwitcherProps, 'language' | 'onLanguageChange' | 'size' | 'className'>) {
  return (
    <LanguageThemeSwitcher
      language={language}
      onLanguageChange={onLanguageChange}
      showTheme={false}
      size={size}
      className={className}
    />
  );
}

// Theme Switcher Only
export function ThemeSwitcher({
  theme,
  onThemeChange,
  size = 'md',
  className,
}: Pick<LanguageThemeSwitcherProps, 'theme' | 'onThemeChange' | 'size' | 'className'>) {
  return (
    <LanguageThemeSwitcher
      theme={theme}
      onThemeChange={onThemeChange}
      showLanguage={false}
      size={size}
      className={className}
    />
  );
}

/**
 * DROPDOWN VARIANT - Cho navbar khi cần tiết kiệm không gian
 */
interface LanguageThemeDropdownProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  className?: string;
}

export function LanguageThemeDropdown({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  className,
}: LanguageThemeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        aria-label="Settings"
      >
        <Languages className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
            {/* Language Section */}
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Ngôn ngữ
              </p>
              <div className="space-y-1">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (onLanguageChange) onLanguageChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                      language === option.value
                        ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

            {/* Theme Section */}
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Giao diện
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    if (onThemeChange) onThemeChange('light');
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2',
                    theme === 'light'
                      ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Sun className="h-4 w-4" />
                  Sáng
                </button>
                <button
                  onClick={() => {
                    if (onThemeChange) onThemeChange('dark');
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2',
                    theme === 'dark'
                      ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Moon className="h-4 w-4" />
                  Tối
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Basic (uncontrolled):
 * <LanguageThemeSwitcher />
 * 
 * Controlled:
 * <LanguageThemeSwitcher
 *   language={currentLanguage}
 *   onLanguageChange={setLanguage}
 *   theme={currentTheme}
 *   onThemeChange={setTheme}
 * />
 * 
 * Language only:
 * <LanguageSwitcher
 *   language={lang}
 *   onLanguageChange={setLang}
 * />
 * 
 * Theme only:
 * <ThemeSwitcher
 *   theme={theme}
 *   onThemeChange={setTheme}
 * />
 * 
 * Vertical layout:
 * <LanguageThemeSwitcher orientation="vertical" />
 * 
 * Dropdown variant (cho navbar):
 * <LanguageThemeDropdown
 *   language={lang}
 *   onLanguageChange={setLang}
 *   theme={theme}
 *   onThemeChange={setTheme}
 * />
 * 
 * Different sizes:
 * <LanguageThemeSwitcher size="sm" />
 * <LanguageThemeSwitcher size="lg" />
 */
