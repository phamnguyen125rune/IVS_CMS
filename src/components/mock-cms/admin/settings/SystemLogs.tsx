'use client';

import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  // Clock,
  Copy,
  Download,
  Eye,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { auditLogService } from '@/services/audit-log.service';
import type {
  AuditLog,
  AuditLogFilterParams,
  AuditLogSearchResponse,
} from '@/types/audit-log.type';

export default function SystemLogs() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<AuditLogSearchResponse | null>(null);

  // Hidden native date input refs to trigger calendar popup
  const fromDatePickerRef = useRef<HTMLInputElement>(null);
  const toDatePickerRef = useRef<HTMLInputElement>(null);

  // Helper functions for Date formatting (dd/mm/yyyy and 24h HH:mm)
  const formatDMY = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatHM = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Convert "dd/mm/yyyy" to "YYYY-MM-DD" for backend API
  const dmyToYmd = (dmy: string): string | undefined => {
    if (!dmy) return undefined;
    const parts = dmy.trim().split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d && m && y && y.length === 4) {
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dmy.trim())) {
      return dmy.trim();
    }
    return undefined;
  };

  // Convert "YYYY-MM-DD" to "dd/mm/yyyy"
  const ymdToDmy = (ymd: string): string => {
    if (!ymd) return '';
    const parts = ymd.trim().split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}/${m}/${y}`;
    }
    return ymd;
  };

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [preset, setPreset] = useState('7d');
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return formatDMY(d);
  });
  const [fromTime, setFromTime] = useState<string>('');
  const [toDate, setToDate] = useState<string>(() => formatDMY(new Date()));
  const [toTime, setToTime] = useState<string>('');

  const [statusGroup, setStatusGroup] = useState('ALL');
  const [entityType] = useState('');
  const anonymousOnly = false;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal detail log state
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedOld, setCopiedOld] = useState(false);
  const [copiedNew, setCopiedNew] = useState(false);

  // Handle Preset change
  const handlePresetChange = (newPreset: string) => {
    setPreset(newPreset);
    setPage(1);
    if (newPreset === 'custom') return;

    const now = new Date();
    let past = new Date();
    if (newPreset === '1h') {
      past = new Date(now.getTime() - 60 * 60 * 1000);
    } else if (newPreset === '24h') {
      past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (newPreset === '7d') {
      past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (newPreset === '30d') {
      past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setFromDate(formatDMY(past));
    setFromTime(newPreset === '1h' || newPreset === '24h' ? formatHM(past) : '');
    setToDate(formatDMY(now));
    setToTime(newPreset === '1h' || newPreset === '24h' ? formatHM(now) : '');
  };

  // Handle Calendar / Date change
  const handleDateChange = (type: 'from' | 'to', val: string) => {
    if (type === 'from') {
      setFromDate(val);
      if (val && toDate) {
        setPreset('custom');
      }
    } else {
      setToDate(val);
      if (fromDate && val) {
        setPreset('custom');
      }
    }
    setPage(1);
  };

  // Handle Manual Time change (24h)
  const handleTimeChange = (type: 'from' | 'to', val: string) => {
    if (type === 'from') {
      setFromTime(val);
      if (fromDate && toDate) {
        setPreset('custom');
      }
    } else {
      setToTime(val);
      if (fromDate && toDate) {
        setPreset('custom');
      }
    }
    setPage(1);
  };

  // Build params for API based on ReqAuditLogFilterDTO
  const buildDateParams = useCallback(() => {
    let fromParam: string | undefined = undefined;
    let toParam: string | undefined = undefined;
    let fromDateParam: string | undefined = undefined;
    let toDateParam: string | undefined = undefined;

    const fromYMD = dmyToYmd(fromDate);
    const toYMD = dmyToYmd(toDate);

    if (preset === 'custom') {
      if (fromYMD) {
        const trimmed = fromTime.trim();
        if (trimmed && trimmed !== '00:00') {
          // Thời gian 24h khác 0: kết hợp thành LocalDateTime ISO
          fromParam = `${fromYMD}T${trimmed}:00`;
        } else {
          fromDateParam = fromYMD;
        }
      }

      if (toYMD) {
        const trimmed = toTime.trim();
        if (trimmed && trimmed !== '00:00' && trimmed !== '23:59') {
          // Thời gian 24h khác 0: kết hợp thành LocalDateTime ISO
          toParam = `${toYMD}T${trimmed}:00`;
        } else {
          toDateParam = toYMD;
        }
      }
    }

    return {
      preset: preset !== 'custom' ? preset : undefined,
      from: fromParam,
      to: toParam,
      fromDate: fromDateParam,
      toDate: toDateParam,
    };
  }, [preset, fromDate, fromTime, toDate, toTime]);

  // Fetch logs on filter/page change
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const dateParams = buildDateParams();
        const params: AuditLogFilterParams = {
          page,
          size: pageSize,
          ...dateParams,
          keyword: keyword.trim() || undefined,
          statusGroup: statusGroup !== 'ALL' ? statusGroup : undefined,
          entityType: entityType || undefined,
          anonymousOnly: anonymousOnly ? true : undefined,
        };

        const res = await auditLogService.getAuditLogs(params);
        if (active) {
          setData(res);
        }
      } catch (error) {
        console.error('Lỗi khi tải nhật ký hệ thống:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [page, pageSize, buildDateParams, keyword, statusGroup, entityType, anonymousOnly]);

  // Manual fetch for Refresh button
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const dateParams = buildDateParams();
      const params: AuditLogFilterParams = {
        page,
        size: pageSize,
        ...dateParams,
        keyword: keyword.trim() || undefined,
        statusGroup: statusGroup !== 'ALL' ? statusGroup : undefined,
        entityType: entityType || undefined,
        anonymousOnly: anonymousOnly ? true : undefined,
      };

      const res = await auditLogService.getAuditLogs(params);
      setData(res);
    } catch (error) {
      console.error('Lỗi khi tải nhật ký hệ thống:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, buildDateParams, keyword, statusGroup, entityType, anonymousOnly]);

  // Handle Export CSV
  const handleExport = async () => {
    try {
      setExporting(true);
      const dateParams = buildDateParams();
      const params: AuditLogFilterParams = {
        ...dateParams,
        keyword: keyword.trim() || undefined,
        statusGroup: statusGroup !== 'ALL' ? statusGroup : undefined,
        entityType: entityType || undefined,
        anonymousOnly: anonymousOnly ? true : undefined,
      };
      await auditLogService.exportAuditLogs(params, 5000);
    } catch (error) {
      console.error('Lỗi khi xuất CSV:', error);
      alert('Không thể xuất file CSV. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleCopy = (content: unknown, isOld: boolean) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(text);
    if (isOld) {
      setCopiedOld(true);
      setTimeout(() => setCopiedOld(false), 2000);
    } else {
      setCopiedNew(true);
      setTimeout(() => setCopiedNew(false), 2000);
    }
  };

  const formatPayload = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return val;
      }
    }
    return JSON.stringify(val, null, 2);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (code: number) => {
    return (
      <span className="font-mono text-xs" style={{ color: 'var(--text)' }}>
        {code}
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    return (
      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
        {action}
      </span>
    );
  };

  const summary = data?.summary;
  const meta = data?.meta;
  const items = data?.items || [];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* 1. Header & Actions */}
      <div
        className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text)' }}>
            Nhật ký hệ thống (Audit Logs)
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Theo dõi và truy vết toàn bộ thao tác, thay đổi dữ liệu của quản trị viên và hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download size={14} />
            {exporting ? 'Đang xuất...' : 'Xuất CSV'}
          </button>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-2 text-xs"
        style={{
          background: 'var(--surface-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="rounded-lg border px-2.5 py-1 text-xs font-medium outline-none focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            >
              <option value="1h">1 giờ qua</option>
              <option value="24h">24 giờ qua</option>
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          <span className="text-gray-300 dark:text-gray-600">|</span>

          {/* Hidden inputs to trigger native browser calendar popup */}
          <input
            ref={fromDatePickerRef}
            type="date"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              if (e.target.value) {
                handleDateChange('from', ymdToDmy(e.target.value));
              }
            }}
          />
          <input
            ref={toDatePickerRef}
            type="date"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              if (e.target.value) {
                handleDateChange('to', ymdToDmy(e.target.value));
              }
            }}
          />

          {/* From Date & Time */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                try {
                  fromDatePickerRef.current?.showPicker();
                } catch {
                  fromDatePickerRef.current?.click();
                }
              }}
              className="text-gray-400 transition-colors hover:text-[var(--primary)]"
            >
              <Calendar size={13} />
            </button>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Từ:
            </span>
            <input
              type="text"
              value={fromDate}
              onChange={(e) => handleDateChange('from', e.target.value)}
              placeholder="dd/mm/yyyy"
              maxLength={10}
              className="w-24 rounded-md border px-1.5 py-0.5 text-center text-xs outline-none focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
            <input
              type="text"
              value={fromTime}
              onChange={(e) => handleTimeChange('from', e.target.value)}
              placeholder="HH:mm"
              maxLength={5}
              className="w-14 rounded-md border px-1 py-0.5 text-center text-xs outline-none focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
          </div>

          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            đến
          </span>

          {/* To Date & Time */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                try {
                  toDatePickerRef.current?.showPicker();
                } catch {
                  toDatePickerRef.current?.click();
                }
              }}
              className="text-gray-400 transition-colors hover:text-[var(--primary)]"
            >
              <Calendar size={13} />
            </button>
            <input
              type="text"
              value={toDate}
              onChange={(e) => handleDateChange('to', e.target.value)}
              placeholder="dd/mm/yyyy"
              maxLength={10}
              className="w-24 rounded-md border px-1.5 py-0.5 text-center text-xs outline-none focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
            <input
              type="text"
              value={toTime}
              onChange={(e) => handleTimeChange('to', e.target.value)}
              placeholder="HH:mm"
              maxLength={5}
              className="w-14 rounded-md border px-1 py-0.5 text-center text-xs outline-none focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            />
          </div>
        </div>

        {/* Right: Summary KPI Metrics */}
        {summary && (
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <div className="flex items-center gap-1">
              <span>Tổng:</span>
              <strong style={{ color: 'var(--text)' }}>
                {summary.totalRecords.toLocaleString()}
              </strong>
              <span className="text-[10px] text-gray-400">({summary.executionTimeMs}ms)</span>
            </div>

            <span className="text-gray-300 dark:text-gray-600">•</span>

            <div className="flex items-center gap-1">
              <span>2xx:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {summary.healthRatio.success2xx.toLocaleString()}
              </strong>
            </div>

            <span className="text-gray-300 dark:text-gray-600">•</span>

            <div className="flex items-center gap-1">
              <span>4xx:</span>
              <strong className="text-amber-600 dark:text-amber-400">
                {summary.healthRatio.clientError4xx.toLocaleString()}
              </strong>
            </div>

            <span className="text-gray-300 dark:text-gray-600">•</span>

            <div className="flex items-center gap-1">
              <span>5xx:</span>
              <strong className="text-rose-600 dark:text-rose-400">
                {summary.healthRatio.serverError5xx.toLocaleString()}
              </strong>
            </div>

            <span className="text-gray-300 dark:text-gray-600">•</span>

            <div className="flex items-center gap-1">
              <span>Tỷ lệ lỗi:</span>
              <strong
                className={
                  summary.healthRatio.errorRatePercent > 0 ? 'text-rose-500' : 'text-emerald-500'
                }
              >
                {summary.healthRatio.errorRatePercent}%
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter Controls */}
      <div
        className="flex flex-wrap items-center gap-3 border-b p-4 text-xs"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Search keyword */}
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo thao tác hoặc thực thể..."
            className="w-full rounded-lg border py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[var(--primary)]"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          />
        </div>

        {/* Status Group */}
        <select
          value={statusGroup}
          onChange={(e) => {
            setStatusGroup(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-2.5 py-1.5 text-xs outline-none focus:border-[var(--primary)]"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
          }}
        >
          <option value="ALL">Tất cả mã HTTP</option>
          <option value="2XX">2XX (Thành công)</option>
          <option value="4XX">4XX (Lỗi Client)</option>
          <option value="5XX">5XX (Lỗi Server)</option>
          <option value="ERRORS">Mã lỗi (&gt;= 400)</option>
        </select>

        {/* Entity Type */}
        {/* <select
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-2.5 py-1.5 text-xs outline-none focus:border-[var(--primary)]"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
          }}
        >
          <option value="">Tất cả thực thể</option>
          <option value="USER">USER</option>
          <option value="POST">POST</option>
          <option value="CATEGORY">CATEGORY</option>
          <option value="ROLE">ROLE</option>
          <option value="AUTH">AUTH</option>
          <option value="MEDIA">MEDIA</option>
          <option value="TAG">TAG</option>
        </select> */}

        {/* Anonymous Only checkbox */}
        {/* <label className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
          <input
            type="checkbox"
            checked={anonymousOnly}
            onChange={(e) => {
              setAnonymousOnly(e.target.checked);
              setPage(1);
            }}
            className="rounded"
          />
          <span style={{ color: 'var(--text-muted)' }}>Only Admin</span>
        </label> */}
      </div>

      {/* 4. Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Thời gian</th>
              <th className="px-4 py-3 font-semibold">Người thực hiện</th>
              <th className="px-4 py-3 font-semibold">Thực thể/ID</th>
              <th className="px-4 py-3 font-semibold">Hành động</th>
              <th className="px-4 py-3 font-semibold">Mã HTTP</th>
              <th className="px-4 py-3 text-right font-semibold">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RefreshCw size={20} className="mx-auto mb-2 animate-spin" />
                  Đang tải nhật ký hệ thống...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Không tìm thấy bản ghi nhật ký nào phù hợp.
                </td>
              </tr>
            ) : (
              items.map((log) => (
                <tr
                  key={log.logId}
                  className="border-b transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400">#{log.logId}</td>

                  <td
                    className="px-4 py-3 whitespace-nowrap font-mono text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {formatDate(log.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    {log.userId ? (
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        User #{log.userId}
                      </span>
                    ) : (
                      <span className="rounded bg-gray-500/10 px-1.5 py-0.5 text-[10px] text-gray-400">
                        Unknown
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: 'var(--text)' }}
                    >
                      {log.entityType}
                    </span>
                    {log.entityId !== null && (
                      <span className="ml-1 text-[11px] text-gray-400">#{log.entityId}</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{getActionBadge(log.action)}</td>

                  <td className="px-4 py-3">{getStatusBadge(log.statusCode)}</td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors hover:bg-[var(--primary)] hover:text-white"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                      }}
                    >
                      <Eye size={12} />
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination Footer */}
      {meta && (
        <div
          className="flex flex-col items-center justify-between gap-3 border-t p-4 text-xs sm:flex-row"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span>
              Trang <strong>{meta.page}</strong> / {meta.pages || 1} (Tổng{' '}
              <strong>{meta.total.toLocaleString()}</strong> bản ghi)
            </span>
            <span>•</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border bg-transparent px-2 py-1 text-xs outline-none"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={meta.page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <ChevronLeft size={14} /> Trang trước
            </button>

            <button
              type="button"
              disabled={meta.page >= meta.pages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Trang sau <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 6. Modal Xem Chi Tiết JSON Payload */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b p-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[var(--primary)]">
                  Log #{selectedLog.logId}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  {selectedLog.action} {selectedLog.entityType} #{selectedLog.entityId}
                </span>
                {getStatusBadge(selectedLog.statusCode)}
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2">
              {/* Old Value */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-500">Request</span>
                  {selectedLog.oldValue != null && (
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedLog.oldValue, true)}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[var(--text)]"
                    >
                      {copiedOld ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedOld ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  )}
                </div>
                <div className="flex-1 rounded-xl bg-gray-900 p-3 font-mono text-[11px] text-emerald-400 overflow-auto max-h-[350px]">
                  {selectedLog.oldValue != null ? (
                    <pre>{formatPayload(selectedLog.oldValue)}</pre>
                  ) : (
                    <span className="text-gray-500 italic">null (Không có payload trước)</span>
                  )}
                </div>
              </div>

              {/* New Value */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-500">Response</span>
                  {selectedLog.newValue != null && (
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedLog.newValue, false)}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[var(--text)]"
                    >
                      {copiedNew ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedNew ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  )}
                </div>
                <div className="flex-1 rounded-xl bg-gray-900 p-3 font-mono text-[11px] text-sky-400 overflow-auto max-h-[350px]">
                  {selectedLog.newValue != null ? (
                    <pre>{formatPayload(selectedLog.newValue)}</pre>
                  ) : (
                    <span className="text-gray-500 italic">null (Không có payload sau)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-between border-t p-3 text-xs"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <span>Thời gian ghi nhận: {formatDate(selectedLog.createdAt)}</span>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-[var(--primary)] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
