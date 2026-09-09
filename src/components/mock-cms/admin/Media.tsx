'use client';

import { useMemo, useState } from 'react';

import MediaHeader from './media/MediaHeader';
import MediaUploadZone from './media/MediaUploadZone';
import MediaToolbar, { MediaFilter } from './media/MediaToolbar';
import MediaGrid from './media/MediaGrid';
import MediaList from './media/MediaList';
import MediaPreview from './media/preview/MediaPreview';

import { useMedia } from './media/hooks/useMedia';
import { Media, ViewMode } from '@/types/media/media';

import '@/components/layout/admin/media_styles/MediaPage.css';

export default function MediaPage() {
  const {
    mediaList,
    search,
    loading,
    uploading,
    uploadFiles,
    deleteMedia,
    deleteMultipleMedia,
    downloadMultipleMedia,
    searchAndFilter,
  } = useMedia();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [fileFilter, setFileFilter] = useState<MediaFilter>('all');

  const [previewFile, setPreviewFile] = useState<Media | null>(null);

  const groupedMedia = useMemo(() => {
    const groups: Record<string, Media[]> = {};

    mediaList.forEach((item) => {
      const key = item.uploadedAt
        ? new Date(item.uploadedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'Không xác định';

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
    });

    return Object.entries(groups);
  }, [mediaList]);

  const handleDownload = (item: Media) => {
    const link = document.createElement('a');

    link.href = `/api/v1/media/${item.mediaId}/download`;

    link.download = item.fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleSearch = (value: string) => {
    searchAndFilter(value, fileFilter);
  };

  const handleFilterChange = (value: MediaFilter) => {
    setFileFilter(value);

    searchAndFilter(search, value);
  };

  return (
    <div className="media-page">
      <MediaHeader count={mediaList.length} />

      <MediaUploadZone uploading={uploading} onUpload={uploadFiles} />

      <MediaToolbar
        search={search}
        viewMode={viewMode}
        fileFilter={fileFilter}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="media-page__status">Đang tải dữ liệu...</div>
      ) : mediaList.length === 0 ? (
        <div className="media-page__status media-page__status--empty">Không có file nào</div>
      ) : viewMode === 'grid' ? (
        <MediaGrid
          groups={groupedMedia}
          onPreview={setPreviewFile}
          onDownload={handleDownload}
          onDelete={deleteMedia}
        />
      ) : (
        <MediaList
          mediaList={mediaList}
          onPreview={setPreviewFile}
          onDownload={handleDownload}
          onDelete={deleteMedia}
          onDeleteMultiple={deleteMultipleMedia}
          onDownloadMultiple={downloadMultipleMedia}
        />
      )}

      {previewFile && (
        <MediaPreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
