"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Search,
} from "lucide-react";

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const specialties = [
    { id: "cardiology", name: "Tim mạch", icon: "❤️", doctorCount: 8 },
    { id: "neurology", name: "Thần kinh", icon: "🧠", doctorCount: 6 },
    { id: "orthopedics", name: "Xương khớp", icon: "🦴", doctorCount: 7 },
    { id: "dermatology", name: "Da liễu", icon: "🩹", doctorCount: 5 },
    { id: "endocrinology", name: "Nội tiết", icon: "⚗️", doctorCount: 4 },
    { id: "gastroenterology", name: "Tiêu hóa", icon: "🫁", doctorCount: 6 },
    { id: "general", name: "Nội tổng quát", icon: "🩺", doctorCount: 10 },
    { id: "pediatrics", name: "Nhi khoa", icon: "👶", doctorCount: 8 },
  ];

  const doctors = {
    cardiology: [
      {
        id: 1,
        name: "BS. Trần Thị B",
        specialty: "Tim mạch",
        experience: 15,
        rating: 4.8,
        reviews: 234,
        education: "Bác sĩ chuyên khoa II, Đại học Y Hà Nội",
        languages: ["Tiếng Việt", "English"],
        available: true,
      },
      {
        id: 2,
        name: "ThS.BS. Nguyễn Văn C",
        specialty: "Tim mạch",
        experience: 12,
        rating: 4.9,
        reviews: 189,
        education: "Thạc sĩ Y học, BV Chợ Rẫy",
        languages: ["Tiếng Việt"],
        available: true,
      },
    ],
    // Add more doctors for other specialties as needed
  };

  const availableDates = [
    { date: "2025-01-10", day: "Thứ 6", available: true },
    { date: "2025-01-11", day: "Thứ 7", available: true },
    { date: "2025-01-12", day: "CN", available: false },
    { date: "2025-01-13", day: "Thứ 2", available: true },
    { date: "2025-01-14", day: "Thứ 3", available: true },
    { date: "2025-01-15", day: "Thứ 4", available: true },
    { date: "2025-01-16", day: "Thứ 5", available: true },
  ];

  const timeSlots = [
    { time: "08:00", available: true },
    { time: "08:30", available: true },
    { time: "09:00", available: false },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
  ];

  const handleBooking = () => {
    // API call to book appointment
    console.log({
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason,
    });
    setStep(5); // Success step
  };

  // Step 1: Select Specialty
  const renderSpecialtySelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Chọn chuyên khoa</h2>
        <p className="text-slate-600">Bạn muốn khám chuyên khoa nào?</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input placeholder="Tìm kiếm chuyên khoa..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {specialties.map((specialty) => (
          <Card
            key={specialty.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedSpecialty === specialty.id
                ? "border-2 border-primary-500 bg-primary-50"
                : "hover:border-primary-300"
            }`}
            onClick={() => {
              setSelectedSpecialty(specialty.id);
              setStep(2);
            }}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-3">{specialty.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{specialty.name}</h3>
              <p className="text-sm text-slate-600">{specialty.doctorCount} bác sĩ</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Step 2: Select Doctor
  const renderDoctorSelection = () => {
    const doctorList = doctors[selectedSpecialty as keyof typeof doctors] || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Chọn bác sĩ</h2>
            <p className="text-slate-600">
              {doctorList.length} bác sĩ chuyên khoa{" "}
              {specialties.find((s) => s.id === selectedSpecialty)?.name}
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep(1)}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>

        <div className="space-y-4">
          {doctorList.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDoctor?.id === doctor.id
                  ? "border-2 border-primary-500 bg-primary-50"
                  : ""
              }`}
              onClick={() => {
                setSelectedDoctor(doctor);
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {doctor.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                        <p className="text-sm text-slate-600">{doctor.specialty}</p>
                      </div>
                      {doctor.available && (
                        <Badge variant="default">Đang khả dụng</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-sm text-slate-600">
                          ({doctor.reviews} đánh giá)
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {doctor.experience} năm kinh nghiệm
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      <p>📚 {doctor.education}</p>
                      <p>💬 {doctor.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedDoctor && (
          <Button className="w-full" onClick={() => setStep(3)}>
            Tiếp tục
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    );
  };

  // Step 3: Select Date & Time
  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chọn ngày và giờ</h2>
          <p className="text-slate-600">Lịch khám với {selectedDoctor?.name}</p>
        </div>
        <Button variant="outline" onClick={() => setStep(2)}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Chọn ngày khám
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {availableDates.map((slot) => (
                <Button
                  key={slot.date}
                  variant={selectedDate === slot.date ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col"
                  disabled={!slot.available}
                  onClick={() => setSelectedDate(slot.date)}
                >
                  <div className="text-xs">{slot.day}</div>
                  <div className="font-bold">
                    {new Date(slot.date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Chọn giờ khám
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <Button className="w-full" onClick={() => setStep(4)}>
          Tiếp tục
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );

  // Step 4: Confirmation
  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Xác nhận thông tin</h2>
          <p className="text-slate-600">Vui lòng kiểm tra lại thông tin đặt lịch</p>
        </div>
        <Button variant="outline" onClick={() => setStep(3)}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lịch khám</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xl font-bold">
              {selectedDoctor?.name.split(" ").pop()?.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{selectedDoctor?.name}</h3>
              <p className="text-sm text-slate-600">{selectedDoctor?.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                <span className="text-sm font-semibold">{selectedDoctor?.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-2 text-primary-700 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Ngày khám</span>
              </div>
              <p className="text-slate-900 font-bold">
                {new Date(selectedDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-700 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Giờ khám</span>
              </div>
              <p className="text-slate-900 font-bold">{selectedTime}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Lý do khám (tùy chọn)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-24 px-3 py-2 rounded-md border border-slate-300 resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
            />
          </div>

          <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
            <h4 className="font-semibold text-info-900 mb-2">Lưu ý:</h4>
            <ul className="text-sm text-info-800 space-y-1">
              <li>• Vui lòng đến trước 15 phút để làm thủ tục</li>
              <li>• Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có)</li>
              <li>• Có thể hủy hoặc đổi lịch trước 24 giờ</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
          Chỉnh sửa
        </Button>
        <Button className="flex-1" onClick={handleBooking}>
          Xác nhận đặt lịch
        </Button>
      </div>
    </div>
  );

  // Step 5: Success
  const renderSuccess = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-100 mb-4">
        <CheckCircle className="w-12 h-12 text-success-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Đặt lịch thành công!</h2>
      <p className="text-slate-600">
        Lịch khám của bạn đã được ghi nhận. Chúng tôi sẽ gửi thông báo xác nhận qua email và SMS.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lịch khám</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Mã lịch khám:</span>
            <span className="font-bold text-slate-900">APT-2025-001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Bác sĩ:</span>
            <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Ngày:</span>
            <span className="font-bold text-slate-900">
              {new Date(selectedDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Giờ:</span>
            <span className="font-bold text-slate-900">{selectedTime}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <a href="/patient/appointments">Xem lịch khám</a>
        </Button>
        <Button className="flex-1" asChild>
          <a href="/patient/dashboard">Về trang chủ</a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Progress Steps */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum
                      ? "bg-primary-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      step > stepNum ? "bg-primary-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-3 text-sm text-slate-600">
            <span className={step >= 1 ? "text-primary-700 font-semibold" : ""}>
              Chuyên khoa
            </span>
            <span className={step >= 2 ? "text-primary-700 font-semibold" : ""}>
              Bác sĩ
            </span>
            <span className={step >= 3 ? "text-primary-700 font-semibold" : ""}>
              Ngày giờ
            </span>
            <span className={step >= 4 ? "text-primary-700 font-semibold" : ""}>
              Xác nhận
            </span>
          </div>
        </div>
      )}

      {/* Render Current Step */}
      {step === 1 && renderSpecialtySelection()}
      {step === 2 && renderDoctorSelection()}
      {step === 3 && renderDateTimeSelection()}
      {step === 4 && renderConfirmation()}
      {step === 5 && renderSuccess()}
    </div>
  );
}
