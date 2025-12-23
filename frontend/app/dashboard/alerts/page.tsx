"use client";

export default function AlertsPage() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500/30 backdrop-blur-sm font-display">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      {/* Alert Card */}
      <div className="relative m-4 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl shadow-blue-500/10">
        <div className="flex flex-col items-center gap-4 bg-blue-50 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DD6B20] text-white">
            <span className="material-symbols-outlined text-5xl">
              warning
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#3182CE]">CẢNH BÁO KHẨN CẤP</h1>
        </div>
        
        <div className="flex flex-col p-6">
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="col-span-2 grid grid-cols-subgrid border-b border-b-gray-200 py-4">
              <p className="font-display text-sm font-normal leading-normal text-gray-500">Bệnh nhân:</p>
              <p className="font-display text-base font-medium leading-normal text-gray-900">Nguyễn Văn An - ID: 73451</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-b border-b-gray-200 py-4">
              <p className="font-display text-sm font-normal leading-normal text-gray-500">Vị trí:</p>
              <p className="font-display text-base font-medium leading-normal text-gray-900">Phòng 302B, Khu A</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-b border-b-gray-200 py-4">
              <p className="font-display text-sm font-normal leading-normal text-gray-500">Sự cố:</p>
              <p className="font-display text-base font-medium leading-normal text-[#DD6B20]">Nhịp tim vượt ngưỡng nguy hiểm</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-b border-b-gray-200 py-4">
              <p className="font-display text-sm font-normal leading-normal text-gray-500">Giá trị:</p>
              <p className="font-display text-base font-medium leading-normal text-gray-900">185 BPM</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid pt-4">
              <p className="font-display text-sm font-normal leading-normal text-gray-500">Thời gian:</p>
              <p className="font-display text-base font-medium leading-normal text-gray-900">10:42:15 - 28/10/2023</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 pt-2">
          <div className="flex justify-center">
            <button className="flex h-12 w-full min-w-[84px] max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#3182CE] px-5 text-base font-bold leading-normal tracking-wide text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300">
              <span className="truncate">Đã nhận biết</span>
            </button>
          </div>
          <p className="font-display cursor-pointer text-center text-sm font-normal leading-normal text-gray-500 underline transition-colors hover:text-[#3182CE]">Xem chi tiết bệnh nhân</p>
        </div>
      </div>
    </div>
  );
}
