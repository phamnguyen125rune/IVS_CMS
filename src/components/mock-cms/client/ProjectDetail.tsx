'use client';

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

import {
  LocalizedLink as Link,
  useLocalizedParams as useParams,
} from '@/components/navigation/LocalizedLink';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Tag,
  ExternalLink,
  CheckCircle2,
  Layers,
  Users,
  TrendingUp,
  Award,
  Share2,
} from 'lucide-react';

const projectData = {
  id: 1,
  title: 'Nền tảng Thương mại điện tử TechMart',
  client: 'TechMart Vietnam',
  category: 'E-Commerce',
  year: '2024',
  duration: '6 tháng',
  teamSize: '12 chuyên gia',
  website: 'https://techmart.example.com',
  heroImage:
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop&auto=format',
  summary:
    'Xây dựng hạ tầng thương mại điện tử đa kênh thế hệ mới, đáp ứng tốc độ tăng trưởng bứt phá với hơn 10 triệu sản phẩm và khả năng chịu tải 500.000 người dùng truy cập đồng thời.',
  technologies: [
    'React.js',
    'Next.js',
    'Node.js',
    'Go / Microservices',
    'PostgreSQL',
    'Redis',
    'Kubernetes',
    'AWS S3 & CloudFront',
  ],
  results: [
    { metric: '10M+', label: 'Sản phẩm niêm yết' },
    { metric: '500K', label: 'Users đồng thời (CCU)' },
    { metric: '-45%', label: 'Thời gian tải trang (<0.8s)' },
    { metric: '+180%', label: 'Tăng trưởng doanh số YOY' },
  ],
  overview: [
    'TechMart Vietnam là một trong những tập đoàn bán lẻ công nghệ hàng đầu tại Đông Nam Á. Trước khi chuyển đổi, hệ thống cũ gặp khó khăn nghiêm trọng trong việc mở rộng quy mô, chịu tải kém vào các dịp Lễ lớn/Flash Sale và quy trình thanh toán phức tạp dẫn đến tỷ lệ hủy đơn hàng cao.',
    'CMS đã đồng hành cùng TechMart hiện đại hóa toàn bộ hệ thống bằng kiến trúc Microservices linh hoạt, tối ưu hóa trải nghiệm người dùng trên cả giao diện Web và App Mobile, tích hợp AI hỗ trợ gợi ý sản phẩm cá nhân hóa.',
  ],
  challenges: [
    'Đồng bộ hóa tồn kho thời gian thực cho hơn 200 cửa hàng vật lý và kho hàng trung tâm.',
    'Đảm bảo hệ thống vận hành liên tục 99.99% uptime trong các chiến dịch Siêu Sale hàng tháng.',
    'Tích hợp hơn 15 cổng thanh toán nội địa & quốc tế cùng hệ thống ví điện tử.',
  ],
  solutions: [
    'Thiết kế kiến trúc Microservices decoupled độc lập, cho phép mở rộng linh hoạt từng dịch vụ dịch vụ thanh toán, kho hàng, giỏ hàng.',
    'Áp dụng Caching đa tầng với Redis & CDN toàn cầu giúp phản hồi dữ liệu trong chưa đầy 50ms.',
    'Xây dựng công cụ quản trị đơn hàng tập trung (OMS) tích hợp AI tự động phân luồng đơn hàng đến kho gần nhất.',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop&auto=format',
  ],
  testimonial: {
    quote:
      'Giải pháp từ CMS không chỉ nâng tầm trải nghiệm mua sắm của khách hàng mà còn giúp chúng tôi vận hành mượt mà trong mọi chiến dịch Siêu Sale. Đây là cột mốc quan trọng nhất trong chiến lược số hóa của TechMart.',
    author: 'Trần Minh Hoàng',
    role: 'Giám đốc Công nghệ (CTO)',
    company: 'TechMart Vietnam',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
  },
};

const relatedProjects = [
  {
    id: 2,
    title: 'Hệ thống WMS thông minh VN Logistics',
    category: 'Logistics',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'Dashboard Real-time FinTech Analytics',
    category: 'FinTech',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format',
  },
  {
    id: 5,
    title: 'Cổng thông tin khách hàng RetailVN',
    category: 'E-Commerce',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format',
  },
];

export default function ProjectDetail() {
  useParams();

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <section
        className="pt-12 pb-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link
            to="/du-an"
            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại danh sách dự án
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-semibold text-white tracking-wide uppercase"
                  style={{ background: 'var(--primary)' }}
                >
                  {projectData.category}
                </span>
                <span className="text-blue-200 text-xs flex items-center gap-1">
                  <Calendar size={13} /> Năm thực hiện: {projectData.year}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                {projectData.title}
              </h1>

              <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                {projectData.summary}
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end gap-3">
              <a
                href={projectData.website}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                Ghé thăm Website <ExternalLink size={16} />
              </a>
              <button
                className="p-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                title="Chia sẻ dự án"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {/* Main Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white mb-12">
          <img
            src={projectData.heroImage}
            alt={projectData.title}
            className="w-full aspect-[21/9] object-cover"
          />
        </div>

        {/* Project Meta Metrics Bar */}
        <div
          className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm mb-12 grid grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Khách hàng</p>
              <p className="font-bold text-slate-900 text-base">{projectData.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Thời gian</p>
              <p className="font-bold text-slate-900 text-base">
                {projectData.duration} ({projectData.year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Quy mô đội ngũ</p>
              <p className="font-bold text-slate-900 text-base">{projectData.teamSize}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Lĩnh vực</p>
              <p className="font-bold text-slate-900 text-base">{projectData.category}</p>
            </div>
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Body Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Results Grid */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-6 text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                <TrendingUp size={18} /> Kết quả nổi bật đạt được
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {projectData.results.map((r, i) => (
                  <div key={i} className="border-l-2 border-emerald-500/40 pl-4">
                    <div className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">
                      {r.metric}
                    </div>
                    <div className="text-xs text-slate-300 font-medium leading-snug">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                Tổng quan dự án
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                {projectData.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Tag className="text-amber-500" size={20} /> Bài toán & Thách thức
                </h3>
                <ul className="space-y-3">
                  {projectData.challenges.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={20} /> Giải pháp áp dụng
                </h3>
                <ul className="space-y-3">
                  {projectData.solutions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                Hình ảnh giao diện thực tế
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectData.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border bg-slate-100 group shadow-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i}`}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-8 relative overflow-hidden">
              <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-100/50 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-slate-800 text-base sm:text-lg italic font-medium leading-relaxed mb-6">
                  "{projectData.testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={projectData.testimonial.avatar}
                    alt={projectData.testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {projectData.testimonial.author}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {projectData.testimonial.role} · {projectData.testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tech Stack Box */}
            <div
              className="bg-white rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <h4 className="font-display font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <Layers size={18} className="text-blue-600" /> Công nghệ sử dụng
              </h4>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact CTA Widget */}
            <div
              className="rounded-2xl p-6 text-white text-center shadow-lg"
              style={{ background: 'var(--primary)' }}
            >
              <h4 className="font-display font-bold text-xl mb-2">Bạn có ý tưởng dự án mới?</h4>
              <p className="text-blue-100 text-xs leading-relaxed mb-5">
                Đội ngũ tư vấn kiến trúc công nghệ của CMS sẵn sàng hỗ trợ khảo sát và lên giải pháp
                tối ưu nhất cho bạn.
              </p>
              <Link
                to="/lien-he"
                className="block w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
              >
                Nhận tư vấn giải pháp
              </Link>
            </div>

            {/* Related Projects */}
            <div
              className="bg-white rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <h4 className="font-display font-semibold text-slate-900 text-sm mb-4">
                Dự án tương tự
              </h4>
              <div className="space-y-4">
                {relatedProjects.map((p) => (
                  <Link key={p.id} to={`/du-an/${p.id}`} className="flex gap-3 group items-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-20 h-14 rounded-lg object-cover bg-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                        {p.category}
                      </span>
                      <h5 className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mt-0.5">
                        {p.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
