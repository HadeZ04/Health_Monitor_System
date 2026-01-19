/**
 * ============================================
 * EMPTY STATE - SHARED COMPONENT
 * ============================================
 * 
 * Component hiển thị khi không có dữ liệu
 * Dùng chung cho tất cả các page trong hệ thống
 * 
 * FEATURES:
 * - Customizable icon
 * - Title & description
 * - Optional action button
 * - Multiple variants (no-data, no-results, error, etc.)
 * - Responsive layout
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  LucideIcon,
  Inbox,
  Search,
  AlertCircle,
  FileX,
  Users,
  Calendar,
  Heart,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * TYPES
 */
export type EmptyStateVariant = 'default' | 'no-results' | 'error' | 'no-data' | 'custom';

export interface EmptyStateProps {
  /**
   * Variant - ảnh hưởng icon & message mặc định
   * @default 'default'
   */
  variant?: EmptyStateVariant;
  
  /**
   * Icon hiển thị (override icon mặc định của variant)
   */
  icon?: LucideIcon;
  
  /**
   * Title
   */
  title?: string;
  
  /**
   * Description
   */
  description?: string;
  
  /**
   * Action button label
   */
  actionLabel?: string;
  
  /**
   * Action button click handler
   */
  onAction?: () => void;
  
  /**
   * Secondary action button label
   */
  secondaryActionLabel?: string;
  
  /**
   * Secondary action click handler
   */
  onSecondaryAction?: () => void;
  
  /**
   * Custom content to render below description
   */
  children?: React.ReactNode;
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * VARIANT CONFIGURATION
 */
const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor: string;
    iconBg: string;
  }
> = {
  default: {
    icon: Inbox,
    title: 'Không có dữ liệu',
    description: 'Chưa có dữ liệu nào để hiển thị.',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
  },
  'no-results': {
    icon: Search,
    title: 'Không tìm thấy kết quả',
    description: 'Không tìm thấy kết quả nào phù hợp với tiêu chí tìm kiếm.',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  error: {
    icon: AlertCircle,
    title: 'Đã xảy ra lỗi',
    description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
    iconColor: 'text-error-400',
    iconBg: 'bg-error-100 dark:bg-error-900/30',
  },
  'no-data': {
    icon: FileX,
    title: 'Chưa có dữ liệu',
    description: 'Hãy bắt đầu bằng cách thêm dữ liệu mới.',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
  },
  custom: {
    icon: Inbox,
    title: '',
    description: '',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
  },
};

/**
 * SIZE CONFIGURATION
 */
const sizeConfig = {
  sm: {
    container: 'py-8',
    iconSize: 'h-16 w-16',
    iconInnerSize: 'h-8 w-8',
    titleSize: 'text-base',
    descriptionSize: 'text-sm',
    gap: 'gap-3',
  },
  md: {
    container: 'py-12',
    iconSize: 'h-20 w-20',
    iconInnerSize: 'h-10 w-10',
    titleSize: 'text-lg',
    descriptionSize: 'text-sm',
    gap: 'gap-4',
  },
  lg: {
    container: 'py-16',
    iconSize: 'h-24 w-24',
    iconInnerSize: 'h-12 w-12',
    titleSize: 'text-xl',
    descriptionSize: 'text-base',
    gap: 'gap-5',
  },
};

/**
 * COMPONENT
 */
export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  size = 'md',
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];
  
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeStyle.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', sizeStyle.gap)}>
        {/* Icon */}
        <div
          className={cn(
            'rounded-full flex items-center justify-center',
            sizeStyle.iconSize,
            config.iconBg
          )}
        >
          <Icon className={cn(sizeStyle.iconInnerSize, config.iconColor)} />
        </div>

        {/* Title */}
        {displayTitle && (
          <h3
            className={cn(
              'font-semibold text-slate-900 dark:text-white',
              sizeStyle.titleSize
            )}
          >
            {displayTitle}
          </h3>
        )}

        {/* Description */}
        {displayDescription && (
          <p
            className={cn(
              'text-slate-600 dark:text-slate-400 max-w-md',
              sizeStyle.descriptionSize
            )}
          >
            {displayDescription}
          </p>
        )}

        {/* Custom children */}
        {children && <div className="mt-2">{children}</div>}

        {/* Action buttons */}
        {(onAction || onSecondaryAction) && (
          <div className="flex items-center gap-3 mt-4">
            {onAction && actionLabel && (
              <Button onClick={onAction} size={size === 'sm' ? 'sm' : 'default'}>
                {actionLabel}
              </Button>
            )}
            
            {onSecondaryAction && secondaryActionLabel && (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                size={size === 'sm' ? 'sm' : 'default'}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * PRESET COMPONENTS - Shortcuts cho các trường hợp phổ biến
 */

// No Data (chưa có dữ liệu nào)
export const NoDataState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState variant="no-data" {...props} />
);

// No Search Results
export const NoSearchResultsState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState variant="no-results" {...props} />
);

// Error State
export const ErrorState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState variant="error" {...props} />
);

// No Patients
export const NoPatientsState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState
    variant="no-data"
    icon={Users}
    title="Chưa có bệnh nhân"
    description="Danh sách bệnh nhân đang trống."
    {...props}
  />
);

// No Appointments
export const NoAppointmentsState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState
    variant="no-data"
    icon={Calendar}
    title="Chưa có lịch hẹn"
    description="Bạn chưa có lịch hẹn nào."
    {...props}
  />
);

// No Health Data
export const NoHealthDataState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState
    variant="no-data"
    icon={Activity}
    title="Chưa có dữ liệu sức khỏe"
    description="Bắt đầu đo lường để theo dõi sức khỏe của bạn."
    {...props}
  />
);

/**
 * USAGE EXAMPLES
 * 
 * Basic default:
 * <EmptyState />
 * 
 * Custom content:
 * <EmptyState
 *   variant="no-data"
 *   icon={Users}
 *   title="Chưa có bệnh nhân"
 *   description="Hãy thêm bệnh nhân đầu tiên."
 *   actionLabel="Thêm bệnh nhân"
 *   onAction={() => openAddPatientModal()}
 * />
 * 
 * With search:
 * <EmptyState
 *   variant="no-results"
 *   description="Thử tìm kiếm với từ khóa khác."
 *   secondaryActionLabel="Xóa bộ lọc"
 *   onSecondaryAction={() => clearFilters()}
 * />
 * 
 * Error with retry:
 * <EmptyState
 *   variant="error"
 *   actionLabel="Thử lại"
 *   onAction={() => refetch()}
 * />
 * 
 * Using presets:
 * <NoPatientsState
 *   actionLabel="Thêm bệnh nhân"
 *   onAction={() => navigate('/patients/new')}
 * />
 * 
 * <NoAppointmentsState size="lg" />
 * <NoHealthDataState actionLabel="Kết nối thiết bị" />
 */
