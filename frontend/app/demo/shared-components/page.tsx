/**
 * ============================================
 * SHARED COMPONENTS DEMO PAGE
 * ============================================
 * 
 * Demo page hiển thị tất cả shared components
 * Dùng để test và reference
 */

'use client';

import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Droplet,
  Wind,
  Users,
  Calendar,
  Stethoscope,
  UserPlus,
  Filter,
  Download,
  Plus,
  AlertTriangle,
} from 'lucide-react';

// Import shared components
import {
  HealthMetricCard,
  HealthTrendChart,
  AppointmentListItem,
  StatusBadge,
  PatientCriticalBadge,
  AppointmentConfirmedBadge,
  EmptyState,
  NoAppointmentsState,
  FilterBar,
  PageHeader,
  FormModal,
  NotificationDropdown,
  LanguageThemeSwitcher,
} from '@/components/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SharedComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Mock data
  const mockHealthData = [
    { timestamp: '01/12', heartRate: 72, bloodPressure: 120 },
    { timestamp: '02/12', heartRate: 75, bloodPressure: 122 },
    { timestamp: '03/12', heartRate: 70, bloodPressure: 118 },
    { timestamp: '04/12', heartRate: 73, bloodPressure: 121 },
    { timestamp: '05/12', heartRate: 76, bloodPressure: 125 },
    { timestamp: '06/12', heartRate: 74, bloodPressure: 123 },
    { timestamp: '07/12', heartRate: 72, bloodPressure: 120 },
  ];

  const mockNotifications = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Chỉ số bất thường',
      message: 'Huyết áp của bạn cao hơn bình thường',
      timestamp: '5 phút trước',
      read: false,
      actionUrl: '/metrics/blood-pressure',
    },
    {
      id: 2,
      type: 'appointment' as const,
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch khám vào 9:00 ngày mai',
      timestamp: '1 giờ trước',
      read: false,
    },
    {
      id: 3,
      type: 'system' as const,
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật phiên bản mới',
      timestamp: '3 giờ trước',
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header with Language/Theme Switcher */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Shared Components Demo
          </h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown notifications={mockNotifications} />
            <LanguageThemeSwitcher />
          </div>
        </div>

        {/* Section 1: Page Headers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Page Headers
          </h2>
          
          <div className="space-y-4">
            <PageHeader
              title="Danh sách bệnh nhân"
              subtitle="Quản lý thông tin bệnh nhân trong hệ thống"
            />

            <PageHeader
              icon={Calendar}
              title="Lịch hẹn"
              subtitle="Quản lý lịch hẹn khám bệnh"
              breadcrumb={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Lịch hẹn' },
              ]}
              actions={
                <>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm lịch hẹn
                  </Button>
                </>
              }
            />

            <PageHeader
              variant="gradient"
              icon={Stethoscope}
              title="Bác sĩ"
              subtitle="Quản lý đội ngũ y bác sĩ"
              badges={[
                <StatusBadge key="1" variant="active" showDot>
                  25 đang hoạt động
                </StatusBadge>,
              ]}
              actions={
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm bác sĩ
                </Button>
              }
            />
          </div>
        </section>

        {/* Section 2: Health Metric Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. Health Metric Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HealthMetricCard
              label="Nhịp tim"
              value={72}
              unit="bpm"
              status="normal"
              icon={Heart}
              trend="stable"
              timestamp="5 phút trước"
            />

            <HealthMetricCard
              label="Huyết áp"
              value="140/90"
              unit="mmHg"
              status="warning"
              icon={Activity}
              trend="up"
              trendValue="+8%"
              timestamp="10 phút trước"
            />

            <HealthMetricCard
              label="SpO2"
              value={95}
              unit="%"
              status="low"
              icon={Wind}
              trend="down"
              trendValue="-2%"
              subtitle="Dưới mức bình thường"
              timestamp="15 phút trước"
            />

            <HealthMetricCard
              label="Đường huyết"
              value={105}
              unit="mg/dL"
              status="normal"
              icon={Droplet}
              trend="stable"
              timestamp="20 phút trước"
            />
          </div>

          {/* Different sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HealthMetricCard
              size="sm"
              label="Nhiệt độ"
              value={36.5}
              unit="°C"
              status="normal"
              icon={Activity}
            />
            <HealthMetricCard
              size="md"
              label="Nhiệt độ"
              value={36.5}
              unit="°C"
              status="normal"
              icon={Activity}
            />
            <HealthMetricCard
              size="lg"
              label="Nhiệt độ"
              value={36.5}
              unit="°C"
              status="normal"
              icon={Activity}
            />
          </div>
        </section>

        {/* Section 3: Health Trend Chart */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Health Trend Chart
          </h2>
          
          <HealthTrendChart
            title="Nhịp tim & Huyết áp 7 ngày"
            data={mockHealthData}
            metrics={[
              {
                key: 'heartRate',
                label: 'Nhịp tim',
                color: '#0EA5E9',
                unit: 'bpm',
              },
              {
                key: 'bloodPressure',
                label: 'Huyết áp',
                color: '#EF4444',
                unit: 'mmHg',
              },
            ]}
            selectedRange="7d"
          />
        </section>

        {/* Section 4: Status Badges */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Status Badges
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Appointment Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant="pending">Chờ xác nhận</StatusBadge>
                <StatusBadge variant="confirmed">Đã xác nhận</StatusBadge>
                <StatusBadge variant="completed">Hoàn thành</StatusBadge>
                <StatusBadge variant="canceled">Đã hủy</StatusBadge>
                <StatusBadge variant="rescheduled">Đã dời lịch</StatusBadge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Patient Condition
              </h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant="stable" showDot>
                  Ổn định
                </StatusBadge>
                <StatusBadge variant="warning" showDot icon={AlertTriangle}>
                  Cảnh báo
                </StatusBadge>
                <StatusBadge variant="critical" showDot icon={AlertTriangle}>
                  Nghiêm trọng
                </StatusBadge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Different Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge variant="success" size="sm">
                  Small
                </StatusBadge>
                <StatusBadge variant="success" size="md">
                  Medium
                </StatusBadge>
                <StatusBadge variant="success" size="lg">
                  Large
                </StatusBadge>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Appointment List Items */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            5. Appointment List Items
          </h2>
          
          <div className="space-y-3">
            <AppointmentListItem
              appointment={{
                id: 1,
                doctorName: 'BS. Nguyễn Văn An',
                specialty: 'Tim mạch',
                date: '25/12/2025',
                time: '09:00 - 10:00',
                status: 'confirmed',
                type: 'video',
                reason: 'Khám định kỳ',
              }}
              viewMode="patient"
              onJoin={() => alert('Join video call')}
              onReschedule={() => alert('Reschedule')}
              onCancel={() => alert('Cancel')}
            />

            <AppointmentListItem
              appointment={{
                id: 2,
                patientName: 'Nguyễn Thị Bình',
                date: '26/12/2025',
                time: '14:00 - 15:00',
                status: 'pending',
                type: 'in-person',
                location: 'Phòng khám 101',
                reason: 'Khám bệnh',
              }}
              viewMode="doctor"
              onClick={() => alert('View details')}
            />

            <AppointmentListItem
              appointment={{
                id: 3,
                doctorName: 'BS. Lê Văn Cường',
                specialty: 'Nội khoa',
                date: '20/12/2025',
                time: '10:00 - 11:00',
                status: 'completed',
                type: 'in-person',
              }}
              viewMode="patient"
              onViewDetails={() => alert('View details')}
            />
          </div>
        </section>

        {/* Section 6: Filter Bar */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            6. Filter Bar
          </h2>
          
          <FilterBar
            searchPlaceholder="Tìm kiếm bác sĩ..."
            searchValue={search}
            onSearchChange={setSearch}
            dropdownFilters={[
              {
                id: 'specialty',
                label: 'Chuyên khoa',
                options: [
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Tim mạch', value: 'cardiology' },
                  { label: 'Nội khoa', value: 'internal' },
                ],
              },
            ]}
            tagFilters={[
              { label: 'Tim mạch', value: 'cardiology' },
              { label: 'Nội khoa', value: 'internal' },
              { label: 'Nhi khoa', value: 'pediatrics' },
            ]}
            actions={
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            }
          />
        </section>

        {/* Section 7: Empty States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            7. Empty States
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <EmptyState
                variant="no-data"
                icon={Users}
                title="Chưa có bệnh nhân"
                description="Hãy thêm bệnh nhân đầu tiên."
                actionLabel="Thêm bệnh nhân"
                onAction={() => alert('Add patient')}
                size="sm"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <NoAppointmentsState
                actionLabel="Tạo lịch hẹn"
                onAction={() => alert('Create appointment')}
                size="sm"
              />
            </div>
          </div>
        </section>

        {/* Section 8: Form Modal */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            8. Form Modal
          </h2>
          
          <Button onClick={() => setIsModalOpen(true)}>
            Open Form Modal
          </Button>

          <FormModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Thêm bệnh nhân"
            description="Nhập thông tin bệnh nhân mới"
            onSubmit={() => {
              alert('Submit form');
              setIsModalOpen(false);
            }}
            sections={[
              {
                id: 'basic',
                title: 'Thông tin cơ bản',
                description: 'Thông tin chung về bệnh nhân',
                content: (
                  <div className="space-y-4">
                    <Input placeholder="Họ và tên" />
                    <Input placeholder="Email" type="email" />
                    <Input placeholder="Số điện thoại" />
                  </div>
                ),
              },
              {
                id: 'medical',
                title: 'Thông tin y tế',
                content: (
                  <div className="space-y-4">
                    <Input placeholder="Nhóm máu" />
                    <Input placeholder="Tiền sử bệnh" />
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* Footer */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-700">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Shared Components Demo - Health Monitor System
          </p>
        </div>
      </div>
    </div>
  );
}
