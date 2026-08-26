'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import {
  ArrowLeft,
  Save,
  Send,
  Globe,
  Share2,
  LayoutList,
  Tags,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Maximize2,
  Minimize2,
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
    <div className="min-h-[500px] border rounded-xl bg-slate-50 animate-pulse flex flex-col items-center justify-center text-slate-400">
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
  const [showSeo, setShowSeo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ref điều khiển chiều cao textarea tiêu đề, tóm tắt & mô tả OG
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const ogDescriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Tự động co giãn chiều cao tiêu đề, tóm tắt và mô tả OG khi tải dữ liệu hoặc đổi chế độ màn hình
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
    if (summaryTextareaRef.current) {
      summaryTextareaRef.current.style.height = 'auto';
      summaryTextareaRef.current.style.height = `${summaryTextareaRef.current.scrollHeight}px`;
    }
    if (ogDescriptionTextareaRef.current) {
      ogDescriptionTextareaRef.current.style.height = 'auto';
      ogDescriptionTextareaRef.current.style.height = `${ogDescriptionTextareaRef.current.scrollHeight}px`;
    }
  }, [formData.title, formData.summary, formData.ogDescription, isFullscreen]);

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
        .then((data: unknown) => {
          const postData = data as Record<string, unknown>;
          const categoryObj = postData.category as { id?: number } | undefined;
          const metadataObj = postData.metadata as
            | {
                title?: string;
                description?: string;
                canonicalUrl?: string;
                robots?: string;
                openGraph?: { title?: string; description?: string };
              }
            | undefined;
          const tagsArr = postData.tags as Array<{ id: number }> | undefined;
          const mediaArr = postData.mediaList as Array<{ id: number }> | undefined;

          setFormData({
            title: String(postData.title || ''),
            slug: String(postData.slug || ''),
            summary: String(postData.summary || ''),
            content: String(postData.content || ''),
            categoryId: categoryObj?.id || 0,
            metaTitle: metadataObj?.title || '',
            metaDescription: metadataObj?.description || '',
            canonicalUrl: metadataObj?.canonicalUrl || '',
            isIndexable: !metadataObj?.robots?.includes('noindex'),
            isFollowable: !metadataObj?.robots?.includes('nofollow'),
            ogTitle: metadataObj?.openGraph?.title || '',
            ogDescription: metadataObj?.openGraph?.description || '',
            featuredMediaId: (postData.featuredMediaId as number) || null,
            ogImageId: (postData.ogImageId as number) || null,
            tagIds: tagsArr?.map((t) => t.id) || [],
            mediaIds: mediaArr?.map((m) => m.id) || [],
            publishedAt: postData.publishedAt
              ? new Date(String(postData.publishedAt)).toISOString().slice(0, 16)
              : '',
          });
        })
        .catch((err) => console.error('Lỗi tải chi tiết bài viết:', err));
    }
  }, [id, isEditMode, formData.categoryId]);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu bài viết!';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto pb-24">
      {/* CSS cố định Toolbar của Editor */}
      <style jsx global>{`
        .sticky-editor-container .ck-editor__top {
          position: sticky !important;
          top: 0 !important;
          z-index: 20 !important;
          background: #ffffff !important;
        }
        .sticky-editor-container .ck-toolbar {
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04) !important;
        }
        .sticky-editor-container .ck-content {
          min-height: 450px !important;
          max-height: 600px !important;
          overflow-y: auto !important;
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
        .fullscreen-editor .ck-content {
          max-height: calc(100vh - 420px) !important;
          min-height: 450px !important;
        }
      `}</style>

      {/* Action Bar Header */}
      <div className="py-2 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded-xl hover:bg-slate-100 text-slate-600 bg-white shadow-sm transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 leading-none">
              {isEditMode ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isEditMode ? `ID: #${id}` : 'Tập trung sáng tạo nội dung'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <Save size={15} className={loading ? 'animate-pulse' : ''} /> Lưu nháp
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'PENDING')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 shadow transition-all"
            style={{ background: 'var(--primary)' }}
          >
            <Send size={15} className={loading ? 'animate-bounce' : ''} /> Gửi duyệt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ================= CỘT CHÍNH (WRITING CANVAS) ================= */}
        <div className="xl:col-span-8 space-y-5">
          <div
            className={
              isFullscreen
                ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 flex flex-col justify-center items-center'
                : 'bg-white rounded-2xl border shadow-sm p-6 sm:p-8 relative'
            }
            style={!isFullscreen ? { borderColor: 'var(--border)' } : {}}
          >
            <div
              className={
                isFullscreen
                  ? 'bg-white w-full max-w-5xl h-full rounded-2xl shadow-2xl border flex flex-col overflow-hidden'
                  : 'w-full'
              }
              style={isFullscreen ? { borderColor: 'var(--border)' } : {}}
            >
              {isFullscreen && (
                <div
                  className="px-6 py-3.5 border-b flex items-center justify-between bg-slate-50/80"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Chế độ tập trung soạn thảo
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleSubmit(e, 'DRAFT')}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      Lưu nháp
                    </button>
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <Minimize2 size={14} /> Thu nhỏ
                    </button>
                  </div>
                </div>
              )}

              <div
                className={
                  isFullscreen ? 'flex-1 overflow-y-auto p-6 sm:p-10 space-y-4' : 'space-y-4'
                }
              >
                {/* Input Tiêu đề tự co giãn chiều cao và xuống dòng */}
                <div>
                  <textarea
                    ref={titleTextareaRef}
                    name="title"
                    value={formData.title}
                    onChange={(e) => {
                      handleTitleChange(e);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={1}
                    placeholder="Tiêu đề bài viết..."
                    className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 outline-none border-b pb-2 focus:border-blue-500 transition-colors resize-none overflow-hidden leading-snug block"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                {/* Slug */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>slug:</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="duong-dan-tinh"
                    className="flex-1 px-2.5 py-1 bg-slate-50 border rounded-lg text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                {/* Tóm tắt tự co giãn chiều cao và xuống dòng */}
                <div>
                  <textarea
                    ref={summaryTextareaRef}
                    name="summary"
                    value={formData.summary}
                    onChange={(e) => {
                      handleChange(e);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={2}
                    placeholder="Tóm tắt ngắn gọn bài viết..."
                    className="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none overflow-hidden transition-all placeholder:text-slate-400 block leading-relaxed"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                {/* Khung Editor kèm class cố định Toolbar */}
                <div
                  className={`sticky-editor-container ${isFullscreen ? 'fullscreen-editor' : ''}`}
                >
                  <RichTextEditor
                    value={formData.content}
                    onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
                    placeholder="Bắt đầu nội dung bài viết tại đây..."
                  />
                </div>

                {/* Nút mở rộng chế độ toàn màn hình */}
                {!isFullscreen && (
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="w-full mt-2 py-2.5 px-4 bg-slate-50 hover:bg-blue-50/60 border border-dashed hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Maximize2 size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Mở rộng trình soạn thảo (Toàn màn hình)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cấu hình SEO */}
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/60 hover:bg-slate-100/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-emerald-600" />
                <span className="font-display font-bold text-slate-800 text-sm">
                  Cấu hình SEO & Máy chủ tìm kiếm
                </span>
              </div>
              {showSeo ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </button>

            {showSeo && (
              <div className="p-6 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1.5">
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
                    placeholder="Ghi đè tiêu đề hiển thị trên Google..."
                    className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1.5">
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
                    rows={2}
                    placeholder="Mô tả tóm tắt trên kết quả tìm kiếm..."
                    className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    URL Thẩm quyền (Canonical URL)
                  </label>
                  <input
                    type="text"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none font-mono focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="isIndexable"
                      checked={formData.isIndexable}
                      onChange={handleCheckbox}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300"
                    />
                    Index (Cho phép lập chỉ mục)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="isFollowable"
                      checked={formData.isFollowable}
                      onChange={handleCheckbox}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300"
                    />
                    Follow (Theo dõi liên kết)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= CỘT PHỤ (SIDEBAR CẤU HÌNH BÊN PHẢI) ================= */}
        <div className="xl:col-span-4 space-y-5">
          {/* Card 1: Danh mục */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <LayoutList size={16} className="text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">Danh mục bài viết</h3>
            </div>
            <div className="space-y-4">
              <div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value={0} disabled>
                    -- Chọn danh mục --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1.5">
                  <Tags size={13} /> Thẻ bài viết (Tags)
                </label>
                <div
                  className="px-3 py-2 border rounded-xl text-xs text-slate-400 bg-slate-50 border-dashed text-center cursor-not-allowed"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Tính năng gắn thẻ đang bảo trì
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ảnh đại diện (Trạng thái bảo trì) */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <ImageIcon size={16} className="text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">Ảnh đại diện</h3>
            </div>
            <div
              className="px-3 py-6 border rounded-xl text-xs text-slate-400 bg-slate-50 border-dashed text-center cursor-not-allowed flex flex-col items-center justify-center gap-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <ImageIcon size={20} className="text-slate-300" />
              <span>Tính năng tải ảnh đại diện đang bảo trì</span>
            </div>
          </div>

          {/* Card 3: Lên lịch xuất bản */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Calendar size={16} className="text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">Lên lịch xuất bản</h3>
            </div>
            <div>
              <input
                type="datetime-local"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                style={{ borderColor: 'var(--border)' }}
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Bỏ trống nếu muốn xuất bản ngay khi được duyệt.
              </p>
            </div>
          </div>

          {/* Card 4: Mạng xã hội */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Share2 size={16} className="text-violet-600" />
              <h3 className="font-bold text-slate-900 text-sm">Mạng xã hội (OG)</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Tiêu đề OG
                </label>
                <input
                  type="text"
                  name="ogTitle"
                  value={formData.ogTitle}
                  onChange={handleChange}
                  placeholder="Tiêu đề khi share FB/Zalo..."
                  className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-violet-500"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mô tả OG
                </label>
                {/* Mô tả OG tự co giãn chiều cao và xuống dòng */}
                <textarea
                  ref={ogDescriptionTextareaRef}
                  name="ogDescription"
                  value={formData.ogDescription}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  rows={2}
                  placeholder="Mô tả ngắn gọn..."
                  className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-violet-500 resize-none overflow-hidden transition-all placeholder:text-slate-400 block leading-relaxed"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
