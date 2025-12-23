"use client";

import { useState } from "react";

type PatientStatus = "critical" | "warning" | "normal";

interface Patient {
  id: string;
  name: string;
  age: number;
  pid: string;
  status: PatientStatus;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
  };
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    age: 58,
    pid: "74921",
    status: "critical",
    vitals: { hr: 115, bp: "140/90", spo2: 92, temp: 38.5 }
  },
  {
    id: "2",
    name: "Trần Thị Bích",
    age: 65,
    pid: "83015",
    status: "warning",
    vitals: { hr: 95, bp: "130/85", spo2: 95, temp: 37.8 }
  },
  {
    id: "3",
    name: "Lê Hoàng Cường",
    age: 45,
    pid: "61234",
    status: "normal",
    vitals: { hr: 80, bp: "120/80", spo2: 98, temp: 37.0 }
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    age: 72,
    pid: "55487",
    status: "normal",
    vitals: { hr: 88, bp: "125/82", spo2: 97, temp: 37.2 }
  }
];

const statusConfig = {
  critical: {
    gradient: "from-white to-red-50",
    border: "border-status-red",
    text: "text-status-red",
    icon: "text-status-red"
  },
  warning: {
    gradient: "from-white to-yellow-50",
    border: "border-status-yellow",
    text: "text-status-yellow",
    icon: "text-status-yellow"
  },
  normal: {
    gradient: "from-white to-green-50",
    border: "border-status-green",
    text: "text-status-green",
    icon: "text-status-green"
  }
};

export default function MonitoringPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-display text-text-main">
      {/* Header - Adapted from HTML */}
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border-color bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-dashboard-dark text-3xl">health_and_safety</span>
          <h1 className="text-lg font-bold text-text-main">Bảng Điều Khiển Giám Sát</h1>
        </div>
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50">search</span>
            <input 
              className="w-full rounded-lg border-border-color bg-gray-50 py-2 pl-10 pr-4 text-text-main placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-dashboard-light" 
              placeholder="Tìm kiếm bệnh nhân theo tên hoặc ID..." 
              type="search"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-text-secondary transition-colors hover:bg-gray-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div 
            className="h-10 w-10 rounded-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8Lo1uRkleFTXM5i_kqkgn6QA2n5qSrMH9gab2x4llb4IQD3mqh1zdl7FPmjFMxhpC2S4iNHhvyoEyLFHXm6_CYqSSIq9z58WQhXxSzFPYAXj1rm5hIbisaSBruuEtmuJ-n09lKJf141dgDFqCtfKVoVRd6yXdqQAHHuDAG3LjLy75Ea7R7ZMTmAS_wwEIsk8zQj94kD-53U_bvM8pXe1qpc9EHtsQeuNDG78F5kbMupUazN_WZHLVxPe_ugmtWZEQahy4htrxaA0')" }}
          ></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="mb-6">
            <h2 className="text-4xl font-bold leading-tight tracking-tighter text-text-main">Giám Sát Bệnh Nhân</h2>
            <p className="mt-1 text-text-secondary">Dữ liệu được cập nhật theo thời gian thực.</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-secondary shadow-soft transition-colors hover:bg-gray-50">
              <span>Khoa: Tất cả</span>
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-secondary shadow-soft transition-colors hover:bg-gray-50">
              <span>Phòng</span>
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-secondary shadow-soft transition-colors hover:bg-gray-50">
              <span>Trạng thái</span>
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <div className="flex items-center gap-2 pl-2">
              <input className="h-4 w-4 rounded border-border-color bg-white text-primary-dashboard focus:ring-primary-dashboard-light focus:ring-offset-background-light" id="pinned-toggle" type="checkbox"/>
              <label className="text-sm font-medium text-text-secondary" htmlFor="pinned-toggle">Chỉ hiển thị bệnh nhân đã ghim</label>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {patients.map((patient) => {
              const config = statusConfig[patient.status];
              
              return (
                <div key={patient.id} className={`flex flex-col rounded-2xl bg-gradient-to-br ${config.gradient} shadow-soft-lg transition-transform hover:-translate-y-1`}>
                  <div className={`flex items-start justify-between border-b-2 ${config.border.replace('border-', 'border-')}/80 p-5`}>
                    <div>
                      <p className="text-lg font-bold text-text-main">{patient.name}, {patient.age}t</p>
                      <p className="text-xs text-text-secondary">PID: {patient.pid}</p>
                    </div>
                    <button className={`${config.text} transition-colors hover:opacity-80`}>
                      <span className="material-symbols-outlined">push_pin</span>
                    </button>
                  </div>
                  
                  <div className="grid flex-grow grid-cols-2 gap-x-4 gap-y-5 p-5 text-text-main">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${config.icon} text-3xl`}>cardiology</span>
                      <div>
                        <p className="text-sm text-text-secondary">Nhịp tim</p>
                        <p className="font-bold text-lg">{patient.vitals.hr} <span className="text-xs font-normal">BPM</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${config.icon} text-3xl`}>blood_pressure</span>
                      <div>
                        <p className="text-sm text-text-secondary">Huyết áp</p>
                        <p className="font-bold text-lg">{patient.vitals.bp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${config.icon} text-3xl`}>air</span>
                      <div>
                        <p className="text-sm text-text-secondary">SpO2</p>
                        <p className="font-bold text-lg">{patient.vitals.spo2} <span className="text-xs font-normal">%</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${config.icon} text-3xl`}>thermostat</span>
                      <div>
                        <p className="text-sm text-text-secondary">Nhiệt độ</p>
                        <p className="font-bold text-lg">{patient.vitals.temp} <span className="text-xs font-normal">°C</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t border-border-color p-4">
                    <button className="w-full rounded-lg bg-primary-dashboard py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-primary-dashboard-dark">Xem Chi Tiết</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center p-4">
            <a className="flex h-10 w-10 items-center justify-center text-text-secondary/60 transition-colors hover:text-text-main" href="#">
              <span className="material-symbols-outlined">chevron_left</span>
            </a>
            <a className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dashboard text-sm font-bold text-white" href="#">1</a>
            <a className="flex h-10 w-10 items-center justify-center rounded-lg text-sm text-text-secondary transition-colors hover:bg-gray-200" href="#">2</a>
            <a className="flex h-10 w-10 items-center justify-center rounded-lg text-sm text-text-secondary transition-colors hover:bg-gray-200" href="#">3</a>
            <span className="flex h-10 w-10 items-center justify-center text-sm text-text-secondary/60">...</span>
            <a className="flex h-10 w-10 items-center justify-center rounded-lg text-sm text-text-secondary transition-colors hover:bg-gray-200" href="#">10</a>
            <a className="flex h-10 w-10 items-center justify-center text-text-secondary/60 transition-colors hover:text-text-main" href="#">
              <span className="material-symbols-outlined">chevron_right</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

