'use client';

import {
  Clock3,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';

import type { GeneralInfo } from '@/types/setting.type';

interface GeneralSettingsProps {
  info: GeneralInfo;

  onChange: (key: keyof GeneralInfo, value: string) => void;
}

export default function GeneralSettings({ info, onChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      {/* =====================================================
          THÔNG TIN WEBSITE
      ====================================================== */}
      <SettingsSection
        icon={Globe}
        title="Thông tin website"
        description="Thông tin nhận diện và giới thiệu chung của website."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Logo */}
          <Field label="Logo website" hint="Đường dẫn hoặc URL của logo.">
            <div className="relative">
              <ImageIcon
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <input
                value={info.logo || ''}
                onChange={(e) => onChange('logo', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="logo.png hoặc https://..."
              />
            </div>
          </Field>

          {/* Company name */}
          <Field label="Tên công ty" hint="Tên doanh nghiệp hiển thị trên website.">
            <input
              value={info.companyName || ''}
              onChange={(e) => onChange('companyName', e.target.value)}
              className={inputClass}
              placeholder="CMS Technology"
            />
          </Field>

          {/* Website name */}
          <Field label="Tên website" hint="Tên thương hiệu hoặc tên website.">
            <input
              value={info.websiteName || ''}
              onChange={(e) => onChange('websiteName', e.target.value)}
              className={inputClass}
              placeholder="CMS Portal"
            />
          </Field>

          {/* Description */}
          <Field
            label="Mô tả website"
            hint="Mô tả ngắn dùng cho website."
            className="md:col-span-2"
          >
            <textarea
              rows={4}
              value={info.websiteDescription || ''}
              onChange={(e) => onChange('websiteDescription', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Công ty giải pháp công nghệ hàng đầu Việt Nam..."
            />
          </Field>
        </div>
      </SettingsSection>

      {/* =====================================================
          THÔNG TIN LIÊN HỆ
      ====================================================== */}
      <SettingsSection
        icon={Phone}
        title="Thông tin liên hệ"
        description="Thông tin liên hệ được sử dụng trên các trang công khai."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Email */}
          <Field label="Email liên hệ" hint="Email chính của công ty.">
            <div className="relative">
              <Mail
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <input
                type="email"
                value={info.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="info@cms.vn"
              />
            </div>
          </Field>

          {/* Phone */}
          <Field label="Số điện thoại công ty" hint="Số điện thoại liên hệ chính.">
            <div className="relative">
              <Phone
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <input
                value={info.companyPhoneNumber || ''}
                onChange={(e) => onChange('companyPhoneNumber', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="+84 28 3456 7890"
              />
            </div>
          </Field>

          {/* Address */}
          <Field
            label="Địa chỉ công ty"
            hint="Địa chỉ hiển thị trên website."
            className="md:col-span-2"
          >
            <div className="relative">
              <MapPin
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-3
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <textarea
                rows={2}
                value={info.address || ''}
                onChange={(e) => onChange('address', e.target.value)}
                className={`${inputClass} resize-none pl-9`}
                placeholder="Tầng 12, 141 Lê Duẩn, Quận 1, TP. Hồ Chí Minh"
              />
            </div>
          </Field>

          {/* Working hours */}
          <Field label="Giờ làm việc" hint="Có thể nhập nhiều dòng." className="md:col-span-2">
            <div className="relative">
              <Clock3
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-3
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <textarea
                rows={2}
                value={info.workingHours || ''}
                onChange={(e) => onChange('workingHours', e.target.value)}
                className={`${inputClass} resize-none pl-9`}
                placeholder={`Thứ 2 - Thứ 6: 08:00 - 17:30
Thứ 7: 08:00 - 12:00`}
              />
            </div>
          </Field>
        </div>
      </SettingsSection>

      {/* =====================================================
          VỊ TRÍ CÔNG TY
          MOCK - CHƯA XỬ LÝ TÌM KIẾM VỊ TRÍ
      ====================================================== */}
      <SettingsSection
        icon={MapPin}
        title="Vị trí công ty"
        description="Khu vực này sẽ được sử dụng để cấu hình vị trí công ty. Chức năng tìm vị trí sẽ được hoàn thiện sau."
      >
        <div className="space-y-5">
          {/* Address preview */}
          <Field label="Địa chỉ vị trí" hint="Hiện tại sử dụng trực tiếp địa chỉ ở trên.">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={info.address || ''}
                readOnly
                className={`${inputClass} flex-1`}
                placeholder="Chưa có địa chỉ"
              />

              <button
                type="button"
                disabled
                className="
                  inline-flex shrink-0
                  items-center justify-center
                  gap-2 rounded-xl
                  border px-4 py-2.5
                  text-sm font-medium
                  opacity-60
                  cursor-not-allowed
                "
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border)',
                  background: 'var(--surface-secondary)',
                }}
              >
                <MapPin size={16} />
                Tìm vị trí
              </button>
            </div>
          </Field>

          {/* Mock map */}
          <div
            className="
              relative h-72
              overflow-hidden rounded-2xl
              border
            "
            style={{
              background: 'var(--surface-tertiary)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Background grid */}
            <div
              className="
                absolute inset-0
                opacity-60
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    var(--border-light) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    var(--border-light) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: '32px 32px',
              }}
            />

            {/* Mock map areas */}
            <div
              className="
                absolute left-[8%] top-[18%]
                h-24 w-[38%]
                rotate-[-8deg]
                rounded-[40%]
                opacity-70
              "
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            />

            <div
              className="
                absolute right-[7%] bottom-[15%]
                h-28 w-[35%]
                rotate-[7deg]
                rounded-[40%]
                opacity-70
              "
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            />

            {/* Mock roads */}
            <div
              className="
                absolute left-0 right-0
                top-1/2 h-3
                -rotate-6
              "
              style={{
                background: 'var(--surface)',
              }}
            />

            <div
              className="
                absolute bottom-0 top-0
                left-1/2 w-3
                rotate-12
              "
              style={{
                background: 'var(--surface)',
              }}
            />

            {/* Mock marker */}
            <div
              className="
                absolute left-1/2 top-1/2
                flex -translate-x-1/2
                -translate-y-1/2
                flex-col items-center
              "
            >
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-full shadow-lg
                "
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                <MapPin size={22} />
              </div>

              <div
                className="
                  mt-2 rounded-lg
                  border px-3 py-1.5
                  text-xs font-medium
                  shadow-sm
                "
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              >
                Vị trí công ty
              </div>
            </div>

            {/* Mock label */}
            <div
              className="
                absolute bottom-3 left-3
                rounded-lg border
                px-3 py-2 text-xs
                shadow-sm
              "
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Bản đồ xem trước
            </div>
          </div>

          <div
            className="
              flex items-start gap-2
              rounded-xl border px-4 py-3
              text-xs
            "
            style={{
              background: 'var(--info-light)',
              borderColor: 'var(--info)',
              color: 'var(--text-secondary)',
            }}
          >
            <MapPin
              size={15}
              className="mt-0.5 shrink-0"
              style={{
                color: 'var(--info)',
              }}
            />

            <span>
              Đây hiện chỉ là giao diện mẫu. Chức năng tự động tìm vị trí từ địa chỉ sẽ được triển
              khai ở bước tiếp theo.
            </span>
          </div>

          {/* Existing map embed URL */}
          <Field label="Google Maps Embed URL" hint="Giữ nguyên field hiện tại trong database.">
            <div className="relative">
              <ExternalLink
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                "
                style={{
                  color: 'var(--text-muted)',
                }}
              />

              <input
                type="url"
                value={info.mapEmbedUrl || ''}
                onChange={(e) => onChange('mapEmbedUrl', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </Field>
        </div>
      </SettingsSection>

      {/* =====================================================
          MẠNG XÃ HỘI
      ====================================================== */}
      <SettingsSection
        icon={Share2}
        title="Mạng xã hội"
        description="Các liên kết mạng xã hội được sử dụng trên Navbar và Footer."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SocialField
            label="Facebook"
            value={info.facebookLink}
            placeholder="https://facebook.com/..."
            onChange={(value) => onChange('facebookLink', value)}
          />

          <SocialField
            label="Twitter / X"
            value={info.twitterLink}
            placeholder="https://twitter.com/..."
            onChange={(value) => onChange('twitterLink', value)}
          />

          <SocialField
            label="Instagram"
            value={info.instagramLink}
            placeholder="https://instagram.com/..."
            onChange={(value) => onChange('instagramLink', value)}
          />

          <SocialField
            label="LinkedIn"
            value={info.linkedinLink}
            placeholder="https://linkedin.com/..."
            onChange={(value) => onChange('linkedinLink', value)}
          />

          <SocialField
            label="YouTube"
            value={info.youtubeLink}
            placeholder="https://youtube.com/..."
            onChange={(value) => onChange('youtubeLink', value)}
          />

          <SocialField
            label="Zalo"
            value={info.zaloLink}
            placeholder="https://zalo.me/..."
            onChange={(value) => onChange('zaloLink', value)}
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <SettingsSection
        icon={ExternalLink}
        title="Liên kết Footer"
        description="Các liên kết phụ hiển thị ở khu vực cuối trang."
      >
        <Field label="Liên kết phụ Footer" hint="Nhập các tên liên kết, ngăn cách bằng dấu phẩy.">
          <textarea
            rows={3}
            value={info.footerLinks || ''}
            onChange={(e) => onChange('footerLinks', e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Chính sách bảo mật, Điều khoản sử dụng, Cookie"
          />
        </Field>

        <div className="mt-4 flex items-start gap-2">
          <ExternalLink
            size={14}
            className="mt-0.5 shrink-0"
            style={{
              color: 'var(--text-muted)',
            }}
          />

          <p
            className="text-xs"
            style={{
              color: 'var(--text-muted)',
            }}
          >
            Hiện tại database chỉ lưu danh sách dưới dạng text. Việc cấu hình URL riêng cho từng
            linker có thể được mở rộng sau.
          </p>
        </div>
      </SettingsSection>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl border
      "
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Section header */}
      <div
        className="
          flex items-start gap-3
          border-b px-6 py-5
        "
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface-secondary)',
        }}
      >
        <div
          className="
            flex h-9 w-9
            shrink-0 items-center
            justify-center rounded-xl
          "
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary-text)',
          }}
        >
          <Icon size={18} />
        </div>

        <div>
          <h2
            className="
              font-display
              font-semibold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            {title}
          </h2>

          <p
            className="mt-0.5 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
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
   FIELD
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
        className="
          mb-1.5 block
          text-xs font-semibold
        "
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </label>

      {children}

      {hint && (
        <p
          className="mt-1 text-[11px]"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SOCIAL FIELD
========================================================= */

function SocialField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder={placeholder}
      />
    </Field>
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
  placeholder:text-[var(--text-placeholder)]
  focus:border-[var(--primary)]
`;
