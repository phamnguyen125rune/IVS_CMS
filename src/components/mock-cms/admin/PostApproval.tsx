'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Eye, Loader2, Search, X } from 'lucide-react';
import { CmsRecord } from '@/lib/cms-demo-store';

export default function PostApproval() {
  const [posts, setPosts] = useState<CmsRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CmsRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pendingPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return posts.filter((post) => {
      const waiting = ['PENDING', 'DRAFT'].includes(post.status);
      const matched =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        (post.owner || '').toLowerCase().includes(keyword) ||
        (post.type || '').toLowerCase().includes(keyword);
      return waiting && matched;
    });
  }, [posts, search]);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cms-records?moduleKey=posts&page=1&size=200');
      const data = await readJson(response);
      setPosts(data.result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được bài viết');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function changeStatus(post: CmsRecord, status: string) {
    setError(null);
    try {
      const response = await fetch(`/api/cms-records/${post.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await readJson(response);
      setSelected(null);
      setNotice(status === 'PUBLISHED' ? 'Đã duyệt và xuất bản bài viết' : 'Đã từ chối bài viết');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đổi được trạng thái bài viết');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-950">Quản lý Kiểm duyệt</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Duyệt nội dung trước khi xuất bản. Trạng thái được đồng bộ với backend Quản lý Bài viết.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          {pendingPosts.length} bài đang chờ
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

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề, tác giả, loại bài..."
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
              Đang tải bài viết từ backend...
            </div>
          ) : (
            pendingPosts.map((post) => (
              <article key={post.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex gap-4">
                  {post.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imageUrl} alt={post.title} className="h-20 w-28 rounded-lg object-cover" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                      {post.status}
                    </div>
                    <h2 className="mt-1 font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{post.description}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      {post.owner} · {post.type} · {formatDate(post.updatedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(post)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={15} />
                    Xem
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(post, 'REJECTED')}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    <X size={15} />
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(post, 'PUBLISHED')}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check size={15} />
                    Duyệt
                  </button>
                </div>
              </article>
            ))
          )}

          {!loading && pendingPosts.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Không có bài viết nào đang chờ kiểm duyệt.
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            {selected.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.imageUrl} alt={selected.title} className="mt-5 h-72 w-full rounded-lg object-cover" />
            )}
            <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              {selected.description}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => changeStatus(selected, 'REJECTED')}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={() => changeStatus(selected, 'PUBLISHED')}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Duyệt xuất bản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Có lỗi xảy ra');
  }
  return data;
}

function formatDate(value?: string) {
  return value ? value.slice(0, 10) : '-';
}
