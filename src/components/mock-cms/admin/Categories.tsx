'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Folder, Tag } from 'lucide-react';

import { categoryService } from '@/services/category.service';

function CategoryItem({ item, depth = 0, onEdit, onDelete }: any) {
  const [expanded, setExpanded] = useState(depth === 0);

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 group"
        style={{
          paddingLeft: `${12 + depth * 20}px`,
        }}
      >
        <button type="button" onClick={() => setExpanded(!expanded)} className="w-5 flex-shrink-0">
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

        <span className="flex-1 text-sm text-slate-700 font-medium">{item.name}</span>

        <span className="text-xs text-slate-400 font-mono">{item.posts || 0} bài</span>

        <span className="text-xs text-slate-300 font-mono hidden group-hover:inline">
          {item.slug}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit size={12} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item.id, 'categories')}
            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>
          {item.children.map((child: any) => (
            <CategoryItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Categories() {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [selectedParentId, setSelectedParentId] = useState('');

  // =========================
  // LOAD DATA
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [catData, tagData] = await Promise.all([
        categoryService.getAllCategories(),
        categoryService.getAllTags(),
      ]);

      setCategories(Array.isArray(catData) ? catData : (catData as any)?.data || []);

      setTags(Array.isArray(tagData) ? tagData : (tagData as any)?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục / tag:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchData();
    };
    loadInitialData();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setEditingId(null);
    setNewName('');
    setNewSlug('');
    setNewDescription('');
    setSelectedParentId('');
  };

  // =========================
  // SLUG
  // =========================

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async () => {
    if (!newName.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }

    try {
      const generatedSlug = newSlug.trim() || generateSlug(newName);

      // =========================
      // CATEGORY
      // =========================

      if (activeTab === 'categories') {
        const payload = {
          code: generatedSlug,
          name: newName.trim(),
          slug: generatedSlug,
          description: newDescription.trim(),
          status: 'ACTIVE',
          parentId: selectedParentId ? Number(selectedParentId) : null,
        };

        if (editingId !== null) {
          await categoryService.updateCategory(editingId, payload);
        } else {
          await categoryService.createCategory(payload);
        }
      }

      // =========================
      // TAG
      // =========================
      else {
        const payload = {
          code: generatedSlug,
          name: newName.trim(),
          slug: generatedSlug,
        };

        if (editingId !== null) {
          await categoryService.updateTag(editingId, payload);
        } else {
          await categoryService.createTag(payload);
        }
      }

      resetForm();

      await fetchData();

      alert('Thao tác thành công!');
    } catch (error: any) {
      console.error('Lỗi chi tiết từ backend:', error);

      const errorMsg = error?.message || 'Không thể thực hiện thao tác';

      alert(`Lỗi khi lưu vào database: ${errorMsg}`);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item: any) => {
    setEditingId(item.id);

    setNewName(item.name || '');
    setNewSlug(item.slug || '');

    setNewDescription(item.description || '');

    setSelectedParentId(item.parentId != null ? String(item.parentId) : '');
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number | string, type: 'categories' | 'tags' = activeTab) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này khỏi database?')) {
      return;
    }

    try {
      if (type === 'categories') {
        await categoryService.deleteCategory(id);
      } else {
        await categoryService.deleteTag(id);
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchData();
    } catch (error: any) {
      console.error('Lỗi khi xóa:', error);

      alert(`Không thể xóa mục này: ${error?.message || 'Lỗi backend'}`);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Danh mục</h1>

          <p className="text-slate-500 text-sm mt-0.5">Quản lý danh mục và thẻ từ khóa bài viết</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          {
            key: 'categories',
            label: 'Danh mục',
          },
          {
            key: 'tags',
            label: 'Thẻ từ khóa',
          },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key as 'categories' | 'tags');

              resetForm();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* =========================
            TREE / TAG LIST
        ========================= */}

        <div
          className="lg:col-span-3 bg-white rounded-xl border overflow-hidden"
          style={{
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="px-4 py-3 border-b bg-slate-50"
            style={{
              borderColor: 'var(--border)',
            }}
          >
            <h3 className="text-sm font-semibold text-slate-700">
              {activeTab === 'categories' ? 'Cây danh mục' : 'Danh sách thẻ'}
            </h3>
          </div>

          <div className="p-2">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-400">
                Đang tải dữ liệu từ database...
              </div>
            ) : activeTab === 'categories' ? (
              categories.length > 0 ? (
                categories.map((cat) => (
                  <CategoryItem
                    key={cat.id}
                    item={cat}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-400">
                  Chưa có danh mục nào trong database
                </div>
              )
            ) : (
              <div className="flex flex-wrap gap-2 p-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 group"
                    >
                      <Tag size={12} className="text-slate-400" />

                      <span className="text-sm text-slate-700">{tag.name}</span>

                      <span className="text-xs text-slate-400 font-mono">{tag.posts || 0}</span>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 ml-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(tag)}
                          className="p-0.5 rounded text-slate-300 hover:text-blue-600"
                        >
                          <Edit size={11} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(tag.id, 'tags')}
                          className="p-0.5 rounded text-slate-300 hover:text-red-500"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400 w-full">
                    Chưa có thẻ nào trong database
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        <div className="lg:col-span-2 space-y-4">
          <div
            className="bg-white rounded-xl border p-5"
            style={{
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingId !== null
                  ? activeTab === 'categories'
                    ? 'Chỉnh sửa danh mục'
                    : 'Chỉnh sửa thẻ'
                  : activeTab === 'categories'
                    ? 'Thêm danh mục mới'
                    : 'Thêm thẻ mới'}
              </h3>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Hủy
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* NAME */}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Tên {activeTab === 'categories' ? 'danh mục' : 'thẻ'}
                </label>

                <input
                  value={newName}
                  onChange={(e) => {
                    const value = e.target.value;

                    setNewName(value);

                    if (editingId === null) {
                      setNewSlug(generateSlug(value));
                    }
                  }}
                  placeholder="Nhập tên..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 text-slate-800"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Đường dẫn (slug)
                </label>

                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="ten-danh-muc"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 font-mono text-slate-800"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                />
              </div>

              {/* PARENT CATEGORY */}

              {activeTab === 'categories' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Danh mục cha
                  </label>

                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white text-slate-800"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <option value="">-- Danh mục gốc --</option>

                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* DESCRIPTION */}

              {activeTab === 'categories' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Mô tả</label>

                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Mô tả ngắn..."
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none text-slate-800"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
              style={{
                background: 'var(--primary)',
              }}
            >
              {editingId !== null
                ? 'Cập nhật'
                : `Thêm ${activeTab === 'categories' ? 'Danh mục' : 'Thẻ'}`}
            </button>
          </div>

          {/* =========================
              STATS
          ========================= */}

          <div
            className="bg-white rounded-xl border p-5"
            style={{
              borderColor: 'var(--border)',
            }}
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Thống kê</h3>

            <div className="space-y-2.5">
              {[
                {
                  label: 'Tổng danh mục',
                  value: categories.length,
                },
                {
                  label: 'Tổng thẻ từ khóa',
                  value: tags.length,
                },
                {
                  label: 'Bài viết đã phân loại',
                  value: 384,
                },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{stat.label}</span>

                  <span className="text-sm font-bold font-mono text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
