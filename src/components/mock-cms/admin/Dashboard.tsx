'use client';

import { useEffect, useState } from 'react';
import { BarChart3, FileText, FolderTree, Image, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { CmsRecord } from '@/lib/cms-demo-store';

type DashboardData = {
  posts: CmsRecord[];
  categories: CmsRecord[];
  media: CmsRecord[];
  forms: CmsRecord[];
  roles: CmsRecord[];
};

const emptyData: DashboardData = {
  posts: [],
  categories: [],
  media: [],
  forms: [],
  roles: [],
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const [posts, categories, media, forms, roles] = await Promise.all([
        fetchModule('posts'),
        fetchModule('categories'),
        fetchModule('media'),
        fetchModule('forms'),
        fetchModule('roles'),
      ]);
      setData({ posts, categories, media, forms, roles });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu tổng quan');
    } finally {
      setLoading(false);
    }
  }

  const metrics = [
    {
      label: 'Bài viết',
      value: data.posts.length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Chờ duyệt',
      value: data.posts.filter((post) => ['PENDING', 'DRAFT'].includes(post.status)).length,
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Danh mục',
      value: data.categories.length,
      icon: FolderTree,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      label: 'Media',
      value: data.media.length,
      icon: Image,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Biểu mẫu',
      value: data.forms.length,
      icon: Mail,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Vai trò',
      value: data.roles.length,
      icon: BarChart3,
      color: 'text-slate-600 bg-slate-100',
    },
  ];

  const activities = [...data.posts, ...data.forms, ...data.media]
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-950">Tổng quan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bảng điều khiển tổng hợp dữ liệu thật từ backend CMS.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center text-slate-500">
          <Loader2 className="mx-auto mb-2 animate-spin" size={22} />
          Đang tải dữ liệu từ backend...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">{metric.value}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${metric.color}`}
                  >
                    <metric.icon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-950">Tình trạng bài viết</h2>
              <div className="mt-5 space-y-4">
                {['PUBLISHED', 'PENDING', 'DRAFT', 'REJECTED'].map((status) => {
                  const count = data.posts.filter((post) => post.status === status).length;
                  const percent = data.posts.length
                    ? Math.round((count / data.posts.length) * 100)
                    : 0;
                  return (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-slate-600">{status}</span>
                        <span className="text-slate-400">{count} bài</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-950">Hoạt động gần đây</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {activities.map((item) => (
                  <div key={`${item.moduleKey}-${item.id}`} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.type} · {item.owner} · {formatDate(item.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

async function fetchModule(moduleKey: string) {
  const response = await fetch(`/api/cms-records?moduleKey=${moduleKey}&page=1&size=200`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Không tải được dữ liệu');
  }
  return (data.result || []) as CmsRecord[];
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }
  return value.slice(0, 10);
}
