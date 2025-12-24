/**
 * ============================================
 * ALERT BADGE & NOTIFICATION COMPONENTS
 * HEALTHCARE DESIGN SYSTEM
 * ============================================
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { IconButton } from '@/components/ui/button-new';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * ========================================
 * ALERT BANNER - Full-width notification
 * ========================================
 */
export interface AlertBannerProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const alertConfig: Record<
  AlertVariant,
  { bgClass: string; borderClass: string; textClass: string; icon: React.ElementType }
> = {
  info: {
    bgClass: 'bg-info-light',
    borderClass: 'border-info',
    textClass: 'text-info',
    icon: Info,
  },
  success: {
    bgClass: 'bg-success-light',
    borderClass: 'border-success',
    textClass: 'text-success',
    icon: CheckCircle,
  },
  warning: {
    bgClass: 'bg-warning-light',
    borderClass: 'border-warning',
    textClass: 'text-warning',
    icon: AlertTriangle,
  },
  error: {
    bgClass: 'bg-error-light',
    borderClass: 'border-error',
    textClass: 'text-error',
    icon: AlertCircle,
  },
};

export function AlertBanner({
  variant = 'info',
  title,
  message,
  onClose,
  action,
  className,
}: AlertBannerProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-4 p-4',
        config.bgClass,
        config.borderClass,
        className
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.textClass)} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('font-semibold text-sm mb-1', config.textClass)}>
            {title}
          </h4>
        )}
        <p className="text-sm text-foreground">{message}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline hover:no-underline',
              config.textClass
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {onClose && (
        <IconButton
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className={cn('flex-shrink-0', config.textClass)}
        >
          <X className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  );
}

/**
 * ========================================
 * BADGE - Small status indicator
 * ========================================
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: AlertVariant | 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeVariants = {
  default: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-error text-error-foreground',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * ========================================
 * NOTIFICATION CARD - Detailed notification
 * ========================================
 */
export interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  variant?: AlertVariant;
  unread?: boolean;
  onRead?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function NotificationCard({
  title,
  message,
  timestamp,
  variant = 'info',
  unread = false,
  onRead,
  onDismiss,
  className,
}: NotificationCardProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative flex gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-card-hover',
        unread && 'border-l-4 ' + config.borderClass,
        className
      )}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-1')}>
        <div className={cn('rounded-lg p-2', config.bgClass)}>
          <Icon className={cn('h-4 w-4', config.textClass)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          {unread && (
            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
        <p className="mt-2 text-xs text-muted-foreground">{timestamp}</p>
        
        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          {onRead && unread && (
            <button
              onClick={onRead}
              className="text-xs font-medium text-primary hover:underline"
            >
              Mark as read
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ========================================
 * TOAST - Temporary notification
 * ========================================
 */
export interface ToastProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  variant = 'info',
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xl',
        'min-w-[320px] max-w-md',
        className
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0 rounded-lg p-2', config.bgClass)}>
        <Icon className={cn('h-5 w-5', config.textClass)} />
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-sm text-foreground mb-1">{title}</h4>
        )}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {onClose && (
        <IconButton
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  );
}

/**
 * ========================================
 * STATUS DOT - Inline status indicator
 * ========================================
 */
export interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-error',
  away: 'bg-warning',
};

const dotSizes = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

export function StatusDot({
  status,
  label,
  showLabel = true,
  size = 'md',
  className,
}: StatusDotProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'rounded-full',
            statusColors[status],
            dotSizes[size],
            status === 'online' && 'animate-pulse'
          )}
        />
        {status === 'online' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              statusColors[status],
              'animate-ping'
            )}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-sm font-medium capitalize text-foreground">
          {label || status}
        </span>
      )}
    </div>
  );
}
