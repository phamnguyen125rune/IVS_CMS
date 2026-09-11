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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <FolderOpen size={20} className="text-blue-600" />
            <h2 className="font-bold text-slate-900 text-lg">Thư viện Media</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full"
            aria-label="Đóng thư viện media"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="text-center py-10 text-slate-500 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Đang tải thư viện...</span>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {items.map((media) => (
                <button
                  type="button"
                  key={media.mediaId}
                  onClick={() => onSelect(media)}
                  className="aspect-square rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group relative shadow-sm"
                >
                  <img
                    src={media.filePath}
                    alt={media.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 drop-shadow-md">Chọn</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed">Chưa có file ảnh nào trong thư viện.</div>
          )}
        </div>
      </div>
    </div>
  );
}
