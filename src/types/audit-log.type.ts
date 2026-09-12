export interface AuditLog {
  logId: number;
  userId: number | null;
  entityType: string;
  entityId: number | null;
  action: string;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
  statusCode: number;
}

export interface AuditLogHealthRatio {
  success2xx: number;
  clientError4xx: number;
  serverError5xx: number;
  other: number;
  errorRatePercent: number;
}

export interface AuditLogSummary {
  totalRecords: number;
  executionTimeMs: number;
  healthRatio: AuditLogHealthRatio;
}

export interface AuditLogPaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface AuditLogSearchResponse {
  summary: AuditLogSummary;
  meta: AuditLogPaginationMeta;
  items: AuditLog[];
}

export interface AuditLogFilterParams {
  preset?: string;
  from?: string;
  to?: string;
  fromDate?: string;
  toDate?: string;
  userId?: number;
  anonymousOnly?: boolean;
  entityType?: string;
  entityId?: number;
  action?: string;
  actions?: string | string[];
  statusCode?: number;
  minStatusCode?: number;
  statusGroup?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  size?: number;
}
