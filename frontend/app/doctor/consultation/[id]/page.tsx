"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Pill,
  FlaskConical,
  Heart,
  Activity,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Search,
  TrendingUp,
  Stethoscope,
  ClipboardList,
  Droplet,
  Thermometer,
  Eye,
  Upload,
} from "lucide-react";

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Mock patient data
  const patient = {
    id: params.id,
    code: "BN001234",
    name: "Nguyễn Văn An",
    age: 45,
    gender: "Nam",
    bloodType: "O+",
    room: "P-302",
    condition: "Tiểu đường type 2",
    allergies: ["Penicillin", "Aspirin"],
    vitals: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 36.5,
      spo2: 98,
      glucose: 105,
    },
    recentHistory: [
      {
        date: "2025-01-10",
        diagnosis: "Kiểm tra đường huyết định kỳ",
        treatment: "Điều chỉnh liều Metformin",
      },
      {
        date: "2024-12-15",
        diagnosis: "Xét nghiệm HbA1c",
        treatment: "Kết quả: 6.5% - Kiểm soát tốt",
      },
    ],
  };

  // Form state
  const [consultationData, setConsultationData] = useState({
    chiefComplaint: "",
    symptoms: [] as string[],
    examination: {
      general: "",
      cardiovascular: "",
      respiratory: "",
      abdomen: "",
      other: "",
    },
    diagnosis: {
      primary: "",
      secondary: [] as string[],
      icd10: "",
    },
    treatment: {
      plan: "",
      advice: "",
      followUp: "",
    },
    prescriptions: [] as Array<{
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: string;
      notes: string;
    }>,
    labOrders: [] as Array<{
      test: string;
      urgency: string;
      notes: string;
    }>,
    notes: "",
  });

  const [newSymptom, setNewSymptom] = useState("");
  const [newSecondaryDiag, setNewSecondaryDiag] = useState("");

  // Common medications for quick add
  const commonMedications = [
    { name: "Metformin 500mg", dosage: "500mg", frequency: "2 lần/ngày" },
    { name: "Lisinopril 10mg", dosage: "10mg", frequency: "1 lần/ngày" },
    { name: "Atorvastatin 20mg", dosage: "20mg", frequency: "1 lần/ngày" },
    { name: "Aspirin 81mg", dosage: "81mg", frequency: "1 lần/ngày" },
  ];

  // Common lab tests
  const commonLabTests = [
    "Xét nghiệm máu tổng quát",
    "Xét nghiệm đường huyết",
    "HbA1c",
    "Lipid profile",
    "Chức năng gan",
    "Chức năng thận",
    "ECG",
    "X-quang ngực",
  ];

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      setConsultationData({
        ...consultationData,
        symptoms: [...consultationData.symptoms, newSymptom.trim()],
      });
      setNewSymptom("");
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setConsultationData({
      ...consultationData,
      symptoms: consultationData.symptoms.filter((_, i) => i !== index),
    });
  };

  const handleAddSecondaryDiag = () => {
    if (newSecondaryDiag.trim()) {
      setConsultationData({
        ...consultationData,
        diagnosis: {
          ...consultationData.diagnosis,
          secondary: [...consultationData.diagnosis.secondary, newSecondaryDiag.trim()],
        },
      });
      setNewSecondaryDiag("");
    }
  };

  const handleAddPrescription = () => {
    setConsultationData({
      ...consultationData,
      prescriptions: [
        ...consultationData.prescriptions,
        {
          medication: "",
          dosage: "",
          frequency: "",
          duration: "",
          quantity: "",
          notes: "",
        },
      ],
    });
  };

  const handleAddLabOrder = () => {
    setConsultationData({
      ...consultationData,
      labOrders: [
        ...consultationData.labOrders,
        {
          test: "",
          urgency: "normal",
          notes: "",
        },
      ],
    });
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Đã lưu bản nháp");
    }, 1000);
  };

  const handleCompleteConsultation = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push("/doctor/patients");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doctor/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Phiếu khám bệnh</h1>
            <p className="text-slate-600 text-sm mt-1">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveConsultation} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Lưu nháp
          </Button>
          <Button
            className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
            onClick={handleCompleteConsultation}
            disabled={isSaving}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Hoàn thành khám
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Patient Info & History */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Card */}
          <Card className="bg-gradient-to-br from-white to-primary-50/30 border-slate-200 shadow-lg sticky top-6">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin bệnh nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <Link
                    href={`/doctor/patients/${patient.id}`}
                    className="font-bold text-slate-800 hover:text-primary-600 transition-colors"
                  >
                    {patient.name}
                  </Link>
                  <p className="text-sm text-slate-600">{patient.code}</p>
                  <p className="text-sm text-slate-600">
                    {patient.age} tuổi - {patient.gender}
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Droplet className="w-4 h-4 text-danger-500" />
                  <span className="text-slate-600">Nhóm máu:</span>
                  <strong className="text-slate-800">{patient.bloodType}</strong>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClipboardList className="w-4 h-4 text-primary-500" />
                  <span className="text-slate-600">Phòng:</span>
                  <strong className="text-slate-800">{patient.room}</strong>
                </div>
              </div>

              {/* Allergies Warning */}
              {patient.allergies.length > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-800">Dị ứng</p>
                  </div>
                  <div className="space-y-1">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-700 mr-1 text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Condition */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 mb-1">Chẩn đoán hiện tại</p>
                <p className="text-sm font-semibold text-blue-800">{patient.condition}</p>
              </div>

              {/* Current Vitals */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-3">Chỉ số sinh tồn hiện tại</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Heart className="w-3 h-3 text-danger-500" />
                      <span className="text-xs text-slate-600">Huyết áp</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{patient.vitals.bloodPressure}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-primary-500" />
                      <span className="text-xs text-slate-600">Nhịp tim</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{patient.vitals.heartRate} bpm</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-slate-600">Nhiệt độ</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{patient.vitals.temperature}°C</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-teal-500" />
                      <span className="text-xs text-slate-600">SpO2</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{patient.vitals.spo2}%</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <Link href={`/doctor/patients/${patient.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Hồ sơ
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Lịch sử
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Lịch sử khám gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {patient.recentHistory.map((record, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">{record.date}</p>
                    <p className="text-sm font-semibold text-slate-800 mb-1">{record.diagnosis}</p>
                    <p className="text-xs text-slate-600">{record.treatment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Consultation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chief Complaint */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Lý do khám</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <textarea
                value={consultationData.chiefComplaint}
                onChange={(e) =>
                  setConsultationData({ ...consultationData, chiefComplaint: e.target.value })
                }
                placeholder="Bệnh nhân đến khám vì..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[100px] text-sm"
              />
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Triệu chứng</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-3">
                <Input
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSymptom()}
                  placeholder="Nhập triệu chứng..."
                  className="flex-1"
                />
                <Button onClick={handleAddSymptom} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {consultationData.symptoms.map((symptom, index) => (
                  <Badge
                    key={index}
                    className="bg-primary-100 text-primary-700 pr-1 flex items-center gap-1"
                  >
                    {symptom}
                    <button
                      onClick={() => handleRemoveSymptom(index)}
                      className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Khám lâm sàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Toàn thân
                </label>
                <textarea
                  value={consultationData.examination.general}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      examination: { ...consultationData.examination, general: e.target.value },
                    })
                  }
                  placeholder="Tình trạng chung, ý thức, dinh dưỡng..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[80px] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Tim mạch
                  </label>
                  <textarea
                    value={consultationData.examination.cardiovascular}
                    onChange={(e) =>
                      setConsultationData({
                        ...consultationData,
                        examination: {
                          ...consultationData.examination,
                          cardiovascular: e.target.value,
                        },
                      })
                    }
                    placeholder="Nhịp tim, tiếng tim..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[60px] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Hô hấp
                  </label>
                  <textarea
                    value={consultationData.examination.respiratory}
                    onChange={(e) =>
                      setConsultationData({
                        ...consultationData,
                        examination: {
                          ...consultationData.examination,
                          respiratory: e.target.value,
                        },
                      })
                    }
                    placeholder="Nhịp thở, âm thở..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[60px] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Bụng
                  </label>
                  <textarea
                    value={consultationData.examination.abdomen}
                    onChange={(e) =>
                      setConsultationData({
                        ...consultationData,
                        examination: { ...consultationData.examination, abdomen: e.target.value },
                      })
                    }
                    placeholder="Gan, lách, ruột..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[60px] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Khác
                  </label>
                  <textarea
                    value={consultationData.examination.other}
                    onChange={(e) =>
                      setConsultationData({
                        ...consultationData,
                        examination: { ...consultationData.examination, other: e.target.value },
                      })
                    }
                    placeholder="Các cơ quan khác..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[60px] text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Chẩn đoán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Chẩn đoán chính *
                </label>
                <Input
                  value={consultationData.diagnosis.primary}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      diagnosis: { ...consultationData.diagnosis, primary: e.target.value },
                    })
                  }
                  placeholder="Chẩn đoán chính..."
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Mã ICD-10
                </label>
                <Input
                  value={consultationData.diagnosis.icd10}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      diagnosis: { ...consultationData.diagnosis, icd10: e.target.value },
                    })
                  }
                  placeholder="E11.9, I10..."
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Chẩn đoán kèm theo
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSecondaryDiag}
                    onChange={(e) => setNewSecondaryDiag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSecondaryDiag()}
                    placeholder="Thêm chẩn đoán phụ..."
                    className="flex-1 text-sm"
                  />
                  <Button onClick={handleAddSecondaryDiag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {consultationData.diagnosis.secondary.map((diag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {diag}
                      <button
                        onClick={() => {
                          setConsultationData({
                            ...consultationData,
                            diagnosis: {
                              ...consultationData.diagnosis,
                              secondary: consultationData.diagnosis.secondary.filter(
                                (_, i) => i !== index
                              ),
                            },
                          });
                        }}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Hướng điều trị</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Phương pháp điều trị
                </label>
                <textarea
                  value={consultationData.treatment.plan}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      treatment: { ...consultationData.treatment, plan: e.target.value },
                    })
                  }
                  placeholder="Phương pháp điều trị, can thiệp..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[80px] text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Tư vấn cho bệnh nhân
                </label>
                <textarea
                  value={consultationData.treatment.advice}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      treatment: { ...consultationData.treatment, advice: e.target.value },
                    })
                  }
                  placeholder="Chế độ ăn uống, sinh hoạt, tập thể dục..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[80px] text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Lịch tái khám
                </label>
                <Input
                  value={consultationData.treatment.followUp}
                  onChange={(e) =>
                    setConsultationData({
                      ...consultationData,
                      treatment: { ...consultationData.treatment, followUp: e.target.value },
                    })
                  }
                  placeholder="Sau 1 tuần, 2 tuần, 1 tháng..."
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Kê đơn thuốc
                </CardTitle>
                <Button onClick={handleAddPrescription} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thuốc
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {consultationData.prescriptions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Pill className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Chưa có thuốc trong đơn</p>
                  <p className="text-xs mt-1">Nhấn "Thêm thuốc" để kê đơn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultationData.prescriptions.map((prescription, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-slate-700">Thuốc #{index + 1}</p>
                        <button
                          onClick={() => {
                            setConsultationData({
                              ...consultationData,
                              prescriptions: consultationData.prescriptions.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="text-danger-500 hover:text-danger-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Tên thuốc
                          </label>
                          <Input
                            value={prescription.medication}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].medication = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="Tên thuốc..."
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Liều lượng
                          </label>
                          <Input
                            value={prescription.dosage}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].dosage = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="500mg, 10mg..."
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Tần suất
                          </label>
                          <Input
                            value={prescription.frequency}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].frequency = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="2 lần/ngày..."
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Thời gian
                          </label>
                          <Input
                            value={prescription.duration}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].duration = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="7 ngày, 1 tháng..."
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Số lượng
                          </label>
                          <Input
                            value={prescription.quantity}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].quantity = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="60 viên..."
                            className="text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Ghi chú
                          </label>
                          <Input
                            value={prescription.notes}
                            onChange={(e) => {
                              const newPrescriptions = [...consultationData.prescriptions];
                              newPrescriptions[index].notes = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                prescriptions: newPrescriptions,
                              });
                            }}
                            placeholder="Uống sau ăn..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Common Medications */}
              {consultationData.prescriptions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Thêm nhanh:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonMedications.map((med, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setConsultationData({
                            ...consultationData,
                            prescriptions: [
                              ...consultationData.prescriptions,
                              {
                                medication: med.name,
                                dosage: med.dosage,
                                frequency: med.frequency,
                                duration: "",
                                quantity: "",
                                notes: "",
                              },
                            ],
                          });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {med.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lab Orders */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  Yêu cầu xét nghiệm
                </CardTitle>
                <Button onClick={handleAddLabOrder} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm xét nghiệm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {consultationData.labOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FlaskConical className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Chưa có yêu cầu xét nghiệm</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultationData.labOrders.map((lab, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-slate-700">Xét nghiệm #{index + 1}</p>
                        <button
                          onClick={() => {
                            setConsultationData({
                              ...consultationData,
                              labOrders: consultationData.labOrders.filter((_, i) => i !== index),
                            });
                          }}
                          className="text-danger-500 hover:text-danger-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Loại xét nghiệm
                          </label>
                          <Input
                            value={lab.test}
                            onChange={(e) => {
                              const newLabOrders = [...consultationData.labOrders];
                              newLabOrders[index].test = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                labOrders: newLabOrders,
                              });
                            }}
                            placeholder="Tên xét nghiệm..."
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Mức độ
                          </label>
                          <select
                            value={lab.urgency}
                            onChange={(e) => {
                              const newLabOrders = [...consultationData.labOrders];
                              newLabOrders[index].urgency = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                labOrders: newLabOrders,
                              });
                            }}
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-400"
                          >
                            <option value="normal">Bình thường</option>
                            <option value="urgent">Khẩn cấp</option>
                            <option value="stat">Cấp cứu (STAT)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">
                            Ghi chú
                          </label>
                          <Input
                            value={lab.notes}
                            onChange={(e) => {
                              const newLabOrders = [...consultationData.labOrders];
                              newLabOrders[index].notes = e.target.value;
                              setConsultationData({
                                ...consultationData,
                                labOrders: newLabOrders,
                              });
                            }}
                            placeholder="Lưu ý..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Common Tests */}
              {consultationData.labOrders.length === 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Xét nghiệm phổ biến:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonLabTests.map((test, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setConsultationData({
                            ...consultationData,
                            labOrders: [
                              ...consultationData.labOrders,
                              {
                                test: test,
                                urgency: "normal",
                                notes: "",
                              },
                            ],
                          });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {test}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doctor Notes */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Ghi chú riêng của bác sĩ</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Ghi chú này chỉ bác sĩ có thể xem</p>
            </CardHeader>
            <CardContent className="p-6">
              <textarea
                value={consultationData.notes}
                onChange={(e) => setConsultationData({ ...consultationData, notes: e.target.value })}
                placeholder="Ghi chú quan sát, theo dõi đặc biệt..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-400 min-h-[100px] text-sm"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleSaveConsultation}
              disabled={isSaving}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu nháp
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
              onClick={handleCompleteConsultation}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Hoàn thành và lưu
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
