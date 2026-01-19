/**
 * ============================================
 * FORM MODAL / DRAWER - SHARED COMPONENT
 * ============================================
 * 
 * Component modal/drawer dùng chung cho form
 * Hỗ trợ tạo/sửa entities (User, Appointment, Prescription...)
 * 
 * FEATURES:
 * - Modal & Drawer variants
 * - Form sections
 * - Validation error display
 * - Submit & Cancel actions
 * - Loading states
 * - Responsive (Modal on desktop, Drawer on mobile)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * TYPES
 */
export type FormLayoutType = 'modal' | 'drawer' | 'auto';

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

export interface FormModalProps {
  /**
   * Modal visibility
   */
  open: boolean;
  
  /**
   * Close handler
   */
  onClose: () => void;
  
  /**
   * Title
   */
  title: string;
  
  /**
   * Description
   */
  description?: string;
  
  /**
   * Layout type
   * @default 'auto'
   */
  layout?: FormLayoutType;
  
  /**
   * Form sections (nếu có nhiều section)
   */
  sections?: FormSection[];
  
  /**
   * Form content (nếu chỉ có 1 section)
   */
  children?: React.ReactNode;
  
  /**
   * Submit handler
   */
  onSubmit?: () => void;
  
  /**
   * Cancel handler (nếu khác với onClose)
   */
  onCancel?: () => void;
  
  /**
   * Submit button label
   * @default 'Lưu'
   */
  submitLabel?: string;
  
  /**
   * Cancel button label
   * @default 'Hủy'
   */
  cancelLabel?: string;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Disable submit button
   */
  disableSubmit?: boolean;
  
  /**
   * Hide footer
   */
  hideFooter?: boolean;
  
  /**
   * Max width (chỉ cho modal)
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * MAX WIDTH MAPPING
 */
const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

/**
 * COMPONENT
 */
export function FormModal({
  open,
  onClose,
  title,
  description,
  layout = 'auto',
  sections,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  loading = false,
  error,
  disableSubmit = false,
  hideFooter = false,
  maxWidth = 'lg',
  className,
}: FormModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine actual layout
  const actualLayout =
    layout === 'auto' ? (isMobile ? 'drawer' : 'modal') : layout;

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !disableSubmit && !loading) {
      onSubmit();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Drawer */}
      <div
        className={cn(
          'fixed z-50 bg-white dark:bg-slate-900 shadow-2xl transition-all',
          actualLayout === 'modal'
            ? [
                'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'rounded-xl w-full',
                maxWidthClasses[maxWidth],
                'max-h-[90vh] overflow-hidden',
                'mx-4',
              ]
            : [
                'bottom-0 left-0 right-0',
                'rounded-t-2xl',
                'max-h-[95vh]',
              ],
          className
        )}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-error-50 dark:bg-error-950/30 border border-error-200 dark:border-error-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-error-900 dark:text-error-200">
                    Lỗi
                  </p>
                  <p className="text-sm text-error-700 dark:text-error-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Sections */}
            {sections && sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={cn(
                      index > 0 && 'pt-6 border-t border-slate-200 dark:border-slate-700'
                    )}
                  >
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <div>{section.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              children
            )}
          </div>

          {/* Footer */}
          {!hideFooter && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              
              <Button
                type="submit"
                disabled={disableSubmit || loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {submitLabel}
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <FormModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Thêm bệnh nhân"
 *   description="Nhập thông tin bệnh nhân mới"
 *   onSubmit={handleSubmit}
 * >
 *   <Input label="Họ và tên" />
 *   <Input label="Email" />
 * </FormModal>
 * 
 * With sections:
 * <FormModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Tạo lịch hẹn"
 *   sections={[
 *     {
 *       id: 'basic',
 *       title: 'Thông tin cơ bản',
 *       description: 'Thông tin chung về lịch hẹn',
 *       content: (
 *         <>
 *           <Select label="Bệnh nhân" />
 *           <Select label="Bác sĩ" />
 *         </>
 *       ),
 *     },
 *     {
 *       id: 'datetime',
 *       title: 'Ngày giờ',
 *       content: (
 *         <>
 *           <DatePicker label="Ngày khám" />
 *           <TimePicker label="Giờ khám" />
 *         </>
 *       ),
 *     },
 *   ]}
 *   onSubmit={handleCreateAppointment}
 *   loading={isLoading}
 * />
 * 
 * Force drawer layout:
 * <FormModal
 *   layout="drawer"
 *   {...props}
 * />
 * 
 * With error:
 * <FormModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Cập nhật thông tin"
 *   error="Không thể lưu thông tin. Vui lòng thử lại."
 *   onSubmit={handleSubmit}
 * >
 *   {children}
 * </FormModal>
 */
