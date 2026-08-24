'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Save, Send } from 'lucide-react';
import { useLocalizedNavigate, useLocalizedParams } from '@/components/navigation/LocalizedLink';
import { CmsRecord } from '@/lib/cms-demo-store';

const emptyPost: Partial<CmsRecord> = {
  title: '',
  subtitle: '',
  type: 'Tin tức',
  status: 'DRAFT',
  owner: 'Admin',
  description: '',
  imageUrl: '',
};

export default function PostEditor() {
  const navigate = useLocalizedNavigate();
  const params = useLocalizedParams();
  const postId = typeof params.id === 'string' ? Number(params.id) : null;
  const [form, setForm] = useState<Partial<CmsRecord>>(emptyPost);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (postId) {
      void loadPost(postId);
    }
  }, [postId]);

  async function loadPost(id: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cms-records?moduleKey=posts&page=1&size=200');
      const data = await readJson(response);
      const post = (data.result || []).find((item: CmsRecord) => item.id === id);
      if (post) {
        setForm(post);
      } else {
        setError('Không tìm thấy bài viết cần sửa');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được bài viết');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void savePost();
  }

  async function savePost(status?: string) {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        moduleKey: 'posts',
        title: form.title?.trim() || '',
        subtitle: form.subtitle?.trim() || '',
        type: form.type?.trim() || 'Tin tức',
        status: status || form.status || 'DRAFT',
        owner: form.owner?.trim() || 'Admin',
        description: form.description?.trim() || '',
        imageUrl: form.imageUrl?.trim() || '',
      };
      const response = await fetch(postId ? `/api/cms-records/${postId}` : '/api/cms-records', {
        method: postId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await readJson(response);
      setNotice(status === 'PENDING' ? 'Đã gửi bài vào luồng kiểm duyệt' : 'Đã lưu bài viết');
      if (!postId) {
        setForm(emptyPost);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được bài viết');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/bai-viet')}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách
          </button>
          <h1 className="font-display text-xl font-bold text-slate-950">
            {postId ? 'Sửa bài viết' : 'Tạo bài viết'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Soạn nội dung và lưu trực tiếp vào database qua backend Spring Boot.
          </p>
        </div>
      </div>

      {notice && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center text-slate-500">
          <Loader2 className="mx-auto mb-2 animate-spin" size={22} />
          Đang tải bài viết...
        </div>
      ) : (
        <form className="grid gap-5 xl:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
          <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <Field label="Tiêu đề">
              <input
                required
                value={form.title || ''}
                onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                className={inputClass}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.subtitle || ''}
                onChange={(event) => setForm((value) => ({ ...value, subtitle: event.target.value }))}
                className={inputClass}
                placeholder="slug-bai-viet"
              />
            </Field>
            <Field label="Nội dung">
              <textarea
                required
                value={form.description || ''}
                onChange={(event) =>
                  setForm((value) => ({ ...value, description: event.target.value }))
                }
                className={`${inputClass} min-h-[320px] py-3 leading-7`}
                placeholder="Viết nội dung bài viết..."
              />
            </Field>
          </section>

          <aside className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-950">Thuộc tính</h2>
              <div className="mt-4 space-y-4">
                <Field label="Loại bài">
                  <select
                    value={form.type || 'Tin tức'}
                    onChange={(event) => setForm((value) => ({ ...value, type: event.target.value }))}
                    className={inputClass}
                  >
                    <option>Tin tức</option>
                    <option>Kiến thức</option>
                    <option>Hướng dẫn</option>
                    <option>Dự án</option>
                  </select>
                </Field>
                <Field label="Trạng thái">
                  <select
                    value={form.status || 'DRAFT'}
                    onChange={(event) =>
                      setForm((value) => ({ ...value, status: event.target.value }))
                    }
                    className={inputClass}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </Field>
                <Field label="Tác giả">
                  <input
                    value={form.owner || ''}
                    onChange={(event) =>
                      setForm((value) => ({ ...value, owner: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Ảnh đại diện">
                  <input
                    value={form.imageUrl || ''}
                    onChange={(event) =>
                      setForm((value) => ({ ...value, imageUrl: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:bg-slate-400"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost('PENDING')}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  <Send size={16} />
                  Gửi kiểm duyệt
                </button>
              </div>
            </section>
          </aside>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Có lỗi xảy ra');
  }
  return data;
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
