'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Sliders, Search, Moon, Globe, Plus, Trash2 } from 'lucide-react';
import type { GeneralInfo } from '@/types/setting.type';

interface FooterColumnItem {
  title: string;
  links: { label: string; url: string }[];
}

interface AppearanceSettingsProps {
  info: GeneralInfo;
  onChange: <K extends keyof GeneralInfo>(key: K, value: GeneralInfo[K]) => void;
}

export default function AppearanceSettings({ info, onChange }: AppearanceSettingsProps) {
  // Parse footer columns json or default columns
  const [columns, setColumns] = useState<FooterColumnItem[]>([]);

  useEffect(() => {
    try {
      if (info.footerColumnsJson) {
        const parsed = JSON.parse(info.footerColumnsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setColumns(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }

    // Default 2 columns if not configured yet
    setColumns([
      {
        title: 'Điều hướng',
        links: [
          { label: 'Trang chủ', url: '/' },
          { label: 'Giới thiệu', url: '/gioi-thieu' },
          { label: 'Tuyển dụng', url: '/tuyen-dung' },
          { label: 'Dự án', url: '/du-an' },
          { label: 'Bài viết', url: '/bai-viet' },
          { label: 'Liên hệ', url: '/lien-he' },
        ],
      },
      {
        title: 'Dịch vụ giải pháp',
        links: [
          { label: 'Phát triển phần mềm', url: '/dich-vu' },
          { label: 'Thiết kế UI/UX', url: '/dich-vu' },
          { label: 'Tư vấn công nghệ', url: '/dich-vu' },
          { label: 'Chuyển đổi số', url: '/dich-vu' },
          { label: 'Bảo trì hệ thống', url: '/dich-vu' },
        ],
      },
    ]);
  }, [info.footerColumnsJson]);

  const syncColumns = (newCols: FooterColumnItem[]) => {
    setColumns(newCols);
    onChange('footerColumnsJson', JSON.stringify(newCols));
  };

  const handleAddColumn = () => {
    syncColumns([...columns, { title: 'Cột mới', links: [{ label: 'Liên kết', url: '/' }] }]);
  };

  const handleRemoveColumn = (colIdx: number) => {
    syncColumns(columns.filter((_, i) => i !== colIdx));
  };

  const handleColumnTitleChange = (colIdx: number, title: string) => {
    const updated = [...columns];
    updated[colIdx].title = title;
    syncColumns(updated);
  };

  const handleAddLink = (colIdx: number) => {
    const updated = [...columns];
    updated[colIdx].links.push({ label: 'Tên liên kết', url: '/' });
    syncColumns(updated);
  };

  const handleRemoveLink = (colIdx: number, linkIdx: number) => {
    const updated = [...columns];
    updated[colIdx].links = updated[colIdx].links.filter((_, i) => i !== linkIdx);
    syncColumns(updated);
  };

  const handleLinkChange = (
    colIdx: number,
    linkIdx: number,
    field: 'label' | 'url',
    value: string
  ) => {
    const updated = [...columns];
    updated[colIdx].links[linkIdx][field] = value;
    syncColumns(updated);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER CUSTOMIZATION
          ======================================================== */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Layout size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Tùy chỉnh Header (Đầu trang)</h2>
            <p className="text-xs text-slate-400">
              Cấu hình thanh thông báo trên cùng (Topbar), nút CTA và các công tắc tiện ích
            </p>
          </div>
        </div>

        {/* Topbar Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-sm font-semibold text-white">Thanh thông báo Topbar</div>
              <div className="text-xs text-slate-400">
                Hiển thị dải băng thông báo & liên hệ nhanh ở mép trên cùng website
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={info.showTopbar ?? true}
                onChange={(e) => onChange('showTopbar', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {(info.showTopbar ?? true) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nội dung thông báo (Announcement Text)
                </label>
                <input
                  type="text"
                  value={info.topbarAnnouncementText || ''}
                  onChange={(e) => onChange('topbarAnnouncementText', e.target.value)}
                  placeholder="VD: 🎉 Ưu đãi 20% cho giải pháp chuyển đổi số tháng này"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Đường dẫn liên kết thông báo (URL)
                </label>
                <input
                  type="text"
                  value={info.topbarAnnouncementUrl || ''}
                  onChange={(e) => onChange('topbarAnnouncementUrl', e.target.value)}
                  placeholder="VD: /bai-viet/khuyen-mai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Header CTA Button */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="text-sm font-semibold text-white">
            Nút bấm chính trên Header (CTA Button)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Chữ trên nút (Text)
              </label>
              <input
                type="text"
                value={info.headerCtaText || ''}
                onChange={(e) => onChange('headerCtaText', e.target.value)}
                placeholder="VD: Tư vấn miễn phí"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Đường dẫn liên kết (URL)
              </label>
              <input
                type="text"
                value={info.headerCtaUrl || ''}
                onChange={(e) => onChange('headerCtaUrl', e.target.value)}
                placeholder="VD: /lien-he"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              Nút Tìm kiếm
            </span>
            <input
              type="checkbox"
              checked={info.showHeaderSearch ?? true}
              onChange={(e) => onChange('showHeaderSearch', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-700 bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Moon size={14} className="text-slate-400" />
              Đổi theme Sáng/Tối
            </span>
            <input
              type="checkbox"
              checked={info.showThemeToggle ?? true}
              onChange={(e) => onChange('showThemeToggle', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-700 bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Globe size={14} className="text-slate-400" />
              Bộ chọn ngôn ngữ
            </span>
            <input
              type="checkbox"
              checked={info.showLanguageSwitch ?? true}
              onChange={(e) => onChange('showLanguageSwitch', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-700 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FOOTER CUSTOMIZATION
          ======================================================== */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Sliders size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Tùy chỉnh Footer (Chân trang)</h2>
            <p className="text-xs text-slate-400">
              Quản lý các cột liên kết điều hướng, khối nhận bản tin và dòng bản quyền
            </p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-sm font-semibold text-white">
                Khối Đăng ký nhận tin (Newsletter)
              </div>
              <div className="text-xs text-slate-400">
                Cho phép người dùng để lại email nhận tin tức mới
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={info.showNewsletter ?? true}
                onChange={(e) => onChange('showNewsletter', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {(info.showNewsletter ?? true) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tiêu đề khối
                </label>
                <input
                  type="text"
                  value={info.newsletterTitle || ''}
                  onChange={(e) => onChange('newsletterTitle', e.target.value)}
                  placeholder="VD: Đăng ký nhận bản tin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={info.newsletterDesc || ''}
                  onChange={(e) => onChange('newsletterDesc', e.target.value)}
                  placeholder="VD: Nhận thông tin cập nhật công nghệ và thông báo mới nhất."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Link Columns Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Các cột liên kết chân trang</div>
              <div className="text-xs text-slate-400">
                Tự do tạo các nhóm danh mục liên kết (Điều hướng, Dịch vụ, Chính sách...)
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors"
            >
              <Plus size={14} /> Thêm cột mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => handleColumnTitleChange(colIdx, e.target.value)}
                    placeholder="Tiêu đề cột (VD: Dịch vụ)"
                    className="font-semibold text-sm text-white bg-transparent border-b border-slate-700 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAddLink(colIdx)}
                      className="p-1 rounded text-blue-400 hover:bg-blue-500/10 text-xs inline-flex items-center gap-1"
                      title="Thêm link vào cột này"
                    >
                      <Plus size={14} /> Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(colIdx)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      title="Xóa cả cột"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* List of links */}
                <div className="space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleLinkChange(colIdx, linkIdx, 'label', e.target.value)}
                        placeholder="Tên link"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleLinkChange(colIdx, linkIdx, 'url', e.target.value)}
                        placeholder="/duong-dan"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(colIdx, linkIdx)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Dòng chữ bản quyền (Copyright)
          </label>
          <input
            type="text"
            value={info.footerCopyright || ''}
            onChange={(e) => onChange('footerCopyright', e.target.value)}
            placeholder="VD: © 2026 CMS Technology. Tất cả quyền được bảo lưu."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
