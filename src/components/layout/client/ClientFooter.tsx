'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

interface ClientFooterProps {
  language: string;
}

export default function ClientFooter({ language }: ClientFooterProps) {
  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  const navigationLinks = [
    ['Trang chủ', '/'],
    ['Giới thiệu', '/gioi-thieu'],
    ['Tuyển dụng', '/tuyen-dung'],
    ['Dự án', '/du-an'],
    ['Bài viết', '/bai-viet'],
    ['Liên hệ', '/lien-he'],
  ];

  const services = [
    'Phát triển phần mềm',
    'Thiết kế UI/UX',
    'Tư vấn công nghệ',
    'Chuyển đổi số',
    'Bảo trì hệ thống',
  ];

  const socialLinks = [FaFacebook, FaYoutube, FaLinkedin, SiZalo];

  const legalLinks = ['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'];

  return (
    <footer
      style={{
        background: 'var(--dark-background)',
        color: 'var(--dark-text-secondary)',
      }}
    >
      {/* =================================================
          MAIN FOOTER
      ================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* =================================================
              BRAND
          ================================================== */}

          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  font-bold
                "
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                C
              </div>

              <span
                className="font-display text-lg font-bold"
                style={{
                  color: 'var(--dark-text)',
                }}
              >
                CMS
              </span>
            </div>

            <p
              className="
                mb-5
                text-sm
                leading-relaxed
              "
              style={{
                color: 'var(--dark-text-secondary)',
              }}
            >
              Công ty giải pháp công nghệ hàng đầu Việt Nam. Chúng tôi kiến tạo những sản phẩm số
              giúp doanh nghiệp phát triển bền vững.
            </p>

            {/* Social links */}

            <div className="flex items-center gap-3">
              {socialLinks.map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={`Social media ${index + 1}`}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    transition-colors
                    hover:text-white
                  "
                  style={{
                    background: 'var(--dark-surface)',
                    color: 'var(--dark-text-muted)',
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div>
            <h4
              className="
                mb-4
                font-display
                text-sm
                font-semibold
              "
              style={{
                color: 'var(--dark-text)',
              }}
            >
              Điều hướng
            </h4>

            <ul className="space-y-2.5">
              {navigationLinks.map(([label, path]) => (
                <li key={path}>
                  <Link
                    href={getLocalizedPath(path)}
                    className="
                      text-sm
                      transition-colors
                      hover:text-[var(--primary)]
                    "
                    style={{
                      color: 'var(--dark-text-muted)',
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              SERVICES
          ================================================== */}

          <div>
            <h4
              className="
                mb-4
                font-display
                text-sm
                font-semibold
              "
              style={{
                color: 'var(--dark-text)',
              }}
            >
              Dịch vụ
            </h4>

            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="
                      text-sm
                      transition-colors
                      hover:text-[var(--primary)]
                    "
                    style={{
                      color: 'var(--dark-text-muted)',
                    }}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================== */}

          <div>
            <h4
              className="
                mb-4
                font-display
                text-sm
                font-semibold
              "
              style={{
                color: 'var(--dark-text)',
              }}
            >
              Liên hệ
            </h4>

            <ul className="space-y-3">
              {/* Address */}

              <li
                className="
                  flex
                  items-start
                  gap-2.5
                  text-sm
                "
                style={{
                  color: 'var(--dark-text-muted)',
                }}
              >
                <MapPin
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-blue-400
                  "
                />

                <span>Tầng 12, 141 Lê Duẩn, Q.1, TP.HCM</span>
              </li>

              {/* Phone */}

              <li
                className="
                  flex
                  items-center
                  gap-2.5
                  text-sm
                "
                style={{
                  color: 'var(--dark-text-muted)',
                }}
              >
                <Phone size={14} className="shrink-0 text-blue-400" />

                <span>+84 28 3456 7890</span>
              </li>

              {/* Email */}

              <li
                className="
                  flex
                  items-center
                  gap-2.5
                  text-sm
                "
                style={{
                  color: 'var(--dark-text-muted)',
                }}
              >
                <Mail size={14} className="shrink-0 text-blue-400" />

                <span>info@CMS.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUB FOOTER
      ====================================================== */}

      <div
        style={{
          borderTop: '1px solid var(--dark-border)',
        }}
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-3
            px-6
            py-5
            md:flex-row
          "
        >
          <p
            className="text-xs"
            style={{
              color: 'var(--dark-text-muted)',
            }}
          >
            © 2026 CMS. Bảo lưu mọi quyền.
          </p>

          <div className="flex items-center gap-5">
            {legalLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  text-xs
                  transition-colors
                  hover:text-[var(--dark-text)]
                "
                style={{
                  color: 'var(--dark-text-muted)',
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
