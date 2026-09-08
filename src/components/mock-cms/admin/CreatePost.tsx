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
  UploadCloud,
  X,
  FolderOpen
} from 'lucide-react';
import dynamic from 'next/dynamic';

import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import { apiFetch } from '@/utils/api-client';
import { ReqPostCreateDTO, ReqPostUpdateDTO, PostStatus } from '@/types/post.type';
import { PostCategory } from '@/types/category.type';
import { Tag } from '@/types/tag.type';

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
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // State tìm kiếm Tag
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // State Thư viện Media
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const ogDescriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Tự động co giãn textarea
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

  // Load danh mục và tag có sẵn
  useEffect(() => {
    Promise.all([
      categoryService.getAllCategories(),
      tagService.getAllTags()
    ]).then(([cats, fetchedTags]) => {
      setCategories(cats);
      setAvailableTags(fetchedTags);
      if (!isEditMode && cats.length > 0 && formData.categoryId === 0) {
        setFormData((prev) => ({ ...prev, categoryId: cats[0].categoryId }));
      }
    }).catch((err) => console.error('Lỗi tải dữ liệu nền:', err));

    if (isEditMode && id) {
      postService
        .getPostById(id)
        .then((postData: any) => {
          setFormData({
            title: postData.title || '',
            slug: postData.slug || '',
            summary: postData.summary || '',
            content: postData.content || '',
            categoryId: postData.category?.id || 0,
            metaTitle: postData.metadata?.title || '',
            metaDescription: postData.metadata?.description || '',
            canonicalUrl: postData.metadata?.canonicalUrl || '',
            isIndexable: !postData.metadata?.robots?.includes('noindex'),
            isFollowable: !postData.metadata?.robots?.includes('nofollow'),
            ogTitle: postData.metadata?.openGraph?.title || '',
            ogDescription: postData.metadata?.openGraph?.description || '',
            featuredMediaId: postData.mediaList?.[0]?.id || null,
            ogImageId: null,
            tagIds: postData.tags?.map((t: any) => t.id) || [],
            mediaIds: postData.mediaList?.map((m: any) => m.id) || [],
            publishedAt: postData.publishedAt
              ? new Date(postData.publishedAt).toISOString().slice(0, 16)
              : '',
          });

          if (postData.metadata?.openGraph?.imageUrl) {
            setFeaturedImageUrl(postData.metadata.openGraph.imageUrl);
          } else if (postData.mediaList && postData.mediaList.length > 0) {
            setFeaturedImageUrl(postData.mediaList[0].filePath);
          }
        })
        .catch((err) => console.error('Lỗi lấy chi tiết bài viết:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const toggleTag = (tagId: number) => {
    setFormData((prev) => {
      const isSelected = prev.tagIds?.includes(tagId);
      return {
        ...prev,
        tagIds: isSelected
          ? prev.tagIds?.filter((id) => id !== tagId)
          : [...(prev.tagIds || []), tagId],
      };
    });
  };

  // Upload Ảnh đại diện (Trực tiếp)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await apiFetch<any>('/api/v1/media/upload', {
        method: 'POST',
        body: uploadData,
      });

      // Bóc tách data nếu BE bọc trong { data: ... }
      const result = (res && typeof res === 'object' && 'data' in res) ? res.data : res;

      setFormData((prev) => ({
        ...prev,
        featuredMediaId: result.mediaId,
        mediaIds: [...(prev.mediaIds || []), result.mediaId]
      }));
      setFeaturedImageUrl(result.filePath);

    } catch (error) {
      console.error(error);
      alert('Lỗi khi upload ảnh!');
    } finally {
      setUploadingImage(false);
    }
  };

  // Load Thư viện Media
  const fetchMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const res = await apiFetch<any>('/api/v1/media?fileType=image');

      // Bóc tách data nếu BE bọc trong { data: ... }
      const items = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
      setMediaItems(Array.isArray(items) ? items : []);

    } catch (error: any) {
      console.error('Lỗi lấy danh sách media:', error);
      alert(error.message || 'Không thể tải thư viện ảnh.');
    } finally {
      setLoadingMedia(false);
    }
  };

  // Chọn Ảnh từ Thư viện
  const handleSelectFromLibrary = (media: any) => {
    setFormData((prev) => ({
      ...prev,
      featuredMediaId: media.mediaId,
      mediaIds: [...(prev.mediaIds || []), media.mediaId]
    }));
    setFeaturedImageUrl(media.filePath);
    setIsMediaModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus: PostStatus) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content || !formData.categoryId) {
      alert('Vui lòng nhập Tiêu đề, Slug, Nội dung và chọn Danh mục!');
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
        if (targetStatus === 'PENDING') {
          await postService.changeStatus(currentPostId, targetStatus);
        }
      } else {
        const createdPost = await postService.createPost(payloadToSubmit);
        currentPostId = createdPost.id;
        if (targetStatus === 'PENDING') {
          await postService.changeStatus(currentPostId, targetStatus);
        }
      }

      navigate('/admin/bai-viet');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi lưu bài viết!');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      !formData.tagIds?.includes(tag.tagId) &&
      tag.tagName.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const selectedTags = availableTags.filter((tag) => formData.tagIds?.includes(tag.tagId));

  return (
    <div className="p-6 max-w-[1400px] mx-auto pb-24 relative">
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
            disabled={loading || uploadingImage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <Save size={15} className={loading ? 'animate-pulse' : ''} /> Lưu nháp
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'PENDING')}
            disabled={loading || uploadingImage}
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
                    placeholder="Tóm tắt ngắn bài viết..."
                    className="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none overflow-hidden transition-all placeholder:text-slate-400 block leading-relaxed"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div
                  className={`sticky-editor-container ${isFullscreen ? 'fullscreen-editor' : ''}`}
                >
                  <RichTextEditor
                    value={formData.content}
                    onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
                    placeholder="Bắt đầu nội dung bài viết ở đây..."
                  />
                </div>

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
                    placeholder="Ghi đè tiêu đề trên Google..."
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
                    Index (Cho phép chỉ mục)
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

        {/* ================= CỘT PHỤ (SIDEBAR) ================= */}
        <div className="xl:col-span-4 space-y-5">
          {/* Phân loại & Tags */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <LayoutList size={16} className="text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">Phân loại</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Danh mục chính</label>
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
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
                  <Tags size={13} /> Thẻ bài viết (Tags)
                </label>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.tagId}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium transition-colors"
                      >
                        {tag.tagName}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag.tagId)}
                          className="text-blue-400 hover:text-red-500 transition-colors"
                          title="Gỡ thẻ"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    onFocus={() => setShowTagDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                    placeholder="Tìm và chọn thẻ..."
                    className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                    style={{ borderColor: 'var(--border)' }}
                  />

                  {showTagDropdown && (
                    <div
                      className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag) => (
                          <button
                            key={tag.tagId}
                            type="button"
                            onClick={() => {
                              toggleTag(tag.tagId);
                              setTagSearch('');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                          >
                            <span>{tag.tagName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{tag.slug}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-400 italic text-center bg-slate-50">
                          {availableTags.length === 0 ? 'Hệ thống chưa có thẻ nào.' : 'Không tìm thấy thẻ phù hợp.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ảnh đại diện (Tích hợp Media Library) */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center justify-between mb-4 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-slate-600" />
                <h3 className="font-bold text-slate-900 text-sm">Ảnh đại diện</h3>
              </div>
              {featuredImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImageUrl(null);
                    setFormData(prev => ({ ...prev, featuredMediaId: null }));
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Xóa
                </button>
              )}
            </div>

            {featuredImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredImageUrl}
                alt="Preview"
                className="w-full aspect-video object-cover rounded-xl border mb-2"
              />
            ) : (
              <div
                className="px-3 py-6 border rounded-xl bg-slate-50 border-dashed text-center flex flex-col items-center justify-center gap-3 mb-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <UploadCloud size={24} className="text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Chọn ảnh cho bài viết</span>
                <div className="flex gap-2 mt-1">
                  <label className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                    Tải lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMediaModalOpen(true);
                      fetchMediaLibrary();
                    }}
                    className="px-3 py-1.5 bg-white border text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Thư viện
                  </button>
                </div>
              </div>
            )}

            {uploadingImage && (
              <div className="text-center mt-2">
                <span className="text-xs font-semibold text-blue-600 animate-pulse">Đang tải lên...</span>
              </div>
            )}
          </div>

          {/* Lịch xuất bản */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Calendar size={16} className="text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm">Lịch xuất bản</h3>
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
                Bỏ trống nếu muốn xuất bản ngay khi được duyệt
              </p>
            </div>
          </div>

          {/* Mạng xã hội */}
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
                  Tiêu đề
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
                  Mô tả
                </label>
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
                  placeholder="Mô tả ngắn..."
                  className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-violet-500 resize-none overflow-hidden transition-all placeholder:text-slate-400 block leading-relaxed"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL MEDIA LIBRARY ================= */}
      {isMediaModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsMediaModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <FolderOpen size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Thư viện Media</h3>
              </div>
              <button onClick={() => setIsMediaModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {loadingMedia ? (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Đang tải thư viện...</span>
                </div>
              ) : mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {mediaItems.map(media => (
                    <div
                      key={media.mediaId}
                      onClick={() => handleSelectFromLibrary(media)}
                      className="aspect-square rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group relative shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={media.filePath} alt={media.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">Chọn</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed">
                  Chưa có file ảnh nào trong thư viện.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}