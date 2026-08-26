'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  Tag,
} from "lucide-react";

const initialCategories = [
  {
    id: 1,
    name: "Công nghệ",
    slug: "cong-nghe",
    posts: 124,
    children: [
      {
        id: 11,
        name: "Trí tuệ nhân tạo",
        slug: "tri-tue-nhan-tao",
        posts: 45,
        children: [],
      },
      { id: 12, name: "Lập trình", slug: "lap-trinh", posts: 67, children: [] },
      { id: 13, name: "Bảo mật", slug: "bao-mat", posts: 12, children: [] },
    ],
  },
  {
    id: 2,
    name: "Tin tức",
    slug: "tin-tuc",
    posts: 89,
    children: [
      {
        id: 21,
        name: "Tin công ty",
        slug: "tin-cong-ty",
        posts: 34,
        children: [],
      },
      {
        id: 22,
        name: "Thị trường",
        slug: "thi-truong",
        posts: 55,
        children: [],
      },
    ],
  },
  { id: 3, name: "Kiến thức", slug: "kien-thuc", posts: 76, children: [] },
  { id: 4, name: "Case Study", slug: "case-study", posts: 23, children: [] },
  { id: 5, name: "Marketing", slug: "marketing", posts: 41, children: [] },
];

const tags = [
  { id: 1, name: "AI", posts: 87 },
  { id: 2, name: "Machine Learning", posts: 54 },
  { id: 3, name: "React", posts: 43 },
  { id: 4, name: "Node.js", posts: 38 },
  { id: 5, name: "Chuyển đổi số", posts: 65 },
  { id: 6, name: "Cloud", posts: 29 },
  { id: 7, name: "DevOps", posts: 22 },
  { id: 8, name: "Blockchain", posts: 17 },
  { id: 9, name: "UX/UI", posts: 34 },
  { id: 10, name: "Agile", posts: 19 },
];

function CategoryItem({ item, depth = 0 }: any) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = item.children?.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 group"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-5 flex-shrink-0"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown size={14} className="text-slate-400" />
            ) : (
              <ChevronRight size={14} className="text-slate-400" />
            )
          ) : null}
        </button>
        {hasChildren ? (
          expanded ? (
            <FolderOpen size={15} className="text-amber-500 flex-shrink-0" />
          ) : (
            <Folder size={15} className="text-amber-500 flex-shrink-0" />
          )
        ) : (
          <Folder size={15} className="text-slate-300 flex-shrink-0" />
        )}
        <span className="flex-1 text-sm text-slate-700 font-medium">
          {item.name}
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {item.posts} bài
        </span>
        <span className="text-xs text-slate-300 font-mono hidden group-hover:inline">
          {item.slug}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50">
            <Edit size={12} />
          </button>
          <button className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children.map((child: any) => (
            <CategoryItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Categories() {
  const [activeTab, setActiveTab] = useState<"categories" | "tags">(
    "categories",
  );
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Quản lý Danh mục
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Quản lý danh mục và thẻ từ khóa bài viết
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { key: "categories", label: "Danh mục" },
          { key: "tags", label: "Thẻ từ khóa" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Tree / Tag list */}
        <div
          className="lg:col-span-3 bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b bg-slate-50"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-700">
              {activeTab === "categories" ? "Cây danh mục" : "Danh sách thẻ"}
            </h3>
          </div>
          <div className="p-2">
            {activeTab === "categories" ? (
              initialCategories.map((cat) => (
                <CategoryItem key={cat.id} item={cat} />
              ))
            ) : (
              <div className="flex flex-wrap gap-2 p-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 group"
                  >
                    <Tag size={12} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{tag.name}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {tag.posts}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 ml-1">
                      <button className="p-0.5 rounded text-slate-300 hover:text-blue-600">
                        <Edit size={11} />
                      </button>
                      <button className="p-0.5 rounded text-slate-300 hover:text-red-500">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add form */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              {activeTab === "categories"
                ? "Thêm danh mục mới"
                : "Thêm thẻ mới"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Tên {activeTab === "categories" ? "danh mục" : "thẻ"}
                </label>
                <input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, ""),
                    );
                  }}
                  placeholder="Nhập tên..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Đường dẫn (slug)
                </label>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="ten-danh-muc"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 font-mono"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              {activeTab === "categories" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Danh mục cha
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="">-- Danh mục gốc --</option>
                    {initialCategories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ngắn..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>
            <button
              className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "var(--primary)" }}
            >
              Thêm {activeTab === "categories" ? "Danh mục" : "Thẻ"}
            </button>
          </div>

          {/* Stats */}
          <div
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Thống kê
            </h3>
            <div className="space-y-2.5">
              {[
                {
                  label: "Tổng danh mục",
                  value:
                    initialCategories.length +
                    initialCategories.flatMap((c) => c.children).length,
                },
                { label: "Tổng thẻ từ khóa", value: tags.length },
                { label: "Bài viết đã phân loại", value: 384 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


