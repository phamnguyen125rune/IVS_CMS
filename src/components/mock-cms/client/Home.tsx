'use client';

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Code2,
  Palette,
  Sparkles,
  ShieldCheck,
  Cloud,
  BarChart3,
  Users,
  Award,
  Building2,
  Activity,
  Send,
  Calendar,
  Layers,
} from 'lucide-react';
import { bannerService } from '@/services/banner.service';
import { postService } from '@/services/post.service';
import { settingService } from '@/services/setting.service';
import type { Banner, StatsItem } from '@/types/banner.type';
import type { ResPostListDTO } from '@/types/post.type';
import type { GeneralInfo } from '@/types/setting.type';

// Modern services configuration using Lucide React icons
const services = [
  {
    title: 'Phát triển phần mềm',
    desc: 'Xây dựng ứng dụng web và mobile hiệu suất cao, đáp ứng nhu cầu kinh doanh phức tạp nhất.',
    icon: Code2,
    gradient: 'from-blue-600 to-indigo-600',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Thiết kế UI/UX',
    desc: 'Tạo ra trải nghiệm người dùng trực quan, đẹp mắt, và dễ sử dụng trên mọi thiết bị.',
    icon: Palette,
    gradient: 'from-violet-600 to-purple-600',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Tư vấn chuyển đổi số',
    desc: 'Hỗ trợ doanh nghiệp xây dựng lộ trình chuyển đổi số bài bản, hiệu quả và tiết kiệm chi phí.',
    icon: Sparkles,
    gradient: 'from-cyan-600 to-teal-600',
    iconColor: 'text-cyan-400',
  },
  {
    title: 'Bảo mật hệ thống',
    desc: 'Kiểm tra, đánh giá và triển khai giải pháp bảo mật toàn diện bảo vệ dữ liệu doanh nghiệp.',
    icon: ShieldCheck,
    gradient: 'from-emerald-600 to-green-600',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Tối ưu hóa hạ tầng trên đám mây, CI/CD pipeline và tự động hóa quy trình vận hành.',
    icon: Cloud,
    gradient: 'from-amber-600 to-orange-600',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Phân tích dữ liệu',
    desc: 'Khai thác và phân tích dữ liệu lớn, cung cấp insights có giá trị cho ra quyết định kinh doanh.',
    icon: BarChart3,
    gradient: 'from-rose-600 to-pink-600',
    iconColor: 'text-rose-400',
  },
];

const projects = [
  {
    title: 'Nền tảng Thương mại điện tử TechMart',
    client: 'TechMart Vietnam',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=338&fit=crop&auto=format',
    tag: 'E-Commerce',
  },
  {
    title: 'Ứng dụng quản lý chuỗi cung ứng',
    client: 'VN Logistics Group',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=338&fit=crop&auto=format',
    tag: 'Enterprise',
  },
  {
    title: 'Hệ thống LMS cho EduTech',
    client: 'EduTech Vietnam',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=338&fit=crop&auto=format',
    tag: 'Education',
  },
  {
    title: 'Dashboard phân tích dữ liệu thời gian thực',
    client: 'FinTech Solutions',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=338&fit=crop&auto=format',
    tag: 'FinTech',
  },
];

const testimonials = [
  {
    name: 'Nguyễn Hoàng Nam',
    role: 'CEO, TechStart Vietnam',
    content:
      'CMS đã giúp chúng tôi xây dựng nền tảng số vững chắc. Đội ngũ chuyên nghiệp, quy trình làm việc rõ ràng và sản phẩm vượt kỳ vọng.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format',
    rating: 5,
  },
  {
    name: 'Trần Thị Bảo Châu',
    role: 'CTO, RetailVN Corporation',
    content:
      'Trong 3 tháng hợp tác, CMS đã deliver đúng cam kết và còn vượt xa kỳ vọng về chất lượng. Tôi đánh giá cao sự chuyên nghiệp và tận tâm của toàn đội.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format',
    rating: 5,
  },
  {
    name: 'Lê Minh Đức',
    role: 'Founder, FinTech Solutions',
    content:
      'Giải pháp bảo mật mà CMS triển khai đã giúp chúng tôi đạt được chứng chỉ PCI DSS. Đây là bước ngoặt quan trọng cho sự phát triển của công ty.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format',
    rating: 5,
  },
];

const defaultNews = [
  {
    id: 1,
    title: 'CMS đạt giải thưởng "Công ty công nghệ tiêu biểu 2024"',
    date: '10/07/2024',
    category: 'Tin công ty',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop&auto=format',
    excerpt:
      'Tại lễ trao giải thường niên, CMS vinh dự nhận giải thưởng danh giá nhất trong lĩnh vực công nghệ Việt Nam năm 2024...',
    slug: 'bai-viet-1',
  },
  {
    id: 2,
    title: 'Xu hướng AI trong phát triển phần mềm doanh nghiệp',
    date: '08/07/2024',
    category: 'Công nghệ',
    image:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop&auto=format',
    excerpt:
      'Trí tuệ nhân tạo đang định hình lại cách các doanh nghiệp tiếp cận việc phát triển và vận hành phần mềm...',
    slug: 'bai-viet-2',
  },
  {
    id: 3,
    title: 'Hướng dẫn chuyển đổi số cho doanh nghiệp vừa và nhỏ',
    date: '05/07/2024',
    category: 'Kiến thức',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format',
    excerpt:
      'Chuyển đổi số không còn là bài toán chỉ dành cho doanh nghiệp lớn. Hướng dẫn này cung cấp lộ trình...',
    slug: 'bai-viet-3',
  },
];

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);

  // 1. Fetch Banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        let res = await bannerService.getPublicBanners('HOME_HERO');
        if (!res?.data || res.data.length === 0) {
          res = await bannerService.getPublicBanners('');
        }
        if (res?.data && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (err) {
        console.warn('Lỗi tải banner trang chủ, sử dụng dữ liệu mặc định:', err);
      }
    };
    fetchBanners();
  }, []);

  // 2. Fetch Latest Published Posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postService.getPublicPosts({}, 1, 3);
        if (res?.result && res.result.length > 0) {
          setPosts(res.result);
        }
      } catch (err) {
        console.warn('Lỗi tải bài viết trang chủ:', err);
      }
    };
    fetchPosts();
  }, []);

  // 3. Fetch General Info for CTA & Branding
  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const res = await settingService.getGeneralInfo();
        if (res?.data) {
          setGeneralInfo(res.data);
        }
      } catch {
        // fallback
      }
    };
    fetchGeneralInfo();
  }, []);

  // Banner auto-slider timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Testimonial auto-slider timer
  useEffect(() => {
    const timer = setInterval(
      () => setTestimonialIdx((prev) => (prev + 1) % testimonials.length),
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const activeBanner = banners[currentBannerIdx] || {
    title: 'Kiến tạo tương lai số',
    highlightText: 'cho doanh nghiệp của bạn',
    subtitle: 'Đã phục vụ 500+ doanh nghiệp trên toàn quốc',
    description:
      'CMS cung cấp giải pháp công nghệ toàn diện — từ phát triển phần mềm đến chuyển đổi số — giúp doanh nghiệp tăng trưởng bền vững trong kỷ nguyên số.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=420&fit=crop&auto=format',
    primaryBtnText: 'Tư vấn miễn phí',
    primaryBtnUrl: '/lien-he',
    secondaryBtnText: 'Xem dự án',
    secondaryBtnUrl: '/du-an',
    floatingBadgeText: 'Đã phục vụ 500+ doanh nghiệp',
    statsJson:
      '[{"num": "500+", "label": "Khách hàng"}, {"num": "200+", "label": "Dự án hoàn thành"}, {"num": "10+", "label": "Năm kinh nghiệm"}]',
  };

  let heroStats: StatsItem[] = [];
  try {
    if (activeBanner.statsJson) {
      heroStats = JSON.parse(activeBanner.statsJson);
    }
  } catch {
    heroStats = [
      { num: '500+', label: 'Khách hàng' },
      { num: '200+', label: 'Dự án hoàn thành' },
      { num: '10+', label: 'Năm kinh nghiệm' },
    ];
  }

  return (
    <div>
      {/* =========================================================
          1. Hero Section (100% Live Preview aesthetics)
          ========================================================= */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          minHeight: 560,
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Subtitle / Badge */}
              {activeBanner.subtitle && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs sm:text-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeBanner.subtitle}</span>
                </div>
              )}

              {/* Title with Gradient Highlight */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {activeBanner.title}
                {activeBanner.highlightText && (
                  <>
                    <br />
                    <span className="text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                      {activeBanner.highlightText}
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}
              {activeBanner.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {activeBanner.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {activeBanner.primaryBtnText && (
                  <Link
                    to={activeBanner.primaryBtnUrl || '/lien-he'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-sm group"
                  >
                    <span>{activeBanner.primaryBtnText}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {activeBanner.secondaryBtnText && (
                  <Link
                    to={activeBanner.secondaryBtnUrl || '/du-an'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all text-sm"
                  >
                    <Play size={14} className="fill-white/80" />
                    <span>{activeBanner.secondaryBtnText}</span>
                  </Link>
                )}
              </div>

              {/* Stats Counter Row */}
              {heroStats.length > 0 && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 sm:gap-10 pt-6 border-t border-white/10">
                  {heroStats.map((item, idx) => (
                    <div key={idx} className="space-y-0.5 text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                        {item.num}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg">
                <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl aspect-[4/3] bg-slate-800 group">
                  <img
                    src={activeBanner.imageUrl}
                    alt={activeBanner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Badge (Glassmorphic) */}
                {activeBanner.floatingBadgeText && (
                  <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 max-w-[90%]">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
                      ★
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                      {activeBanner.floatingBadgeText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls if multiple banners */}
        {banners.length > 1 && (
          <div className="relative max-w-7xl mx-auto px-6 pb-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              {banners.map((_, bIdx) => (
                <button
                  key={bIdx}
                  type="button"
                  onClick={() => setCurrentBannerIdx(bIdx)}
                  className={`h-2 rounded-full transition-all ${
                    currentBannerIdx === bIdx
                      ? 'w-8 bg-blue-500'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Chuyển sang banner ${bIdx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentBannerIdx((prev) => (prev - 1 + banners.length) % banners.length)
                }
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                aria-label="Banner trước"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % banners.length)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                aria-label="Banner tiếp theo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          2. About Snippet Section
          ========================================================= */}
      <section className="py-20 border-b" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ color: 'var(--primary)' }}
              >
                <Sparkles size={14} /> Về chúng tôi
              </div>

              <h2
                className="font-display text-3xl lg:text-4xl font-bold leading-tight mb-5"
                style={{ color: 'var(--text)' }}
              >
                Đối tác công nghệ đáng tin cậy của doanh nghiệp Việt
              </h2>

              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {generalInfo?.websiteDescription ||
                  'Thành lập từ năm 2014, CMS đã trở thành một trong những công ty công nghệ hàng đầu Việt Nam, chuyên cung cấp giải pháp phần mềm tùy chỉnh và dịch vụ chuyển đổi số.'}
              </p>

              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Với đội ngũ hơn 150 kỹ sư và chuyên gia, chúng tôi đã đồng hành cùng hàng trăm doanh
                nghiệp trong và ngoài nước, từ startup đến tập đoàn lớn.
              </p>

              <Link
                to="/gioi-thieu"
                className="inline-flex items-center gap-2 font-semibold text-sm transition-opacity hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                Tìm hiểu thêm về {generalInfo?.companyName || 'CMS'} <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  num: '150+',
                  label: 'Chuyên gia & kỹ sư',
                  icon: Users,
                  accentColor: 'text-blue-500',
                  bgColor: 'bg-blue-500/10',
                },
                {
                  num: '10+',
                  label: 'Năm kinh nghiệm',
                  icon: Award,
                  accentColor: 'text-violet-500',
                  bgColor: 'bg-violet-500/10',
                },
                {
                  num: '500+',
                  label: 'Doanh nghiệp tin dùng',
                  icon: Building2,
                  accentColor: 'text-cyan-500',
                  bgColor: 'bg-cyan-500/10',
                },
                {
                  num: '99.9%',
                  label: 'Uptime đảm bảo',
                  icon: Activity,
                  accentColor: 'text-emerald-500',
                  bgColor: 'bg-emerald-500/10',
                },
              ].map((stat) => (
                <div
                  key={stat.num}
                  className="p-6 rounded-2xl border transition-all hover:shadow-md"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bgColor} ${stat.accentColor} flex items-center justify-center mb-3`}
                  >
                    <stat.icon size={20} />
                  </div>

                  <div
                    className="font-display font-bold text-3xl mb-1"
                    style={{ color: 'var(--text)' }}
                  >
                    {stat.num}
                  </div>

                  <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. Services Section (Upgraded with Lucide Icons)
          ========================================================= */}
      <section className="py-20" style={{ background: 'var(--surface-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2"
              style={{ color: 'var(--primary)' }}
            >
              <Layers size={14} /> Dịch vụ giải pháp
            </div>

            <h2
              className="font-display text-3xl lg:text-4xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              Giải pháp công nghệ toàn diện
            </h2>

            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Chúng tôi cung cấp đầy đủ các dịch vụ công nghệ giúp doanh nghiệp phát triển vượt trội trong kỷ nguyên số
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}
                >
                  <service.icon size={22} />
                </div>

                <h3 className="font-display font-semibold text-lg mb-2.5" style={{ color: 'var(--text)' }}>
                  {service.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {service.desc}
                </p>

                <div
                  className="mt-5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold group-hover:gap-2.5 transition-all"
                  style={{ color: 'var(--primary)' }}
                >
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. Featured Projects
          ========================================================= */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ color: 'var(--primary)' }}
              >
                <Award size={14} /> Dự án nổi bật
              </div>

              <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Công trình tiêu biểu của chúng tôi
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProjectIdx(Math.max(0, projectIdx - 1))}
                className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-30 hover:bg-[var(--hover)] transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
                disabled={projectIdx === 0}
                aria-label="Dự án trước"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => setProjectIdx(Math.min(projects.length - 1, projectIdx + 1))}
                className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-30 hover:bg-[var(--hover)] transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
                disabled={projectIdx === projects.length - 1}
                aria-label="Dự án tiếp theo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(projectIdx, projectIdx + 3).map((project) => (
              <Link
                key={project.title}
                to="/du-an"
                className="group block rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ background: 'var(--surface-tertiary)' }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-blue-600 px-2.5 py-1 rounded-full shadow-md">
                    {project.tag}
                  </span>
                </div>

                <div className="p-5" style={{ background: 'var(--surface)' }}>
                  <h3
                    className="font-display font-semibold leading-snug text-base"
                    style={{ color: 'var(--text)' }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    Khách hàng: {project.client}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/du-an"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border hover:opacity-85 transition-opacity"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
                background: 'var(--surface)',
              }}
            >
              Xem tất cả dự án <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. Testimonials Section
          ========================================================= */}
      <section className="py-20" style={{ background: 'var(--dark-background)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2"
            style={{ color: 'var(--primary)' }}
          >
            <Star size={14} className="fill-[var(--primary)]" /> Đánh giá từ khách hàng
          </div>

          <h2
            className="font-display text-3xl font-bold mb-12"
            style={{ color: 'var(--dark-text)' }}
          >
            Khách hàng nói gì về chúng tôi
          </h2>

          <div className="relative">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  i === testimonialIdx ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      fill="var(--rating)"
                      style={{ color: 'var(--rating)' }}
                    />
                  ))}
                </div>

                <blockquote
                  className="text-lg sm:text-xl leading-relaxed italic mb-8"
                  style={{ color: 'var(--dark-text-secondary)' }}
                >
                  "{t.content}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={t.avatar}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    alt={t.name}
                  />

                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: 'var(--dark-text)' }}>
                      {t.name}
                    </div>

                    <div className="text-xs" style={{ color: 'var(--dark-text-muted)' }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTestimonialIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === testimonialIdx ? 'bg-blue-400 w-6' : 'bg-white/20 w-2'
                }`}
                aria-label={`Đánh giá ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. News / Latest Articles (Connected to DB API)
          ========================================================= */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ color: 'var(--primary)' }}
              >
                <Calendar size={14} /> Tin tức & Bài viết
              </div>

              <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Cập nhật mới nhất
              </h2>
            </div>

            <Link
              to="/bai-viet"
              className="text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Tất cả bài viết <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(posts.length > 0
              ? posts.map((post) => ({
                  id: post.id,
                  title: post.title,
                  category: post.category?.name || 'Tin tức',
                  image:
                    post.featuredMedia ||
                    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop&auto=format',
                  date: post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('vi-VN')
                    : 'Mới cập nhật',
                  excerpt: post.summary || 'Xem chi tiết bài viết công nghệ và tin tức mới nhất...',
                  slug: post.slug,
                }))
              : defaultNews
            ).map((item) => (
              <Link
                key={item.id}
                to={`/bai-viet/${item.slug}`}
                className="group block rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="aspect-video overflow-hidden"
                  style={{ background: 'var(--surface-tertiary)' }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-text)',
                      }}
                    >
                      {item.category}
                    </span>

                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.date}
                    </span>
                  </div>

                  <h3
                    className="font-display font-semibold text-base leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-xs sm:text-sm leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.excerpt}
                  </p>

                  <div
                    className="mt-4 text-xs sm:text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    style={{ color: 'var(--primary)' }}
                  >
                    Đọc tiếp <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          7. Bottom CTA Banner (Configured via General Info)
          ========================================================= */}
      <section
        className="py-16 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Sẵn sàng chuyển đổi cùng {generalInfo?.companyName || 'doanh nghiệp chúng tôi'}?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Liên hệ ngay hôm nay để nhận tư vấn miễn phí giải pháp công nghệ toàn diện từ đội ngũ chuyên gia.
          </p>

          <Link
            to={generalInfo?.headerCtaUrl || '/lien-he'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all text-sm group"
          >
            <span>{generalInfo?.headerCtaText || 'Liên hệ với chúng tôi'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
