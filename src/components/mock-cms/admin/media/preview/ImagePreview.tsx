'use client';

import { Media } from '@/types/media/media';
import '@/components/layout/admin/media_styles/ImagePreview.css';

interface ImagePreviewProps {
  file: Media;
}

export default function ImagePreview({ file }: ImagePreviewProps) {
  const viewUrl = `/api/v1/media/${file.mediaId}/view`;

  return (
    <div className="image-preview-container">
      <img src={viewUrl} alt={file.fileName} className="image-preview" />
    </div>
  );
}
