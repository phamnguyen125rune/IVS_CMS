import Link from 'next/link';

const services = [
  {
    title: 'Website doanh nghiệp',
    desc: 'Thiết kế website giới thiệu công ty, đa ngôn ngữ, tối ưu SEO và dễ quản trị nội dung.',
    tags: ['Next.js', 'CMS', 'SEO'],
  },
  {
    title: 'CMS nội bộ',
    desc: 'Hệ thống quản trị bài viết, media, phân quyền, biểu mẫu và quy trình kiểm duyệt.',
    tags: ['Admin', 'Workflow', 'RBAC'],
  },
  {
    title: 'Dashboard vận hành',
    desc: 'Màn hình theo dõi số liệu, trạng thái xử lý và nhật ký thao tác theo thời gian thực.',
    tags: ['Analytics', 'Reports', 'Logs'],
  },
  {
    title: 'Tích hợp hệ thống',
    desc: 'Kết nối website với CRM, email, form liên hệ, xác thực Google và các API doanh nghiệp.',
    tags: ['API', 'Auth', 'Automation'],
  },
];

export default async function ProductsPage({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  return (
    <div className="bg-white">
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Products & Services
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Giải pháp web và CMS cho doanh nghiệp cần vận hành nội dung nghiêm túc
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Từ website khách hàng đến hệ thống quản trị nội bộ, các chức năng được thiết kế để đội
            marketing, nhân sự và quản lý dùng hằng ngày.
          </p>
          <Link
            href={`/${language}/lien-he`}
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Nhận tư vấn
          </Link>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{service.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
