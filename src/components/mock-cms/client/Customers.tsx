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
        const [collaboratorResult, settingResult] = await Promise.all([
          apiFetch<Collaborator[] | { data?: Collaborator[] }>('/api/v1/collaborator'),
          apiFetch<CollaboratorSetting>('/api/v1/collaborator-settings'),
        ]);

        const collaboratorData = Array.isArray(collaboratorResult)
          ? collaboratorResult
          : (collaboratorResult.data ?? []);

        setPartners(
          collaboratorData
            .filter((partner) => partner.visible)
            .sort((a, b) => a.position - b.position)
        );

        if (settingResult.columnsPerRow >= 2 && settingResult.columnsPerRow <= 6) {
          setColumnsPerRow(settingResult.columnsPerRow);
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
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Đối tác & Khách hàng
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            Đồng hành cùng sự phát triển
          </h1>

          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Hơn 500+ doanh nghiệp hàng đầu đã tin tưởng và lựa chọn CMS làm đối tác chiến lược trong
            hành trình chuyển đổi số.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-16 text-slate-500">
              Đang tải danh sách đối tác...
            </div>
          ) : partners.length === 0 ? (
            <div className="flex justify-center py-16 text-slate-500">
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
                <div key={partner.collabId} className="customer-card">
                  <div className="customer-logo">
                    <img
                      src={partner.companyImage}
                      alt={`Logo ${partner.collabName}`}
                      loading="lazy"
                    />
                  </div>

                  {partner.description && (
                    <div className="customer-tooltip">
                      <div className="customer-tooltip-name">{partner.collabName}</div>

                      <div className="customer-tooltip-description">{partner.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Trở thành đối tác của chúng tôi
          </h2>

          <p className="text-slate-500 mb-8">
            Cùng nhau xây dựng những giải pháp công nghệ mang tính đột phá và tạo ra giá trị bền
            vững cho doanh nghiệp.
          </p>

          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)' }}
          >
            Liên hệ hợp tác <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
