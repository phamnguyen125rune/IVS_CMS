import { apiFetch } from '@/utils/api-client';
import type { AuditLogFilterParams, AuditLogSearchResponse } from '@/types/audit-log.type';

export const auditLogService = {
  getAuditLogs: (params: AuditLogFilterParams = {}): Promise<AuditLogSearchResponse> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query.append(key, value.join(','));
        } else {
          query.append(key, String(value));
        }
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/api/v1/audit-logs?${queryString}` : '/api/v1/audit-logs';
    return apiFetch<AuditLogSearchResponse>(endpoint);
  },

  exportAuditLogs: async (params: AuditLogFilterParams = {}, limit = 5000): Promise<void> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'page' &&
        key !== 'size'
      ) {
        if (Array.isArray(value)) {
          query.append(key, value.join(','));
        } else {
          query.append(key, String(value));
        }
      }
    });
    query.set('limit', String(limit));

    const endpoint = `/api/v1/audit-logs/export?${query.toString()}`;

    if (typeof window !== 'undefined') {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Không thể tải file xuất dữ liệu CSV');
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `audit_logs_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }
  },
};
