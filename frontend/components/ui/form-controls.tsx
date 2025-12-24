/**
 * ============================================
 * SELECT & CHECKBOX COMPONENTS
 * HEALTHCARE DESIGN SYSTEM
 * ============================================
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

/**
 * ========================================
 * SELECT / DROPDOWN COMPONENT
 * ========================================
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  wrapperClassName?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, wrapperClassName, options, required, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-background px-4 py-2 pr-10 text-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-error focus:ring-error/50'
                : 'border-input hover:border-input-hover',
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown Icon */}
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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

Select.displayName = 'Select';

/**
 * ========================================
 * CHECKBOX COMPONENT
 * ========================================
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  wrapperClassName?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, wrapperClassName, indeterminate, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        <label className="flex items-start gap-3 cursor-pointer group">
          {/* Checkbox Container */}
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className={cn(
                'peer h-5 w-5 shrink-0 appearance-none rounded border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:bg-primary checked:border-primary',
                error
                  ? 'border-error focus:ring-error/50'
                  : 'border-input hover:border-primary/50',
                className
              )}
              ref={inputRef}
              {...props}
            />
            {/* Check Icon */}
            <Check className="absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Label & Helper Text */}
          {(label || helperText) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              )}
              {helperText && !error && (
                <span className="text-xs text-muted-foreground">{helperText}</span>
              )}
            </div>
          )}
        </label>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-1 text-xs text-error ml-8">
            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * ========================================
 * RADIO COMPONENT
 * ========================================
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  wrapperClassName?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, helperText, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        <label className="flex items-start gap-3 cursor-pointer group">
          {/* Radio Container */}
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              className={cn(
                'peer h-5 w-5 shrink-0 appearance-none rounded-full border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:border-primary',
                'border-input hover:border-primary/50',
                className
              )}
              ref={ref}
              {...props}
            />
            {/* Radio Dot */}
            <div className="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Label & Helper Text */}
          {(label || helperText) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              )}
              {helperText && (
                <span className="text-xs text-muted-foreground">{helperText}</span>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

/**
 * ========================================
 * RADIO GROUP COMPONENT
 * ========================================
 */
export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{
    value: string;
    label: React.ReactNode;
    helperText?: string;
    disabled?: boolean;
  }>;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  orientation = 'vertical',
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Group Label */}
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* Radio Options */}
      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            label={option.label}
            helperText={option.helperText}
            disabled={option.disabled}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-1 text-xs text-error">
          <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';

/**
 * ========================================
 * SWITCH/TOGGLE COMPONENT
 * ========================================
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  wrapperClassName?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, helperText, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        <label className="flex items-start gap-3 cursor-pointer group">
          {/* Switch Container */}
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div
              className={cn(
                'h-6 w-11 rounded-full transition-colors duration-200',
                'peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                'bg-input',
                className
              )}
            />
            {/* Switch Knob */}
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 peer-checked:translate-x-5" />
          </div>

          {/* Label & Helper Text */}
          {(label || helperText) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              )}
              {helperText && (
                <span className="text-xs text-muted-foreground">{helperText}</span>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
