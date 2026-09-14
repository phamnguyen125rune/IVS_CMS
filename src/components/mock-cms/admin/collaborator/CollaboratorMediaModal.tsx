'use client';

import { X } from 'lucide-react';

import type { Media } from '@/types/collaborator.type';

interface Props {
  mediaList: Media[];
  loading: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export default function CollaboratorMediaModal({ mediaList, loading, onClose, onSelect }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="media-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Chọn ảnh từ Media</h2>

            <p>Chọn một hình ảnh đã có trong Media</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="media-loading">Đang tải Media...</div>
        ) : mediaList.length === 0 ? (
          <div className="media-empty">Chưa có hình ảnh nào trong Media</div>
        ) : (
          <div className="media-grid">
            {mediaList.map((media) => (
              <button
                key={media.mediaId}
                type="button"
                className="media-item"
                onClick={() => onSelect(media)}
              >
                <div className="media-item-image">
                  <img src={media.filePath} alt={media.fileName} />
                </div>

                <div className="media-item-name" title={media.fileName}>
                  {media.fileName}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
