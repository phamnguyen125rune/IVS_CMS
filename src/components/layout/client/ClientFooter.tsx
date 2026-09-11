'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

import { settingService } from '@/services/setting.service';
import type { GeneralInfo } from '@/types/setting.type';

interface ClientFooterProps {
  language: string;
}

const defaultGeneralInfo: GeneralInfo = {
  logo: 'default-logo.png',
  companyName: 'CMS Technology',
  websiteName: 'CMS Portal',
  websiteDescription: 'Công ty giải pháp công nghệ hàng đầu Việt Nam.',
  email: 'info@cms.vn',
  facebookLink: '',
  twitterLink: '',
  instagramLink: '',
  linkedinLink: '',
  youtubeLink: '',
  zaloLink: '',
  companyPhoneNumber: '',
  address: '',
  workingHours: '',
  mapEmbedUrl: '',
  footerLinks: '',
};

export default function ClientFooter({ language }: ClientFooterProps) {
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(defaultGeneralInfo);

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  /*
   * =========================================================
   * LOAD GENERAL INFO
   * =========================================================
   */
  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const response = await settingService.getGeneralInfo();

        if (response?.data) {
          setGeneralInfo({
            ...defaultGeneralInfo,
            ...response.data,
          });
        }
      } catch (error) {
        console.error('Fetch general info error:', error);
      }
    };

    fetchGeneralInfo();
  }, []);

  /*
   * =========================================================
   * NAVIGATION
   * =========================================================
   */

  const navigationLinks = [
    ['Trang chủ', '/'],
    ['Giới thiệu', '/gioi-thieu'],
    ['Tuyển dụng', '/tuyen-dung'],
    ['Dự án', '/du-an'],
    ['Bài viết', '/bai-viet'],
    ['Liên hệ', '/lien-he'],
  ];

  /*
   * =========================================================
   * SERVICES
   * =========================================================
   *
   * Phần này vẫn giữ nguyên vì hiện tại DB general_info
   * chưa quản lý danh sách dịch vụ.
   */

  const services = [
    'Phát triển phần mềm',
    'Thiết kế UI/UX',
    'Tư vấn công nghệ',
    'Chuyển đổi số',
    'Bảo trì hệ thống',
  ];

  /*
   * =========================================================
   * SOCIAL LINKS
   * =========================================================
   */

  const socialLinks = [
    {
      href: generalInfo.facebookLink,
      label: 'Facebook',
      icon: FaFacebook,
    },
    {
      href: generalInfo.youtubeLink,
      label: 'YouTube',
      icon: FaYoutube,
    },
    {
      href: generalInfo.linkedinLink,
      label: 'LinkedIn',
      icon: FaLinkedin,
    },
    {
      href: generalInfo.zaloLink,
      label: 'Zalo',
      icon: SiZalo,
    },
  ].filter((item) => item.href?.trim());

  /*
   * =========================================================
   * FOOTER LINKS
   * =========================================================
   *
   * Hiện tại footerLinks đang được lưu dạng:
   *
   * "Chính sách bảo mật, Điều khoản sử dụng, Cookie"
   *
   * nên trước mắt chỉ tách thành danh sách text.
   */

  const legalLinks = generalInfo.footerLinks
    ? generalInfo.footerLinks
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  /*
   * =========================================================
   * LOGO
   * =========================================================
   */

  const getLogoUrl = (logo?: string) => {
    if (!logo) {
      return '/images/default-logo.png';
    }

    if (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/')) {
      return logo;
    }

    return `/images/${logo}`;
  };

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
                  overflow-hidden
                  rounded-xl
                  font-bold
                "
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {generalInfo.logo ? (
                  <img
                    src={getLogoUrl(generalInfo.logo)}
                    alt={generalInfo.companyName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  'C'
                )}
              </div>

              <span
                className="font-display text-lg font-bold"
                style={{
                  color: 'var(--dark-text)',
                }}
              >
                {generalInfo.websiteName || generalInfo.companyName || 'CMS'}
              </span>
            </div>

            <p
              className="mb-5 text-sm leading-relaxed"
              style={{
                color: 'var(--dark-text-secondary)',
              }}
            >
              {generalInfo.websiteDescription || 'Công ty giải pháp công nghệ hàng đầu Việt Nam.'}
            </p>

            {/* Social links */}

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
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
            )}
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

              {generalInfo.address && (
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

                  <span>{generalInfo.address}</span>
                </li>
              )}

              {/* Phone */}

              {generalInfo.companyPhoneNumber && (
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

                  <a
                    href={`tel:${generalInfo.companyPhoneNumber}`}
                    className="hover:text-[var(--primary)]"
                  >
                    {generalInfo.companyPhoneNumber}
                  </a>
                </li>
              )}

              {/* Email */}

              {generalInfo.email && (
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

                  <a href={`mailto:${generalInfo.email}`} className="hover:text-[var(--primary)]">
                    {generalInfo.email}
                  </a>
                </li>
              )}

              {/* Working Hours */}

              {generalInfo.workingHours && (
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
                  <span className="shrink-0 text-blue-400">⏰</span>

                  <span>{generalInfo.workingHours}</span>
                </li>
              )}
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
            © {new Date().getFullYear()} {generalInfo.companyName || 'CMS'}. Bảo lưu mọi quyền.
          </p>

          {legalLinks.length > 0 && (
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
          )}
        </div>
      </div>
    </footer>
  );
}
