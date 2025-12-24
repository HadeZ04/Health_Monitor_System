/**
 * ============================================
 * APPOINTMENT LIST ITEM - SHARED COMPONENT
 * ============================================
 * 
 * Component hiển thị 1 lịch hẹn khám
 * Reusable cho Patient Portal, Doctor Portal, Admin Portal
 * 
 * FEATURES:
 * - Hiển thị thông tin bệnh nhân/bác sĩ
 * - Ngày giờ, trạng thái
 * - Action buttons (Join, Reschedule, Cancel...)
 * - Responsive layout
 * - Support different views (patient/doctor/admin)
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Video,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * TYPES
 */
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'canceled'
  | 'rescheduled'
  | 'no-show';

export type AppointmentType = 'in-person' | 'video' | 'phone';

export type AppointmentViewMode = 'patient' | 'doctor' | 'admin';

export interface AppointmentData {
  id: string | number;
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  date: string; // ISO date or formatted
  time: string; // e.g., "09:00 - 10:00"
  status: AppointmentStatus;
  type?: AppointmentType;
  location?: string;
  reason?: string;
  notes?: string;
}

export interface AppointmentListItemProps {
  /**
   * Dữ liệu cuộc hẹn
   */
  appointment: AppointmentData;
  
  /**
   * View mode (ảnh hưởng đến hiển thị thông tin)
   * @default 'patient'
   */
  viewMode?: AppointmentViewMode;
  
  /**
   * Hiển thị action buttons
   * @default true
   */
  showActions?: boolean;
  
  /**
   * Callback khi click vào item
   */
  onClick?: () => void;
  
  /**
   * Action handlers
   */
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
  onMoreActions?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * STATUS CONFIGURATION
 */
const statusConfig: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'outline'; color: string }
> = {
  pending: {
    label: 'Chờ xác nhận',
    variant: 'outline',
    color: 'text-warning-600 bg-warning-50 border-warning-300',
  },
  confirmed: {
    label: 'Đã xác nhận',
    variant: 'success',
    color: 'text-success-600 bg-success-50 border-success-300',
  },
  completed: {
    label: 'Hoàn thành',
    variant: 'outline',
    color: 'text-slate-600 bg-slate-50 border-slate-300',
  },
  canceled: {
    label: 'Đã hủy',
    variant: 'destructive',
    color: 'text-error-600 bg-error-50 border-error-300',
  },
  rescheduled: {
    label: 'Đã dời lịch',
    variant: 'outline',
    color: 'text-info-600 bg-blue-50 border-blue-300',
  },
  'no-show': {
    label: 'Không đến',
    variant: 'outline',
    color: 'text-slate-600 bg-slate-100 border-slate-400',
  },
};

/**
 * TYPE ICONS
 */
const typeIcons: Record<AppointmentType, React.ElementType> = {
  'in-person': MapPin,
  video: Video,
  phone: Phone,
};

/**
 * COMPONENT
 */
export function AppointmentListItem({
  appointment,
  viewMode = 'patient',
  showActions = true,
  onClick,
  onJoin,
  onReschedule,
  onCancel,
  onViewDetails,
  onMoreActions,
  className,
}: AppointmentListItemProps) {
  const statusInfo = statusConfig[appointment.status];
  const TypeIcon = appointment.type ? typeIcons[appointment.type] : null;
  
  // Determine displayed person based on view mode
  const displayedPerson =
    viewMode === 'patient' ? appointment.doctorName : appointment.patientName;
  const displayedIcon = viewMode === 'patient' ? Stethoscope : User;
  const DisplayedIcon = displayedIcon;

  // Check if appointment is actionable (can join/reschedule)
  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'pending';
  const isCompleted = appointment.status === 'completed';
  const isCanceled = appointment.status === 'canceled';

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-primary-300',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Main Info */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Person & Specialty */}
          <div className="flex items-start gap-3">
            {/* Avatar placeholder */}
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
              <DisplayedIcon className="h-5 w-5 text-primary-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                {displayedPerson || 'N/A'}
              </h4>
              {appointment.specialty && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {appointment.specialty}
                </p>
              )}
              {appointment.reason && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 line-clamp-1">
                  {appointment.reason}
                </p>
              )}
            </div>
          </div>

          {/* Date, Time, Type */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{appointment.date}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
            
            {TypeIcon && (
              <div className="flex items-center gap-1.5">
                <TypeIcon className="h-4 w-4" />
                <span className="capitalize">
                  {appointment.type === 'in-person'
                    ? 'Trực tiếp'
                    : appointment.type === 'video'
                    ? 'Video call'
                    : 'Điện thoại'}
                </span>
              </div>
            )}

            {appointment.location && appointment.type === 'in-person' && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{appointment.location}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div>
            <Badge className={cn('border', statusInfo.color)}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Right: Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {/* Join button (for confirmed video appointments) */}
            {isUpcoming && appointment.type === 'video' && onJoin && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin();
                }}
                className="hidden sm:flex"
              >
                <Video className="h-4 w-4 mr-1" />
                Tham gia
              </Button>
            )}

            {/* Reschedule button */}
            {isUpcoming && onReschedule && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReschedule();
                }}
                className="hidden md:flex"
              >
                Đổi lịch
              </Button>
            )}

            {/* Cancel button */}
            {isUpcoming && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="hidden md:flex text-error-600 hover:text-error-700"
              >
                Hủy
              </Button>
            )}

            {/* View details */}
            {(isCompleted || isCanceled) && onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
              >
                Chi tiết
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}

            {/* More actions menu */}
            {onMoreActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreActions();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Patient View:
 * <AppointmentListItem
 *   appointment={{
 *     id: 1,
 *     doctorName: "BS. Nguyễn Văn A",
 *     specialty: "Tim mạch",
 *     date: "25/12/2025",
 *     time: "09:00 - 10:00",
 *     status: "confirmed",
 *     type: "video",
 *   }}
 *   viewMode="patient"
 *   onJoin={() => joinVideoCall()}
 *   onReschedule={() => openRescheduleModal()}
 *   onCancel={() => cancelAppointment()}
 * />
 * 
 * Doctor View:
 * <AppointmentListItem
 *   appointment={{
 *     id: 2,
 *     patientName: "Nguyễn Thị B",
 *     date: "26/12/2025",
 *     time: "14:00 - 15:00",
 *     status: "pending",
 *     type: "in-person",
 *     location: "Phòng khám 101",
 *     reason: "Khám định kỳ",
 *   }}
 *   viewMode="doctor"
 *   onClick={() => navigate(`/appointments/${id}`)}
 * />
 */
