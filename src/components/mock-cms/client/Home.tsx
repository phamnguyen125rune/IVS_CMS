'use client';

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

import { useState, useEffect } from "react";
import { LocalizedLink as Link } from "@/components/navigation/LocalizedLink";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "Phát triển phần mềm",
    desc: "Xây dựng ứng dụng web và mobile hiệu suất cao, đáp ứng nhu cầu kinh doanh phức tạp nhất.",
    icon: "⚙️",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Thiết kế UI/UX",
    desc: "Tạo ra trải nghiệm người dùng trực quan, đẹp mắt, và dễ sử dụng trên mọi thiết bị.",
    icon: "🎨",
    color: "from-violet-500 to-violet-600",
  },
  {
    title: "Tư vấn chuyển đổi số",
    desc: "Hỗ trợ doanh nghiệp xây dựng lộ trình chuyển đổi số bài bản, hiệu quả và tiết kiệm chi phí.",
    icon: "🔄",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Bảo mật hệ thống",
    desc: "Kiểm tra, đánh giá và triển khai giải pháp bảo mật toàn diện bảo vệ dữ liệu doanh nghiệp.",
    icon: "🔒",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Cloud & DevOps",
    desc: "Tối ưu hóa hạ tầng trên đám mây, CI/CD pipeline và tự động hóa quy trình vận hành.",
    icon: "☁️",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Phân tích dữ liệu",
    desc: "Khai thác và phân tích dữ liệu lớn, cung cấp insights có giá trị cho ra quyết định kinh doanh.",
    icon: "📊",
    color: "from-rose-500 to-rose-600",
  },
];

const projects = [
  {
    title: "Nền tảng Thương mại điện tử TechMart",
    client: "TechMart Vietnam",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=338&fit=crop&auto=format",
    tag: "E-Commerce",
  },
  {
    title: "Ứng dụng quản lý chuỗi cung ứng",
    client: "VN Logistics Group",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=338&fit=crop&auto=format",
    tag: "Enterprise",
  },
  {
    title: "Hệ thống LMS cho EduTech",
    client: "EduTech Vietnam",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=338&fit=crop&auto=format",
    tag: "Education",
  },
  {
    title: "Dashboard phân tích dữ liệu thời gian thực",
    client: "FinTech Solutions",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=338&fit=crop&auto=format",
    tag: "FinTech",
  },
];

const testimonials = [
  {
    name: "Nguyễn Hoàng Nam",
    role: "CEO, TechStart Vietnam",
    content:
      "CMS đã giúp chúng tôi xây dựng nền tảng số vững chắc. Đội ngũ chuyên nghiệp, quy trình làm việc rõ ràng và sản phẩm vượt kỳ vọng.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
    rating: 5,
  },
  {
    name: "Trần Thị Bảo Châu",
    role: "CTO, RetailVN Corporation",
    content:
      "Trong 3 tháng hợp tác, CMS đã deliver đúng cam kết và còn vượt xa kỳ vọng về chất lượng. Tôi đánh giá cao sự chuyên nghiệp và tận tâm của toàn đội.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
    rating: 5,
  },
  {
    name: "Lê Minh Đức",
    role: "Founder, FinTech Solutions",
    content:
      "Giải pháp bảo mật mà CMS triển khai đã giúp chúng tôi đạt được chứng chỉ PCI DSS. Đây là bước ngoặt quan trọng cho sự phát triển của công ty.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
    rating: 5,
  },
];

const news = [
  {
    title: 'CMS đạt giải thưởng "Công ty công nghệ tiêu biểu 2024"',
    date: "10/07/2024",
    category: "Tin công ty",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop&auto=format",
    excerpt:
      "Tại lễ trao giải thường niên, CMS vinh dự nhận giải thưởng danh giá nhất trong lĩnh vực công nghệ Việt Nam năm 2024...",
  },
  {
    title: "Xu hướng AI trong phát triển phần mềm doanh nghiệp",
    date: "08/07/2024",
    category: "Công nghệ",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop&auto=format",
    excerpt:
      "Trí tuệ nhân tạo đang định hình lại cách các doanh nghiệp tiếp cận việc phát triển và vận hành phần mềm...",
  },
  {
    title: "Hướng dẫn chuyển đổi số cho doanh nghiệp vừa và nhỏ",
    date: "05/07/2024",
    category: "Kiến thức",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format",
    excerpt:
      "Chuyển đổi số không còn là bài toán chỉ dành cho doanh nghiệp lớn. Hướng dẫn này cung cấp lộ trình...",
  },
];

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setTestimonialIdx((prev) => (prev + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)",
          minHeight: 600,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Đã phục vụ 500+ doanh nghiệp trên toàn quốc
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-6">
              Kiến tạo tương lai số
              <br />
              <span style={{ color: "#60a5fa" }}>cho doanh nghiệp</span>
              <br />
              của bạn
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              CMS cung cấp giải pháp công nghệ toàn diện — từ phát triển phần
              mềm đến chuyển đổi số — giúp doanh nghiệp tăng trưởng bền vững
              trong kỷ nguyên số.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/lien-he"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                Tư vấn miễn phí <ArrowRight size={16} />
              </Link>
              <Link
                to="/du-an"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10"
              >
                <Play size={15} />
                Xem dự án
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
              {[
                ["500+", "Khách hàng"],
                ["200+", "Dự án hoàn thành"],
                ["10+", "Năm kinh nghiệm"],
              ].map(([num, label]) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold font-display text-white">
                    {num}
                  </div>
                  <div className="text-blue-300 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=420&fit=crop&auto=format"
                alt="Dashboard analytics"
                className="rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Dự án hoàn thành</div>
                  <div className="font-bold text-slate-900">+18 tháng này</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)" }}
              >
                Về chúng tôi
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-5">
                Đối tác công nghệ đáng tin cậy của doanh nghiệp Việt
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-6">
                Thành lập từ năm 2014, CMS đã trở thành một trong những công ty
                công nghệ hàng đầu Việt Nam, chuyên cung cấp giải pháp phần mềm
                tùy chỉnh và dịch vụ chuyển đổi số.
              </p>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Với đội ngũ hơn 150 kỹ sư và chuyên gia, chúng tôi đã đồng hành
                cùng hàng trăm doanh nghiệp trong và ngoài nước, từ startup đến
                tập đoàn lớn.
              </p>
              <Link
                to="/gioi-thieu"
                className="inline-flex items-center gap-2 font-semibold text-sm"
                style={{ color: "var(--primary)" }}
              >
                Tìm hiểu thêm về CMS <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  num: "150+",
                  label: "Chuyên gia & kỹ sư",
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  num: "10+",
                  label: "Năm kinh nghiệm",
                  color: "bg-violet-50 border-violet-200",
                },
                {
                  num: "500+",
                  label: "Doanh nghiệp tin dùng",
                  color: "bg-cyan-50 border-cyan-200",
                },
                {
                  num: "99.9%",
                  label: "Uptime đảm bảo",
                  color: "bg-emerald-50 border-emerald-200",
                },
              ].map((stat) => (
                <div
                  key={stat.num}
                  className={`p-6 rounded-2xl border ${stat.color}`}
                >
                  <div className="font-display font-bold text-3xl text-slate-900 mb-1">
                    {stat.num}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20" style={{ background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--primary)" }}
            >
              Dịch vụ
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900">
              Giải pháp công nghệ toàn diện
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các dịch vụ công nghệ giúp doanh nghiệp
              phát triển trong kỷ nguyên số
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-all group cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {service.icon}
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {service.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Tìm hiểu thêm <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project slider */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)" }}
              >
                Dự án nổi bật
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900">
                Công trình tiêu biểu của chúng tôi
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setProjectIdx(Math.max(0, projectIdx - 1))}
                className="w-10 h-10 rounded-xl border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                style={{ borderColor: "var(--border)" }}
                disabled={projectIdx === 0}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setProjectIdx(Math.min(projects.length - 1, projectIdx + 1))
                }
                className="w-10 h-10 rounded-xl border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                style={{ borderColor: "var(--border)" }}
                disabled={projectIdx === projects.length - 1}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(projectIdx, projectIdx + 3).map((project) => (
              <Link
                key={project.title}
                to="/du-an"
                className="group block rounded-2xl overflow-hidden border hover:shadow-xl transition-all bg-slate-100"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-blue-600 px-2.5 py-1 rounded-full">
                    {project.tag}
                  </span>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-display font-semibold text-slate-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Khách hàng: {project.client}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/du-an"
              className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border hover:bg-slate-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Xem tất cả dự án <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: "#0f172a" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Đánh giá khách hàng
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-12">
            Khách hàng nói gì về chúng tôi
          </h2>
          <div className="relative">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${i === testimonialIdx ? "opacity-100" : "opacity-0 absolute inset-0"}`}
              >
                <div className="flex justify-center mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      fill="#f59e0b"
                      className="text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-blue-100 text-xl leading-relaxed italic mb-8">
                  "{t.content}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={t.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                    alt={t.name}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-blue-300 text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? "bg-blue-400 w-6" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)" }}
              >
                Tin tức & Bài viết
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900">
                Cập nhật mới nhất
              </h2>
            </div>
            <Link
              to="/bai-viet"
              className="text-sm font-semibold flex items-center gap-1"
              style={{ color: "var(--primary)" }}
            >
              Tất cả bài viết <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link
                key={item.title}
                to="/bai-viet/bai-viet-1"
                className="group block rounded-2xl overflow-hidden border hover:shadow-lg transition-all bg-white"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Đọc tiếp <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-6" style={{ background: "var(--primary)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Sẵn sàng chuyển đổi doanh nghiệp?
          </h2>
          <p className="text-blue-200 text-base mb-8">
            Liên hệ ngay để nhận tư vấn miễn phí từ đội ngũ chuyên gia của chúng
            tôi.
          </p>
          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-blue-700 bg-white hover:bg-blue-50 transition-colors"
          >
            Liên hệ với chúng tôi <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}


