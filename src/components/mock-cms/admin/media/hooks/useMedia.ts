'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api-client';
import { Media, MediaResponse } from '@/types/media/media';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useMedia() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [search, setSearch] = useState('');
  const [fileFilter, setFileFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async (keyword = search, filter = fileFilter) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (keyword.trim()) params.set('keyword', keyword.trim());
      if (filter && filter !== 'all') params.set('fileType', filter);

      const query = params.toString();
      const url = `/api/v1/media${query ? `?${query}` : ''}`;

      const data = await apiFetch<MediaResponse>(url);

      if (Array.isArray(data)) {
        setMediaList(data);
      } else if (Array.isArray(data.result)) {
        setMediaList(data.result);
      } else if (Array.isArray(data.data)) {
        setMediaList(data.data);
      } else {
        setMediaList([]);
      }

      setSearch(keyword);
      setFileFilter(filter);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const oversizedFiles: File[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      alert(
        `Các file sau vượt quá giới hạn 10MB:\n\n${oversizedFiles.map((file) => file.name).join('\n')}`
      );
    }

    if (validFiles.length === 0) return;

    try {
      setUploading(true);

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);

        await apiFetch('/api/v1/media/upload', {
          method: 'POST',
          body: formData,
        });
      }

      await loadMedia(search, fileFilter);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? `Upload thất bại: ${error.message}` : 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa file này?')) return;

    try {
      await apiFetch(`/api/v1/media/${id}`, {
        method: 'DELETE',
      });

      await loadMedia(search, fileFilter);

      alert('Xóa file thành công!');
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? `Xóa file thất bại: ${error.message}` : 'Xóa file thất bại');
    }
  };

  const deleteMultipleMedia = async (ids: number[]) => {
    if (ids.length === 0) return;

    if (!window.confirm(`Bạn có chắc muốn xóa ${ids.length} file đã chọn?`)) return;

    try {
      setLoading(true);

      for (const id of ids) {
        await apiFetch(`/api/v1/media/${id}`, {
          method: 'DELETE',
        });
      }

      await loadMedia(search, fileFilter);

      alert(`Đã xóa ${ids.length} file thành công!`);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? `Xóa file thất bại: ${error.message}` : 'Xóa file thất bại');
    } finally {
      setLoading(false);
    }
  };

  const downloadMultipleMedia = (ids: number[]) => {
    if (ids.length === 0) return;

    const selectedFiles = mediaList.filter((item) => ids.includes(item.mediaId));

    selectedFiles.forEach((item) => {
      const link = document.createElement('a');
      link.href = `/api/v1/media/${item.mediaId}/download`;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const searchAndFilter = async (keyword: string, filter: string) => {
    await loadMedia(keyword, filter);
  };

  useEffect(() => {
    loadMedia('', 'all');
  }, []);

  return {
    mediaList,
    search,
    fileFilter,
    loading,
    uploading,
    loadMedia,
    uploadFiles,
    deleteMedia,
    deleteMultipleMedia,
    downloadMultipleMedia,
    searchAndFilter,
  };
}
