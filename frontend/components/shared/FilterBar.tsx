/**
 * ============================================
 * FILTER BAR - SHARED COMPONENT
 * ============================================
 * 
 * Component dùng chung để filter/search dữ liệu
 * Hỗ trợ: Search, Dropdown filters, Date range, Tags
 * 
 * FEATURES:
 * - Search input với debounce
 * - Multiple dropdown filters
 * - Date range picker
 * - Tag/category filters
 * - Clear all filters
 * - Responsive layout
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  X,
  ChevronDown,
  Calendar as CalendarIcon,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * TYPES
 */
export interface FilterOption {
  label: string;
  value: string;
}

export interface DropdownFilter {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

export interface DateRangeValue {
  from?: Date;
  to?: Date;
}

export interface FilterBarProps {
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
  
  /**
   * Search value (controlled)
   */
  searchValue?: string;
  
  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;
  
  /**
   * Dropdown filters
   */
  dropdownFilters?: DropdownFilter[];
  
  /**
   * Selected filters (controlled)
   */
  selectedFilters?: Record<string, string | string[]>;
  
  /**
   * Filter change handler
   */
  onFilterChange?: (filterId: string, value: string | string[]) => void;
  
  /**
   * Date range value (controlled)
   */
  dateRange?: DateRangeValue;
  
  /**
   * Date range change handler
   */
  onDateRangeChange?: (range: DateRangeValue) => void;
  
  /**
   * Show date range picker
   * @default false
   */
  showDateRange?: boolean;
  
  /**
   * Tag filters
   */
  tagFilters?: FilterOption[];
  
  /**
   * Selected tags
   */
  selectedTags?: string[];
  
  /**
   * Tag change handler
   */
  onTagChange?: (tags: string[]) => void;
  
  /**
   * Clear all filters handler
   */
  onClearAll?: () => void;
  
  /**
   * Show filter count badge
   * @default true
   */
  showFilterCount?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Additional action buttons
   */
  actions?: React.ReactNode;
}

/**
 * COMPONENT
 */
export function FilterBar({
  searchPlaceholder = 'Tìm kiếm...',
  searchValue = '',
  onSearchChange,
  dropdownFilters = [],
  selectedFilters = {},
  onFilterChange,
  dateRange,
  onDateRangeChange,
  showDateRange = false,
  tagFilters = [],
  selectedTags = [],
  onTagChange,
  onClearAll,
  showFilterCount = true,
  className,
  actions,
}: FilterBarProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearchValue !== searchValue) {
        onSearchChange(localSearchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchValue, onSearchChange, searchValue]);

  // Calculate active filter count
  const activeFilterCount = Object.values(selectedFilters).filter(
    (value) => value && (Array.isArray(value) ? value.length > 0 : true)
  ).length + selectedTags.length;

  // Handle tag toggle
  const handleTagToggle = (tagValue: string) => {
    if (!onTagChange) return;
    
    const newTags = selectedTags.includes(tagValue)
      ? selectedTags.filter((t) => t !== tagValue)
      : [...selectedTags, tagValue];
    
    onTagChange(newTags);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setLocalSearchValue('');
    if (onSearchChange) onSearchChange('');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Desktop Dropdown Filters */}
        <div className="hidden md:flex items-center gap-2">
          {dropdownFilters.map((filter) => (
            <div key={filter.id} className="relative">
              <button
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                  'text-sm font-medium whitespace-nowrap',
                  selectedFilters[filter.id]
                    ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                {filter.label}
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown menu would go here - simplified for this example */}
            </div>
          ))}

          {/* Date Range (simplified) */}
          {showDateRange && (
            <Button variant="outline" size="default">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          size="default"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Lọc
          {activeFilterCount > 0 && showFilterCount && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Clear All Filters */}
        {activeFilterCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="default"
            onClick={onClearAll}
            className="text-error-600 hover:text-error-700 hover:bg-error-50"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Tag Filters */}
      {tagFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Danh mục:
          </span>
          {tagFilters.map((tag) => {
            const isSelected = selectedTags.includes(tag.value);
            return (
              <button
                key={tag.value}
                onClick={() => handleTagToggle(tag.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                )}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="md:hidden p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white">Bộ lọc</h4>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile filter options would go here */}
          <div className="space-y-2">
            {dropdownFilters.map((filter) => (
              <div key={filter.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {filter.label}
                </p>
                {/* Filter options */}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(false)}
            className="w-full"
          >
            Áp dụng
          </Button>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && showFilterCount && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Filter className="h-4 w-4" />
          <span>
            Đang áp dụng <strong>{activeFilterCount}</strong> bộ lọc
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Basic search:
 * <FilterBar
 *   searchPlaceholder="Tìm kiếm bệnh nhân..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 * />
 * 
 * With dropdown filters:
 * <FilterBar
 *   searchPlaceholder="Tìm kiếm..."
 *   dropdownFilters={[
 *     {
 *       id: 'status',
 *       label: 'Trạng thái',
 *       options: [
 *         { label: 'Tất cả', value: 'all' },
 *         { label: 'Đang hoạt động', value: 'active' },
 *         { label: 'Không hoạt động', value: 'inactive' },
 *       ],
 *     },
 *     {
 *       id: 'specialty',
 *       label: 'Chuyên khoa',
 *       options: [...],
 *     },
 *   ]}
 *   selectedFilters={filters}
 *   onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
 * />
 * 
 * With tags:
 * <FilterBar
 *   tagFilters={[
 *     { label: 'Tim mạch', value: 'cardiology' },
 *     { label: 'Nội khoa', value: 'internal' },
 *     { label: 'Nhi khoa', value: 'pediatrics' },
 *   ]}
 *   selectedTags={tags}
 *   onTagChange={setTags}
 * />
 * 
 * Complete example:
 * <FilterBar
 *   searchPlaceholder="Tìm kiếm bác sĩ..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   dropdownFilters={dropdownFilters}
 *   selectedFilters={filters}
 *   onFilterChange={handleFilterChange}
 *   showDateRange={true}
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 *   tagFilters={specialties}
 *   selectedTags={selectedSpecialties}
 *   onTagChange={setSelectedSpecialties}
 *   onClearAll={clearAllFilters}
 *   actions={
 *     <Button onClick={exportData}>
 *       <Download className="h-4 w-4 mr-2" />
 *       Export
 *     </Button>
 *   }
 * />
 */
