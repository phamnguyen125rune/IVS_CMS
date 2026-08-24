'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Edit,
  Eye,
  FileDown,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  CmsModuleKey,
  CmsRecord,
} from '@/lib/cms-demo-store';

type WorkspaceTone = 'blue' | 'emerald' | 'violet' | 'cyan' | 'slate';

interface AdminWorkspaceProps {
  moduleKey: CmsModuleKey;
  title: string;
  description: string;
  createLabel: string;
  searchPlaceholder?: string;
  tone?: WorkspaceTone;
  primaryStatuses?: string[];
  readonly?: boolean;
}

const defaultForm: Partial<CmsRecord> = {
  title: '',
  subtitle: '',
  type: '',
  status: 'ACTIVE',
  owner: '',
  description: '',
  imageUrl: '',
};

const toneClass: Record<WorkspaceTone, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25',
  emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
  violet: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/25',
  cyan: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/25',
  slate: 'bg-slate-800 hover:bg-slate-900 shadow-slate-600/20',
};

export default function AdminWorkspace({
  moduleKey,
  title,
  description,
  createLabel,
  searchPlaceholder = 'Tìm kiếm theo tên, mã, người phụ trách...',
  tone = 'blue',
  primaryStatuses = ['ACTIVE', 'PUBLISHED', 'READY', 'NEW'],
  readonly = false,
}: AdminWorkspaceProps) {
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState<CmsRecord | null>(null);
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [form, setForm] = useState<Partial<CmsRecord>>(defaultForm);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<CmsRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, statusFilter]);

  const statuses = useMemo(() => {
    const values = Array.from(new Set(records.map((record) => record.status).filter(Boolean)));
    return values.length > 0 ? values : primaryStatuses;
  }, [records, primaryStatuses]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchStatus = statusFilter === 'ALL' || record.status === statusFilter;
      const matchSearch =
        !keyword ||
        record.title.toLowerCase().includes(keyword) ||
        (record.subtitle || '').toLowerCase().includes(keyword) ||
        (record.owner || '').toLowerCase().includes(keyword) ||
        (record.type || '').toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [records, search, statusFilter]);

  const activeCount = records.filter((record) => primaryStatuses.includes(record.status)).length;
  const pendingCount = records.filter((record) =>
    ['PENDING', 'NEW', 'DRAFT'].includes(record.status)
  ).length;

  function openCreate() {
    setEditing(null);
    setForm({
      ...defaultForm,
      status: primaryStatuses[0] || 'ACTIVE',
      owner: 'Admin',
    });
    setFormOpen(true);
  }

  function openEdit(record: CmsRecord) {
    setEditing(record);
    setForm(record);
    setFormOpen(true);
  }

  async function loadRecords() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        moduleKey,
        status: statusFilter,
        page: '1',
        size: '200',
      });
      if (search.trim()) {
        params.set('search', search.trim());
      }
      const response = await fetch(`/api/cms-records?${params}`);
      const data = await readJson(response);
      setRecords(data.result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = toPayload(moduleKey, form);
      const response = await fetch(editing ? `/api/cms-records/${editing.id}` : '/api/cms-records', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await readJson(response);
      setEditing(null);
      setFormOpen(false);
      setForm(defaultForm);
      setNotice(editing ? 'Đã cập nhật dữ liệu' : 'Đã thêm dữ liệu mới');
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được dữ liệu');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(record: CmsRecord) {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/cms-records/${record.id}`, { method: 'DELETE' });
      await readJson(response);
      setDeleting(null);
      setNotice('Đã xóa dữ liệu');
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xóa được dữ liệu');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(record: CmsRecord, status: string) {
    setError(null);
    try {
      const response = await fetch(`/api/cms-records/${record.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await readJson(response);
      setNotice(`Đã chuyển trạng thái sang ${status}`);
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đổi được trạng thái');
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${moduleKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function refreshModule() {
    void loadRecords();
    setNotice('Đã tải lại dữ liệu từ server');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-950">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {!readonly && (
          <button
            type="button"
            onClick={openCreate}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition ${toneClass[tone]}`}
          >
            <Plus size={16} />
            {createLabel}
          </button>
        )}
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          {notice}
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="ml-auto rounded-full p-1 hover:bg-emerald-100"
            title="Đóng"
            aria-label="Đóng"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Tổng dữ liệu" value={records.length} />
        <Metric label="Đang hoạt động" value={activeCount} />
        <Metric label="Cần xử lý" value={pendingCount} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
          <div className="relative min-w-64 flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder={searchPlaceholder}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <FileDown size={15} />
            Xuất JSON
          </button>
          <button
            type="button"
            onClick={refreshModule}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={15} />
            Tải lại
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Tên</th>
                <th className="px-5 py-3">Loại</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Phụ trách</th>
                <th className="px-5 py-3">Cập nhật</th>
                <th className="px-5 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
                    Đang tải dữ liệu từ server...
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                <tr key={record.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {record.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={record.imageUrl}
                          alt={record.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-500">
                          {record.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-800">{record.title}</div>
                        <div className="text-xs text-slate-400">{record.subtitle || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{record.type}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-600">{record.owner}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{record.updatedAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <IconButton label="Xem" onClick={() => setSelected(record)}>
                        <Eye size={15} />
                      </IconButton>
                      {!readonly && (
                        <>
                          <IconButton label="Sửa" onClick={() => openEdit(record)}>
                            <Edit size={15} />
                          </IconButton>
                          <IconButton label="Xóa" onClick={() => setDeleting(record)}>
                            <Trash2 size={15} />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    Không có dữ liệu phù hợp.
                    {!readonly && (
                      <button
                        type="button"
                        onClick={openCreate}
                        className={`mx-auto mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${toneClass[tone]}`}
                      >
                        <Plus size={15} />
                        {createLabel}
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && !readonly && (
        <RecordModal
          title={editing ? 'Cập nhật dữ liệu' : createLabel}
          form={form}
          saving={saving}
          statuses={statuses}
          onChange={(payload) => setForm((value) => ({ ...value, ...payload }))}
          onClose={() => {
            setEditing(null);
            setFormOpen(false);
            setForm(defaultForm);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {selected && (
        <DetailModal
          record={selected}
          statuses={statuses}
          readonly={readonly}
          onClose={() => setSelected(null)}
          onStatus={(status) => {
            handleStatus(selected, status);
            setSelected((value) => (value ? { ...value, status } : value));
          }}
        />
      )}

      {deleting && (
        <ConfirmDelete
          record={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => handleDelete(deleting)}
        />
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = ['ACTIVE', 'PUBLISHED', 'READY', 'SUCCESS', 'REPLIED'].includes(status)
    ? 'bg-emerald-100 text-emerald-700'
    : ['PENDING', 'NEW', 'DRAFT'].includes(status)
      ? 'bg-amber-100 text-amber-700'
      : ['LOCKED', 'REJECTED', 'FAILED'].includes(status)
        ? 'bg-red-100 text-red-700'
        : 'bg-slate-100 text-slate-600';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
    >
      {children}
    </button>
  );
}

function RecordModal({
  title,
  form,
  statuses,
  saving,
  onChange,
  onClose,
  onSubmit,
}: {
  title: string;
  form: Partial<CmsRecord>;
  statuses: string[];
  saving: boolean;
  onChange: (payload: Partial<CmsRecord>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={onClose}>
      <form
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên">
            <input
              required
              value={form.title || ''}
              onChange={(event) => onChange({ title: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Slug / Email / Mô tả ngắn">
            <input
              value={form.subtitle || ''}
              onChange={(event) => onChange({ subtitle: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Loại">
            <input
              required
              value={form.type || ''}
              onChange={(event) => onChange({ type: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Trạng thái">
            <select
              value={form.status || statuses[0] || 'ACTIVE'}
              onChange={(event) => onChange({ status: event.target.value })}
              className={inputClass}
            >
              {Array.from(new Set([...statuses, 'ACTIVE', 'DRAFT', 'PENDING', 'PUBLISHED'])).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phụ trách">
            <input
              value={form.owner || ''}
              onChange={(event) => onChange({ owner: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Ảnh URL">
            <input
              value={form.imageUrl || ''}
              onChange={(event) => onChange({ imageUrl: event.target.value })}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Nội dung / ghi chú">
              <textarea
                value={form.description || ''}
                onChange={(event) => onChange({ description: event.target.value })}
                className={`${inputClass} min-h-28 py-3`}
              />
            </Field>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

function DetailModal({
  record,
  statuses,
  readonly,
  onClose,
  onStatus,
}: {
  record: CmsRecord;
  statuses: string[];
  readonly: boolean;
  onClose: () => void;
  onStatus: (status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{record.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{record.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        {record.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={record.imageUrl} alt={record.title} className="mt-5 h-56 w-full rounded-lg object-cover" />
        )}
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <Info label="Loại" value={record.type} />
          <Info label="Trạng thái" value={record.status} />
          <Info label="Phụ trách" value={record.owner} />
          <Info label="Cập nhật" value={record.updatedAt} />
        </div>
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">{record.description}</p>
        {!readonly && (
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from(new Set([...statuses, 'ACTIVE', 'PENDING', 'PUBLISHED', 'REJECTED'])).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatus(status)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Chuyển {status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDelete({
  record,
  onClose,
  onConfirm,
}: {
  record: CmsRecord;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-950">Xóa dữ liệu</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bạn có chắc chắn muốn xóa <span className="font-semibold">{record.title}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-slate-800">{value || '-'}</div>
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

function toPayload(moduleKey: CmsModuleKey, form: Partial<CmsRecord>) {
  return {
    moduleKey,
    title: form.title?.trim() || '',
    subtitle: form.subtitle?.trim() || '',
    type: form.type?.trim() || 'General',
    status: form.status?.trim() || 'ACTIVE',
    owner: form.owner?.trim() || 'Admin',
    description: form.description?.trim() || '',
    imageUrl: form.imageUrl?.trim() || '',
  };
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
