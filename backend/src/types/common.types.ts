/**
 * Common TypeScript Type Definitions
 */

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Date range filter
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Common query parameters
 */
export interface CommonQueryParams extends PaginationParams, SortParams {
  search?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
  metadata?: PaginationMetadata;
  timestamp: string;
}

/**
 * User roles
 */
export type UserRole = 'admin' | 'doctor' | 'patient' | 'staff';

/**
 * Vital status
 */
export type VitalStatus = 'normal' | 'warning' | 'critical';

/**
 * Appointment status
 */
export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

/**
 * Alert severity
 */
export type AlertSeverity = 'info' | 'warning' | 'critical';

/**
 * Generic ID parameter
 */
export interface IdParam {
  id: string;
}
