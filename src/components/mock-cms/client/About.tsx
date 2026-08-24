'use client';

/* eslint-disable @next/next/no-img-element */

import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { ArrowRight, Target, Eye, Heart } from 'lucide-react';

const team = [
  {
    name: 'Nguyễn Văn Hoàng',
    role: 'CEO & Co-founder',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Trần Thị Minh Châu',
    role: 'CTO & Co-founder',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Lê Quốc Bảo',
    role: 'CPO — Sản phẩm',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Phạm Thị Hương Ly',
    role: 'CMO — Marketing',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Hoàng Văn Phú',
    role: 'Lead Engineer',
    avatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&auto=format',
  },
  {
    name: 'Ngô Thị Thu Hà',
    role: 'Head of Design',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&auto=format',
  },
];

const timeline = [
  {
    year: '2014',
    title: 'Thành lập CMS',
    desc: 'Ra đời với 5 thành viên sáng lập và tầm nhìn trở thành đối tác công nghệ hàng đầu Việt Nam.',
  },
  {
    year: '2016',
    title: 'Mở rộng ra Hà Nội',
    desc: 'Thành lập văn phòng thứ hai tại Hà Nội, nâng tổng số nhân sự lên 30 người.',
  },
  {
    year: '2018',
    title: 'Đạt mốc 100 khách hàng',
    desc: 'Phục vụ khách hàng thứ 100 và nhận giải thưởng "Startup công nghệ tiêu biểu" do Bộ KH&CN trao tặng.',
  },
  {
    year: '2020',
    title: 'Mở rộng dịch vụ Cloud',
    desc: 'Ra mắt dịch vụ Cloud & DevOps, đồng thời kết hợp với AWS và Google Cloud trở thành đối tác ủy quyền.',
  },
  {
    year: '2022',
    title: 'Hợp tác quốc tế',
    desc: 'Ký kết hợp tác chiến lược với 3 tập đoàn công nghệ Nhật Bản và Singapore, mở rộng thị trường quốc tế.',
  },
  {
    year: '2024',
    title: '500+ Khách hàng toàn cầu',
    desc: 'Đạt dấu mốc 500 doanh nghiệp tin dùng, với đội ngũ 150+ chuyên gia trên 3 văn phòng.',
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 lg:py-28"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Về chúng tôi
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5">
            Chúng tôi là CMS
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Hơn 10 năm kiến tạo giải pháp công nghệ, chúng tôi tin rằng mỗi doanh nghiệp đều xứng
            đáng được trang bị công cụ tốt nhất để thành công trong thời đại số.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Sứ mệnh',
                color: 'text-blue-600 bg-blue-50',
                desc: 'Trao quyền cho doanh nghiệp Việt Nam thông qua công nghệ tiên tiến, giúp họ cạnh tranh và phát triển trong kỷ nguyên số toàn cầu.',
              },
              {
                icon: Eye,
                title: 'Tầm nhìn',
                color: 'text-violet-600 bg-violet-50',
                desc: 'Đến năm 2030, trở thành công ty công nghệ có tầm ảnh hưởng hàng đầu Đông Nam Á, phục vụ 2000+ doanh nghiệp ở 10 quốc gia.',
              },
              {
                icon: Heart,
                title: 'Giá trị cốt lõi',
                color: 'text-rose-600 bg-rose-50',
                desc: 'Chất lượng đi đầu — Tận tâm với khách hàng — Đổi mới sáng tạo không ngừng — Hợp tác và tôn trọng là nền tảng mọi hoạt động.',
              },
            ].map(({ icon: Icon, title, color, desc }) => (
              <div
                key={title}
                className="p-8 rounded-2xl border"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--primary)' }}
            >
              Lịch sử hình thành
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Hành trình 10 năm phát triển
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className={`flex items-center gap-8 mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div
                    className="bg-white rounded-2xl border p-5 inline-block max-w-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="text-sm font-bold mb-1" style={{ color: 'var(--primary)' }}>
                      {item.year}
                    </div>
                    <h4 className="font-display font-semibold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-blue-600 bg-white flex-shrink-0 z-10" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--primary)' }}
            >
              Đội ngũ lãnh đạo
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Những con người tài năng
            </h2>
            <p className="text-slate-500 mt-3">
              Đội ngũ lãnh đạo với kinh nghiệm dày dặn, đam mê công nghệ và cam kết với sự thành
              công của khách hàng
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square bg-slate-100">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-display font-semibold text-slate-900 text-sm">{member.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="py-0">
        <div className="relative h-80 overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1400&h=400&fit=crop&auto=format"
            alt="CMS office"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Muốn gia nhập đội ngũ CMS?
              </h2>
              <Link
                to="/tuyen-dung"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-blue-700 bg-white font-semibold hover:bg-blue-50"
              >
                Xem cơ hội nghề nghiệp <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
