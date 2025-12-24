/**
 * ============================================
 * SHARED COMPONENTS - INDEX
 * ============================================
 * 
 * Export tất cả shared components cho hệ thống
 * Health Monitor System
 */

// Health & Medical Components
export { HealthMetricCard } from './HealthMetricCard';
export type {
  HealthMetricCardProps,
  HealthMetricStatus,
  HealthMetricTrend,
  HealthMetricSize,
} from './HealthMetricCard';

export { HealthTrendChart } from './HealthTrendChart';
export type {
  HealthTrendChartProps,
  TimeRange,
  HealthDataPoint,
  MetricConfig,
} from './HealthTrendChart';

// Appointment Components
export { AppointmentListItem } from './AppointmentListItem';
export type {
  AppointmentListItemProps,
  AppointmentData,
  AppointmentStatus,
  AppointmentType,
  AppointmentViewMode,
} from './AppointmentListItem';

// Status & Indicators
export {
  StatusBadge,
  AppointmentPendingBadge,
  AppointmentConfirmedBadge,
  AppointmentCompletedBadge,
  AppointmentCanceledBadge,
  PatientStableBadge,
  PatientWarningBadge,
  PatientCriticalBadge,
  UserActiveBadge,
  UserInactiveBadge,
  UserLockedBadge,
} from './StatusBadge';
export type { StatusBadgeProps } from './StatusBadge';

// Empty States
export {
  EmptyState,
  NoDataState,
  NoSearchResultsState,
  ErrorState,
  NoPatientsState,
  NoAppointmentsState,
  NoHealthDataState,
} from './EmptyState';
export type { EmptyStateProps, EmptyStateVariant } from './EmptyState';

// Filters & Search
export { FilterBar } from './FilterBar';
export type {
  FilterBarProps,
  FilterOption,
  DropdownFilter,
  DateRangeValue,
} from './FilterBar';

// Layout Components
export { PageHeader } from './PageHeader';
export type { PageHeaderProps, BreadcrumbItem } from './PageHeader';

// Forms
export { FormModal } from './FormModal';
export type { FormModalProps, FormSection, FormLayoutType } from './FormModal';

// Notifications
export { NotificationDropdown } from './NotificationDropdown';
export type {
  NotificationDropdownProps,
  Notification,
  NotificationType,
} from './NotificationDropdown';

// Settings & Preferences
export {
  LanguageThemeSwitcher,
  LanguageSwitcher,
  ThemeSwitcher,
  LanguageThemeDropdown,
} from './LanguageThemeSwitcher';
export type {
  LanguageThemeSwitcherProps,
  Language,
  Theme,
} from './LanguageThemeSwitcher';
