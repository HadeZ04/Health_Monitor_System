/**
 * ============================================
 * INPUT COMPONENT - HEALTHCARE DESIGN SYSTEM
 * ============================================
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Input Variants Definition
 */
const inputVariants = cva(
  // Base styles
  'flex w-full rounded-lg border bg-background px-4 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      /**
       * Visual States
       */
      state: {
        default: 'border-input hover:border-input-hover',
        error: 'border-error focus:ring-error/50',
        success: 'border-success focus:ring-success/50',
        warning: 'border-warning focus:ring-warning/50',
      },

      /**
       * Size Variants
       */
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },

      /**
       * Full Width
       */
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
      fullWidth: true,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Helper text below input
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Icon before input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon after input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Wrapper class name
   */
  wrapperClassName?: string;

  /**
   * Required field indicator
   */
  required?: boolean;
}

/**
 * Input Component
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      size,
      fullWidth,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      wrapperClassName,
      required,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const finalState = error ? 'error' : state;

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ state: finalState, size, fullWidth }),
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <div
            className={cn(
              'flex items-start gap-1 text-xs',
              error ? 'text-error' : 'text-muted-foreground'
            )}
          >
            {error && <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />}
            <span>{error || helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Pick<InputProps, 'label' | 'helperText' | 'error' | 'wrapperClassName' | 'state' | 'size' | 'fullWidth' | 'required'> {
  /**
   * Show character count
   */
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      state,
      size,
      fullWidth,
      label,
      helperText,
      error,
      wrapperClassName,
      required,
      showCount,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const finalState = error ? 'error' : state;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {label}
              {required && <span className="ml-1 text-error">*</span>}
            </label>
            {showCount && maxLength && (
              <span className="text-xs text-muted-foreground">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        {/* Textarea */}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-background px-4 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            finalState === 'error' && 'border-error focus:ring-error/50',
            finalState === 'success' && 'border-success focus:ring-success/50',
            finalState === 'warning' && 'border-warning focus:ring-warning/50',
            finalState === 'default' && 'border-input hover:border-input-hover',
            size === 'sm' && 'min-h-[60px] px-3 py-1.5 text-xs',
            size === 'lg' && 'min-h-[100px] px-5 py-3 text-base',
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <div
            className={cn(
              'flex items-start gap-1 text-xs',
              error ? 'text-error' : 'text-muted-foreground'
            )}
          >
            {error && <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />}
            <span>{error || helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Export variants
export { inputVariants };
