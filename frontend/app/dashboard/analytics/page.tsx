"use client";

export default function AnalyticsPage() {
  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      {/* Inner Sidebar - Specific to this Analytics View */}
      <aside className="hidden md:flex h-screen w-64 flex-col bg-white dark:bg-gray-900/50 p-4 border-r border-gray-200 dark:border-gray-800 sticky top-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBhr7ZRz11NlVNmOPOKXUpgkUcsVHMMyYvL_uckJfhYiPTNGVnf9jGC6hKhEXxNKEZLWQHJdkYhsc9Kq-CAZlJoNCJ1PWo1ENy3nWu248jhUlDMeVCzpRn2dw6xDju9YALnc0r5XVH_KaeHoYvFANS4dOKa_Dwa1P9O0Lp0ZNl_JcfYwt_tn1k-SqvDvu1K3gvzubq9FBdzIupACE0sN2zD32IvHDBWgrgneT_G9mT5JztK7SGchQDSeetm5w20BpfohOo2jP4Xoro")' }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Dr. Minh</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Bác sĩ Tim mạch</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-dashboard/10 dark:bg-primary-dashboard/20 text-primary-dashboard dark:text-white" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Bảng điều khiển</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">Bệnh nhân</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
              <span className="material-symbols-outlined">lab_profile</span>
              <p className="text-sm font-medium leading-normal">Báo cáo</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Cài đặt</p>
            </a>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-dashboard text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Bệnh nhân mới</span>
          </button>
          <div className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
              <span className="material-symbols-outlined">help</span>
              <p className="text-sm font-medium leading-normal">Trung tâm Trợ giúp</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Đăng xuất</p>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Phân tích Bệnh nhân: Nguyễn Văn A</p>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">ID: 73519</p>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-dashboard/10 dark:bg-primary-dashboard/20 text-primary-dashboard dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Xuất báo cáo PDF</span>
            </button>
          </div>

          {/* Chips/Time Filter */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <div className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-primary-dashboard text-white px-4">
              <p className="text-sm font-medium leading-normal">24 Giờ</p>
            </div>
            <div className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-sm font-medium leading-normal">7 Ngày</p>
            </div>
            <div className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-sm font-medium leading-normal">30 Ngày</p>
            </div>
            <div className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-sm font-medium leading-normal">Tùy chỉnh</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Nhịp tim TB</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">78 BPM</p>
              <p className="text-green-600 dark:text-green-400 text-base font-medium leading-normal">+2%</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Nhiệt độ cao nhất</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">37.5°C</p>
              <p className="text-orange-500 dark:text-orange-400 text-base font-medium leading-normal">-0.5%</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900/50 border border-red-500/20 dark:border-red-500/30">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">SpO2 thấp nhất</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">94%</p>
              <p className="text-red-600 dark:text-red-400 text-base font-medium leading-normal">Cảnh báo thấp</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Huyết áp TB</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">122/81</p>
              <p className="text-gray-500 dark:text-gray-400 text-base font-medium leading-normal">mmHg</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SVG Chart 1 */}
            <div className="flex w-full flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50">
              <p className="text-gray-900 dark:text-white text-lg font-medium leading-normal">Nhịp tim (BPM)</p>
              <p className="text-gray-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">82</p>
              <div className="flex gap-2 items-center">
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">24 giờ qua</p>
                <p className="text-green-600 dark:text-green-400 text-base font-medium leading-normal">+1.2%</p>
              </div>
              <div className="flex min-h-[200px] flex-1 flex-col gap-8 py-4">
                <svg fill="none" preserveAspectRatio="none" viewBox="0 0 475 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#chart-gradient-light)"></path>
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#3d7af5" strokeLinecap="round" strokeWidth="3"></path>
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="chart-gradient-light" x1="236" x2="236" y1="1" y2="149">
                      <stop stopColor="#3d7af5" stopOpacity="0.2"></stop>
                      <stop offset="1" stopColor="#f5f6f8" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">12am</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">4am</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">8am</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">12pm</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">4pm</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">8pm</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">Hiện tại</p>
                </div>
              </div>
            </div>

            {/* Bar Chart (Simulated with Divs) */}
            <div className="flex w-full flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50">
              <p className="text-gray-900 dark:text-white text-lg font-medium leading-normal">Huyết áp (mmHg)</p>
              <p className="text-gray-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">120/80</p>
              <div className="flex gap-2 items-center">
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">24 giờ qua</p>
                <p className="text-orange-500 dark:text-orange-400 text-base font-medium leading-normal">-0.5%</p>
              </div>
              <div className="grid min-h-[200px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-12 pb-4">
                {[
                  { time: "12am", h1: "80%", h2: "50%" },
                  { time: "4am", h1: "75%", h2: "45%" },
                  { time: "8am", h1: "90%", h2: "60%" },
                  { time: "12pm", h1: "82%", h2: "52%" },
                  { time: "4pm", h1: "70%", h2: "40%" },
                  { time: "8pm", h1: "85%", h2: "55%" },
                  { time: "Hiện tại", h1: "80%", h2: "50%" },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center justify-end w-full h-full gap-1">
                     <div className="bg-blue-300 dark:bg-blue-800 w-full rounded-t-sm" style={{ height: bar.h1 }}></div>
                     <div className="bg-blue-500 dark:bg-blue-600 w-full rounded-t-sm" style={{ height: bar.h2 }}></div>
                     <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mt-2">{bar.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
