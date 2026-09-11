'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit, Folder, Tag as TagIcon, Trash2 } from 'lucide-react';

import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import type { PostCategory } from '@/types/category.type';
import type { Tag } from '@/types/tag.type';

type Tab = 'categories' | 'tags';

interface CategoriesProps {
  initialTab?: Tab;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Categories({ initialTab = 'categories' }: CategoriesProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState<PostCategory | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [categoryData, tagData] = await Promise.all([
        categoryService.getAllCategories(),
        tagService.getAllTags(),
      ]);
      setCategories(categoryData);
      setTags(tagData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải danh mục và thẻ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) setSlug(slugify(value));
  };

  const submit = async () => {
    if (!name.trim()) {
      setError(
        activeTab === 'categories' ? 'Vui lòng nhập tên danh mục.' : 'Vui lòng nhập tên thẻ.'
      );
      return;
    }

    try {
      setBusy(true);
      setError('');

      if (activeTab === 'categories') {
        if (editingCategory) {
          await categoryService.updateCategory(editingCategory.categoryId, {
            categoryName: name.trim(),
          });
        } else {
          const finalSlug = slug.trim() || slugify(name);
          await categoryService.createCategory({
            categoryName: name.trim(),
            slug: finalSlug,
          });
        }
      } else {
        const finalSlug = slug.trim() || slugify(name);
        await tagService.createTag({
          tagName: name.trim(),
          slug: finalSlug,
        });
      }

      resetForm();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể lưu dữ liệu.');
    } finally {
      setBusy(false);
    }
  };

  const removeCategory = async (item: PostCategory) => {
    if (!confirm(`Xóa danh mục “${item.categoryName}”?`)) return;

    try {
      setBusy(true);
      setError('');
      await categoryService.deleteCategory(item.categoryId);

      if (editingCategory?.categoryId === item.categoryId) {
        resetForm();
      }

      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể xóa danh mục.');
    } finally {
      setBusy(false);
    }
  };

  const removeTag = async (item: Tag) => {
    if (!confirm(`Xóa thẻ “${item.tagName}”?`)) return;

    try {
      setBusy(true);
      setError('');
      await tagService.deleteTag(item.tagId);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể xóa thẻ.');
    } finally {
      setBusy(false);
    }
  };

  const stats = useMemo(
    () => [
      { label: 'Tổng danh mục', value: categories.length },
      { label: 'Tổng thẻ từ khóa', value: tags.length },
    ],
    [categories.length, tags.length]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-display text-xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Quản lý Danh mục
          </h1>

          <p
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Quản lý danh mục và thẻ từ khóa bài viết
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mb-5 rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: 'var(--error-light)',
            background: 'var(--error-light)',
            color: 'var(--error)',
          }}
        >
          {error}
        </div>
      )}

      <div
        className="flex gap-1 mb-5 p-1 rounded-xl w-fit"
        style={{ background: 'var(--surface-tertiary)' }}
      >
        {[
          { key: 'categories' as const, label: 'Danh mục' },
          { key: 'tags' as const, label: 'Thẻ từ khóa' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key);
              resetForm();
              setError('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'shadow-sm'
                : 'hover:opacity-80'
            }`}
            style={
              activeTab === key
                ? {
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }
                : {
                    color: 'var(--text-muted)',
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div
          className="lg:col-span-3 rounded-xl border overflow-hidden"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {activeTab === 'categories' ? 'Danh sách danh mục' : 'Danh sách thẻ'}
            </h3>
          </div>

          <div className="p-2 min-h-40">
            {loading ? (
              <div
                className="p-8 text-center text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Đang tải dữ liệu...
              </div>
            ) : activeTab === 'categories' ? (
              categories.length ? (
                categories.map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl group"
                    style={{ color: 'var(--text)' }}
                  >
                    <span className="w-5 shrink-0" />

                    <Folder
                      size={15}
                      className="text-amber-500 shrink-0"
                    />

                    <span
                      className="flex-1 text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.categoryName}
                    </span>

                    <span
                      className="text-xs font-mono hidden sm:inline"
                      style={{ color: 'var(--text-placeholder)' }}
                    >
                      {item.slug || '-'}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(item);
                          setName(item.categoryName);
                          setSlug(item.slug || '');
                        }}
                        className="p-1 rounded transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        title="Đổi tên"
                      >
                        <Edit size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeCategory(item)}
                        className="p-1 rounded transition-colors disabled:opacity-40"
                        style={{ color: 'var(--text-muted)' }}
                        title="Xóa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="p-8 text-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Chưa có danh mục.
                </div>
              )
            ) : tags.length ? (
              <div className="flex flex-wrap gap-2 p-2">
                {tags.map((item) => (
                  <div
                    key={item.tagId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent group"
                    style={{
                      background: 'var(--surface-secondary)',
                    }}
                  >
                    <TagIcon
                      size={12}
                      style={{ color: 'var(--text-muted)' }}
                    />

                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.tagName}
                    </span>

                    {item.slug && (
                      <span
                        className="text-[11px] font-mono"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {item.slug}
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeTag(item)}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 disabled:opacity-40"
                      style={{ color: 'var(--text-placeholder)' }}
                      title="Xóa thẻ"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="p-8 text-center text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Chưa có thẻ.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div
            className="rounded-xl border p-5"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--text)' }}
            >
              {activeTab === 'categories'
                ? editingCategory
                  ? 'Đổi tên danh mục'
                  : 'Thêm danh mục mới'
                : 'Thêm thẻ mới'}
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Tên {activeTab === 'categories' ? 'danh mục' : 'thẻ'}
                </label>

                <input
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Nhập tên..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Đường dẫn (slug)
                </label>

                <input
                  value={slug}
                  disabled={Boolean(editingCategory)}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="ten-danh-muc"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none font-mono disabled:opacity-60"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />

                {editingCategory && (
                  <p
                    className="text-[11px] mt-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Backend hiện chỉ hỗ trợ đổi tên, không đổi slug.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {editingCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                    background: 'var(--surface)',
                  }}
                >
                  Hủy
                </button>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={submit}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {busy
                  ? 'Đang lưu...'
                  : activeTab === 'categories'
                    ? editingCategory
                      ? 'Lưu thay đổi'
                      : 'Thêm Danh mục'
                    : 'Thêm Thẻ'}
              </button>
            </div>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text)' }}
            >
              Thống kê
            </h3>

            <div className="space-y-2.5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center"
                >
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {stat.label}
                  </span>

                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: 'var(--text)' }}
                  >
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