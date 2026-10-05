'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { Edit2, Trash2, Eye, LayoutTemplate } from 'lucide-react';
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
      <div
        className="w-full py-16 flex flex-col items-center justify-center rounded-2xl border"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
          style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
        />
        <span className="text-sm font-medium">Đang tải danh sách banner...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div
        className="w-full py-16 flex flex-col items-center justify-center rounded-2xl border text-center p-6"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary-text)',
          }}
        >
          <LayoutTemplate size={24} />
        </div>
        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
          Chưa có banner nào
        </h4>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Hãy nhấn nút &ldquo;+ Thêm Banner mới&rdquo; để tạo banner đầu tiên cho trang chính.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-2xl border shadow-sm"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <table className="w-full text-left text-sm">
        <thead
          className="text-xs font-semibold uppercase tracking-wider border-b"
          style={{
            background: 'var(--surface-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <tr>
            <th className="py-3.5 px-4">Banner</th>
            <th className="py-3.5 px-4 text-center">Thứ tự</th>
            <th className="py-3.5 px-4 text-center">Nút CTA</th>
            <th className="py-3.5 px-4 text-center">Trạng thái</th>
            <th className="py-3.5 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
          {banners.map((item) => (
            <tr
              key={item.bannerId}
              className="transition-colors hover:opacity-90"
              style={{
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              {/* Thumbnail & Title */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="relative w-20 h-14 rounded-xl overflow-hidden border shrink-0 group"
                    style={{
                      background: 'var(--surface-secondary)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    {item.subtitle && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-text)',
                          borderColor: 'var(--primary-soft)',
                        }}
                      >
                        {item.subtitle}
                      </span>
                    )}
                    <div
                      className="font-semibold text-sm line-clamp-1"
                      style={{ color: 'var(--text)' }}
                    >
                      {item.title}
                      {item.highlightText && (
                        <span className="ml-1.5 font-normal" style={{ color: 'var(--primary)' }}>
                          [{item.highlightText}]
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Order */}
              <td className="py-4 px-4 text-center">
                <span
                  className="font-mono text-xs font-semibold px-2 py-1 rounded"
                  style={{
                    background: 'var(--surface-secondary)',
                    color: 'var(--text)',
                  }}
                >
                  {item.displayOrder}
                </span>
              </td>

              {/* Buttons summary */}
              <td className="py-4 px-4 text-center">
                <div className="flex flex-col items-center gap-1 text-[11px]">
                  {item.primaryBtnText ? (
                    <span className="font-medium" style={{ color: 'var(--success)' }}>
                      ✓ {item.primaryBtnText}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                  {item.secondaryBtnText && (
                    <span style={{ color: 'var(--primary-text)' }}>✓ {item.secondaryBtnText}</span>
                  )}
                </div>
              </td>

              {/* Status Toggle Switch */}
              <td className="py-4 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.bannerId, item.isActive)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border"
                  style={
                    item.isActive
                      ? {
                          background: 'var(--success-light)',
                          color: 'var(--success)',
                          borderColor: 'var(--success)',
                        }
                      : {
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-muted)',
                          borderColor: 'var(--border)',
                        }
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: item.isActive ? 'var(--success)' : 'var(--text-muted)',
                    }}
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
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: 'var(--surface-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                    title="Xem trước"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary-text)',
                    }}
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.bannerId)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: 'var(--error-light)',
                      color: 'var(--error)',
                    }}
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
