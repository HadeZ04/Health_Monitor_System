"use client";

export default function DevicesPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display text-text-main">
      <div className="flex h-full min-h-screen">
        {/* Sidebar - keeping as requested for fidelity */}
        <aside className="hidden lg:flex w-64 flex-col bg-white p-4 border-r border-border-color">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCP0rM9fPgiZf6wBRLyCorsefj0F8u3xx88nn6DCSGmZVQPABGCU1gn7uZkaHLtNbMlJ55vCp2z3jb9141uVpFc6tljxPCfzXNbqFXzdJbcwWseAl7P4HB3XAv-5HP1eHnjgSKA1cKmEphWJioFTVegil5fa8BJPoU3q2oF84NS1GQqfGVcBfF35l2LBuQB4x0RjUSVGpFWR5hbhXDyqxEigOqcMMo3ujdjWlI6x_GxNgrK3AbI975222L_hHfsW3LFIiadDtzaJdo")' }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-text-primary text-base font-medium leading-normal">Admin</h1>
                <p className="text-text-secondary text-sm font-normal leading-normal">admin@healthiot.com</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-dashboard-light">
                <span className="material-symbols-outlined text-primary-dashboard-dark">dashboard</span>
                <p className="text-primary-dashboard-dark text-sm font-medium leading-normal">Dashboard</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-dashboard-light/60 cursor-pointer">
                <span className="material-symbols-outlined text-text-secondary">devices</span>
                <p className="text-text-primary text-sm font-medium leading-normal">Thiết bị</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-dashboard-light/60 cursor-pointer">
                <span className="material-symbols-outlined text-text-secondary">notifications_active</span>
                <p className="text-text-primary text-sm font-medium leading-normal">Cảnh báo</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-dashboard-light/60 cursor-pointer">
                <span className="material-symbols-outlined text-text-secondary">person</span>
                <p className="text-text-primary text-sm font-medium leading-normal">Bệnh nhân</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-auto">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-dashboard-light/60 cursor-pointer">
              <span className="material-symbols-outlined text-text-secondary">settings</span>
              <p className="text-text-primary text-sm font-medium leading-normal">Cài đặt</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-dashboard-light/60 cursor-pointer">
              <span className="material-symbols-outlined text-text-secondary">logout</span>
              <p className="text-text-primary text-sm font-medium leading-normal">Đăng xuất</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 bg-background-light">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between gap-3">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-text-primary text-3xl font-black leading-tight tracking-[-0.033em]">Bảng điều khiển Giám sát Bệnh nhân</p>
                <p className="text-text-secondary text-base font-normal leading-normal">Theo dõi thời gian thực các thiết bị, vị trí bệnh nhân và các cảnh báo hệ thống.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-color bg-white shadow-soft">
                <p className="text-text-primary text-base font-medium leading-normal">Thiết bị hoạt động</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#48BB78]">memory</span>
                  <p className="text-text-primary tracking-light text-3xl font-bold leading-tight">128</p>
                </div>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-color bg-white shadow-soft">
                <p className="text-text-primary text-base font-medium leading-normal">Bệnh nhân theo dõi</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-dashboard">groups</span>
                  <p className="text-text-primary tracking-light text-3xl font-bold leading-tight">110</p>
                </div>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-color bg-white shadow-soft">
                <p className="text-text-primary text-base font-medium leading-normal">Cảnh báo đang chờ</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F44336]">error</span>
                  <p className="text-text-primary tracking-light text-3xl font-bold leading-tight">3</p>
                </div>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-color bg-white shadow-soft">
                <p className="text-text-primary text-base font-medium leading-normal">Thiết bị sắp hết pin</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFC107]">battery_alert</span>
                  <p className="text-text-primary tracking-light text-3xl font-bold leading-tight">5</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device List */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="flex flex-col bg-white border border-border-color rounded-xl shadow-soft">
                  <h2 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em] px-5 pb-3 pt-5">Danh sách Thiết bị Hoạt động</h2>
                  <div className="px-5 py-3 border-t border-b border-border-color">
                    <label className="flex flex-col min-w-40 h-11 w-full">
                      <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-text-secondary flex border border-border-color bg-white items-center justify-center pl-4 rounded-l-lg border-r-0">
                          <span className="material-symbols-outlined">search</span>
                        </div>
                        <input 
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary focus:outline-0 focus:ring-2 focus:ring-primary-dashboard/50 border border-border-color bg-white focus:border-primary-dashboard/50 h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" 
                          placeholder="Tìm theo ID thiết bị hoặc tên bệnh nhân..." 
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex flex-col divide-y divide-border-color">
                    <div className="p-4 flex flex-col gap-3 hover:bg-primary-dashboard-light/60">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-text-primary font-semibold text-sm">ESP32-S3-001</p>
                          <p className="text-primary-dashboard-dark text-xs">Đã gán: Nguyễn Văn A</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#4CAF50]">battery_full</span> 95%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary-dashboard">wifi</span> Tốt
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="px-3 py-1.5 text-xs font-medium text-primary-dashboard-dark bg-primary-dashboard-light hover:bg-blue-200 rounded-lg">Xem chi tiết</button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3 hover:bg-primary-dashboard-light/60">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-text-primary font-semibold text-sm">ESP32-S3-002</p>
                          <p className="text-text-secondary text-xs italic">Chưa gán</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#FFC107]">battery_horiz_050</span> 48%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary-dashboard">wifi</span> Trung bình
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary-dashboard hover:bg-primary-dashboard-dark rounded-lg">Gán cho Bệnh nhân</button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3 hover:bg-primary-dashboard-light/60">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-text-primary font-semibold text-sm">ESP32-S3-003</p>
                          <p className="text-primary-dashboard-dark text-xs">Đã gán: Trần Thị B</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#F44336]">battery_alert</span> 15%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary-dashboard">wifi</span> Tốt
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="px-3 py-1.5 text-xs font-medium text-primary-dashboard-dark bg-primary-dashboard-light hover:bg-blue-200 rounded-lg">Xem chi tiết</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex flex-col bg-white border border-border-color rounded-xl h-[600px] shadow-soft">
                  <div className="flex flex-wrap justify-between items-center px-5 pb-3 pt-5">
                    <h2 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em]">Bản đồ Giám sát Vị trí & Vùng an toàn</h2>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-primary-dashboard hover:bg-primary-dashboard-dark rounded-lg">
                        <span className="material-symbols-outlined text-base">draw</span>
                        Vẽ Vùng Mới
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary-dashboard-dark bg-primary-dashboard-light hover:bg-blue-200 rounded-lg">
                        <span className="material-symbols-outlined text-base">edit</span>
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 rounded-b-xl overflow-hidden relative">
                    <div 
                      className="absolute inset-0 bg-center bg-no-repeat aspect-video bg-cover" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBslzhPcaGJcV5o0OoOvKQXMrK9PSVuaMnOmpp1FMDIWDvg6cECf9diVMM3ed6vadvdAY0Eh3il-eZr8K_v8-oGK5YNtxLHUvkq5r0nwVA3DIKbHBBQXMS9b9Pwy6VnNjrUSINXSSavB_qc3Nbkc-8SqQ81_Io7W47d_6hFXe36Evqp5Md9l2oB_mAbEOM3YtW03fVcNFjxmXOER76l2_2s8-3zWyDDxh3Du4rGmsUrXhH4CmdKS4eodMHdQVoN97WhGuBaXQ__FhM")' }}
                    ></div>
                    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border border-border-color shadow-soft">
                      <p className="text-text-primary text-sm font-semibold mb-2">Chú thích</p>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#4CAF50] border border-slate-300"></div>
                          <span className="text-text-primary">Trong vùng an toàn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#F44336] border border-slate-300"></div>
                          <span className="text-text-primary">Ngoài vùng an toàn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
