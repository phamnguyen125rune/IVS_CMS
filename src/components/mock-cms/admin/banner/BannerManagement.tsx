'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  LayoutTemplate,
  Layers,
  CheckCircle2,
  EyeOff,
  X,
} from 'lucide-react';
import type { Banner, ReqCreateBannerDTO, ReqUpdateBannerDTO } from '@/types/banner.type';
import { bannerService } from '@/services/banner.service';
import BannerTable from './BannerTable';
import BannerFormModal from './BannerFormModal';
import BannerLivePreview from './BannerLivePreview';

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [previewingBanner, setPreviewingBanner] = useState<Banner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const isActiveParam =
        statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined;

      const res = await bannerService.getAllBanners({
        search: search.trim() || undefined,
        isActive: isActiveParam,
        page,
        size: 10,
      });

      if (res?.data) {
        setBanners(res.data.result || []);
        setTotalPages(res.data.meta?.pages || 1);
        setTotalCount(res.data.meta?.total || 0);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách banner:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreateOrUpdate = async (data: ReqCreateBannerDTO | ReqUpdateBannerDTO) => {
    try {
      setActionLoading(true);
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.bannerId, {
          ...data,
          bannerId: editingBanner.bannerId,
        });
      } else {
        await bannerService.createBanner(data as ReqCreateBannerDTO);
      }
      setIsFormOpen(false);
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      console.error('Lỗi lưu banner:', err);
      alert('Không thể lưu banner. Vui lòng kiểm tra lại quyền hạn hoặc dữ liệu.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setActionLoading(true);
      await bannerService.deleteBanner(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchBanners();
    } catch (err) {
      console.error('Lỗi xóa banner:', err);
      alert('Không thể xóa banner.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await bannerService.toggleStatus(id, !currentStatus);
      setBanners((prev) =>
        prev.map((b) => (b.bannerId === id ? { ...b, isActive: !currentStatus } : b))
      );
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      alert('Không thể cập nhật trạng thái.');
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.filter((b) => !b.isActive).length;

  return (
    <div
      className="p-6 space-y-6 min-h-full"
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold font-display tracking-tight flex items-center gap-2.5"
            style={{ color: 'var(--text)' }}
          >
            <LayoutTemplate style={{ color: 'var(--primary)' }} size={24} />
            Quản lý Banner Trang chính
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Tùy biến toàn bộ nội dung, ảnh bìa, văn bản nổi bật, nút kêu gọi hành động và số liệu
            thống kê.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBanner(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 shadow-sm shrink-0"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Plus size={18} />
          Thêm Banner mới
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl border p-4 flex items-center gap-4 transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary-text)',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {totalCount}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Tổng số Banner
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 flex items-center gap-4 transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'var(--success-light)',
              color: 'var(--success)',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--success)' }}>
              {activeCount}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Đang hoạt động trên web
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 flex items-center gap-4 transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'var(--surface-secondary)',
              color: 'var(--text-muted)',
            }}
          >
            <EyeOff size={22} />
          </div>
          <div>
            <div
              className="text-2xl font-bold font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              {inactiveCount}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Đang tạm ẩn
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm theo tiêu đề, phụ đề..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-xs outline-none transition-colors"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-xl p-1 text-xs border"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={
                statusFilter === 'ALL'
                  ? {
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ACTIVE');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={
                statusFilter === 'ACTIVE'
                  ? {
                      background: 'var(--success-light)',
                      color: 'var(--success)',
                      fontWeight: 600,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Đang bật
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('INACTIVE');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={
                statusFilter === 'INACTIVE'
                  ? {
                      background: 'var(--surface)',
                      color: 'var(--text-secondary)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Đã ẩn
            </button>
          </div>

          <button
            type="button"
            onClick={fetchBanners}
            className="p-2.5 rounded-xl border transition-colors hover:opacity-80"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
            title="Làm mới"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      <BannerTable
        banners={banners}
        loading={loading}
        onEdit={(banner) => {
          setEditingBanner(banner);
          setIsFormOpen(true);
        }}
        onDelete={(id) => setDeleteConfirmId(id)}
        onToggleStatus={handleToggleStatus}
        onPreview={(banner) => setPreviewingBanner(banner)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-2 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          <div>
            Trang{' '}
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {page}
            </span>{' '}
            / {totalPages} (Tổng {totalCount} banner)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <BannerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBanner(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingBanner}
        loading={actionLoading}
      />

      {/* Standalone Preview Modal */}
      {previewingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="relative w-full max-w-4xl border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                Xem trước Banner Trang chính
              </h3>
              <button
                type="button"
                onClick={() => setPreviewingBanner(null)}
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <BannerLivePreview banner={previewingBanner} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Xác nhận xóa Banner?
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Banner này sẽ bị xóa hoàn toàn khỏi hệ thống và không còn xuất hiện trên trang chính.
              Bạn có chắc chắn muốn xóa không?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl border text-xs font-medium transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'var(--surface)',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--error)',
                }}
              >
                {actionLoading ? 'Đang xóa...' : 'Đồng ý xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
