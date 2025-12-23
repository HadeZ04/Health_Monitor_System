"use client";

import { useEffect, useRef } from "react";

export default function PatientDetailPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationFrameId: number;
    let x = 0;
    let y = canvas.height / 2;

    const draw = () => {
      // Fade out effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = "#ef4444"; // red-500
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      
      ctx.moveTo(x, y);
      
      // Simulate ECG wave
      x += 2;
      if (x > canvas.width) {
        x = 0;
        ctx.moveTo(0, y);
      }

      // Random fluctuation
      const fluctuation = Math.random() * 10 - 5;
      
      // Periodic "heartbeat" spike
      if (x % 100 > 45 && x % 100 < 55) {
         y = canvas.height / 2 + (Math.random() * 60 - 30);
      } else {
         y = canvas.height / 2 + fluctuation;
      }

      ctx.lineTo(x, y);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-text-primary">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <header className="flex items-center justify-between whitespace-nowrap border border-solid border-slate-200 px-6 py-4 rounded-xl bg-surface-light shadow-soft">
              <div className="flex items-center gap-4">
                <div className="size-8 text-primary-dark">
                  <span className="material-symbols-outlined text-4xl">
                    monitor_heart
                  </span>
                </div>
                <h2 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em]">Nguyễn Văn A, ID: 12345, 68 Tuổi</h2>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-dashboard-light text-primary-dashboard-dark text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-normal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-normal"></span>
                </span>
                <span className="truncate">Đang kết nối</span>
              </button>
            </header>

            <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* ECG Chart Card */}
                <div className="flex flex-col gap-4 p-6 rounded-xl bg-surface-light shadow-soft border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-text-secondary text-base font-medium leading-normal">Điện tâm đồ (ECG) thời gian thực</p>
                      <p className="text-text-primary tracking-light text-[40px] font-bold leading-tight truncate">85 <span className="text-2xl text-text-secondary">BPM</span></p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="text-text-secondary text-base font-normal leading-normal">Thời gian thực</p>
                    </div>
                  </div>
                  <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full" id="ecg-chart"></canvas>
                  </div>
                </div>

                {/* History & PCG */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4 p-6 rounded-xl bg-surface-light shadow-soft border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">Lịch sử dữ liệu</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm font-medium rounded-full bg-primary-dashboard-light text-primary-dashboard-dark">24 Giờ</button>
                        <button className="px-3 py-1 text-sm font-medium rounded-full bg-transparent text-text-secondary hover:bg-slate-100">7 Ngày</button>
                      </div>
                    </div>
                    <div className="w-full h-56 bg-slate-50 rounded-lg flex items-center justify-center">
                      <p className="text-slate-400 text-sm">Biểu đồ Lịch sử (SpO2/Nhịp tim)</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-6 rounded-xl bg-surface-light shadow-soft border border-slate-200">
                    <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">Âm thanh tim (PCG)</h3>
                    <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center">
                      <p className="text-slate-400 text-sm">Phổ tần số (Spectrogram)</p>
                    </div>
                    <div className="flex items-center gap-4 text-text-primary">
                      <button className="p-3 rounded-full bg-primary-dashboard-light text-primary-dashboard-dark hover:bg-sky-200 transition-colors">
                        <span className="material-symbols-outlined">play_arrow</span>
                      </button>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>0:12</span>
                          <span>1:30</span>
                        </div>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full cursor-pointer group">
                          <div className="w-1/4 h-2 bg-primary-dashboard rounded-full relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-primary-dashboard-dark border-2 border-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-slate-100">
                        <span className="material-symbols-outlined text-text-secondary">volume_up</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Stats */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="p-6 rounded-xl bg-surface-light shadow-soft border border-slate-200 flex flex-col gap-4 sticky top-6">
                  <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em] pb-2 border-b border-slate-200">Các chỉ số huyết động học</h3>
                  
                  <div className="flex items-center gap-4 rounded-lg p-4 bg-amber-500/10">
                    <div className="p-3 rounded-full bg-amber-500/20 text-status-warning">
                      <span className="material-symbols-outlined">bloodtype</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-secondary text-base font-medium leading-normal">SpO2</p>
                      <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">92%</p>
                    </div>
                    <span className="material-symbols-outlined text-status-warning">warning</span>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg p-4 bg-green-500/10">
                    <div className="p-3 rounded-full bg-green-500/20 text-status-normal">
                      <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-secondary text-base font-medium leading-normal">Huyết áp</p>
                      <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">120/80 <span className="text-base font-normal text-text-secondary">mmHg</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg p-4 bg-green-500/10">
                    <div className="p-3 rounded-full bg-green-500/20 text-status-normal">
                      <span className="material-symbols-outlined">cardiology</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-secondary text-base font-medium leading-normal">Nhịp tim</p>
                      <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">85 <span className="text-base font-normal text-text-secondary">BPM</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg p-4 bg-red-500/10">
                    <div className="p-3 rounded-full bg-red-500/20 text-status-critical">
                      <span className="material-symbols-outlined">pulmonology</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-secondary text-base font-medium leading-normal">Nhịp thở</p>
                      <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">25 <span className="text-base font-normal text-text-secondary">/phút</span></p>
                    </div>
                    <span className="material-symbols-outlined text-status-critical animate-pulse">error</span>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg p-4 bg-green-500/10">
                    <div className="p-3 rounded-full bg-green-500/20 text-status-normal">
                      <span className="material-symbols-outlined">device_thermostat</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-secondary text-base font-medium leading-normal">Nhiệt độ</p>
                      <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">37.1 <span className="text-base font-normal text-text-secondary">°C</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

