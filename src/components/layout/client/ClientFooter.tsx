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

  return (
    <footer
      style={{
        background: '#0f172a',
      }}
      className="text-slate-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* =================================================
              BRAND
          ================================================== */}

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{
                  background: 'var(--primary, #2563eb)',
                }}
              >
                C
              </div>

              <span className="font-display font-bold text-white text-lg">CMS</span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Công ty giải pháp công nghệ hàng đầu Việt Nam. Chúng tôi kiến tạo những sản phẩm số
              giúp doanh nghiệp phát triển bền vững.
            </p>

            <div className="flex items-center gap-3">
              {[FaFacebook, FaYoutube, FaLinkedin, SiZalo].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{
                    background: '#1e293b',
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
            <h4 className="text-white font-semibold font-display mb-4 text-sm">Điều hướng</h4>

            <ul className="space-y-2.5">
              {[
                ['Trang chủ', '/'],
                ['Giới thiệu', '/gioi-thieu'],
                ['Tuyển dụng', '/tuyen-dung'],
                ['Dự án', '/du-an'],
                ['Bài viết', '/bai-viet'],
                ['Liên hệ', '/lien-he'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    href={getLocalizedPath(path)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
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
            <h4 className="text-white font-semibold font-display mb-4 text-sm">Dịch vụ</h4>

            <ul className="space-y-2.5">
              {[
                'Phát triển phần mềm',
                'Thiết kế UI/UX',
                'Tư vấn công nghệ',
                'Chuyển đổi số',
                'Bảo trì hệ thống',
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
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
            <h4 className="text-white font-semibold font-display mb-4 text-sm">Liên hệ</h4>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-400" />

                <span>Tầng 12, 141 Lê Duẩn, Q.1, TP.HCM</span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone size={14} className="text-blue-400 shrink-0" />
                +84 28 3456 7890
              </li>

              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={14} className="text-blue-400 shrink-0" />
                info@CMS.vn
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUB FOOTER
      ====================================================== */}

      <div className="border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 CMS. Bảo lưu mọi quyền.</p>

          <div className="flex items-center gap-5">
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
