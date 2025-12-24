"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Activity,
  TrendingUp,
  AlertTriangle,
  FileText,
  Pill,
  FlaskConical,
  MessageSquare,
  Edit,
  Download,
  Share2,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Droplet,
  Thermometer,
  Wind,
  Eye,
  Stethoscope,
  Syringe,
  ClipboardList,
  BookOpen,
} from "lucide-react";

export default function PatientDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const patient = {
    id: params.id,
    code: "BN001234",
    name: "Nguyễn Văn An",
    age: 45,
    gender: "Nam",
    dateOfBirth: "15/05/1979",
    bloodType: "O+",
    phone: "0901234567",
    email: "nguyenvanan@email.com",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    insurance: "BHYT-001234567890",
    emergencyContact: {
      name: "Nguyễn Thị B (Vợ)",
      phone: "0912345678",
      relationship: "Vợ",
    },
    status: "stable",
    priority: "normal",
    condition: "Tiểu đường type 2",
    admitDate: "2025-01-08",
    room: "P-302",
    bed: "Giường 02",
    attendingDoctor: "BS. Trần Thị Minh Châu",
    allergies: ["Penicillin", "Aspirin"],
    chronicDiseases: ["Tiểu đường type 2", "Tăng huyết áp nhẹ"],
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "2 lần/ngày",
        duration: "Dài hạn",
        status: "active",
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "1 lần/ngày (sáng)",
        duration: "Dài hạn",
        status: "active",
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "1 lần/ngày",
        duration: "Dài hạn",
        status: "stopped",
        note: "Dị ứng - đã dừng",
      },
    ],
    vitals: {
      current: {
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 36.5,
        respiratoryRate: 16,
        spo2: 98,
        glucose: 105,
        weight: 72,
        height: 170,
        bmi: 24.9,
      },
      lastUpdated: "2025-01-13 09:30",
    },
  };

  const medicalHistory = [
    {
      id: 1,
      date: "2025-01-10",
      type: "Khám bệnh",
      doctor: "BS. Trần Thị Minh Châu",
      diagnosis: "Kiểm tra đường huyết định kỳ",
      treatment: "Điều chỉnh liều Metformin, tư vấn chế độ ăn",
      notes: "Bệnh nhân tuân thủ tốt điều trị. Đường huyết ổn định.",
      attachments: 2,
    },
    {
      id: 2,
      date: "2024-12-15",
      type: "Xét nghiệm",
      doctor: "BS. Lê Văn C",
      diagnosis: "Xét nghiệm HbA1c",
      treatment: "Kết quả: 6.5% - Kiểm soát tốt",
      notes: "Tiếp tục duy trì điều trị hiện tại.",
      attachments: 1,
    },
    {
      id: 3,
      date: "2024-11-20",
      type: "Khám bệnh",
      doctor: "BS. Trần Thị Minh Châu",
      diagnosis: "Tái khám tiểu đường",
      treatment: "Kê đơn thuốc mới, tư vấn tập thể dục",
      notes: "Bệnh nhân có dấu hiệu cải thiện. Khuyến nghị tập thể dục 30 phút/ngày.",
      attachments: 0,
    },
    {
      id: 4,
      date: "2024-10-05",
      type: "Nhập viện",
      doctor: "BS. Nguyễn Văn D",
      diagnosis: "Đường huyết cao 280 mg/dL",
      treatment: "Điều trị nội trú 5 ngày, điều chỉnh insulin",
      notes: "Đường huyết đã ổn định sau điều trị. Xuất viện với đơn thuốc mới.",
      attachments: 5,
    },
  ];

  const labResults = [
    {
      id: 1,
      date: "2025-01-05",
      type: "Xét nghiệm đường huyết",
      status: "completed",
      results: [
        { parameter: "Glucose lúc đói", value: "105", unit: "mg/dL", normal: "70-100", status: "warning" },
        { parameter: "HbA1c", value: "6.5", unit: "%", normal: "< 5.7", status: "warning" },
      ],
      reviewedBy: "BS. Trần Thị Minh Châu",
    },
    {
      id: 2,
      date: "2024-12-28",
      type: "Xét nghiệm máu tổng quát",
      status: "completed",
      results: [
        { parameter: "Hồng cầu", value: "4.8", unit: "triệu/µL", normal: "4.5-5.5", status: "normal" },
        { parameter: "Bạch cầu", value: "7.2", unit: "nghìn/µL", normal: "4.0-10.0", status: "normal" },
        { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", normal: "13.5-17.5", status: "normal" },
      ],
      reviewedBy: "BS. Lê Văn C",
    },
  ];

  const prescriptions = [
    {
      id: 1,
      date: "2025-01-10",
      doctor: "BS. Trần Thị Minh Châu",
      medications: [
        { name: "Metformin 500mg", quantity: "60 viên", usage: "2 lần/ngày sau ăn" },
        { name: "Lisinopril 10mg", quantity: "30 viên", usage: "1 lần/ngày buổi sáng" },
      ],
      status: "active",
      validUntil: "2025-02-10",
    },
    {
      id: 2,
      date: "2024-12-15",
      doctor: "BS. Trần Thị Minh Châu",
      medications: [
        { name: "Metformin 500mg", quantity: "60 viên", usage: "2 lần/ngày sau ăn" },
      ],
      status: "expired",
      validUntil: "2025-01-15",
    },
  ];

  const notes = [
    {
      id: 1,
      date: "2025-01-13 14:30",
      author: "BS. Trần Thị Minh Châu",
      type: "private",
      content: "Bệnh nhân tuân thủ tốt điều trị. Cần theo dõi đường huyết sát hơn trong 2 tuần tới.",
      tags: ["Theo dõi", "Đường huyết"],
    },
    {
      id: 2,
      date: "2025-01-10 10:15",
      author: "BS. Trần Thị Minh Châu",
      type: "private",
      content: "Đã tư vấn về chế độ ăn uống. Bệnh nhân cam kết giảm carbohydrate và tăng rau xanh.",
      tags: ["Tư vấn", "Dinh dưỡng"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/doctor/patients">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </Link>

      {/* Patient Header Card */}
      <Card className="bg-gradient-to-br from-white to-primary-50/30 border-slate-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {patient.name.charAt(0)}
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                    patient.status === "stable" ? "bg-success-500" : "bg-orange-500"
                  }`}
                ></div>
              </div>

              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
                    <p className="text-slate-600 mt-1">
                      {patient.code} • {patient.age} tuổi • {patient.gender}
                    </p>
                  </div>
                  <Badge className={patient.status === "stable" ? "bg-success-100 text-success-700" : "bg-orange-100 text-orange-700"}>
                    {patient.status === "stable" ? "Ổn định" : "Cảnh báo"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Sinh: {patient.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Droplet className="w-4 h-4 text-danger-500" />
                    <span>Nhóm máu: {patient.bloodType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{patient.room} - {patient.bed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                    <span>{patient.attendingDoctor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-2 lg:w-48">
              <Link href={`/doctor/consultation/${patient.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Khám bệnh
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 border-slate-300">
                <MessageSquare className="w-4 h-4 mr-2" />
                Nhắn tin
              </Button>
              <Button variant="outline" className="flex-1 border-slate-300">
                <Download className="w-4 h-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg">
        <div className="border-b border-slate-200 p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Tổng quan", icon: Eye },
              { id: "vitals", label: "Chỉ số sinh tồn", icon: Activity },
              { id: "history", label: "Lịch sử khám", icon: Clock },
              { id: "prescriptions", label: "Đơn thuốc", icon: Pill },
              { id: "lab-results", label: "Xét nghiệm", icon: FlaskConical },
              { id: "notes", label: "Ghi chú", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Primary Condition */}
              <Card className="bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary-600" />
                    Chẩn đoán chính
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-slate-800 mb-2">{patient.condition}</p>
                  <p className="text-sm text-slate-600">
                    Ngày nhập viện: {patient.admitDate}
                  </p>
                </CardContent>
              </Card>

              {/* Allergies & Chronic Diseases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Dị ứng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-700 mr-2">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-purple-600" />
                      Bệnh nền
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patient.chronicDiseases.map((disease, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span>{disease}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Contact */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-slate-600" />
                    Liên hệ khẩn cấp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700">
                      <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relationship})
                    </p>
                    <p className="text-sm text-slate-600">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {patient.emergencyContact.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-slate-600" />
                    Thuốc đang dùng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patient.medications
                      .filter((med) => med.status === "active")
                      .map((med, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{med.name}</p>
                            <p className="text-sm text-slate-600 mt-1">
                              {med.dosage} - {med.frequency}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Thời gian: {med.duration}</p>
                          </div>
                          <Badge className="bg-success-100 text-success-700">Đang dùng</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === "vitals" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">
                  Cập nhật lần cuối: <strong>{patient.vitals.lastUpdated}</strong>
                </p>
                <Button size="sm" className="bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  Cập nhật chỉ số
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Huyết áp", value: patient.vitals.current.bloodPressure, unit: "mmHg", icon: Heart, color: "danger" },
                  { label: "Nhịp tim", value: patient.vitals.current.heartRate, unit: "bpm", icon: Activity, color: "primary" },
                  { label: "Nhiệt độ", value: patient.vitals.current.temperature, unit: "°C", icon: Thermometer, color: "orange" },
                  { label: "Nhịp thở", value: patient.vitals.current.respiratoryRate, unit: "/phút", icon: Wind, color: "teal" },
                  { label: "SpO2", value: patient.vitals.current.spo2, unit: "%", icon: Activity, color: "blue" },
                  { label: "Đường huyết", value: patient.vitals.current.glucose, unit: "mg/dL", icon: TrendingUp, color: "purple" },
                  { label: "Cân nặng", value: patient.vitals.current.weight, unit: "kg", icon: User, color: "slate" },
                  { label: "Chiều cao", value: patient.vitals.current.height, unit: "cm", icon: User, color: "slate" },
                  { label: "BMI", value: patient.vitals.current.bmi, unit: "", icon: User, color: "success" },
                ].map((vital, index) => {
                  const Icon = vital.icon;
                  return (
                    <Card key={index} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 bg-${vital.color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${vital.color}-600`} />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{vital.label}</p>
                        <p className="text-2xl font-bold text-slate-800">
                          {vital.value} <span className="text-sm font-normal text-slate-500">{vital.unit}</span>
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {medicalHistory.map((record) => (
                <Card key={record.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {record.type === "Khám bệnh" ? (
                          <Stethoscope className="w-6 h-6 text-primary-600" />
                        ) : record.type === "Xét nghiệm" ? (
                          <FlaskConical className="w-6 h-6 text-teal-600" />
                        ) : (
                          <Activity className="w-6 h-6 text-orange-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {record.type}
                            </Badge>
                            <p className="font-semibold text-slate-800 text-lg">{record.diagnosis}</p>
                            <p className="text-sm text-slate-600 mt-1">BS: {record.doctor}</p>
                          </div>
                          <p className="text-sm text-slate-500">{record.date}</p>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs font-semibold text-slate-600 mb-1">Điều trị:</p>
                            <p className="text-sm text-slate-700">{record.treatment}</p>
                          </div>

                          {record.notes && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Ghi chú:</p>
                              <p className="text-sm text-slate-700">{record.notes}</p>
                            </div>
                          )}
                        </div>

                        {record.attachments > 0 && (
                          <div className="mt-3">
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              {record.attachments} tài liệu đính kèm
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === "prescriptions" && (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <Card
                  key={prescription.id}
                  className={`border-slate-200 ${prescription.status === "expired" ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              prescription.status === "active"
                                ? "bg-success-100 text-success-700"
                                : "bg-slate-100 text-slate-700"
                            }
                          >
                            {prescription.status === "active" ? "Đang hiệu lực" : "Hết hạn"}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            Hiệu lực đến: {prescription.validUntil}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Ngày kê đơn: {prescription.date} - BS: {prescription.doctor}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Tải đơn
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">{med.name}</p>
                            <p className="text-sm text-slate-600 mt-1">
                              Số lượng: {med.quantity}
                            </p>
                            <p className="text-sm text-slate-600">Cách dùng: {med.usage}</p>
                          </div>
                          <Pill className="w-5 h-5 text-primary-600" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === "lab-results" && (
            <div className="space-y-4">
              {labResults.map((lab) => (
                <Card key={lab.id} className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FlaskConical className="w-5 h-5 text-teal-600" />
                          <h3 className="font-semibold text-slate-800 text-lg">{lab.type}</h3>
                          <Badge className="bg-success-100 text-success-700">Hoàn thành</Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          Ngày: {lab.date} - Duyệt bởi: {lab.reviewedBy}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Tải kết quả
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left p-3 text-sm font-semibold text-slate-700">Chỉ số</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-700">Kết quả</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-700">Đơn vị</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-700">Tham chiếu</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-700">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lab.results.map((result, index) => (
                            <tr key={index} className="border-b border-slate-100">
                              <td className="p-3 text-sm text-slate-700">{result.parameter}</td>
                              <td className="p-3 text-sm font-semibold text-slate-800">{result.value}</td>
                              <td className="p-3 text-sm text-slate-600">{result.unit}</td>
                              <td className="p-3 text-sm text-slate-600">{result.normal}</td>
                              <td className="p-3">
                                {result.status === "normal" ? (
                                  <Badge className="bg-success-100 text-success-700">Bình thường</Badge>
                                ) : (
                                  <Badge className="bg-orange-100 text-orange-700">Cao</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-600">Ghi chú riêng tư của bác sĩ</p>
                <Button size="sm" className="bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Thêm ghi chú
                </Button>
              </div>

              {notes.map((note) => (
                <Card key={note.id} className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-800">{note.author}</p>
                        <p className="text-xs text-slate-600">{note.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {note.type === "private" ? "Riêng tư" : "Công khai"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{note.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
