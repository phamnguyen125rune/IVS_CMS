'use client';

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

import { LocalizedLink as Link } from "@/components/navigation/LocalizedLink";
import { ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";

const relatedPosts = [
  {
    title: "Hướng dẫn chuyển đổi số toàn diện cho SME",
    category: "Kiến thức",
    date: "05/07/2024",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format",
  },
  {
    title: "Cloud Computing: AWS vs Google Cloud vs Azure",
    category: "Công nghệ",
    date: "15/06/2024",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&auto=format",
  },
  {
    title: "Bảo mật thông tin doanh nghiệp: 10 nguyên tắc",
    category: "Bảo mật",
    date: "28/06/2024",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&auto=format",
  },
];

export default function PostDetail() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Link
            to="/bai-viet"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6"
          >
            <ArrowLeft size={15} />
            Quay lại danh sách tin tức
          </Link>

          {/* Categories & tag */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-medium text-white px-3 py-1 rounded-full"
              style={{ background: "var(--primary)" }}
            >
              Công nghệ
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              Trí tuệ nhân tạo
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 leading-tight mb-5">
            Xu hướng công nghệ AI trong năm 2024 và tác động sâu rộng đến doanh
            nghiệp Việt Nam
          </h1>

          {/* Author info */}
          <div
            className="flex items-center gap-4 mb-6 pb-6 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format"
              className="w-12 h-12 rounded-full object-cover"
              alt="Nguyễn Thị Hoa"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                Nguyễn Thị Hoa
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Chuyên gia Công nghệ AI</span>
                <span>·</span>
                <span>10/07/2024</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />8 phút đọc
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-xl border text-slate-500 hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                <Share2 size={15} />
              </button>
              <button
                className="p-2 rounded-xl border text-slate-500 hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                <Bookmark size={15} />
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-8">
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=675&fit=crop&auto=format"
              alt="AI Trends 2024"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article content */}
          <div className="prose max-w-none">
            <p className="text-slate-600 text-base leading-relaxed mb-5">
              Năm 2024 đánh dấu bước ngoặt quan trọng trong ứng dụng trí tuệ
              nhân tạo tại Việt Nam. Từ những mô hình ngôn ngữ lớn (LLM) như
              GPT-4 và Gemini cho đến các giải pháp AI chuyên biệt cho từng
              ngành, làn sóng AI đang tái định hình cách doanh nghiệp hoạt động
              và tạo ra giá trị.
            </p>

            <h2 className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">
              1. Generative AI: Không còn là thí nghiệm
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Nếu năm 2023 là năm của sự thử nghiệm với Generative AI, thì 2024
              là năm doanh nghiệp bắt đầu tích hợp nghiêm túc vào quy trình kinh
              doanh. Theo khảo sát của CMS với 300 doanh nghiệp Việt Nam, 68% đã
              triển khai ít nhất một ứng dụng AI trong hoạt động hàng ngày.
            </p>

            <div
              className="rounded-2xl p-6 my-6"
              style={{
                background: "#eff6ff",
                borderLeft: "4px solid var(--primary)",
              }}
            >
              <p className="text-blue-800 font-medium italic">
                "AI không thay thế con người, mà trao quyền cho con người làm
                được những điều mà trước đây chỉ là ước mơ." — Nguyễn Văn Hoàng,
                CEO CMS
              </p>
            </div>

            <h2 className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">
              2. AI trong chăm sóc khách hàng
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Chatbot và virtual assistant được nâng cấp mạnh mẽ nhờ LLM. Không
              còn là những bot trả lời cứng nhắc, các hệ thống AI mới có thể
              hiểu ngữ cảnh, xử lý tiếng Việt tự nhiên và thậm chí có khả năng
              nhận biết cảm xúc khách hàng. Điều này giúp giảm 40-60% tải cho bộ
              phận CSKH mà không làm giảm chất lượng trải nghiệm.
            </p>

            <h2 className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">
              3. Thách thức và cơ hội cho doanh nghiệp Việt
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Dù tiềm năng rõ ràng, việc ứng dụng AI không phải không có thách
              thức. Thiếu dữ liệu chất lượng cao, thiếu nhân lực hiểu biết AI,
              và lo ngại về quyền riêng tư vẫn là ba rào cản lớn nhất. Tuy
              nhiên, đây cũng là cơ hội cho các doanh nghiệp tiên phong xây dựng
              lợi thế cạnh tranh khó sao chép.
            </p>

            <div className="grid grid-cols-3 gap-4 my-8">
              {[
                ["68%", "Doanh nghiệp đã dùng AI"],
                ["40-60%", "Giảm tải CSKH"],
                ["3.2x", "ROI trung bình từ AI"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-2xl border"
                  style={{
                    borderColor: "var(--border)",
                    background: "#f8fafc",
                  }}
                >
                  <div className="font-display font-bold text-2xl text-slate-900 mb-1">
                    {num}
                  </div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            <h2 className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">
              4. Lộ trình ứng dụng AI cho doanh nghiệp
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                "Bắt đầu với use case đơn giản, đo lường được (chatbot, phân loại email)",
                "Đầu tư vào dữ liệu — dữ liệu chất lượng là nguyên liệu của AI",
                "Đào tạo nhân viên hiểu và làm việc cùng AI, không phải chống lại nó",
                "Thiết lập quy trình kiểm soát chất lượng đầu ra của AI",
                "Mở rộng dần sang các use case phức tạp hơn sau khi có nền tảng",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: "var(--primary)" }}
                  >
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-slate-600 text-base leading-relaxed">
              Kết luận: AI năm 2024 không còn là lựa chọn mà là điều kiện cần để
              duy trì tính cạnh tranh. Doanh nghiệp nào hành động sớm sẽ có lợi
              thế đáng kể trong 3-5 năm tới. CMS sẵn sàng đồng hành cùng bạn
              trên hành trình này.
            </p>
          </div>

          {/* Tags */}
          <div
            className="flex flex-wrap gap-2 mt-8 pt-6 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              "AI",
              "Machine Learning",
              "Chuyển đổi số",
              "Doanh nghiệp",
              "2024",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full border text-slate-600 hover:bg-slate-50 cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author card */}
          <div
            className="bg-white rounded-2xl border p-5 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format"
              className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              alt="Nguyễn Thị Hoa"
            />
            <h4 className="font-semibold text-slate-900">Nguyễn Thị Hoa</h4>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">
              Chuyên gia Công nghệ AI · CMS
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hơn 8 năm nghiên cứu và ứng dụng AI trong doanh nghiệp. Tác giả
              của 40+ bài viết chuyên sâu.
            </p>
          </div>

          {/* Related posts */}
          <div
            className="bg-white rounded-2xl border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <h4 className="font-display font-semibold text-slate-900 mb-4 text-sm">
              Bài viết liên quan
            </h4>
            <div className="space-y-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.title}
                  to="/bai-viet/bai-viet-1"
                  className="flex gap-3 group"
                >
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">
                      {post.category}
                    </p>
                    <h5 className="text-xs font-medium text-slate-700 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div
            className="rounded-2xl p-5 text-white"
            style={{ background: "var(--primary)" }}
          >
            <h4 className="font-display font-semibold mb-2">
              Đăng ký nhận tin
            </h4>
            <p className="text-blue-200 text-xs mb-3">
              Nhận bài viết mới nhất và insights hàng tuần từ CMS.
            </p>
            <input
              placeholder="Email của bạn..."
              className="w-full px-3 py-2 rounded-xl text-sm text-slate-900 outline-none mb-2 bg-white placeholder:text-slate-400"
            />
            <button className="w-full py-2 rounded-xl bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


