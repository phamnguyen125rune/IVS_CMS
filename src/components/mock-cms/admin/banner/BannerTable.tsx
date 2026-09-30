'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import type { Banner } from '@/types/banner.type';

interface BannerTableProps {
  banners: Banner[];
  loading: boolean;
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onPreview: (banner: Banner) => void;
}

export default function BannerTable({
  banners,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
}: BannerTableProps) {
  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm">Đang tải danh sách banner...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
          🖼️
        </div>
        <h4 className="text-sm font-semibold text-slate-300 mb-1">Chưa có banner nào</h4>
        <p className="text-xs text-slate-500">
          Hãy nhấn nút &ldquo;+ Thêm Banner mới&rdquo; để tạo banner đầu tiên cho trang chính.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Banner</th>
            <th className="py-3.5 px-4">Vị trí</th>
            <th className="py-3.5 px-4 text-center">Thứ tự</th>
            <th className="py-3.5 px-4 text-center">Nút CTA</th>
            <th className="py-3.5 px-4 text-center">Trạng thái</th>
            <th className="py-3.5 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {banners.map((item) => (
            <tr key={item.bannerId} className="hover:bg-slate-800/40 transition-colors">
              {/* Thumbnail & Title */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 group">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    {item.subtitle && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.subtitle}
                      </span>
                    )}
                    <div className="font-semibold text-white text-sm line-clamp-1">
                      {item.title}
                      {item.highlightText && (
                        <span className="text-blue-400 ml-1.5 font-normal">
                          [{item.highlightText}]
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Position */}
              <td className="py-4 px-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {item.position || 'HOME_HERO'}
                </span>
              </td>

              {/* Order */}
              <td className="py-4 px-4 text-center">
                <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-800/60 text-slate-300">
                  {item.displayOrder}
                </span>
              </td>

              {/* Buttons summary */}
              <td className="py-4 px-4 text-center">
                <div className="flex flex-col items-center gap-1 text-[11px]">
                  {item.primaryBtnText ? (
                    <span className="text-emerald-400 font-medium">✓ {item.primaryBtnText}</span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                  {item.secondaryBtnText && (
                    <span className="text-blue-300">✓ {item.secondaryBtnText}</span>
                  )}
                </div>
              </td>

              {/* Status Toggle Switch */}
              <td className="py-4 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.bannerId, item.isActive)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  {item.isActive ? 'Đang bật' : 'Đã ẩn'}
                </button>
              </td>

              {/* Action Buttons */}
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Xem trước"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.bannerId)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Xóa banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
