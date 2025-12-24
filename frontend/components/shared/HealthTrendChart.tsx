/**
 * ============================================
 * HEALTH TREND CHART - SHARED COMPONENT
 * ============================================
 * 
 * Biểu đồ xu hướng cho chỉ số sức khỏe theo thời gian
 * Hỗ trợ nhiều dataset, chọn khoảng thời gian, tooltip
 * 
 * FEATURES:
 * - Line chart cho 1 hoặc nhiều metrics
 * - Time range selector (7 days, 30 days, 3 months, custom)
 * - Interactive tooltip
 * - Responsive & mobile-friendly
 * - Export data option
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * TYPES
 */
export type TimeRange = '7d' | '30d' | '3m' | '6m' | 'custom';

export interface HealthDataPoint {
  timestamp: string; // ISO date string or formatted date
  [key: string]: string | number; // Dynamic metric values
}

export interface MetricConfig {
  key: string; // Khóa trong data point
  label: string; // Tên hiển thị
  color: string; // Màu đường (hex)
  unit: string; // Đơn vị
}

export interface HealthTrendChartProps {
  /**
   * Tiêu đề biểu đồ
   */
  title: string;
  
  /**
   * Dữ liệu biểu đồ
   */
  data: HealthDataPoint[];
  
  /**
   * Cấu hình các metrics hiển thị
   */
  metrics: MetricConfig[];
  
  /**
   * Khoảng thời gian hiện tại
   * @default '7d'
   */
  selectedRange?: TimeRange;
  
  /**
   * Callback khi thay đổi time range
   */
  onRangeChange?: (range: TimeRange) => void;
  
  /**
   * Callback khi export data
   */
  onExport?: () => void;
  
  /**
   * Hiển thị grid
   * @default true
   */
  showGrid?: boolean;
  
  /**
   * Hiển thị legend
   * @default true
   */
  showLegend?: boolean;
  
  /**
   * Chiều cao biểu đồ (px)
   * @default 350
   */
  height?: number;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * TIME RANGE OPTIONS
 */
const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '3m', label: '3 tháng' },
  { value: '6m', label: '6 tháng' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

/**
 * CUSTOM TOOLTIP
 */
interface CustomTooltipProps extends TooltipProps<number, string> {
  metrics: MetricConfig[];
}

function CustomTooltip({ active, payload, label, metrics }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const metric = metrics.find((m) => m.key === entry.dataKey);
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {metric?.label || entry.dataKey}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {entry.value} {metric?.unit || ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * COMPONENT
 */
export function HealthTrendChart({
  title,
  data,
  metrics,
  selectedRange = '7d',
  onRangeChange,
  onExport,
  showGrid = true,
  showLegend = true,
  height = 350,
  loading = false,
  className,
}: HealthTrendChartProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Handle range change
  const handleRangeChange = (range: TimeRange) => {
    if (onRangeChange) {
      onRangeChange(range);
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRangeChange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  selectedRange === option.value
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : data.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-slate-500"
            style={{ height }}
          >
            <Calendar className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">Không có dữ liệu trong khoảng thời gian này</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  className="dark:stroke-slate-700"
                />
              )}
              
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              
              <YAxis
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              
              <Tooltip content={<CustomTooltip metrics={metrics} />} />
              
              {showLegend && (
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  formatter={(value) => {
                    const metric = metrics.find((m) => m.key === value);
                    return metric?.label || value;
                  }}
                />
              )}
              
              {metrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={hoveredMetric === metric.key ? 3 : 2}
                  dot={{ r: 4, fill: metric.color }}
                  activeDot={{ r: 6 }}
                  onMouseEnter={() => setHoveredMetric(metric.key)}
                  onMouseLeave={() => setHoveredMetric(null)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer - Metrics Summary */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
        {metrics.map((metric) => {
          const values = data.map((d) => Number(d[metric.key])).filter((v) => !isNaN(v));
          const avg = values.length > 0
            ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
            : '--';
          const min = values.length > 0 ? Math.min(...values).toFixed(1) : '--';
          const max = values.length > 0 ? Math.max(...values).toFixed(1) : '--';

          return (
            <div key={metric.key} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {metric.label}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  TB: {avg} {metric.unit} | Min: {min} | Max: {max}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLES
 * 
 * Single metric:
 * <HealthTrendChart
 *   title="Nhịp tim 7 ngày"
 *   data={[
 *     { timestamp: '01/12', heartRate: 72 },
 *     { timestamp: '02/12', heartRate: 75 },
 *     ...
 *   ]}
 *   metrics={[
 *     { key: 'heartRate', label: 'Nhịp tim', color: '#0EA5E9', unit: 'bpm' }
 *   ]}
 * />
 * 
 * Multiple metrics:
 * <HealthTrendChart
 *   title="Chỉ số sức khỏe"
 *   data={chartData}
 *   metrics={[
 *     { key: 'systolic', label: 'Tâm thu', color: '#EF4444', unit: 'mmHg' },
 *     { key: 'diastolic', label: 'Tâm trương', color: '#3B82F6', unit: 'mmHg' },
 *   ]}
 *   selectedRange="30d"
 *   onRangeChange={(range) => fetchData(range)}
 *   onExport={() => downloadCSV()}
 * />
 */
