'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { Search, ArrowRight, Clock } from 'lucide-react';

const categories = [
  'Tất cả',
  'Công nghệ',
  'Tin tức',
  'Kiến thức',
  'Case Study',
  'Marketing',
  'Bảo mật',
];

const posts = [
  {
    id: 1,
    slug: 'xu-huong-ai-2024',
    title: 'Xu hướng công nghệ AI trong năm 2024 và tác động đến doanh nghiệp',
    category: 'Công nghệ',
    date: '10/07/2024',
    readTime: '8 phút',
    image:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Trí tuệ nhân tạo không còn là khái niệm xa lạ. Năm 2024 chứng kiến làn sóng ứng dụng AI bùng nổ trong mọi lĩnh vực từ sản xuất đến dịch vụ...',
    author: 'Nguyễn Thị Hoa',
    featured: true,
  },
  {
    id: 2,
    slug: 'CMS-giai-thuong-2024',
    title: 'CMS đạt giải thưởng "Công ty công nghệ tiêu biểu 2024"',
    category: 'Tin tức',
    date: '08/07/2024',
    readTime: '4 phút',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Tại lễ trao giải thường niên do Hiệp hội Phần mềm & Dịch vụ CNTT Việt Nam (VINASA) tổ chức, CMS vinh dự nhận giải thưởng danh giá nhất...',
    author: 'Ban Biên tập',
    featured: false,
  },
  {
    id: 3,
    slug: 'chuyen-doi-so-doanh-nghiep',
    title: 'Hướng dẫn chuyển đổi số toàn diện cho doanh nghiệp vừa và nhỏ',
    category: 'Kiến thức',
    date: '05/07/2024',
    readTime: '12 phút',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Chuyển đổi số không chỉ là mua thêm phần mềm. Đây là bài hướng dẫn từng bước giúp SME xây dựng lộ trình số hóa bài bản...',
    author: 'Trần Văn Minh',
    featured: false,
  },
  {
    id: 4,
    slug: 'case-study-techmart',
    title: 'Case Study: Xây dựng nền tảng TMĐT cho TechMart Vietnam',
    category: 'Case Study',
    date: '01/07/2024',
    readTime: '10 phút',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'TechMart Vietnam đã từ 0 lên 10 triệu sản phẩm và 500K người dùng đồng thời chỉ trong 12 tháng. Đây là câu chuyện đằng sau...',
    author: 'Lê Thị Lan',
    featured: false,
  },
  {
    id: 5,
    slug: 'bao-mat-doanh-nghiep',
    title: 'Bảo mật thông tin doanh nghiệp: 10 nguyên tắc không thể bỏ qua',
    category: 'Bảo mật',
    date: '28/06/2024',
    readTime: '9 phút',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Trong bối cảnh tấn công mạng ngày càng tinh vi, mọi doanh nghiệp đều cần có chiến lược bảo mật toàn diện...',
    author: 'Đặng Quốc Huy',
    featured: false,
  },
  {
    id: 6,
    slug: 'seo-content-marketing',
    title: 'Chiến lược SEO Content Marketing hiệu quả cho doanh nghiệp B2B',
    category: 'Marketing',
    date: '25/06/2024',
    readTime: '7 phút',
    image:
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'B2B content marketing khác biệt hoàn toàn với B2C. Đây là cách CMS đã giúp 50+ khách hàng tăng organic traffic...',
    author: 'Vũ Thị Thu',
    featured: false,
  },
  {
    id: 7,
    slug: 'microservices-kien-truc',
    title: 'Kiến trúc Microservices: Khi nào nên áp dụng và khi nào không?',
    category: 'Kiến thức',
    date: '20/06/2024',
    readTime: '11 phút',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Microservices không phải giải pháp vạn năng. Bài viết này phân tích kỹ khi nào nên và không nên áp dụng kiến trúc này...',
    author: 'Hoàng Minh Tuấn',
    featured: false,
  },
  {
    id: 8,
    slug: 'cloud-computing-guide',
    title: 'Cloud Computing toàn tập: AWS vs Google Cloud vs Azure',
    category: 'Công nghệ',
    date: '15/06/2024',
    readTime: '14 phút',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'So sánh toàn diện 3 nền tảng cloud hàng đầu thế giới dựa trên tiêu chí giá cả, tính năng và hệ sinh thái...',
    author: 'Nguyễn Văn Admin',
    featured: false,
  },
  {
    id: 9,
    slug: 'react-best-practices',
    title: 'React.js Best Practices 2024: Những điều developer phải biết',
    category: 'Công nghệ',
    date: '10/06/2024',
    readTime: '9 phút',
    image:
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop&auto=format',
    excerpt:
      'Hệ sinh thái React liên tục phát triển. Đây là những best practices mới nhất giúp code của bạn clean hơn và hiệu năng tốt hơn...',
    author: 'Ngô Thị Thu',
    featured: false,
  },
];

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p !== featured);

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
            Tin tức
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Kiến thức & Insights
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-8">
            Cập nhật xu hướng công nghệ, chia sẻ kiến thức chuyên sâu và câu chuyện thành công từ
            đội ngũ CMS.
          </p>
          {/* Search */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 max-w-lg">
            <Search size={16} className="text-white/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="bg-transparent text-white placeholder:text-white/50 outline-none flex-1 text-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'text-white'
                  : 'bg-white border text-slate-600 hover:bg-slate-50'
              }`}
              style={
                activeCategory === cat
                  ? { background: 'var(--primary)' }
                  : { borderColor: 'var(--border)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link to={`/bai-viet/${featured.slug}`} className="group block mb-10">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden border hover:shadow-xl transition-all bg-white"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="aspect-video overflow-hidden bg-slate-100">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-semibold text-white px-3 py-1 rounded-full"
                    style={{ background: 'var(--primary)' }}
                  >
                    Nổi bật
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {featured.category}
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {featured.readTime} đọc
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                  Đọc bài viết <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} to={`/bai-viet/${post.slug}`} className="group block">
              <article
                className="rounded-2xl overflow-hidden border hover:shadow-lg transition-all bg-white h-full"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {post.author} · {post.date}
                    </div>
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc tiếp <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium text-slate-600">Không tìm thấy bài viết phù hợp</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc danh mục khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
