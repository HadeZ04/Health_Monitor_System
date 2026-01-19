/**
 * ============================================
 * PAGE HEADER - SHARED COMPONENT
 * ============================================
 * 
 * Component header chung cho tất cả các page
 * Thay thế PageHero với thiết kế đơn giản, hiện đại hơn
 * 
 * FEATURES:
 * - Title, subtitle, breadcrumb
 * - Icon support
 * - Action buttons (Create, Export, Settings...)
 * - Badge/tag display
 * - Responsive layout
 * - Back button option
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * TYPES
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  
  /**
   * Subtitle/description
   */
  subtitle?: string;
  
  /**
   * Icon hiển thị bên cạnh title
   */
  icon?: LucideIcon;
  
  /**
   * Breadcrumb items
   */
  breadcrumb?: BreadcrumbItem[];
  
  /**
   * Badges/tags
   */
  badges?: React.ReactNode[];
  
  /**
   * Action buttons (bên phải)
   */
  actions?: React.ReactNode;
  
  /**
   * Back button
   */
  showBackButton?: boolean;
  
  /**
   * Back button handler (nếu không có sẽ dùng history.back)
   */
  onBack?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Variant style
   * @default 'default'
   */
  variant?: 'default' | 'gradient' | 'minimal';
}

/**
 * COMPONENT
 */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  breadcrumb,
  badges,
  actions,
  showBackButton = false,
  onBack,
  className,
  variant = 'default',
}: PageHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div
      className={cn(
        'mb-6',
        variant === 'gradient' &&
          'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 -mx-6 -mt-6 px-6 pt-6 pb-8 rounded-t-2xl',
        variant === 'minimal' && 'border-b border-slate-200 dark:border-slate-700 pb-6',
        className
      )}
    >
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-2 mb-3 text-sm text-slate-600 dark:text-slate-400">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 dark:text-white font-medium">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left: Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            )}

            {/* Icon */}
            {Icon && (
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 shrink-0">
                <Icon className="h-6 w-6" />
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">
              {title}
            </h1>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          )}

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {badges.map((badge, index) => (
                <React.Fragment key={index}>{badge}</React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <PageHeader
 *   title="Danh sách bệnh nhân"
 *   subtitle="Quản lý thông tin bệnh nhân trong hệ thống"
 * />
 * 
 * With icon & breadcrumb:
 * <PageHeader
 *   icon={Users}
 *   title="Danh sách bệnh nhân"
 *   subtitle="Quản lý và theo dõi thông tin bệnh nhân"
 *   breadcrumb={[
 *     { label: 'Trang chủ', href: '/' },
 *     { label: 'Bệnh nhân' },
 *   ]}
 * />
 * 
 * With actions:
 * <PageHeader
 *   icon={Calendar}
 *   title="Lịch hẹn"
 *   subtitle="Quản lý lịch hẹn khám bệnh"
 *   actions={
 *     <>
 *       <Button variant="outline">
 *         <Filter className="h-4 w-4 mr-2" />
 *         Lọc
 *       </Button>
 *       <Button>
 *         <Plus className="h-4 w-4 mr-2" />
 *         Thêm lịch hẹn
 *       </Button>
 *     </>
 *   }
 * />
 * 
 * With badges:
 * <PageHeader
 *   icon={Activity}
 *   title="Bệnh nhân Nguyễn Văn A"
 *   subtitle="ID: #12345"
 *   badges={[
 *     <StatusBadge variant="stable">Ổn định</StatusBadge>,
 *     <Badge>Tim mạch</Badge>,
 *   ]}
 *   showBackButton
 * />
 * 
 * Gradient variant:
 * <PageHeader
 *   variant="gradient"
 *   icon={Stethoscope}
 *   title="Bác sĩ"
 *   subtitle="Quản lý đội ngũ y bác sĩ"
 *   actions={
 *     <Button>
 *       <UserPlus className="h-4 w-4 mr-2" />
 *       Thêm bác sĩ
 *     </Button>
 *   }
 * />
 * 
 * Minimal variant:
 * <PageHeader
 *   variant="minimal"
 *   title="Cài đặt"
 *   subtitle="Tùy chỉnh hệ thống"
 * />
 */
