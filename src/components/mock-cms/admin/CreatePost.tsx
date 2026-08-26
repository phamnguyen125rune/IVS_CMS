'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import {
  ArrowLeft,
  Save,
  Send,
  ImagePlus,
  Globe,
  Share2,
  LayoutList,
  Tags,
  Calendar,
  Type,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';

import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { ReqPostCreateDTO, ReqPostUpdateDTO, PostStatus } from '@/types/post.type';
import { PostCategory } from '@/types/category.type';

// Tải ngầm CKEditor
const RichTextEditor = dynamic(() => import('@/config/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[600px] border rounded-xl bg-slate-50 animate-pulse flex flex-col items-center justify-center text-slate-400">
      <FileText size={32} className="mb-2 opacity-50" />
      <span>Đang tải trình soạn thảo...</span>
    </div>
  ),
});

export default function PostEditor() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Data chuẩn Backend DTO
  const [formData, setFormData] = useState<ReqPostCreateDTO>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    categoryId: 0,
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    isIndexable: true,
    isFollowable: true,
    ogTitle: '',
    ogDescription: '',
    tagIds: [],
    mediaIds: [],
    featuredMediaId: null,
    ogImageId: null,
    publishedAt: '',
  });

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((data) => {
        setCategories(data);
        if (!isEditMode && data.length > 0 && formData.categoryId === 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].categoryId }));
        }
      })
      .catch((err) => console.error('Lỗi tải danh mục:', err));

    if (isEditMode && id) {
      postService
        .getPostById(id)
        .then((data: any) => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            summary: data.summary || '',
            content: data.content || '',
            categoryId: data.category?.id || 0,
            metaTitle: data.metadata?.title || '',
            metaDescription: data.metadata?.description || '',
            canonicalUrl: data.metadata?.canonicalUrl || '',
            isIndexable: data.metadata?.robots?.includes('noindex') ? false : true,
            isFollowable: data.metadata?.robots?.includes('nofollow') ? false : true,
            ogTitle: data.metadata?.openGraph?.title || '',
            ogDescription: data.metadata?.openGraph?.description || '',
            featuredMediaId: data.featuredMediaId || null,
            ogImageId: data.ogImageId || null,
            tagIds: data.tags?.map((t: any) => t.id) || [],
            mediaIds: data.mediaList?.map((m: any) => m.id) || [],
            publishedAt: data.publishedAt
              ? new Date(data.publishedAt).toISOString().slice(0, 16)
              : '',
          });
        })
        .catch((err) => console.error('Lỗi tải chi tiết bài viết:', err));
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const newData = { ...prev, title: val };
      if (!isEditMode) {
        newData.slug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      return newData;
    });
  };

  // --- XỬ LÝ LƯU & GỬI DUYỆT ---
  const handleSubmit = async (e: React.FormEvent, targetStatus: PostStatus) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content || !formData.categoryId) {
      alert('Vui lòng nhập Tiêu đề, Slug, Nội dung và Danh mục!');
      return;
    }
    setLoading(true);

    try {
      const payloadToSubmit = { ...formData };

      if (payloadToSubmit.publishedAt) {
        payloadToSubmit.publishedAt = new Date(payloadToSubmit.publishedAt).toISOString();
      } else {
        delete payloadToSubmit.publishedAt;
      }

      let currentPostId = id;

      if (isEditMode && currentPostId) {
        const payload: ReqPostUpdateDTO = { ...payloadToSubmit };
        await postService.updatePost(currentPostId, payload);
      } else {
        const createdPost = await postService.createPost(payloadToSubmit);
        currentPostId = createdPost.id;
      }

      if (currentPostId && (targetStatus === 'DRAFT' || targetStatus === 'PENDING')) {
        await postService.changeStatus(currentPostId, targetStatus);
      }

      navigate('/admin/bai-viet');
    } catch (error: any) {
      alert(error?.message || 'Có lỗi xảy ra khi lưu bài viết!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto pb-24">
      {/* HEADER: Workflow & Hành động (Đã bỏ sticky/nổi) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded-xl hover:bg-slate-50 text-slate-600 bg-white shadow-sm transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-none">
              {isEditMode ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              {isEditMode ? `ID: #${id}` : 'Bản nháp tự động lưu cục bộ'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <Save size={16} className={loading ? 'animate-pulse' : ''} /> Lưu nháp
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'PENDING')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 shadow-md transition-all"
            style={{ background: 'var(--primary)' }}
          >
            <Send size={16} className={loading ? 'animate-bounce' : ''} /> Gửi duyệt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* ================= CỘT CHÍNH (8 CỘT - BÊN TRÁI) ================= */}
        <div className="xl:col-span-8 space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-6 pb-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Type size={18} className="text-slate-500" />
              <h2 className="font-display font-bold text-slate-900 text-lg">Thông tin cơ bản</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Tiêu đề bài viết (H1) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề (Khuyến nghị 50 - 60 ký tự)..."
                  className="w-full px-4 py-3 text-lg font-bold text-slate-900 outline-none border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Đường dẫn tĩnh (Permalink / Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="thuong-duoc-tao-tu-dong-tu-tieu-de"
                  className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-600 bg-slate-50 transition-all"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Đoạn trích dẫn (Excerpt)
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y transition-all"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="Tóm tắt ngắn gọn nội dung để thu hút người đọc (Hiển thị ở trang chủ và danh sách bài viết)..."
                />
              </div>
            </div>
          </div>

          {/* Card 2: Trình soạn thảo văn bản */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-6 pb-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <FileText size={18} className="text-blue-600" />
              <h2 className="font-display font-bold text-slate-900 text-lg">
                Nội dung bài viết <span className="text-red-500">*</span>
              </h2>
            </div>
            <div
              className="border rounded-xl overflow-hidden shadow-inner"
              style={{ borderColor: 'var(--border)' }}
            >
              <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
                placeholder="Bắt đầu câu chuyện của bạn tại đây..."
              />
            </div>
          </div>

          {/* Card 3: Cấu hình SEO (Đặt dưới cùng Cột Trái) */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-6 pb-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Globe size={18} className="text-emerald-600" />
              <h2 className="font-display font-bold text-slate-900 text-lg">
                Tối ưu máy chủ tìm kiếm (SEO)
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 flex justify-between mb-1.5">
                  <span>Thẻ tiêu đề (Meta Title)</span>
                  <span
                    className={`text-xs ${(formData.metaTitle?.length ?? 0) > 60 ? 'text-red-500' : 'text-slate-400'}`}
                  >
                    {formData.metaTitle?.length ?? 0} / 60
                  </span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Ghi đè tiêu đề gốc nếu muốn hiển thị khác trên Google..."
                  className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 flex justify-between mb-1.5">
                  <span>Thẻ mô tả (Meta Description)</span>
                  <span
                    className={`text-xs ${(formData.metaDescription?.length ?? 0) > 160 ? 'text-red-500' : 'text-slate-400'}`}
                  >
                    {formData.metaDescription?.length ?? 0} / 160
                  </span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mô tả hấp dẫn người dùng click từ Google..."
                  className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  URL Thẩm quyền (Canonical URL)
                </label>
                <input
                  type="text"
                  name="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={handleChange}
                  placeholder="https://cms.vn/nguon-goc-bai-viet (Chỉ dùng khi copy từ nguồn khác)"
                  className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isIndexable"
                      checked={formData.isIndexable}
                      onChange={handleCheckbox}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 transition-all cursor-pointer peer"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                      Index
                    </span>
                    <p className="text-xs text-slate-400">Cho phép Google lập chỉ mục</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isFollowable"
                      checked={formData.isFollowable}
                      onChange={handleCheckbox}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 transition-all cursor-pointer peer"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                      Follow
                    </span>
                    <p className="text-xs text-slate-400">Bot theo dõi các link trong bài</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHỤ (4 CỘT - SIDEBAR BÊN PHẢI) ================= */}
        <div className="xl:col-span-4 space-y-6">
          {/* Card 4: Kế hoạch xuất bản */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3.5 border-b bg-slate-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <Calendar size={16} className="text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">Kế hoạch xuất bản</h3>
            </div>
            <div className="p-5">
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Ngày giờ lên sóng (Dự kiến)
              </label>
              <input
                type="datetime-local"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
                style={{ borderColor: 'var(--border)' }}
              />
              <p className="text-xs text-slate-400 mt-2">
                Bỏ trống nếu muốn xuất bản ngay sau khi được duyệt.
              </p>
            </div>
          </div>

          {/* Card 5: Phân loại */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3.5 border-b bg-slate-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <LayoutList size={16} className="text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">Phân loại học (Taxonomy)</h3>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Danh mục chính <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value={0} disabled>
                    -- Lựa chọn danh mục --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Tags size={14} /> Thẻ liên quan (Tags)
                </label>
                <div
                  className="px-4 py-2.5 border rounded-xl text-sm text-slate-400 bg-slate-50 border-dashed text-center cursor-not-allowed"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Tính năng gắn thẻ đang bảo trì
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Ảnh đại diện */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3.5 border-b bg-slate-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <ImageIcon size={16} className="text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">Ảnh đại diện (Thumbnail)</h3>
            </div>
            <div className="p-5">
              <div
                className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-3 transition-colors">
                  <ImagePlus size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-blue-700">
                  Tải ảnh lên / Chọn từ Thư viện
                </p>
                <p className="text-[11px] text-slate-400">Định dạng JPG, PNG, WebP (Tối đa 5MB)</p>
              </div>
            </div>
          </div>

          {/* Card 7: Mạng xã hội */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3.5 border-b bg-slate-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <Share2 size={16} className="text-violet-600" />
              <h3 className="font-bold text-slate-900 text-sm">Mạng xã hội (Open Graph)</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Tiêu đề chia sẻ (OG Title)
                </label>
                <input
                  type="text"
                  name="ogTitle"
                  value={formData.ogTitle}
                  onChange={handleChange}
                  placeholder="Tiêu đề hiển thị trên Facebook, Zalo..."
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Mô tả chia sẻ (OG Description)
                </label>
                <textarea
                  name="ogDescription"
                  value={formData.ogDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Mô tả đi kèm khi share link..."
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none transition-all"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Ảnh chia sẻ độc lập
                </label>
                <button
                  className="w-full px-3 py-2 border border-dashed rounded-xl text-xs font-medium text-slate-500 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300 transition-all"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Ghi đè ảnh đại diện (Tùy chọn)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
