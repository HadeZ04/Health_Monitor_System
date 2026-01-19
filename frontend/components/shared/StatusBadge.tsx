/**
 * ============================================
 * STATUS BADGE - ENHANCED SHARED COMPONENT
 * ============================================
 * 
 * Badge component hiển thị trạng thái với nhiều variant
 * Hỗ trợ: Appointment, Patient Condition, User Status, System Status
 * 
 * FEATURES:
 * - Multiple status types & variants
 * - Icon support
 * - Dot indicator
 * - Hover tooltips
 * - Consistent styling across system
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

/**
 * BADGE VARIANTS
 */
const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        // Appointment Statuses
        pending: 'bg-warning-50 text-warning-700 border-warning-300 dark:bg-warning-950/30 dark:text-warning-400 dark:border-warning-800',
        confirmed: 'bg-success-50 text-success-700 border-success-300 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800',
        completed: 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-700',
        canceled: 'bg-error-50 text-error-700 border-error-300 dark:bg-error-950/30 dark:text-error-400 dark:border-error-800',
        rescheduled: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
        'no-show': 'bg-slate-100 text-slate-600 border-slate-400 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600',
        
        // Patient Condition
        stable: 'bg-success-50 text-success-700 border-success-300 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800',
        warning: 'bg-warning-50 text-warning-700 border-warning-300 dark:bg-warning-950/30 dark:text-warning-400 dark:border-warning-800',
        critical: 'bg-error-50 text-error-700 border-error-300 dark:bg-error-950/30 dark:text-error-400 dark:border-error-800',
        
        // User Status
        active: 'bg-success-50 text-success-700 border-success-300 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800',
        inactive: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600',
        locked: 'bg-error-50 text-error-700 border-error-300 dark:bg-error-950/30 dark:text-error-400 dark:border-error-800',
        
        // System Status
        online: 'bg-success-50 text-success-700 border-success-300 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800',
        offline: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600',
        maintenance: 'bg-warning-50 text-warning-700 border-warning-300 dark:bg-warning-950/30 dark:text-warning-400 dark:border-warning-800',
        
        // General
        info: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
        success: 'bg-success-50 text-success-700 border-success-300 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800',
        error: 'bg-error-50 text-error-700 border-error-300 dark:bg-error-950/30 dark:text-error-400 dark:border-error-800',
        default: 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * PROPS
 */
export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  /**
   * Icon hiển thị bên trái
   */
  icon?: LucideIcon;
  
  /**
   * Hiển thị dot indicator
   */
  showDot?: boolean;
  
  /**
   * Tooltip text khi hover
   */
  tooltip?: string;
  
  /**
   * Custom dot color (override default)
   */
  dotColor?: string;
}

/**
 * DOT COLOR MAPPING
 */
const dotColorMap: Record<string, string> = {
  pending: 'bg-warning-500',
  confirmed: 'bg-success-500',
  completed: 'bg-slate-500',
  canceled: 'bg-error-500',
  rescheduled: 'bg-blue-500',
  'no-show': 'bg-slate-600',
  stable: 'bg-success-500',
  warning: 'bg-warning-500',
  critical: 'bg-error-500',
  active: 'bg-success-500',
  inactive: 'bg-slate-500',
  locked: 'bg-error-500',
  online: 'bg-success-500',
  offline: 'bg-slate-500',
  maintenance: 'bg-warning-500',
  info: 'bg-blue-500',
  success: 'bg-success-500',
  error: 'bg-error-500',
  default: 'bg-slate-500',
};

/**
 * COMPONENT
 */
export function StatusBadge({
  className,
  variant,
  size,
  icon: Icon,
  showDot = false,
  tooltip,
  dotColor,
  children,
  ...props
}: StatusBadgeProps) {
  const dotClass = dotColor || dotColorMap[variant || 'default'];

  return (
    <div
      className={cn(statusBadgeVariants({ variant, size }), className)}
      title={tooltip}
      {...props}
    >
      {/* Dot Indicator */}
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', dotClass)} />
      )}
      
      {/* Icon */}
      {Icon && <Icon className="h-3.5 w-3.5" />}
      
      {/* Label */}
      {children}
    </div>
  );
}

/**
 * PRESET COMPONENTS - Shortcuts cho các trạng thái phổ biến
 */

// Appointment Status Badges
export const AppointmentPendingBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="pending" {...props}>
    {props.children || 'Chờ xác nhận'}
  </StatusBadge>
);

export const AppointmentConfirmedBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="confirmed" {...props}>
    {props.children || 'Đã xác nhận'}
  </StatusBadge>
);

export const AppointmentCompletedBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="completed" {...props}>
    {props.children || 'Hoàn thành'}
  </StatusBadge>
);

export const AppointmentCanceledBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="canceled" {...props}>
    {props.children || 'Đã hủy'}
  </StatusBadge>
);

// Patient Condition Badges
export const PatientStableBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="stable" showDot {...props}>
    {props.children || 'Ổn định'}
  </StatusBadge>
);

export const PatientWarningBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="warning" showDot {...props}>
    {props.children || 'Cảnh báo'}
  </StatusBadge>
);

export const PatientCriticalBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="critical" showDot {...props}>
    {props.children || 'Nghiêm trọng'}
  </StatusBadge>
);

// User Status Badges
export const UserActiveBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="active" showDot {...props}>
    {props.children || 'Hoạt động'}
  </StatusBadge>
);

export const UserInactiveBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="inactive" {...props}>
    {props.children || 'Không hoạt động'}
  </StatusBadge>
);

export const UserLockedBadge: React.FC<Omit<StatusBadgeProps, 'variant'>> = (props) => (
  <StatusBadge variant="locked" {...props}>
    {props.children || 'Bị khóa'}
  </StatusBadge>
);

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <StatusBadge variant="confirmed">Đã xác nhận</StatusBadge>
 * 
 * With icon:
 * <StatusBadge variant="critical" icon={AlertTriangle}>
 *   Nghiêm trọng
 * </StatusBadge>
 * 
 * With dot:
 * <StatusBadge variant="online" showDot>Đang online</StatusBadge>
 * 
 * With tooltip:
 * <StatusBadge 
 *   variant="pending" 
 *   tooltip="Đang chờ bác sĩ xác nhận"
 * >
 *   Chờ xác nhận
 * </StatusBadge>
 * 
 * Using presets:
 * <PatientCriticalBadge size="lg" />
 * <AppointmentConfirmedBadge icon={CheckCircle} />
 * <UserActiveBadge showDot />
 */
