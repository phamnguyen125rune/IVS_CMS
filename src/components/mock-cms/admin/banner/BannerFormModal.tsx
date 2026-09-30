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
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=420&fit=crop&auto=format',
        mobileImageUrl: '',
        primaryBtnText: 'Tư vấn miễn phí',
        primaryBtnUrl: '/lien-he',
        secondaryBtnText: 'Xem dự án',
        secondaryBtnUrl: '/du-an',
        statsJson: '[]',
        floatingBadgeText: 'Đã phục vụ 500+ doanh nghiệp',
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

  const handleStatsChange = (index: number, field: 'num' | 'label', val: string) => {
    const updated = [...stats];
    updated[index][field] = val;
    setStats(updated);
    setFormData((prev) => ({ ...prev, statsJson: JSON.stringify(updated) }));
  };

  const handleAddStat = () => {
    const updated = [...stats, { num: '100+', label: 'Chỉ số mới' }];
    setStats(updated);
    setFormData((prev) => ({ ...prev, statsJson: JSON.stringify(updated) }));
  };

  const handleRemoveStat = (index: number) => {
    const updated = stats.filter((_, i) => i !== index);
    setStats(updated);
    setFormData((prev) => ({ ...prev, statsJson: JSON.stringify(updated) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề chính của Banner.');
      return;
    }
    onSubmit({
      ...formData,
      statsJson: JSON.stringify(stats),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-5xl my-8 border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20"
          style={{
            background: 'var(--surface-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary-text)',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {initialData ? 'Chỉnh sửa Banner' : 'Thêm mới Banner'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Tùy chỉnh toàn diện nội dung, hình ảnh, nút bấm và số liệu thống kê
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher on smaller screens / preview tabs */}
            <div
              className="flex items-center p-0.5 rounded-lg border text-xs"
              style={{
                background: 'var(--surface-tertiary)',
                borderColor: 'var(--border)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-3 py-1.5 rounded-md font-medium transition-colors"
                style={
                  activeTab === 'form'
                    ? {
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }
                    : {
                        color: 'var(--text-secondary)',
                      }
                }
              >
                Nhập liệu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-3 py-1.5 rounded-md font-medium transition-colors"
                style={
                  activeTab === 'preview'
                    ? {
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }
                    : {
                        color: 'var(--text-secondary)',
                      }
                }
              >
                Xem trước
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:opacity-80"
              style={{
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
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
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--primary-text)' }}
                >
                  1. Nội dung văn bản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Tiêu đề chính <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Kiến tạo tương lai số"
                      className={modalInputClass}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Chữ nhấn mạnh (Tô màu nổi bật)
                    </label>
                    <input
                      type="text"
                      value={formData.highlightText}
                      onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                      placeholder="VD: cho doanh nghiệp của bạn"
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Tiêu đề phụ / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="VD: Đã phục vụ 500+ doanh nghiệp trên toàn quốc"
                      className={modalInputClass}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Huy hiệu nổi góc ảnh (Floating Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.floatingBadgeText}
                      onChange={(e) =>
                        setFormData({ ...formData, floatingBadgeText: e.target.value })
                      }
                      placeholder="VD: ⭐ Đánh giá 4.9/5 từ khách hàng"
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Đoạn văn miêu tả chi tiết
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả tóm tắt dịch vụ, sứ mệnh hoặc giá trị cốt lõi..."
                    className={`${modalInputClass} resize-none`}
                  />
                </div>
              </div>

              {/* Group 2: Hình ảnh */}
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--primary-text)' }}
                >
                  2. Hình ảnh Banner
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Ảnh hiển thị chính (Desktop URL)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://... hoặc /images/banner.png"
                      className={modalInputClass}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Ảnh cho điện thoại (Mobile URL - Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={formData.mobileImageUrl}
                      onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                      placeholder="Nếu để trống sẽ tự dùng ảnh Desktop"
                      className={modalInputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Nút kêu gọi hành động (CTA) */}
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--primary-text)' }}
                >
                  3. Nút kêu gọi hành động (Call To Action)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-3.5 rounded-xl border space-y-3"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                      Nút chính (Primary CTA)
                    </div>
                    <div>
                      <label
                        className="block text-[11px] mb-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Chữ trên nút
                      </label>
                      <input
                        type="text"
                        value={formData.primaryBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryBtnText: e.target.value })
                        }
                        placeholder="VD: Tư vấn miễn phí"
                        className={modalInputClass}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[11px] mb-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Đường dẫn (URL)
                      </label>
                      <input
                        type="text"
                        value={formData.primaryBtnUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryBtnUrl: e.target.value })
                        }
                        placeholder="VD: /lien-he"
                        className={modalInputClass}
                      />
                    </div>
                  </div>

                  <div
                    className="p-3.5 rounded-xl border space-y-3"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                      Nút phụ (Secondary CTA)
                    </div>
                    <div>
                      <label
                        className="block text-[11px] mb-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Chữ trên nút
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryBtnText}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryBtnText: e.target.value })
                        }
                        placeholder="VD: Xem dự án"
                        className={modalInputClass}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[11px] mb-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Đường dẫn (URL)
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryBtnUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryBtnUrl: e.target.value })
                        }
                        placeholder="VD: /du-an"
                        className={modalInputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4: Thống kê số liệu (Stats) */}
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--primary-text)' }}
                  >
                    4. Số liệu thống kê chân Banner
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-opacity"
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary-text)',
                    }}
                  >
                    <Plus size={13} /> Thêm số liệu
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl border space-y-2 relative"
                      style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveStat(index)}
                        className="absolute top-2 right-2 p-1 rounded transition-colors hover:opacity-80"
                        style={{
                          background: 'var(--error-light)',
                          color: 'var(--error)',
                        }}
                        title="Xóa"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div>
                        <label
                          className="block text-[11px] mb-1"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Số lượng (Num)
                        </label>
                        <input
                          type="text"
                          value={item.num}
                          onChange={(e) => handleStatsChange(index, 'num', e.target.value)}
                          placeholder="500+"
                          className={`${modalInputClass} !py-1.5 !text-xs font-bold`}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-[11px] mb-1"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Nhãn mô tả (Label)
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleStatsChange(index, 'label', e.target.value)}
                          placeholder="Khách hàng"
                          className={`${modalInputClass} !py-1.5 !text-xs`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 5: Cấu hình hiển thị */}
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--primary-text)' }}
                >
                  5. Vị trí & Trạng thái
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Vị trí hiển thị
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={modalInputClass}
                    >
                      <option value="HOME_HERO">HOME_HERO (Đầu trang chủ)</option>
                      <option value="ABOUT_HERO">ABOUT_HERO (Trang giới thiệu)</option>
                      <option value="SERVICE_HERO">SERVICE_HERO (Trang dịch vụ)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Thứ tự hiển thị (Nhỏ xếp trước)
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                      }
                      className={modalInputClass}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Trạng thái hoạt động
                    </label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <label
                        htmlFor="is_active"
                        className="text-xs cursor-pointer font-medium"
                        style={{ color: 'var(--text)' }}
                      >
                        Bật hiển thị trên website
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 z-20"
          style={{
            background: 'var(--surface-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border text-xs font-semibold transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
            }}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="banner-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold transition-opacity disabled:opacity-50"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật Banner' : 'Tạo mới Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}

const modalInputClass = `
  w-full rounded-xl border
  px-3.5 py-2
  text-xs outline-none
  transition-colors
  bg-[var(--surface)]
  text-[var(--text)]
  border-[var(--border)]
  placeholder:text-[var(--text-placeholder)]
  focus:border-[var(--primary)]
`;
