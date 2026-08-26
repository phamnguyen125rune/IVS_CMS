'use client';

import { Download, Eye, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Media } from '@/types/media/media';
import { getFileName, getFileTypeLabel, isImage } from '@/utils/media/media-file';
import { formatDate, formatFileSize } from '@/utils/media/media-format';
import MediaFileIcon from './MediaFileIcon';

import '@/components/layout/admin/media_styles/MediaList.css';

interface MediaListProps {
  mediaList: Media[];
  onPreview: (item: Media) => void;
  onDownload: (item: Media) => void;
  onDelete: (id: number) => void;
  onDeleteMultiple: (ids: number[]) => Promise<void>;
  onDownloadMultiple: (ids: number[]) => void;
}

export default function MediaList({
  mediaList = [],
  onPreview,
  onDownload,
  onDelete,
  onDeleteMultiple,
  onDownloadMultiple,
}: MediaListProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const currentIds = mediaList.map((item) => item.mediaId);
  const selectedCurrentIds = selectedIds.filter((id) => currentIds.includes(id));

  const allSelected = mediaList.length > 0 && selectedCurrentIds.length === mediaList.length;

  const someSelected =
    selectedCurrentIds.length > 0 && selectedCurrentIds.length < mediaList.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    setSelectedIds(allSelected ? [] : currentIds);
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleDownloadSelected = () => {
    if (selectedCurrentIds.length === 0) return;
    onDownloadMultiple(selectedCurrentIds);
  };

  const handleDeleteSelected = async () => {
    if (selectedCurrentIds.length === 0) return;

    await onDeleteMultiple(selectedCurrentIds);
    setSelectedIds([]);
  };

  return (
    <div className="media-list">
      <div className="media-list__table-wrapper">
        <table className="media-list__table">
          <thead>
            <tr className="media-list__header-row">
              <th className="media-list__checkbox-column">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="media-list__checkbox"
                  aria-label="Chọn tất cả file"
                />
              </th>

              <th className="media-list__header-cell">FILE</th>
              <th className="media-list__header-cell">TÊN TỆP</th>
              <th className="media-list__header-cell">KÍCH THƯỚC</th>
              <th className="media-list__header-cell">NGÀY TẢI</th>

              <th className="media-list__header-cell media-list__header-cell--right">
                <div className="media-list__actions">
                  <button
                    type="button"
                    onClick={handleDownloadSelected}
                    disabled={selectedCurrentIds.length === 0}
                    className="media-list__action media-list__action--download"
                    title="Tải xuống các file đã chọn"
                    aria-label="Tải xuống các file đã chọn"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={selectedCurrentIds.length === 0}
                    className="media-list__action media-list__action--delete"
                    title="Xóa các file đã chọn"
                    aria-label="Xóa các file đã chọn"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {mediaList.length === 0 ? (
              <tr>
                <td colSpan={6} className="media-list__empty">
                  Không có file nào
                </td>
              </tr>
            ) : (
              mediaList.map((item) => (
                <tr key={item.mediaId} className="media-list__row">
                  <td className="media-list__cell">
                    <input
                      type="checkbox"
                      checked={selectedCurrentIds.includes(item.mediaId)}
                      onChange={() => handleSelectOne(item.mediaId)}
                      className="media-list__checkbox"
                      aria-label={`Chọn ${getFileName(item)}`}
                    />
                  </td>

                  <td className="media-list__cell">
                    <div className="media-list__file-preview">
                      {isImage(item) ? (
                        <img
                          src={`/api/v1/media/${item.mediaId}/view`}
                          alt={getFileName(item)}
                          className="media-list__image"
                        />
                      ) : (
                        <MediaFileIcon file={item} size={40} />
                      )}
                    </div>
                  </td>

                  <td className="media-list__name-cell">
                    <div className="media-list__name-wrapper">
                      <p className="media-list__file-name" title={getFileName(item)}>
                        {getFileName(item)}
                      </p>
                      <span className="media-list__type">{getFileTypeLabel(item)}</span>
                    </div>
                  </td>

                  <td className="media-list__cell media-list__text">
                    {formatFileSize(item.fileSize)}
                  </td>

                  <td className="media-list__cell media-list__text">
                    {formatDate(item.uploadedAt)}
                  </td>

                  <td className="media-list__cell">
                    <div className="media-list__actions">
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="media-list__action media-list__action--preview"
                        title="Xem"
                        aria-label={`Xem ${getFileName(item)}`}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownload(item)}
                        className="media-list__action media-list__action--download"
                        title="Tải xuống"
                        aria-label={`Tải xuống ${getFileName(item)}`}
                      >
                        <Download size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item.mediaId)}
                        className="media-list__action media-list__action--delete"
                        title="Xóa"
                        aria-label={`Xóa ${getFileName(item)}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
