'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { categoryService } from '@/services/category.service';
import { postService } from '@/services/post.service';
import type { PostCategory } from '@/types/category.type';
import type { PostStatus, ResPostListDTO } from '@/types/post.type';

import { POST_PAGE_SIZE } from '../post.constants';

export function usePostList() {
  const requestId = useRef(0);
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PostStatus | ''>('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletePost, setDeletePost] = useState<ResPostListDTO | null>(null);

  const fetchPosts = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await postService.getPosts(
        {
          keyword: search.trim() || undefined,
          status,
          categoryId,
        },
        page,
        POST_PAGE_SIZE
      );

      if (currentRequest !== requestId.current) return;
      const pages = response.meta?.pages || 0;
      if (pages > 0 && page > pages) {
        setPage(pages);
        return;
      }

      setPosts(response.result || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(pages);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tải danh sách bài viết.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [categoryId, page, search, status]);

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((result) => setCategories(result || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchPosts, 350);
    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  const deleteSelectedPost = async () => {
    if (!deletePost || busy) return;
    setBusy(true);
    setErrorMessage('');
    try {
      await postService.deletePost(deletePost.id);
      setDeletePost(null);
      if (posts.length === 1 && page > 1) setPage((current) => current - 1);
      else await fetchPosts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể xóa bài viết.');
    } finally {
      setBusy(false);
    }
  };

  const changePostStatus = async (
    post: ResPostListDTO,
    action: 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED'
  ) => {
    if (busy) return;

    const message =
      action === 'PENDING'
        ? 'Gửi bài viết này đi kiểm duyệt?'
        : action === 'PUBLISHED'
          ? 'Xuất bản bài viết này?'
          : 'Ngừng xuất bản bài viết này?';
    if (!window.confirm(message)) return;

    setBusy(true);
    setErrorMessage('');
    try {
      if (action === 'UNPUBLISHED') {
        await postService.reviewPost(post.id, {
          action: 'UNPUBLISHED',
          comment: 'Ngừng xuất bản từ trang quản lý bài viết',
        });
      } else {
        await postService.changeStatus(post.id, action);
      }
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không thể thay đổi trạng thái bài viết.'
      );
    } finally {
      setBusy(false);
    }
  };

  const setSearchFilter = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const setStatusFilter = (value: PostStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const setCategoryFilter = (value?: number) => {
    setCategoryId(value);
    setPage(1);
  };

  return {
    posts,
    categories,
    loading,
    busy,
    errorMessage,
    search,
    status,
    categoryId,
    page,
    total,
    totalPages,
    deletePost,
    pageSize: POST_PAGE_SIZE,
    setPage,
    setDeletePost,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
    fetchPosts,
    deleteSelectedPost,
    changePostStatus,
  };
}
