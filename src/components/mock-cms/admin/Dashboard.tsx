'use client';

import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      label: 'Tổng số nhân viên',
      value: '124',
      change: '+12.5%',
      up: true,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tổng số bài viết',
      value: '842',
      change: '+5.2%',
      up: true,
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Số lượt xem',
      value: '145.2K',
      change: '-2.4%',
      up: false,
      icon: Eye,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Số bài chờ duyệt',
      value: '28',
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
    <div className="mx-auto max-w-7xl space-y-6 pb-20 font-['Plus_Jakarta_Sans']">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Tổng quan hệ thống
        </h1>

        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
          Theo dõi các chỉ số quan trọng và hoạt động gần đây của nền tảng.
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="rounded-2xl border p-6 shadow-sm"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-3 ${metric.bg} ${metric.color}`}>
                <metric.icon size={24} />
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  metric.up ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {metric.change}

                {metric.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                {metric.value}
              </h3>

              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {metric.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Bar Chart Section */}
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Lưu lượng truy cập tuần qua
            </h2>

            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Số lượt truy cập website phân bổ theo các ngày trong tuần.
            </p>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-100" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tổng lượt truy cập
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Người dùng mới
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100"
            style={{
              background: 'var(--surface-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            Xuất báo cáo
          </button>
        </div>

        {/* CSS-based Bar Chart */}
        <div className="mt-4 flex h-64 items-end justify-between gap-2 px-2">
          {chartData.map((d, i) => (
            <div key={i} className="group flex w-full flex-col items-center">
              <div className="relative flex h-52 w-full justify-center">
                <div
                  className="relative w-full max-w-[4rem] cursor-pointer rounded-t-xl bg-blue-100 transition-all duration-500 group-hover:bg-blue-200"
                  style={{
                    height: `${d.value}%`,
                    bottom: 0,
                    position: 'absolute',
                  }}
                >
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-14 left-1/2 z-10 flex min-w-max -translate-x-1/2 flex-col items-center gap-0.5 rounded-lg bg-slate-800 px-3 py-2 text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-medium">
                      Tổng: <strong className="text-sm">{d.value}k</strong> lượt
                    </span>

                    <span className="text-[10px] text-slate-300">
                      Mới: {Math.round(d.value * 0.7)}k lượt
                    </span>

                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-xl bg-blue-600 transition-all"
                    style={{ height: `${d.value * 0.7}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 text-sm font-medium text-slate-500 transition-colors group-hover:text-blue-600">
                {d.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Recent Activity Data Table */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="flex items-center justify-between border-b p-6"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Hoạt động gần đây
          </h2>

          <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ background: 'var(--surface-secondary)' }}>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Người thực hiện
                </th>

                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Hành động
                </th>

                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Đối tượng
                </th>

                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Thời gian
                </th>

                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Trạng thái
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {activities.map((act, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors hover:bg-slate-50/50"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                        {act.user.charAt(0)}
                      </div>

                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        {act.user}
                      </span>
                    </div>
                  </td>

                  <td
                    className="whitespace-nowrap px-6 py-4 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {act.action}
                  </td>

                  <td
                    className="whitespace-nowrap px-6 py-4 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {act.target}
                  </td>

                  <td
                    className="whitespace-nowrap px-6 py-4 text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {act.time}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background:
                          act.status === 'Hoàn tất'
                            ? 'var(--success-light)'
                            : 'var(--warning-light)',
                        color: act.status === 'Hoàn tất' ? 'var(--success)' : 'var(--warning)',
                      }}
                    >
                      {act.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button type="button" className="text-slate-400 hover:text-slate-600">
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
