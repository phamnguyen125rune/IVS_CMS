'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import { RECRUITMENT_CATEGORY_ID } from '@/config/post-sections';
import { categoryService } from '@/services/category.service';
import { postService } from '@/services/post.service';
import { tagService } from '@/services/tag.service';
import type { PostCategory } from '@/types/category.type';
import type { Media, MediaResponse } from '@/types/media.type';
import type { PostStatus, ReqPostCreateDTO, ReqPostUpdateDTO } from '@/types/post.type';
import type { Tag } from '@/types/tag.type';
import { apiFetch, ApiError } from '@/utils/api-client';
import { mediaIdFromUrl, preparePostPayload } from '@/utils/post-payload';

const EMPTY_FORM: ReqPostCreateDTO = {
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
};

export type PostMediaTarget = 'featured' | 'og';

export function usePostEditor() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const submitting = useRef(false);

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState<ReqPostCreateDTO>(EMPTY_FORM);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [mediaTarget, setMediaTarget] = useState<PostMediaTarget>('featured');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [loadingPost, setLoadingPost] = useState(Boolean(id));
  const [savedPostId, setSavedPostId] = useState<number | null>(id);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([categoryService.getAllCategories(), tagService.getAllTags()])
      .then(([fetchedCategories, fetchedTags]) => {
        if (cancelled) return;
        setCategories(fetchedCategories || []);
        setAvailableTags(fetchedTags || []);
        if (!isEditMode && fetchedCategories.length > 0) {
          setFormData((previous) =>
            previous.categoryId === 0
              ? { ...previous, categoryId: fetchedCategories[0].categoryId }
              : previous
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setFormError(error instanceof Error ? error.message : 'Không thể tải danh mục và thẻ.');
        }
      });

    if (isEditMode && id) {
      postService
        .getPostById(id)
        .then((post) => {
          if (cancelled) return;
          const ogImageId = mediaIdFromUrl(post.metadata?.openGraph?.imageUrl);
          const firstMediaId = post.mediaList?.[0]?.id || null;
          const featuredId = firstMediaId;

          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            summary: post.summary || '',
            content: post.content || '',
            categoryId: post.category?.id || 0,
            metaTitle: post.metadata?.title || '',
            metaDescription: post.metadata?.description || '',
            canonicalUrl: post.metadata?.canonicalUrl || '',
            isIndexable: !post.metadata?.robots?.includes('noindex'),
            isFollowable: !post.metadata?.robots?.includes('nofollow'),
            ogTitle: post.metadata?.openGraph?.title || '',
            ogDescription: post.metadata?.openGraph?.description || '',
            featuredMediaId: featuredId,
            ogImageId,
            tagIds: post.tags?.map((tag) => tag.id) || [],
            mediaIds: post.mediaList?.map((media) => media.id) || [],
            publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : '',
          });
          setFeaturedImageUrl(featuredId ? `/api/v1/media/${featuredId}/view` : null);
        })
        .catch((error) => {
          if (!cancelled) {
            setFormError(
              error instanceof Error
                ? error.message
                : 'Không thể tải bài viết. Vui lòng tải lại trang.'
            );
          }
        })
        .finally(() => {
          if (!cancelled) setLoadingPost(false);
        });
    } else {
      setLoadingPost(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const nextValue = name === 'categoryId' ? Number(value) : value;
    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
      ...(name === 'categoryId' && nextValue === RECRUITMENT_CATEGORY_ID ? { summary: '' } : {}),
    }));
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: checked }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      title: value,
      slug: isEditMode ? previous.slug : slugify(value),
    }));
  };

  const setContent = (content: string) => {
    setFormData((previous) => ({ ...previous, content }));
  };

  const toggleTag = (tagId: number) => {
    setFormData((previous) => {
      const selected = previous.tagIds?.includes(tagId);
      return {
        ...previous,
        tagIds: selected
          ? previous.tagIds?.filter((selectedId) => selectedId !== tagId)
          : [...(previous.tagIds || []), tagId],
      };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (
      !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setFormError('Chọn ảnh JPEG, PNG, GIF hoặc WebP không quá 10 MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    setUploadingImage(true);
    setFormError('');

    try {
      const response = await apiFetch<Media | { data: Media }>('/api/v1/media/upload', {
        method: 'POST',
        body: uploadData,
      });
      const result =
        response && typeof response === 'object' && 'data' in response ? response.data : response;
      if (!result?.mediaId) throw new Error('Máy chủ không trả về ID ảnh hợp lệ.');

      setFormData((previous) => ({
        ...previous,
        featuredMediaId: result.mediaId,
        mediaIds: [...new Set([...(previous.mediaIds || []), result.mediaId])],
      }));
      setFeaturedImageUrl(`/api/v1/media/${result.mediaId}/view`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Lỗi khi upload ảnh.');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchMediaLibrary = async () => {
    setLoadingMedia(true);
    setFormError('');
    try {
      const response = await apiFetch<MediaResponse>('/api/v1/media?fileType=image');
      const items = Array.isArray(response) ? response : response.data || response.result || [];
      setMediaItems(Array.isArray(items) ? items : []);
    } catch (error) {
      setMediaItems([]);
      setFormError(error instanceof Error ? error.message : 'Không thể tải thư viện ảnh.');
    } finally {
      setLoadingMedia(false);
    }
  };

  const openMediaLibrary = (target: PostMediaTarget) => {
    setMediaTarget(target);
    setIsMediaModalOpen(true);
    void fetchMediaLibrary();
  };

  const closeMediaLibrary = () => {
    setIsMediaModalOpen(false);
    setMediaTarget('featured');
  };

  const handleSelectFromLibrary = (media: Media) => {
    setFormData((previous) => ({
      ...previous,
      ...(mediaTarget === 'og' ? { ogImageId: media.mediaId } : { featuredMediaId: media.mediaId }),
      mediaIds: [...new Set([...(previous.mediaIds || []), media.mediaId])],
    }));
    if (mediaTarget === 'featured') {
      setFeaturedImageUrl(`/api/v1/media/${media.mediaId}/view`);
    }
    closeMediaLibrary();
  };

  const removeFeaturedImage = () => {
    setFeaturedImageUrl(null);
    setFormData((previous) => ({ ...previous, featuredMediaId: null }));
  };

  const removeOgImage = () => {
    setFormData((previous) => ({ ...previous, ogImageId: null }));
  };

  const submit = async (targetStatus: PostStatus) => {
    if (submitting.current || loadingPost) return;
    if (uploadingContentImage || uploadingImage) {
      setFormError('Vui lòng chờ tải ảnh hoàn tất trước khi lưu bài viết.');
      return;
    }

    submitting.current = true;
    let createdThisAttempt = false;
    setLoading(true);
    setFormError('');

    try {
      const payloadToSubmit = preparePostPayload({
        ...formData,
        summary: formData.categoryId === RECRUITMENT_CATEGORY_ID ? undefined : formData.summary,
      });
      let currentPostId = savedPostId;

      if (currentPostId) {
        const payload: ReqPostUpdateDTO = { ...payloadToSubmit };
        await postService.updatePost(currentPostId, payload);
      } else {
        const createdPost = await postService.createPost(payloadToSubmit);
        currentPostId = createdPost.id;
        setSavedPostId(currentPostId);
        createdThisAttempt = true;
      }

      if (targetStatus === 'PENDING') {
        await postService.changeStatus(currentPostId, 'PENDING');
      }

      navigate('/admin/bai-viet');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `HTTP ${error.status}: ${error.message}`
          : error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi lưu bài viết.';
      setFormError(
        createdThisAttempt
          ? `Bài viết đã được tạo ở dạng nháp nhưng gửi duyệt thất bại: ${message}. Bấm Gửi duyệt để thử lại trên bài vừa tạo.`
          : message
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  const filteredTags = useMemo(
    () =>
      availableTags.filter(
        (tag) =>
          !formData.tagIds?.includes(tag.tagId) &&
          tag.tagName.toLowerCase().includes(tagSearch.trim().toLowerCase())
      ),
    [availableTags, formData.tagIds, tagSearch]
  );

  const selectedTags = useMemo(
    () => availableTags.filter((tag) => formData.tagIds?.includes(tag.tagId)),
    [availableTags, formData.tagIds]
  );

  return {
    id,
    isEditMode,
    categories,
    availableTags,
    formData,
    tagSearch,
    showTagDropdown,
    isMediaModalOpen,
    mediaItems,
    featuredImageUrl,
    formError,
    loadingPost,
    loadingMedia,
    loading,
    uploadingImage,
    uploadingContentImage,
    showSeo,
    isFullscreen,
    filteredTags,
    selectedTags,
    navigate,
    setTagSearch,
    setShowTagDropdown,
    setUploadingContentImage,
    setShowSeo,
    setIsFullscreen,
    handleChange,
    handleCheckbox,
    handleTitleChange,
    setContent,
    toggleTag,
    handleImageUpload,
    openMediaLibrary,
    closeMediaLibrary,
    handleSelectFromLibrary,
    removeFeaturedImage,
    removeOgImage,
    submit,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
