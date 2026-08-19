'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useLocalizedParams as useParams, useLocalizedNavigate as useNavigate } from "@/components/navigation/LocalizedLink";
import {
  ArrowLeft,
  Save,
  Send,
  ImagePlus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";

export default function PostEditor() {
  const { id } = useParams(); // Lấy ID từ URL (VD: /admin/bai-viet/sua/1 -> id = 1)
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Nếu có ID thì là chế độ chỉnh sửa

  // States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Công nghệ");
  const [author, setAuthor] = useState("admin");
  const [tags, setTags] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [status, setStatus] = useState("draft");

  // Giả lập Fetch Data khi ở chế độ Edit
  useEffect(() => {
    if (isEditMode) {
      // Ví dụ: Load data của bài viết có ID = 1 (Lấy 1 bài mẫu chi tiết)
      // Trong thực tế, bạn sẽ gọi API fetch bài viết theo id ở đây
      const mockPostDetail = {
        title: "Xu hướng công nghệ AI trong năm 2024",
        content:
          "Năm 2024 đánh dấu bước ngoặt quan trọng trong ứng dụng trí tuệ nhân tạo tại Việt Nam. Từ những mô hình ngôn ngữ lớn (LLM) như GPT-4 và Gemini cho đến các giải pháp AI chuyên biệt cho từng ngành...\n\nNếu năm 2023 là năm của sự thử nghiệm với Generative AI, thì 2024 là năm doanh nghiệp bắt đầu tích hợp nghiêm túc vào quy trình kinh doanh.",
        category: "Công nghệ",
        author: "hoang",
        tags: "AI, Technology, 2024",
        metaDesc:
          "Bài viết tổng hợp chuyên sâu về xu hướng công nghệ trí tuệ nhân tạo (AI) sẽ thống trị trong năm 2024 tại thị trường doanh nghiệp Việt Nam.",
        status: "published",
      };

      setTitle(mockPostDetail.title);
      setContent(mockPostDetail.content);
      setCategory(mockPostDetail.category);
      setAuthor(mockPostDetail.author);
      setTags(mockPostDetail.tags);
      setMetaDesc(mockPostDetail.metaDesc);
      setStatus(mockPostDetail.status);
    }
  }, [id, isEditMode]);

  // Xử lý khi submit form
  const handleSubmit = (
    e: React.FormEvent,
    submitStatus: "draft" | "published",
  ) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      category,
      author,
      tags,
      metaDesc,
      status: submitStatus,
    };

    if (isEditMode) {
      console.log(`Đã cập nhật bài viết ID ${id}:`, payload);
    } else {
      console.log("Đã tạo mới bài viết:", payload);
    }

    navigate("/admin/bai-viet");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500 transition-colors bg-white"
            style={{ borderColor: "var(--border)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {isEditMode
                ? `Đang chỉnh sửa bản ghi #${id}`
                : "Soạn thảo và cấu hình thông tin bài viết"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => handleSubmit(e as any, "draft")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <Save size={16} />
            {isEditMode && status === "draft"
              ? "Lưu lại bản nháp"
              : "Lưu bản nháp"}
          </button>
          <button
            onClick={(e) => handleSubmit(e as any, "published")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "var(--primary)" }}
          >
            <Send size={16} />
            {isEditMode && status === "published"
              ? "Cập nhật bài viết"
              : "Xuất bản ngay"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (Nội dung chính) */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="bg-white rounded-2xl border p-1"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-5 py-4 text-xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
            />

            {/* Toolbar (Mockup) */}
            <div
              className="flex items-center flex-wrap gap-1 px-4 py-2 border-y bg-slate-50/50"
              style={{ borderColor: "var(--border)" }}
            >
              {[Bold, Italic, Underline, LinkIcon].map((Icon, i) => (
                <button
                  key={i}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded"
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="w-px h-4 bg-slate-300 mx-2" />
              {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
                <button
                  key={i + 4}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded"
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="w-px h-4 bg-slate-300 mx-2" />
              {[List, ListOrdered].map((Icon, i) => (
                <button
                  key={i + 7}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded"
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="w-px h-4 bg-slate-300 mx-2" />
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 px-2 py-1 hover:bg-slate-200 rounded">
                Paragraph <ChevronDown size={14} />
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết nội dung của bạn ở đây..."
              className="w-full px-5 py-4 min-h-[500px] text-slate-700 outline-none resize-y bg-transparent"
            ></textarea>
          </div>

          <div
            className="bg-white rounded-2xl border p-6"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="font-bold text-slate-900 mb-4">Cấu hình SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Mô tả Meta
                </label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                  placeholder="Nhập mô tả ngắn gọn..."
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Đường dẫn thân thiện (Slug)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 text-slate-500 bg-slate-50"
                  style={{ borderColor: "var(--border)" }}
                  value={title
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/đ/g, "d")
                    .replace(/[^a-z0-9]/g, "-")
                    .replace(/-+/g, "-")}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải (Sidebar) */}
        <div className="space-y-6">
          <div
            className="bg-white rounded-2xl border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="font-bold text-slate-900 mb-4">Thông tin chung</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Chuyên mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Tin tức">Tin tức</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Tác giả
                </label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="admin">Nguyễn Văn Admin</option>
                  <option value="hoang">Trần Minh Hoàng</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Thẻ (Tags)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ví dụ: AI, công nghệ,..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="font-bold text-slate-900 mb-4">
              Ảnh đại diện (Thumbnail)
            </h3>
            <div
              className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <ImagePlus size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Click để tải ảnh lên
              </p>
              <p className="text-xs text-slate-400">
                Định dạng JPG, PNG. Tối đa 2MB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


