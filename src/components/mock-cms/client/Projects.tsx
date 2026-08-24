'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  'Tất cả',
  'E-Commerce',
  'Enterprise',
  'FinTech',
  'Education',
  'Logistics',
  'Healthcare',
];

const projects = [
  {
    id: 1,
    title: 'Nền tảng Thương mại điện tử TechMart',
    client: 'TechMart Vietnam',
    category: 'E-Commerce',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&auto=format',
    desc: 'Xây dựng nền tảng TMĐT B2C với 10M+ sản phẩm, hỗ trợ 500K người dùng đồng thời.',
  },
  {
    id: 2,
    title: 'Hệ thống WMS thông minh VN Logistics',
    client: 'VN Logistics Group',
    category: 'Logistics',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=450&fit=crop&auto=format',
    desc: 'Giải pháp quản lý kho bãi tự động hóa, giảm 40% chi phí vận hành.',
  },
  {
    id: 3,
    title: 'LMS Doanh nghiệp EduTech Platform',
    client: 'EduTech Vietnam',
    category: 'Education',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop&auto=format',
    desc: 'Nền tảng học trực tuyến phục vụ 5000 nhân viên, tích hợp AI cá nhân hóa lộ trình học.',
  },
  {
    id: 4,
    title: 'Dashboard Real-time FinTech Analytics',
    client: 'FinTech Solutions',
    category: 'FinTech',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format',
    desc: 'Hệ thống phân tích dữ liệu tài chính thời gian thực, xử lý 1M giao dịch/ngày.',
  },
  {
    id: 5,
    title: 'Cổng thông tin khách hàng RetailVN',
    client: 'RetailVN Corporation',
    category: 'E-Commerce',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format',
    desc: 'Portal B2B cho 2000+ nhà cung cấp, tích hợp quản lý đơn hàng và thanh toán.',
  },
  {
    id: 6,
    title: 'Hệ thống ERP sản xuất ManuCorp',
    client: 'ManuCorp Industrial',
    category: 'Enterprise',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&h=450&fit=crop&auto=format',
    desc: 'Triển khai ERP toàn diện cho nhà máy 500 công nhân, tối ưu chuỗi sản xuất.',
  },
  {
    id: 7,
    title: 'Ứng dụng chăm sóc sức khỏe MedApp',
    client: 'MedTech Vietnam',
    category: 'Healthcare',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop&auto=format',
    desc: 'App đặt lịch khám và tư vấn sức khỏe trực tuyến với 100K người dùng đăng ký.',
  },
  {
    id: 8,
    title: 'Nền tảng ngân hàng số DigitalBank',
    client: 'Digital Banking Co.',
    category: 'FinTech',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop&auto=format',
    desc: 'Core banking system thế hệ mới, xử lý giao dịch với độ trễ dưới 50ms.',
  },
  {
    id: 9,
    title: 'Nền tảng học trực tuyến EduKid',
    client: 'EduKid Vietnam',
    category: 'Education',
    year: '2021',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format',
    desc: 'Platform giáo dục K-12 với nội dung gamification, phục vụ 200K học sinh.',
  },
  {
    id: 10,
    title: 'Hệ thống quản lý bệnh viện HospitalPro',
    client: 'BV Đa khoa Trung tâm',
    category: 'Healthcare',
    year: '2021',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop&auto=format',
    desc: 'HIS toàn diện quản lý bệnh viện 500 giường với tích hợp thiết bị y tế.',
  },
  {
    id: 11,
    title: 'App vận chuyển QuickShip',
    client: 'QuickShip Express',
    category: 'Logistics',
    year: '2021',
    image:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=450&fit=crop&auto=format',
    desc: 'Ứng dụng giao vận last-mile với định tuyến AI, tối ưu 35% chi phí giao hàng.',
  },
  {
    id: 12,
    title: 'Dashboard ESG Báo cáo Bền vững',
    client: 'GreenCorp Holdings',
    category: 'Enterprise',
    year: '2020',
    image:
      'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=800&h=450&fit=crop&auto=format',
    desc: 'Nền tảng thu thập và báo cáo chỉ số ESG theo chuẩn GRI cho tập đoàn 20 công ty con.',
  },
  {
    id: 13,
    title: 'Sàn giao dịch BĐS PropTech',
    client: 'PropTech Vietnam',
    category: 'E-Commerce',
    year: '2020',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop&auto=format',
    desc: 'Sàn TMĐT bất động sản với 50K+ listings và tích hợp xem nhà ảo 360°.',
  },
  {
    id: 14,
    title: 'Platform Tuyển dụng AI TalentPro',
    client: 'HR Solutions Vietnam',
    category: 'Enterprise',
    year: '2019',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop&auto=format',
    desc: 'Nền tảng tuyển dụng thông minh sử dụng AI phân tích CV và matching ứng viên.',
  },
  {
    id: 15,
    title: 'IoT Smart Factory GreenMfg',
    client: 'GreenMfg Industries',
    category: 'Enterprise',
    year: '2019',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop&auto=format',
    desc: 'Hệ thống nhà máy thông minh với 500+ cảm biến IoT theo dõi sản xuất real-time.',
  },
  {
    id: 16,
    title: 'Hệ thống Core Banking MicroBank',
    client: 'MicroBank Corp',
    category: 'FinTech',
    year: '2018',
    image:
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=800&h=450&fit=crop&auto=format',
    desc: 'Hạ tầng ngân hàng vi mô cho 50K khách hàng, tuân thủ chuẩn PCI DSS và Basel III.',
  },
];

const ITEMS_PER_PAGE = 8;

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [page, setPage] = useState(1);

  const filtered = projects.filter((p) => activeFilter === 'Tất cả' || p.category === activeFilter);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div>
      {/* Hero */}
      <section
        className="py-16 lg:py-20"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Dịch vụ
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Những công trình tiêu biểu
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Hơn 200 dự án đã hoàn thành cho các doanh nghiệp thuộc nhiều lĩnh vực khác nhau trên
            khắp Việt Nam và khu vực.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === cat
                  ? 'text-white shadow-md'
                  : 'text-slate-600 bg-white border hover:bg-slate-50'
              }`}
              style={
                activeFilter === cat
                  ? { background: 'var(--primary)' }
                  : { borderColor: 'var(--border)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginated.map((project) => (
            <Link
              key={project.id}
              to={`/du-an/${project.id}`}
              className="group rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 bg-white cursor-pointer block"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {project.category}
                </span>
                <span className="absolute top-3 right-3 text-xs text-white/80 font-mono">
                  {project.year}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-slate-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{project.client}</p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {project.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Xem chi tiết <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  page === i + 1 ? 'text-white' : 'border text-slate-600 hover:bg-slate-50'
                }`}
                style={
                  page === i + 1
                    ? { background: 'var(--primary)' }
                    : { borderColor: 'var(--border)' }
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
        <p className="text-center text-xs text-slate-400 mt-3">
          Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(page * ITEMS_PER_PAGE, filtered.length)} trong {filtered.length} dự án
        </p>
      </div>
    </div>
  );
}
