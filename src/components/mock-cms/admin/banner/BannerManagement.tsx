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

  const handleCreateOrUpdate = async (dto: ReqCreateBannerDTO | ReqUpdateBannerDTO) => {
    try {
      setActionLoading(true);
      if ('bannerId' in dto && dto.bannerId) {
        await bannerService.updateBanner(dto.bannerId, dto as ReqUpdateBannerDTO);
      } else {
        await bannerService.createBanner(dto as ReqCreateBannerDTO);
      }
      setIsFormOpen(false);
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      console.error('Lỗi lưu banner:', err);
      alert('Không thể lưu banner. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      // Optimistic update in UI
      setBanners((prev) =>
        prev.map((b) => (b.bannerId === id ? { ...b, isActive: !currentStatus } : b))
      );
      await bannerService.toggleStatus(id, !currentStatus);
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái banner:', err);
      await fetchBanners();
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
      alert('Xóa banner thất bại. Vui lòng thử lại!');
    } finally {
      setActionLoading(false);
    }
  };

  // Stats calculation
  const activeCount = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.filter((b) => !b.isActive).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <LayoutTemplate className="text-blue-500" size={26} />
            Quản lý Banner Trang chính
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tùy biến tiêu đề, hình ảnh, văn bản mô tả, nút kêu gọi hành động và số liệu thống kê.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBanner(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 shrink-0"
        >
          <Plus size={18} />
          Thêm Banner mới
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{totalCount}</div>
            <div className="text-xs text-slate-400">Tổng số Banner</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{activeCount}</div>
            <div className="text-xs text-slate-400">Đang hoạt động trên web</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
            <EyeOff size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-300 font-mono">{inactiveCount}</div>
            <div className="text-xs text-slate-400">Đang tạm ẩn</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm theo tiêu đề, phụ đề..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ACTIVE');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đang bật
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('INACTIVE');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'INACTIVE'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đã ẩn
            </button>
          </div>

          <button
            type="button"
            onClick={fetchBanners}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
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
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <div>
            Trang <span className="font-semibold text-white">{page}</span> / {totalPages} (Tổng{' '}
            {totalCount} banner)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Xem trước Banner Trang chính</h3>
              <button
                type="button"
                onClick={() => setPreviewingBanner(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Xác nhận xóa Banner?</h3>
            <p className="text-xs text-slate-400">
              Banner này sẽ bị xóa hoàn toàn khỏi hệ thống và không còn xuất hiện trên trang chính.
              Bạn có chắc chắn muốn xóa không?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
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
