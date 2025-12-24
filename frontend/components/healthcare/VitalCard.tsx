/**
 * ============================================
 * VITAL SIGNS CARD - HEALTHCARE COMPONENTS
 * ============================================
 * 
 * Hiển thị các chỉ số sinh hiệu (vital signs) như:
 * - Heart Rate, Blood Pressure, SpO2, Temperature, etc.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type VitalStatus = 'normal' | 'elevated' | 'critical' | 'low';
export type VitalTrend = 'up' | 'down' | 'stable';

export interface VitalCardProps {
  /**
   * Label (e.g., "Heart Rate", "Blood Pressure")
   */
  label: string;
  
  /**
   * Current value
   */
  value: string | number;
  
  /**
   * Unit (e.g., "BPM", "mmHg", "%")
   */
  unit: string;
  
  /**
   * Status indicator
   */
  status?: VitalStatus;
  
  /**
   * Trend direction
   */
  trend?: VitalTrend;
  
  /**
   * Trend percentage (e.g., "+5%", "-2%")
   */
  trendValue?: string;
  
  /**
   * Icon
   */
  icon?: LucideIcon;
  
  /**
   * Additional info/subtitle
   */
  subtitle?: string;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

const statusConfig: Record<VitalStatus, { bgClass: string; textClass: string; borderClass: string }> = {
  normal: {
    bgClass: 'bg-success-light',
    textClass: 'text-success',
    borderClass: 'border-success/30',
  },
  elevated: {
    bgClass: 'bg-warning-light',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  critical: {
    bgClass: 'bg-error-light',
    textClass: 'text-error',
    borderClass: 'border-error/30',
  },
  low: {
    bgClass: 'bg-info-light',
    textClass: 'text-info',
    borderClass: 'border-info/30',
  },
};

const trendConfig: Record<VitalTrend, { icon: LucideIcon; colorClass: string }> = {
  up: { icon: TrendingUp, colorClass: 'text-error' },
  down: { icon: TrendingDown, colorClass: 'text-success' },
  stable: { icon: Minus, colorClass: 'text-muted-foreground' },
};

export function VitalCard({
  label,
  value,
  unit,
  status = 'normal',
  trend,
  trendValue,
  icon: Icon,
  subtitle,
  className,
  onClick,
}: VitalCardProps) {
  const statusStyle = statusConfig[status];
  const TrendIcon = trend ? trendConfig[trend].icon : null;
  const trendColor = trend ? trendConfig[trend].colorClass : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-6 shadow-card transition-all duration-200',
        statusStyle.borderClass,
        onClick && 'cursor-pointer hover:shadow-card-hover hover:scale-[1.02]',
        className
      )}
    >
      {/* Status Indicator Bar */}
      <div className={cn('absolute left-0 top-0 h-full w-1', statusStyle.bgClass)} />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={cn('rounded-lg p-2', statusStyle.bgClass)}>
            <Icon className={cn('h-5 w-5', statusStyle.textClass)} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        <span className="text-lg font-medium text-muted-foreground">
          {unit}
        </span>
      </div>

      {/* Trend */}
      {trend && TrendIcon && (
        <div className={cn('mt-3 flex items-center gap-1.5', trendColor)}>
          <TrendIcon className="h-4 w-4" />
          {trendValue && (
            <span className="text-sm font-medium">{trendValue}</span>
          )}
          <span className="text-xs">vs. last hour</span>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute right-4 top-4">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
            statusStyle.bgClass,
            statusStyle.textClass
          )}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

/**
 * ============================================
 * KPI CARD - General Metric Display
 * ============================================
 */
export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    positive?: boolean; // Is the trend direction positive for this metric?
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const kpiVariants = {
  default: 'border-border',
  primary: 'border-primary/30 bg-primary/5',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  error: 'border-error/30 bg-error/5',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    
    // If positive trend is good and direction is up, or negative trend is good and direction is down
    const isGoodTrend = trend.positive
      ? trend.direction === 'up'
      : trend.direction === 'down';
    
    return isGoodTrend ? 'text-success' : 'text-error';
  };

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-md',
        kpiVariants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          
          {/* Trend */}
          {trend && (
            <div className={cn('mt-2 flex items-center gap-1', getTrendColor())}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================
 * STAT CARD - Simple Statistic Display
 * ============================================
 */
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
}: StatCardProps) {
  const changeColors = {
    positive: 'text-success bg-success/10',
    negative: 'text-error bg-error/10',
    neutral: 'text-muted-foreground bg-muted',
  };

  return (
    <div className={cn('rounded-xl bg-card p-4 shadow-soft', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <span
              className={cn(
                'mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                changeColors[changeType]
              )}
            >
              {change}
            </span>
          )}
        </div>
        {Icon && (
          <Icon className="h-8 w-8 text-muted-foreground opacity-50" />
        )}
      </div>
    </div>
  );
}
