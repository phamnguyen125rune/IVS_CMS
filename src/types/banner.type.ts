export interface StatsItem {
  num: string;
  label: string;
}

export interface Banner {
  bannerId: number;
  title: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  primaryBtnText?: string;
  primaryBtnUrl?: string;
  secondaryBtnText?: string;
  secondaryBtnUrl?: string;
  statsJson?: string;
  floatingBadgeText?: string;
  position: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ReqCreateBannerDTO {
  title: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  primaryBtnText?: string;
  primaryBtnUrl?: string;
  secondaryBtnText?: string;
  secondaryBtnUrl?: string;
  statsJson?: string;
  floatingBadgeText?: string;
  position?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ReqUpdateBannerDTO extends ReqCreateBannerDTO {
  bannerId: number;
}

export interface BannerPaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface BannerPaginationResult {
  meta: BannerPaginationMeta;
  result: Banner[];
}

export interface BannerApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
  error?: string;
}
