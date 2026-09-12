/* eslint-disable @next/next/no-img-element */

import { FolderOpen, X } from 'lucide-react';

import type { Media } from '@/types/media.type';

interface PostMediaLibraryModalProps {
  open: boolean;
  loading: boolean;
  items: Media[];
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export default function PostMediaLibraryModal({
  open,
  loading,
  items,
  onClose,
  onSelect,
}: PostMediaLibraryModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: 'var(--surface)' }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <FolderOpen size={20} style={{ color: 'var(--primary)' }} />

            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Thư viện Media
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-[var(--hover)]"
            style={{
              background: 'var(--surface-tertiary)',
              color: 'var(--text-muted)',
            }}
            aria-label="Đóng thư viện media"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ background: 'var(--surface-secondary)' }}
        >
          {loading ? (
            <div
              className="flex flex-col items-center justify-center gap-2 py-10"
              style={{ color: 'var(--text-muted)' }}
            >
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
              />

              <span className="text-sm font-medium">Đang tải thư viện...</span>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {items.map((media) => (
                <button
                  type="button"
                  key={media.mediaId}
                  onClick={() => onSelect(media)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm transition-all hover:ring-2 hover:ring-[var(--primary)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <img
                    src={media.filePath}
                    alt={media.fileName}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />

                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                    <span className="text-xs font-semibold text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                      Chọn
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed py-10 text-center"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Chưa có file ảnh nào trong thư viện.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
