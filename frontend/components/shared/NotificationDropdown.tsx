/**
 * ============================================
 * NOTIFICATION DROPDOWN - SHARED COMPONENT
 * ============================================
 * 
 * Dropdown hiển thị thông báo trên navbar
 * Dùng chung cho Patient, Doctor, Admin Portal
 * 
 * FEATURES:
 * - Bell icon với badge đếm
 * - Dropdown list notifications
 * - Phân loại: Warning, Info, System
 * - Mark as read
 * - View all link
 * - Real-time update support
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bell,
  BellRing,
  X,
  Check,
  AlertTriangle,
  Info,
  Settings,
  Calendar,
  Heart,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * TYPES
 */
export type NotificationType = 'warning' | 'info' | 'system' | 'appointment' | 'health';

export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO date or formatted
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationDropdownProps {
  /**
   * Danh sách thông báo
   */
  notifications: Notification[];
  
  /**
   * Mark as read handler
   */
  onMarkAsRead?: (id: string | number) => void;
  
  /**
   * Mark all as read handler
   */
  onMarkAllAsRead?: () => void;
  
  /**
   * Delete notification handler
   */
  onDelete?: (id: string | number) => void;
  
  /**
   * View all link
   */
  viewAllUrl?: string;
  
  /**
   * Max display items in dropdown
   * @default 5
   */
  maxDisplayItems?: number;
  
  /**
   * Show badge count
   * @default true
   */
  showBadge?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * NOTIFICATION TYPE CONFIG
 */
const notificationTypeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  warning: {
    icon: AlertTriangle,
    color: 'text-warning-600',
    bgColor: 'bg-warning-100 dark:bg-warning-900/30',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  system: {
    icon: Settings,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  appointment: {
    icon: Calendar,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
  },
  health: {
    icon: Heart,
    color: 'text-error-600',
    bgColor: 'bg-error-100 dark:bg-error-900/30',
  },
};

/**
 * COMPONENT
 */
export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  viewAllUrl = '/notifications',
  maxDisplayItems = 5,
  showBadge = true,
  className,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Count unread
  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications = notifications.slice(0, maxDisplayItems);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle mark as read
  const handleMarkAsRead = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  // Handle delete
  const handleDelete = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          isOpen && 'bg-slate-100 dark:bg-slate-800'
        )}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-6 w-6 text-primary-600" />
        ) : (
          <Bell className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        )}
        
        {/* Badge */}
        {showBadge && unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-error-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Thông báo
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({unreadCount} mới)
                </span>
              )}
            </h3>
            
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Không có thông báo mới
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {displayNotifications.map((notification) => {
                  const config = notificationTypeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                        !notification.read && 'bg-primary-50/50 dark:bg-primary-950/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            'flex items-center justify-center h-10 w-10 rounded-lg shrink-0',
                            config.bgColor
                          )}
                        >
                          <Icon className={cn('h-5 w-5', config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                              {notification.title}
                            </h4>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.read && onMarkAsRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              
                              {onDelete && (
                                <button
                                  onClick={(e) => handleDelete(notification.id, e)}
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                                  title="Xóa"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {notification.message}
                          </p>

                          {/* Timestamp & Action */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp}</span>
                            </div>

                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                onClick={() => setIsOpen(false)}
                              >
                                {notification.actionLabel || 'Xem chi tiết'}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <Link
                href={viewAllUrl}
                onClick={() => setIsOpen(false)}
                className="block w-full py-2 text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Xem tất cả thông báo
              </Link>
            </div>
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
 * <NotificationDropdown
 *   notifications={[
 *     {
 *       id: 1,
 *       type: 'warning',
 *       title: 'Chỉ số bất thường',
 *       message: 'Huyết áp của bạn cao hơn bình thường',
 *       timestamp: '5 phút trước',
 *       read: false,
 *       actionUrl: '/metrics/blood-pressure',
 *     },
 *     {
 *       id: 2,
 *       type: 'appointment',
 *       title: 'Lịch hẹn sắp tới',
 *       message: 'Bạn có lịch khám vào 9:00 ngày mai',
 *       timestamp: '1 giờ trước',
 *       read: false,
 *     },
 *   ]}
 *   onMarkAsRead={(id) => markNotificationAsRead(id)}
 *   onMarkAllAsRead={() => markAllAsRead()}
 *   onDelete={(id) => deleteNotification(id)}
 * />
 * 
 * With custom settings:
 * <NotificationDropdown
 *   notifications={notifications}
 *   maxDisplayItems={10}
 *   viewAllUrl="/dashboard/notifications"
 *   showBadge={true}
 * />
 */
