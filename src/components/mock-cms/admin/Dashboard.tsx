'use client';

import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock, // Đổi MessageSquare thành Clock cho phù hợp với "chờ duyệt"
  MoreHorizontal,
} from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      label: 'Tổng số nhân viên', // Đổi từ "Tổng người dùng"
      value: '124',
      change: '+12.5%',
      up: true,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tổng số bài viết', // Đổi từ "Bài viết đã đăng"
      value: '842',
      change: '+5.2%',
      up: true,
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Số lượt xem', // Đổi từ "Lượt truy cập (30 ngày)"
      value: '145.2K',
      change: '-2.4%',
      up: false,
      icon: Eye,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Số bài chờ duyệt', // Đổi từ "Bình luận mới"
      value: '28', // Cập nhật số liệu cho hợp lý với số bài chờ duyệt
      change: '+4.1%',
      up: true,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const chartData = [
    { name: 'T2', value: 40 },
    { name: 'T3', value: 65 },
    { name: 'T4', value: 45 },
    { name: 'T5', value: 80 },
    { name: 'T6', value: 55 },
    { name: 'T7', value: 90 },
    { name: 'CN', value: 75 },
  ];

  const activities = [
    {
      user: 'Trần Minh Quân',
      action: 'Đã thêm nhân sự mới',
      target: 'Lê Hoàng Anh',
      time: '5 phút trước',
      status: 'Hoàn tất',
    },
    {
      user: 'Nguyễn Thị Hoa',
      action: 'Đã duyệt bài viết',
      target: '"Hướng dẫn sử dụng CMS 2024"',
      time: '32 phút trước',
      status: 'Hoàn tất',
    },
    {
      user: 'Phạm Đức Chung',
      action: 'Đã cập nhật cấu hình',
      target: 'Cài đặt SEO chung',
      time: '1 giờ trước',
      status: 'Cảnh báo',
    },
    {
      user: 'Hệ thống',
      action: 'Tự động sao lưu dữ liệu',
      target: 'Database Backup_2407',
      time: '3 giờ trước',
      status: 'Hoàn tất',
    },
    {
      user: 'Lê Mai Linh',
      action: 'Đã tải lên tệp tin media',
      target: 'banner-khuyen-mai-thang-7.jpg',
      time: '5 giờ trước',
      status: 'Hoàn tất',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-slate-500 mt-1">
          Theo dõi các chỉ số quan trọng và hoạt động gần đây của nền tảng.
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                <metric.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${metric.up ? 'text-emerald-600' : 'text-rose-500'}`}
              >
                {metric.change}
                {metric.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">{metric.value}</h3>
              <p className="text-slate-500 text-sm mt-1">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Bar Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lưu lượng truy cập tuần qua</h2>
            <p className="text-sm text-slate-500 mt-1">
              Số lượt truy cập website phân bổ theo các ngày trong tuần.
            </p>

            {/* Chú thích màu sắc (Legend) */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-100"></span>
                <span className="text-sm text-slate-600">Tổng lượt truy cập</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-sm text-slate-600">Người dùng mới</span>
              </div>
            </div>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap">
            Xuất báo cáo
          </button>
        </div>

        {/* CSS-based Bar Chart Representation for Demo */}
        <div className="h-64 flex items-end justify-between gap-2 mt-4 px-2">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center w-full group">
              <div className="relative w-full flex justify-center h-52">
                <div
                  className="w-full max-w-[4rem] bg-blue-100 group-hover:bg-blue-200 rounded-t-xl transition-all duration-500 relative cursor-pointer"
                  style={{
                    height: `${d.value}%`,
                    bottom: 0,
                    position: 'absolute',
                  }}
                >
                  {/* Tooltip chi tiết */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white py-2 px-3 rounded-lg shadow-xl z-10 pointer-events-none flex flex-col items-center gap-0.5 min-w-max">
                    <span className="text-xs font-medium">
                      Tổng: <strong className="text-sm">{d.value}k</strong> lượt
                    </span>
                    <span className="text-[10px] text-slate-300">
                      Mới: {Math.round(d.value * 0.7)}k lượt
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-xl transition-all"
                    style={{ height: `${d.value * 0.7}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                {d.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Recent Activity Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Hoạt động gần đây</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Người thực hiện
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hành động
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Đối tượng
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {act.user.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{act.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {act.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                    {act.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{act.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        act.status === 'Hoàn tất'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {act.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
