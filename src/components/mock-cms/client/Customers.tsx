'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { apiFetch } from '@/utils/api-client';

import '@/components/layout/client/customer_styles/Customers.css';

interface Collaborator {
  collabId: number;
  collabName: string;
  description?: string;
  position: number;
  companyImage: string;
  visible: boolean;
}

interface CollaboratorSetting {
  settingId: number;
  columnsPerRow: number;
  updatedAt: string;
  updatedBy: number | null;
}

export default function Customers() {
  const [partners, setPartners] = useState<Collaborator[]>([]);
  const [columnsPerRow, setColumnsPerRow] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        /*
         * Load collaborators first.
         * Settings are optional because the page can still work
         * with the default 3-column layout.
         */
        const collaboratorResult = await apiFetch<
          Collaborator[] | { data?: Collaborator[] }
        >('/api/v1/collaborator');

        const collaboratorData = Array.isArray(collaboratorResult)
          ? collaboratorResult
          : (collaboratorResult.data ?? []);

        setPartners(
          collaboratorData
            .filter((partner) => partner.visible)
            .sort((a, b) => a.position - b.position)
        );

        /*
         * Collaborator settings are optional.
         * If this API returns 500, keep the default value of 3
         * instead of making the entire page fail.
         */
        try {
          const settingResult = await apiFetch<CollaboratorSetting>(
            '/api/v1/collaborator-settings'
          );

          if (
            settingResult.columnsPerRow >= 2 &&
            settingResult.columnsPerRow <= 6
          ) {
            setColumnsPerRow(settingResult.columnsPerRow);
          }
        } catch (settingError) {
          console.warn(
            'Không thể tải cấu hình hiển thị đối tác. Sử dụng mặc định 3 cột.',
            settingError
          );
        }
      } catch (error) {
        console.error('Load collaborators error:', error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="py-16 lg:py-24"
        style={{
          background: `linear-gradient(
            135deg,
            var(--hero-start) 0%,
            var(--hero-middle) 100%
          )`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Đối tác & Khách hàng
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold text-white lg:text-5xl">
            Đồng hành cùng sự phát triển
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-blue-200">
            Hơn 500+ doanh nghiệp hàng đầu đã tin tưởng và lựa chọn CMS làm
            đối tác chiến lược trong hành trình chuyển đổi số.
          </p>
        </div>
      </section>

      {/* Collaborators */}
      <section
        className="py-20"
        style={{ background: 'var(--surface-secondary)' }}
      >
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div
              className="flex justify-center py-16"
              style={{ color: 'var(--text-muted)' }}
            >
              Đang tải danh sách đối tác...
            </div>
          ) : partners.length === 0 ? (
            <div
              className="flex justify-center py-16"
              style={{ color: 'var(--text-muted)' }}
            >
              Chưa có thông tin đối tác.
            </div>
          ) : (
            <div
              className="customers-grid"
              style={
                {
                  '--columns-per-row': columnsPerRow,
                } as React.CSSProperties
              }
            >
              {partners.map((partner) => (
                <div
                  key={partner.collabId}
                  className="customer-card"
                >
                  <div className="customer-logo">
                    <img
                      src={partner.companyImage}
                      alt={`Logo ${partner.collabName}`}
                      loading="lazy"
                    />
                  </div>

                  {partner.description && (
                    <div className="customer-tooltip">
                      <div className="customer-tooltip-name">
                        {partner.collabName}
                      </div>

                      <div className="customer-tooltip-description">
                        {partner.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="border-t py-16"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2
            className="mb-4 font-display text-3xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Trở thành đối tác của chúng tôi
          </h2>

          <p
            className="mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cùng nhau xây dựng những giải pháp công nghệ mang tính đột phá và
            tạo ra giá trị bền vững cho doanh nghiệp.
          </p>

          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)' }}
          >
            Liên hệ hợp tác
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}