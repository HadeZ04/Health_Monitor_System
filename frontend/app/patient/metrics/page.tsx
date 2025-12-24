"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Droplet,
  Weight,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HealthMetricsPage() {
  const [timeRange, setTimeRange] = useState("7days");

  const metrics = {
    bloodPressure: {
      name: "Huyết áp",
      icon: Heart,
      color: "text-error-600",
      bgColor: "bg-error-50",
      borderColor: "border-error-200",
      current: { systolic: 120, diastolic: 80 },
      unit: "mmHg",
      status: "normal",
      statusText: "Bình thường",
      trend: "stable",
      data: [
        { date: "2025-01-01", systolic: 125, diastolic: 82 },
        { date: "2025-01-02", systolic: 118, diastolic: 78 },
        { date: "2025-01-03", systolic: 122, diastolic: 80 },
        { date: "2025-01-04", systolic: 120, diastolic: 79 },
        { date: "2025-01-05", systolic: 119, diastolic: 81 },
        { date: "2025-01-06", systolic: 121, diastolic: 80 },
        { date: "2025-01-07", systolic: 120, diastolic: 80 },
      ],
      normalRange: "< 120/80",
    },
    heartRate: {
      name: "Nhịp tim",
      icon: Activity,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-200",
      current: 72,
      unit: "bpm",
      status: "normal",
      statusText: "Bình thường",
      trend: "down",
      data: [
        { date: "2025-01-01", value: 75 },
        { date: "2025-01-02", value: 73 },
        { date: "2025-01-03", value: 74 },
        { date: "2025-01-04", value: 72 },
        { date: "2025-01-05", value: 71 },
        { date: "2025-01-06", value: 73 },
        { date: "2025-01-07", value: 72 },
      ],
      normalRange: "60-100 bpm",
    },
    bloodSugar: {
      name: "Đường huyết",
      icon: Droplet,
      color: "text-secondary-600",
      bgColor: "bg-secondary-50",
      borderColor: "border-secondary-200",
      current: 95,
      unit: "mg/dL",
      status: "normal",
      statusText: "Bình thường",
      trend: "stable",
      data: [
        { date: "2025-01-01", value: 98 },
        { date: "2025-01-02", value: 92 },
        { date: "2025-01-03", value: 96 },
        { date: "2025-01-04", value: 94 },
        { date: "2025-01-05", value: 93 },
        { date: "2025-01-06", value: 97 },
        { date: "2025-01-07", value: 95 },
      ],
      normalRange: "70-100 mg/dL",
    },
    spo2: {
      name: "SpO2",
      icon: Activity,
      color: "text-info-600",
      bgColor: "bg-info-50",
      borderColor: "border-info-200",
      current: 98,
      unit: "%",
      status: "normal",
      statusText: "Bình thường",
      trend: "stable",
      data: [
        { date: "2025-01-01", value: 97 },
        { date: "2025-01-02", value: 98 },
        { date: "2025-01-03", value: 98 },
        { date: "2025-01-04", value: 97 },
        { date: "2025-01-05", value: 99 },
        { date: "2025-01-06", value: 98 },
        { date: "2025-01-07", value: 98 },
      ],
      normalRange: "> 95%",
    },
    weight: {
      name: "Cân nặng / BMI",
      icon: Weight,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      current: { weight: 70, bmi: 24.5 },
      unit: "kg",
      status: "normal",
      statusText: "Bình thường",
      trend: "down",
      data: [
        { date: "2025-01-01", weight: 71.2, bmi: 24.9 },
        { date: "2025-01-02", weight: 71.0, bmi: 24.8 },
        { date: "2025-01-03", weight: 70.8, bmi: 24.7 },
        { date: "2025-01-04", weight: 70.5, bmi: 24.6 },
        { date: "2025-01-05", weight: 70.3, bmi: 24.6 },
        { date: "2025-01-06", weight: 70.2, bmi: 24.5 },
        { date: "2025-01-07", weight: 70.0, bmi: 24.5 },
      ],
      normalRange: "18.5-24.9",
    },
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-error-600" />;
    return <span className="text-xs text-slate-500">—</span>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: { variant: "default" as const, text: "Bình thường" },
      warning: { variant: "secondary" as const, text: "Cần theo dõi" },
      danger: { variant: "destructive" as const, text: "Cảnh báo" },
    };
    const config = variants[status as keyof typeof variants] || variants.normal;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Theo dõi chỉ số sức khỏe</h1>
          <p className="text-slate-600 mt-1">
            Giám sát và quản lý các chỉ số sức khỏe quan trọng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm đo lường
          </Button>
        </div>
      </div>

      {/* Time Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Khoảng thời gian:</span>
            <div className="flex gap-2">
              {[
                { value: "7days", label: "7 ngày" },
                { value: "30days", label: "30 ngày" },
                { value: "3months", label: "3 tháng" },
                { value: "6months", label: "6 tháng" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blood Pressure */}
        <Card className={`${metrics.bloodPressure.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${metrics.bloodPressure.bgColor} flex items-center justify-center`}>
                  <metrics.bloodPressure.icon className={`w-5 h-5 ${metrics.bloodPressure.color}`} />
                </div>
                <CardTitle className="text-lg">{metrics.bloodPressure.name}</CardTitle>
              </div>
              {getTrendIcon(metrics.bloodPressure.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className={`text-3xl font-bold ${metrics.bloodPressure.color}`}>
                  {metrics.bloodPressure.current.systolic}/{metrics.bloodPressure.current.diastolic}
                </div>
                <div className="text-sm text-slate-600">{metrics.bloodPressure.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ngưỡng: {metrics.bloodPressure.normalRange}
                </span>
                {getStatusBadge(metrics.bloodPressure.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card className={`${metrics.heartRate.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${metrics.heartRate.bgColor} flex items-center justify-center`}>
                  <metrics.heartRate.icon className={`w-5 h-5 ${metrics.heartRate.color}`} />
                </div>
                <CardTitle className="text-lg">{metrics.heartRate.name}</CardTitle>
              </div>
              {getTrendIcon(metrics.heartRate.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className={`text-3xl font-bold ${metrics.heartRate.color}`}>
                  {metrics.heartRate.current}
                </div>
                <div className="text-sm text-slate-600">{metrics.heartRate.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ngưỡng: {metrics.heartRate.normalRange}
                </span>
                {getStatusBadge(metrics.heartRate.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Sugar */}
        <Card className={`${metrics.bloodSugar.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${metrics.bloodSugar.bgColor} flex items-center justify-center`}>
                  <metrics.bloodSugar.icon className={`w-5 h-5 ${metrics.bloodSugar.color}`} />
                </div>
                <CardTitle className="text-lg">{metrics.bloodSugar.name}</CardTitle>
              </div>
              {getTrendIcon(metrics.bloodSugar.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className={`text-3xl font-bold ${metrics.bloodSugar.color}`}>
                  {metrics.bloodSugar.current}
                </div>
                <div className="text-sm text-slate-600">{metrics.bloodSugar.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ngưỡng: {metrics.bloodSugar.normalRange}
                </span>
                {getStatusBadge(metrics.bloodSugar.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SpO2 */}
        <Card className={`${metrics.spo2.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${metrics.spo2.bgColor} flex items-center justify-center`}>
                  <metrics.spo2.icon className={`w-5 h-5 ${metrics.spo2.color}`} />
                </div>
                <CardTitle className="text-lg">{metrics.spo2.name}</CardTitle>
              </div>
              {getTrendIcon(metrics.spo2.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className={`text-3xl font-bold ${metrics.spo2.color}`}>
                  {metrics.spo2.current}
                </div>
                <div className="text-sm text-slate-600">{metrics.spo2.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ngưỡng: {metrics.spo2.normalRange}
                </span>
                {getStatusBadge(metrics.spo2.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weight / BMI */}
        <Card className={`${metrics.weight.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${metrics.weight.bgColor} flex items-center justify-center`}>
                  <metrics.weight.icon className={`w-5 h-5 ${metrics.weight.color}`} />
                </div>
                <CardTitle className="text-lg">{metrics.weight.name}</CardTitle>
              </div>
              {getTrendIcon(metrics.weight.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className={`text-2xl font-bold ${metrics.weight.color}`}>
                    {metrics.weight.current.weight}
                  </div>
                  <div className="text-xs text-slate-600">{metrics.weight.unit}</div>
                </div>
                <div className="border-l pl-3">
                  <div className={`text-2xl font-bold ${metrics.weight.color}`}>
                    {metrics.weight.current.bmi}
                  </div>
                  <div className="text-xs text-slate-600">BMI</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  BMI bình thường: {metrics.weight.normalRange}
                </span>
                {getStatusBadge(metrics.weight.status)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ chi tiết</CardTitle>
          <CardDescription>
            Xem xu hướng thay đổi của từng chỉ số theo thời gian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bloodPressure" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="bloodPressure">Huyết áp</TabsTrigger>
              <TabsTrigger value="heartRate">Nhịp tim</TabsTrigger>
              <TabsTrigger value="bloodSugar">Đường huyết</TabsTrigger>
              <TabsTrigger value="spo2">SpO2</TabsTrigger>
              <TabsTrigger value="weight">Cân nặng</TabsTrigger>
            </TabsList>

            {Object.entries(metrics).map(([key, metric]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                {/* Chart Placeholder */}
                <div className="h-64 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-slate-500">
                      Biểu đồ {metric.name} sẽ được hiển thị ở đây
                    </p>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          Ngày
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          Giá trị
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          Đánh giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {metric.data.map((entry: any, index: number) => (
                        <tr key={index} className="border-t hover:bg-slate-50">
                          <td className="px-4 py-2">
                            {new Date(entry.date).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-4 py-2 font-semibold">
                            {key === "bloodPressure"
                              ? `${entry.systolic}/${entry.diastolic}`
                              : key === "weight"
                              ? `${entry.weight} kg (BMI: ${entry.bmi})`
                              : entry.value}
                          </td>
                          <td className="px-4 py-2">
                            {getStatusBadge("normal")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Health Tips */}
      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <CardHeader>
          <CardTitle>💡 Lời khuyên dựa trên chỉ số của bạn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-700">
            ✓ Các chỉ số sức khỏe của bạn đang trong ngưỡng tốt. Hãy duy trì lối sống lành mạnh!
          </p>
          <p className="text-sm text-slate-700">
            ✓ Tiếp tục theo dõi đường huyết đều đặn, đặc biệt sau bữa ăn.
          </p>
          <p className="text-sm text-slate-700">
            ✓ Cân nặng đang giảm nhẹ - điều này rất tốt! Hãy duy trì chế độ ăn uống và tập luyện.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
