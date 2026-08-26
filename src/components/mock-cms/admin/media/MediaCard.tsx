'use client';

import { Download, Eye, Trash2 } from 'lucide-react';

import { Media } from '@/types/media/media';

import {
  getFileName,
  getFileExtension,
  getFileTypeLabel,
  isImage,
  canPreview,
} from '@/utils/media/media-file';

import { formatFileSize } from '@/utils/media/media-format';
import MediaFileIcon from './MediaFileIcon';

import '@/components/layout/admin/media_styles/MediaCard.css';

interface MediaCardProps {
  item: Media;
  onPreview: (item: Media) => void;
  onDownload: (item: Media) => void;
  onDelete: (id: number) => void;
}

export default function MediaCard({ item, onPreview, onDownload, onDelete }: MediaCardProps) {
  const getFileIcon = (size = 90) => {
    const ext = getFileExtension(item);

    if (ext === 'pdf') {
      return (
        <img
          src="/media_icons/pdf.png"
          alt="PDF"
          width={size}
          height={size}
          className="media-card__file-image"
        />
      );
    }

    if (ext === 'doc' || ext === 'docx') {
      return (
        <img
          src="/media_icons/docx.png"
          alt="Word"
          width={size}
          height={size}
          className="media-card__file-image"
        />
      );
    }

    if (ext === 'xls' || ext === 'xlsx' || ext === 'xlsm' || ext === 'csv') {
      return (
        <img
          src="/media_icons/xlsx.png"
          alt="Excel"
          width={size}
          height={size}
          className="media-card__file-image"
        />
      );
    }

    return null;
  };

  return (
    <div className="media-card">
      <div className="media-card__preview">
        {isImage(item) ? (
          <img
            src={`/api/v1/media/${item.mediaId}/view`}
            alt={getFileName(item)}
            className="media-card__image"
          />
        ) : (
          <div className="media-card__file">
            <MediaFileIcon file={item} size={130} className="media-card__icon" />
          </div>
        )}

        <div className="media-card__actions">
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="media-card__action media-card__action--preview"
            title={canPreview(item) ? 'Xem' : 'Thông tin / Download'}
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDownload(item)}
            className="media-card__action media-card__action--download"
            title="Tải xuống"
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item.mediaId)}
            className="media-card__action media-card__action--delete"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="media-card__info">
        <p className="media-card__name" title={getFileName(item)}>
          {getFileName(item)}
        </p>

        <div className="media-card__meta">
          <p className="media-card__size">{formatFileSize(item.fileSize)}</p>

          <span className="media-card__type">{getFileTypeLabel(item)}</span>
        </div>
      </div>
    </div>
  );
}
