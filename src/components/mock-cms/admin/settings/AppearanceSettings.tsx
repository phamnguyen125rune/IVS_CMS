'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Sliders,
  Search,
  Moon,
  Globe,
  Plus,
  Trash2,
  Bell,
  MousePointerClick,
  Mail,
  ListTree,
  ShieldCheck,
} from 'lucide-react';
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
    syncColumns([...columns, { title: 'Cột mới', links: [{ label: 'Liên kết mới', url: '/' }] }]);
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
      <SettingsSection
        icon={Layout}
        title="Tùy chỉnh Header (Đầu trang)"
        description="Cấu hình dải băng thông báo trên cùng, nút kêu gọi hành động (CTA) và các nút tiện ích."
      >
        <div className="space-y-6">
          {/* Topbar Toggle Card */}
          <div
            className="flex items-center justify-between rounded-xl border p-4 transition-colors"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-text)',
                }}
              >
                <Bell size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  Thanh thông báo Topbar
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Hiển thị dải băng thông báo & liên hệ nhanh ở mép trên cùng của website
                </div>
              </div>
            </div>

            <ToggleSwitch
              checked={info.showTopbar ?? true}
              onChange={(checked) => onChange('showTopbar', checked)}
            />
          </div>

          {(info.showTopbar ?? true) && (
            <div
              className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <Field
                label="Nội dung thông báo (Announcement Text)"
                hint="Dòng chữ nổi bật chạy trên thanh thông báo."
              >
                <input
                  type="text"
                  value={info.topbarAnnouncementText || ''}
                  onChange={(e) => onChange('topbarAnnouncementText', e.target.value)}
                  placeholder="VD: 🎉 Ưu đãi 20% cho giải pháp chuyển đổi số tháng này"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Đường dẫn liên kết (URL)"
                hint="Link đích khi người dùng click vào thông báo."
              >
                <input
                  type="text"
                  value={info.topbarAnnouncementUrl || ''}
                  onChange={(e) => onChange('topbarAnnouncementUrl', e.target.value)}
                  placeholder="VD: /bai-viet/khuyen-mai"
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          {/* Header CTA Button */}
          <div
            className="rounded-xl border p-4 space-y-4"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center gap-2">
              <MousePointerClick size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Nút kêu gọi hành động trên Navbar (CTA Button)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Chữ trên nút (Text)">
                <input
                  type="text"
                  value={info.headerCtaText || ''}
                  onChange={(e) => onChange('headerCtaText', e.target.value)}
                  placeholder="VD: Tư vấn miễn phí"
                  className={inputClass}
                />
              </Field>

              <Field label="Đường dẫn liên kết (URL)">
                <input
                  type="text"
                  value={info.headerCtaUrl || ''}
                  onChange={(e) => onChange('headerCtaUrl', e.target.value)}
                  placeholder="VD: /lien-he"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Feature Switches */}
          <div>
            <label
              className="mb-2 block text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Các nút tính năng tiện ích trên Header
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SwitchItem
                icon={Search}
                label="Nút Tìm kiếm"
                checked={info.showHeaderSearch ?? true}
                onChange={(checked) => onChange('showHeaderSearch', checked)}
              />

              <SwitchItem
                icon={Moon}
                label="Đổi theme Sáng/Tối"
                checked={info.showThemeToggle ?? true}
                onChange={(checked) => onChange('showThemeToggle', checked)}
              />

              <SwitchItem
                icon={Globe}
                label="Bộ chọn ngôn ngữ"
                checked={info.showLanguageSwitch ?? true}
                onChange={(checked) => onChange('showLanguageSwitch', checked)}
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ========================================================
          2. FOOTER CUSTOMIZATION
          ======================================================== */}
      <SettingsSection
        icon={Sliders}
        title="Tùy chỉnh Footer (Chân trang)"
        description="Quản lý khối đăng ký nhận bản tin, danh sách cột liên kết điều hướng và dòng bản quyền."
      >
        <div className="space-y-6">
          {/* Newsletter Section */}
          <div
            className="flex items-center justify-between rounded-xl border p-4 transition-colors"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-text)',
                }}
              >
                <Mail size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  Khối Đăng ký nhận tin (Newsletter)
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Cho phép khách hàng để lại email nhận thông báo, tin tức khuyến mãi mới nhất
                </div>
              </div>
            </div>

            <ToggleSwitch
              checked={info.showNewsletter ?? true}
              onChange={(checked) => onChange('showNewsletter', checked)}
            />
          </div>

          {(info.showNewsletter ?? true) && (
            <div
              className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <Field label="Tiêu đề khối">
                <input
                  type="text"
                  value={info.newsletterTitle || ''}
                  onChange={(e) => onChange('newsletterTitle', e.target.value)}
                  placeholder="VD: Đăng ký nhận bản tin"
                  className={inputClass}
                />
              </Field>

              <Field label="Mô tả ngắn">
                <input
                  type="text"
                  value={info.newsletterDesc || ''}
                  onChange={(e) => onChange('newsletterDesc', e.target.value)}
                  placeholder="VD: Nhận thông tin cập nhật công nghệ và thông báo mới nhất."
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          {/* Footer Link Columns Builder */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListTree size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    Các cột liên kết chân trang
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Tự do tạo các nhóm danh mục liên kết (Điều hướng, Dịch vụ, Chính sách...)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                <Plus size={14} /> Thêm cột mới
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {columns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className="rounded-xl border p-4 space-y-3"
                  style={{
                    background: 'var(--surface-secondary)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className="flex items-center justify-between gap-2 pb-2 border-b"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => handleColumnTitleChange(colIdx, e.target.value)}
                      placeholder="Tiêu đề cột (VD: Dịch vụ)"
                      className="font-semibold text-sm bg-transparent border-b outline-none px-1 py-0.5 focus:border-[var(--primary)]"
                      style={{
                        color: 'var(--text)',
                        borderColor: 'var(--border-strong)',
                      }}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddLink(colIdx)}
                        className="p-1 rounded text-xs inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-text)',
                        }}
                        title="Thêm link vào cột này"
                      >
                        <Plus size={13} /> Link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(colIdx)}
                        className="p-1 rounded transition-opacity hover:opacity-80"
                        style={{
                          background: 'var(--error-light)',
                          color: 'var(--error)',
                        }}
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
                          onChange={(e) =>
                            handleLinkChange(colIdx, linkIdx, 'label', e.target.value)
                          }
                          placeholder="Tên link"
                          className={`${inputClass} !py-1.5 !text-xs flex-1`}
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(colIdx, linkIdx, 'url', e.target.value)}
                          placeholder="/duong-dan"
                          className={`${inputClass} !py-1.5 !text-xs flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(colIdx, linkIdx)}
                          className="p-1.5 rounded transition-opacity hover:opacity-80 shrink-0"
                          style={{
                            background: 'var(--error-light)',
                            color: 'var(--error)',
                          }}
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
          <div
            className="rounded-xl border p-4 space-y-2"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
              <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Dòng chữ bản quyền (Copyright text)
              </label>
            </div>
            <input
              type="text"
              value={info.footerCopyright || ''}
              onChange={(e) => onChange('footerCopyright', e.target.value)}
              placeholder="VD: © 2026 CMS Technology. Tất cả quyền được bảo lưu."
              className={inputClass}
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

/* =========================================================
   SETTINGS SECTION HELPER
========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Section header */}
      <div
        className="flex items-start gap-3 border-b px-6 py-5"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface-secondary)',
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary-text)',
          }}
        >
          <Icon size={18} />
        </div>

        <div>
          <h2 className="font-display font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </h2>

          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Section body */}
      <div className="p-6">{children}</div>
    </section>
  );
}

/* =========================================================
   FIELD HELPER
========================================================= */

function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-xs font-semibold"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SWITCH ITEM HELPER
========================================================= */

function SwitchItem({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border p-3.5 transition-colors"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <span
        className="flex items-center gap-2 text-xs font-medium"
        style={{ color: 'var(--text)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>
          <Icon size={14} />
        </span>
        {label}
      </span>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

/* =========================================================
   TOGGLE SWITCH COMPONENT
========================================================= */

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 rounded-full peer transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
          checked ? 'after:translate-x-full' : ''
        }`}
        style={{
          background: checked ? 'var(--primary)' : 'var(--border-strong)',
        }}
      />
    </label>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass = `
  w-full rounded-xl border
  px-3.5 py-2.5
  text-sm outline-none
  transition-colors
  bg-[var(--surface)]
  text-[var(--text)]
  border-[var(--border)]
  placeholder:text-[var(--text-placeholder)]
  focus:border-[var(--primary)]
`;
