'use client';

/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Heart,
  Coffee,
  TrendingUp,
  Award,
  Search,
} from 'lucide-react';

// --- Mock Data ---
const benefits = [
  {
    icon: <DollarSign size={24} className="text-blue-600" />,
    title: 'Mức lương cạnh tranh',
    description:
      'Lương thưởng hấp dẫn, xét tăng lương 2 lần/năm dựa trên năng lực và hiệu suất công việc.',
  },
  {
    icon: <Heart size={24} className="text-pink-600" />,
    title: 'Chăm sóc sức khỏe',
    description:
      'Bảo hiểm y tế toàn diện cho bạn và gia đình, khám sức khỏe định kỳ hàng năm tại bệnh viện quốc tế.',
  },
  {
    icon: <TrendingUp size={24} className="text-green-600" />,
    title: 'Phát triển sự nghiệp',
    description:
      'Lộ trình thăng tiến rõ ràng, tài trợ các khóa học chứng chỉ chuyên môn và kỹ năng mềm.',
  },
  {
    icon: <Coffee size={24} className="text-orange-600" />,
    title: 'Môi trường năng động',
    description:
      'Thời gian làm việc linh hoạt, teambuilding hàng quý, pantry đầy đủ đồ ăn thức uống miễn phí.',
  },
];

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Frontend Developer (ReactJS)',
    department: 'Engineering',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    salary: 'Up to $2000',
    isHot: true,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    salary: '$1000 - $1500',
    isHot: false,
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: 'Thỏa thuận',
    isHot: true,
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    salary: '$800 - $1200',
    isHot: false,
  },
];

export default function Recruitment() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobOpenings.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section
        className="bg-white border-b"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Award size={16} />
            <span>Nơi phát triển sự nghiệp của bạn</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight text-white">
            Cùng chúng tôi kiến tạo <br className="hidden md:block" />
            <span className="text-blue-600">tương lai số</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-10 text-white">
            Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ, sáng tạo và không ngại thử
            thách để cùng nhau xây dựng những sản phẩm mang lại giá trị thực cho cộng đồng.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm vị trí công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-700 bg-slate-50 focus:bg-white"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Chúng tôi tin rằng nhân sự là tài sản quý giá nhất. Tại đây, bạn sẽ được trao quyền,
              hỗ trợ và ghi nhận xứng đáng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-white border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
                Vị trí đang tuyển
              </h2>
              <p className="text-slate-600">Tìm kiếm cơ hội phù hợp với chuyên môn của bạn.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Tất cả phòng ban
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Kỹ thuật (Engineering)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border bg-white hover:border-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.isHot && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                          HOT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={16} />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-green-600 font-medium">
                        <DollarSign size={16} />
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/tuyen-dung/${job.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-50 text-blue-600 font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    Ứng tuyển ngay
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div
                className="text-center py-12 border-2 border-dashed rounded-2xl"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="text-slate-500">
                  Không tìm thấy vị trí phù hợp với từ khóa "{searchTerm}".
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
