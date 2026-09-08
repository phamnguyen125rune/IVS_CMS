'use client';

import { useState, useEffect } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { Search, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { ResPostListDTO } from '@/types/post.type';
import { PostCategory } from '@/types/category.type';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | 'ALL'>('ALL');
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getAllCategories()
      .then(setCategories)
      .catch(err => console.error('Lỗi tải danh mục:', err));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await postService.getPosts({
          keyword: search,
          categoryId: activeCategory !== 'ALL' ? activeCategory : undefined,
          status: 'PUBLISHED'
        }, 1, 20);
        setPosts(res.result || []);
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPosts, 400);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  const featured = posts.length > 0 ? posts[0] : null;
  const rest = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div>
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">Tin tức</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">Kiến thức & Insights</h1>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 max-w-lg mt-8">
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
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'ALL' ? 'text-white shadow-sm' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
            style={activeCategory === 'ALL' ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setActiveCategory(cat.categoryId)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.categoryId ? 'text-white shadow-sm' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
              style={activeCategory === cat.categoryId ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Đang tải dữ liệu...
          </div>
        ) : (
          <>
            {/* Sử dụng slug cho tất cả thẻ Link để tạo Link chữ đẹp */}
            {featured && (
              <Link to={`/bai-viet/${featured.slug}`} className="group block mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden border hover:shadow-xl transition-all bg-white" style={{ borderColor: 'var(--border)' }}>
                  <div className="aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
                    {featured.featuredMedia ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.featuredMedia} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon size={32} />
                        <span className="text-sm">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border">
                        {featured.category?.name || 'Chung'}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-5 line-clamp-3">
                      {featured.summary || 'Không có tóm tắt...'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-semibold text-slate-700">{featured.author?.name || 'Admin'}</span>
                      <span>•</span>
                      <span>{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('vi-VN') : ''}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.id} to={`/bai-viet/${post.slug}`} className="group block">
                  <article className="rounded-2xl overflow-hidden border hover:shadow-lg transition-all bg-white h-full flex flex-col" style={{ borderColor: 'var(--border)' }}>
                    <div className="aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
                      {post.featuredMedia ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.featuredMedia} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImageIcon size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border">
                          {post.category?.name || 'Chung'}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                        {post.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="text-xs text-slate-400">
                          {post.author?.name || 'Admin'} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : ''}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20 text-slate-400 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-lg font-medium text-slate-600">Không tìm thấy bài viết nào</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
