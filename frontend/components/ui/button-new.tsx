/**
 * ============================================
 * BUTTON COMPONENT - HEALTHCARE DESIGN SYSTEM
 * ============================================
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button Variants Definition
 */
const buttonVariants = cva(
  // Base styles - áp dụng cho tất cả variants
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      /**
       * Visual Variants
       */
      variant: {
        // Primary - Main CTA button (Sky Blue)
        primary:
          'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]',
        
        // Secondary - Less prominent actions (Teal)
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]',
        
        // Outline - Border button
        outline:
          'border-2 border-primary bg-background text-primary hover:bg-primary/10 hover:border-primary/80 active:scale-[0.98]',
        
        // Ghost - Minimal, no background
        ghost:
          'text-foreground hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/20',
        
        // Destructive - Delete, dangerous actions (Red)
        destructive:
          'bg-error text-error-foreground shadow-md hover:bg-error/90 hover:shadow-lg active:scale-[0.98]',
        
        // Success - Positive actions (Green)
        success:
          'bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg active:scale-[0.98]',
        
        // Warning - Caution actions (Yellow/Orange)
        warning:
          'bg-warning text-warning-foreground shadow-md hover:bg-warning/90 hover:shadow-lg active:scale-[0.98]',
        
        // Link - Text-only button
        link:
          'text-primary underline-offset-4 hover:underline px-0',
        
        // Muted - Very subtle button
        muted:
          'bg-muted text-muted-foreground hover:bg-muted/80 active:scale-[0.98]',
      },

      /**
       * Size Variants
       */
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',       // Square icon button
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
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
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as child component (for Next.js Link, etc.)
   */
  asChild?: boolean;
  
  /**
   * Loading state
   */
  isLoading?: boolean;
  
  /**
   * Icon before text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon after text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

/**
 * Icon Button - Specialized button for icons only
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'leftIcon' | 'rightIcon'>
>(({ children, size = 'icon', ...props }, ref) => {
  return (
    <Button ref={ref} size={size} {...props}>
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * Button Group - For grouping related buttons
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of button group
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Attached buttons (no gap)
   */
  attached?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', attached = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          attached ? 'gap-0' : 'gap-2',
          attached && orientation === 'horizontal' && '[&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none [&>button:not(:last-child)]:border-r-0',
          attached && orientation === 'vertical' && '[&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none [&>button:not(:last-child)]:border-b-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Export variants for external use
export { buttonVariants };
