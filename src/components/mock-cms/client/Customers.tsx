'use client';

/* eslint-disable @next/next/no-img-element */

import { ArrowRight } from "lucide-react";
import { LocalizedLink as Link } from "@/components/navigation/LocalizedLink";

const partners = [
  {
    name: "TechCorp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "GlobalSoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "InnovateVN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "DataFlow",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "FintechX",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
  },
  {
    name: "EcoSmart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  },
  {
    name: "HealthTech",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
  },
  {
    name: "EduSpace",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
];

export default function Customers() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 lg:py-24"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
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
            Hơn 500+ doanh nghiệp hàng đầu đã tin tưởng và lựa chọn CMS làm đối
            tác chiến lược trong hành trình chuyển đổi số.
          </p>
        </div>
      </section>

      {/* Logos Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl h-32 flex items-center justify-center p-6 hover:shadow-lg transition-all grayscale hover:grayscale-0 cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              >
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  className="max-h-12 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 bg-white border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
            Trở thành đối tác của chúng tôi
          </h2>
          <p className="text-slate-500 mb-8">
            Cùng nhau xây dựng những giải pháp công nghệ mang tính đột phá và
            tạo ra giá trị bền vững cho doanh nghiệp.
          </p>
          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "var(--primary)" }}
          >
            Liên hệ hợp tác <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}


