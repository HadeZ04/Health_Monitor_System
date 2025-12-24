/**
 * ============================================
 * HEALTH METRIC CARD - SHARED COMPONENT
 * ============================================
 * 
 * Card hiển thị 1 chỉ số sức khỏe (vital sign / health metric)
 * Dùng chung cho Patient, Doctor, Admin Portal
 * 
 * FEATURES:
 * - Hiển thị tên chỉ số, giá trị, đơn vị
 * - Trạng thái màu sắc (Normal/Warning/Critical/Low)
 * - Icon tùy chỉnh
 * - Trend indicator (tăng/giảm/ổn định)
 * - Responsive & accessible
 * - Click handler option
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

/**
 * TYPES
 */
export type HealthMetricStatus = 'normal' | 'warning' | 'critical' | 'low' | 'info';
export type HealthMetricTrend = 'up' | 'down' | 'stable';
export type HealthMetricSize = 'sm' | 'md' | 'lg';

export interface HealthMetricCardProps {
  /**
   * Tên chỉ số (VD: "Heart Rate", "Blood Pressure", "SpO2")
   */
  label: string;
  
  /**
   * Giá trị hiện tại
   */
  value: string | number;
  
  /**
   * Đơn vị (VD: "bpm", "mmHg", "%", "mg/dL")
   */
  unit: string;
  
  /**
   * Trạng thái chỉ số (ảnh hưởng màu sắc & hiển thị)
   * @default 'normal'
   */
  status?: HealthMetricStatus;
  
  /**
   * Icon hiển thị bên trái
   */
  icon?: LucideIcon;
  
  /**
   * Hướng xu hướng
   */
  trend?: HealthMetricTrend;
  
  /**
   * Giá trị xu hướng (VD: "+5%", "-2%", "+12 bpm")
   */
  trendValue?: string;
  
  /**
   * Thông tin phụ (subtitle)
   */
  subtitle?: string;
  
  /**
   * Thời gian đo gần nhất
   */
  timestamp?: string;
  
  /**
   * Kích thước card
   * @default 'md'
   */
  size?: HealthMetricSize;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Click handler (để navigate đến chi tiết)
   */
  onClick?: () => void;
  
  /**
   * Disable click
   */
  disabled?: boolean;
}

/**
 * CONFIGURATION
 */
const statusConfig: Record<HealthMetricStatus, {
  bgClass: string;
  textClass: string;
  borderClass: string;
  iconBgClass: string;
  dotClass: string;
}> = {
  normal: {
    bgClass: 'bg-success-50 dark:bg-success-950/20',
    textClass: 'text-success-700 dark:text-success-400',
    borderClass: 'border-success-200 dark:border-success-800',
    iconBgClass: 'bg-success-100 dark:bg-success-900/30',
    dotClass: 'bg-success-500',
  },
  warning: {
    bgClass: 'bg-warning-50 dark:bg-warning-950/20',
    textClass: 'text-warning-700 dark:text-warning-400',
    borderClass: 'border-warning-200 dark:border-warning-800',
    iconBgClass: 'bg-warning-100 dark:bg-warning-900/30',
    dotClass: 'bg-warning-500',
  },
  critical: {
    bgClass: 'bg-error-50 dark:bg-error-950/20',
    textClass: 'text-error-700 dark:text-error-400',
    borderClass: 'border-error-200 dark:border-error-800',
    iconBgClass: 'bg-error-100 dark:bg-error-900/30',
    dotClass: 'bg-error-500',
  },
  low: {
    bgClass: 'bg-blue-50 dark:bg-blue-950/20',
    textClass: 'text-blue-700 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30',
    dotClass: 'bg-blue-500',
  },
  info: {
    bgClass: 'bg-slate-50 dark:bg-slate-900/20',
    textClass: 'text-slate-700 dark:text-slate-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    iconBgClass: 'bg-slate-100 dark:bg-slate-800/30',
    dotClass: 'bg-slate-500',
  },
};

const trendConfig: Record<HealthMetricTrend, {
  icon: LucideIcon;
  colorClass: string;
}> = {
  up: {
    icon: TrendingUp,
    colorClass: 'text-error-600 dark:text-error-400',
  },
  down: {
    icon: TrendingDown,
    colorClass: 'text-success-600 dark:text-success-400',
  },
  stable: {
    icon: Minus,
    colorClass: 'text-slate-500 dark:text-slate-400',
  },
};

const sizeConfig: Record<HealthMetricSize, {
  cardPadding: string;
  iconSize: string;
  valueSize: string;
  labelSize: string;
}> = {
  sm: {
    cardPadding: 'p-3',
    iconSize: 'h-8 w-8',
    valueSize: 'text-xl',
    labelSize: 'text-xs',
  },
  md: {
    cardPadding: 'p-4',
    iconSize: 'h-10 w-10',
    valueSize: 'text-2xl',
    labelSize: 'text-sm',
  },
  lg: {
    cardPadding: 'p-6',
    iconSize: 'h-12 w-12',
    valueSize: 'text-3xl',
    labelSize: 'text-base',
  },
};

/**
 * COMPONENT
 */
export function HealthMetricCard({
  label,
  value,
  unit,
  status = 'normal',
  icon: Icon,
  trend,
  trendValue,
  subtitle,
  timestamp,
  size = 'md',
  className,
  onClick,
  disabled = false,
}: HealthMetricCardProps) {
  const statusStyle = statusConfig[status];
  const sizeStyle = sizeConfig[size];
  const trendStyle = trend ? trendConfig[trend] : null;
  const TrendIcon = trendStyle?.icon;
  
  const isClickable = onClick && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        // Base styles
        'relative overflow-hidden rounded-xl border-2 transition-all duration-200',
        'bg-white dark:bg-slate-900',
        statusStyle.borderClass,
        sizeStyle.cardPadding,
        
        // Hover & Click states
        isClickable && [
          'cursor-pointer',
          'hover:shadow-lg hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        
        className
      )}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={`${label}: ${value} ${unit}`}
      aria-disabled={disabled}
    >
      {/* Status indicator dot */}
      <div className="absolute top-3 right-3">
        <div className={cn('h-2 w-2 rounded-full', statusStyle.dotClass)} />
      </div>

      {/* Main content */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              'flex items-center justify-center rounded-lg shrink-0',
              statusStyle.iconBgClass,
              statusStyle.textClass,
              sizeStyle.iconSize
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Value & Label */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className={cn(
              'font-medium text-slate-600 dark:text-slate-400 truncate',
              sizeStyle.labelSize
            )}
          >
            {label}
          </p>

          {/* Value */}
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={cn(
                'font-bold text-slate-900 dark:text-white',
                sizeStyle.valueSize
              )}
            >
              {value}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Trend & Timestamp */}
      {(trend || timestamp) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          {/* Trend */}
          {trend && trendStyle && (
            <div className="flex items-center gap-1">
              {TrendIcon && (
                <TrendIcon className={cn('h-4 w-4', trendStyle.colorClass)} />
              )}
              {trendValue && (
                <span className={cn('text-xs font-medium', trendStyle.colorClass)}>
                  {trendValue}
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          {timestamp && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              {timestamp}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <HealthMetricCard
 *   label="Heart Rate"
 *   value={72}
 *   unit="bpm"
 *   icon={Heart}
 * />
 * 
 * With status & trend:
 * <HealthMetricCard
 *   label="Blood Pressure"
 *   value="140/90"
 *   unit="mmHg"
 *   status="warning"
 *   icon={Activity}
 *   trend="up"
 *   trendValue="+5%"
 *   timestamp="5 phút trước"
 * />
 * 
 * Clickable:
 * <HealthMetricCard
 *   label="SpO2"
 *   value={95}
 *   unit="%"
 *   status="low"
 *   icon={Wind}
 *   onClick={() => navigate('/metrics/spo2')}
 *   subtitle="Dưới mức bình thường"
 * />
 * 
 * Different sizes:
 * <HealthMetricCard size="sm" {...props} />
 * <HealthMetricCard size="lg" {...props} />
 */
