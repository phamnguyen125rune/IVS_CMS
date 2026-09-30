'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import type {
  Banner,
  ReqCreateBannerDTO,
  ReqUpdateBannerDTO,
  StatsItem,
} from '@/types/banner.type';
import BannerLivePreview from './BannerLivePreview';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReqCreateBannerDTO | ReqUpdateBannerDTO) => Promise<void>;
  initialData?: Banner | null;
  loading?: boolean;
}

export default function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: BannerFormModalProps) {
  const [formData, setFormData] = useState<ReqCreateBannerDTO>({
    title: '',
    highlightText: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    mobileImageUrl: '',
    primaryBtnText: '',
    primaryBtnUrl: '',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    statsJson: '[]',
    floatingBadgeText: '',
    position: 'HOME_HERO',
    displayOrder: 0,
    isActive: true,
  });

  const [stats, setStats] = useState<StatsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        highlightText: initialData.highlightText || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        mobileImageUrl: initialData.mobileImageUrl || '',
        primaryBtnText: initialData.primaryBtnText || '',
        primaryBtnUrl: initialData.primaryBtnUrl || '',
        secondaryBtnText: initialData.secondaryBtnText || '',
        secondaryBtnUrl: initialData.secondaryBtnUrl || '',
        statsJson: initialData.statsJson || '[]',
        floatingBadgeText: initialData.floatingBadgeText || '',
        position: initialData.position || 'HOME_HERO',
        displayOrder: initialData.displayOrder ?? 0,
        isActive: initialData.isActive ?? true,
      });

      try {
        if (initialData.statsJson) {
          setStats(JSON.parse(initialData.statsJson));
        } else {
          setStats([]);
        }
      } catch {
        setStats([]);
      }
    } else {
      setFormData({
        title: '',
        highlightText: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        mobileImageUrl: '',
        primaryBtnText: '',
        primaryBtnUrl: '',
        secondaryBtnText: '',
        secondaryBtnUrl: '',
        statsJson: '[]',
        floatingBadgeText: '',
        position: 'HOME_HERO',
        displayOrder: 0,
        isActive: true,
      });
      setStats([
        { num: '500+', label: 'Khách hàng' },
        { num: '200+', label: 'Dự án hoàn thành' },
        { num: '10+', label: 'Năm kinh nghiệm' },
      ]);
    }
  }, [initialData, isOpen]);

  // Sync stats array to statsJson in formData
  const updateStats = (newStats: StatsItem[]) => {
    setStats(newStats);
    setFormData((prev) => ({
      ...prev,
      statsJson: JSON.stringify(newStats),
    }));
  };

  const handleAddStat = () => {
    updateStats([...stats, { num: '', label: '' }]);
  };

  const handleRemoveStat = (index: number) => {
    updateStats(stats.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: 'num' | 'label', value: string) => {
    const updated = [...stats];
    updated[index][field] = value;
    updateStats(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề banner');
      return;
    }
    if (!formData.imageUrl.trim()) {
      alert('Vui lòng nhập đường dẫn hình ảnh banner');
      return;
    }

    if (initialData) {
      await onSubmit({
        ...formData,
        bannerId: initialData.bannerId,
      });
    } else {
      await onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialData ? 'Chỉnh sửa Banner' : 'Thêm mới Banner'}
              </h2>
              <p className="text-xs text-slate-400">
                Tùy chỉnh toàn diện nội dung, hình ảnh, nút bấm và số liệu thống kê
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher on smaller screens / preview tabs */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'form'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nhập liệu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Xem trước
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-medium">
                Mô phỏng hiển thị trên giao diện trang chủ:
              </div>
              <BannerLivePreview banner={formData} />
            </div>
          ) : (
            <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Collapsible/Compact Live Preview previewing on desktop */}
              <div className="hidden lg:block mb-6">
                <BannerLivePreview banner={formData} />
              </div>

              {/* Group 1: Nội dung chính */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  1. Nội dung văn bản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Tiêu đề chính <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Kiến tạo tương lai số"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Chữ tô màu nổi bật (Highlight)
                    </label>
                    <input
                      type="text"
                      value={formData.highlightText}
                      onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                      placeholder="VD: cho doanh nghiệp của bạn"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phụ đề / Huy hiệu trên cùng (Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="VD: Đã phục vụ 500+ doanh nghiệp trên toàn quốc"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Thẻ nổi góc ảnh (Floating Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.floatingBadgeText}
                      onChange={(e) =>
                        setFormData({ ...formData, floatingBadgeText: e.target.value })
                      }
                      placeholder="VD: Đánh giá 5 sao từ 500+ doanh nghiệp"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Đoạn văn bản mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="VD: CMS cung cấp giải pháp công nghệ toàn diện giúp doanh nghiệp tăng trưởng bền vững..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Group 2: Hình ảnh Banner */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  2. Hình ảnh Banner
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Ảnh Desktop (URL) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://... hoặc /uploads/..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Ảnh Mobile (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={formData.mobileImageUrl}
                      onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                      placeholder="URL ảnh crop riêng cho điện thoại..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Nút kêu gọi hành động (CTA) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  3. Nút kêu gọi hành động (Buttons)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Button */}
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-xs font-medium text-slate-200 block">
                      Nút chính (Primary CTA)
                    </span>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tên nút</label>
                      <input
                        type="text"
                        value={formData.primaryBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryBtnText: e.target.value })
                        }
                        placeholder="VD: Tư vấn miễn phí"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Đường dẫn</label>
                      <input
                        type="text"
                        value={formData.primaryBtnUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryBtnUrl: e.target.value })
                        }
                        placeholder="VD: /lien-he"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Secondary Button */}
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-xs font-medium text-slate-200 block">
                      Nút phụ (Secondary CTA)
                    </span>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tên nút</label>
                      <input
                        type="text"
                        value={formData.secondaryBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryBtnText: e.target.value })
                        }
                        placeholder="VD: Xem dự án"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Đường dẫn</label>
                      <input
                        type="text"
                        value={formData.secondaryBtnUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryBtnUrl: e.target.value })
                        }
                        placeholder="VD: /du-an"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4: Khối số liệu thống kê (Stats Counter) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    4. Số liệu thống kê đính kèm (Stats)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors"
                  >
                    <Plus size={14} /> Thêm chỉ số
                  </button>
                </div>

                <div className="space-y-2.5">
                  {stats.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      Chưa có số liệu thống kê nào. Nhấn &quot;+ Thêm chỉ số&quot; để thêm.
                    </p>
                  ) : (
                    stats.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={s.num}
                          onChange={(e) => handleStatChange(idx, 'num', e.target.value)}
                          placeholder="Số liệu (VD: 500+)"
                          className="w-36 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                          placeholder="Nhãn (VD: Khách hàng tin dùng)"
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(idx)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Xóa dòng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Group 5: Cấu hình hiển thị */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  5. Vị trí & Trạng thái
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Vị trí đặt
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="HOME_HERO">Trang chủ - Hero trên cùng (HOME_HERO)</option>
                      <option value="HOME_MIDDLE">Trang chủ - Giữa trang (HOME_MIDDLE)</option>
                      <option value="ABOUT_HERO">Trang Giới thiệu (ABOUT_HERO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Thứ tự hiển thị (Số nhỏ xếp trước)
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-4 sm:pt-0">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
                      />
                      <span className="text-xs font-medium text-slate-200">
                        Kích hoạt hiển thị ngay
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="banner-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : initialData ? 'Lưu thay đổi' : 'Tạo mới Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}
