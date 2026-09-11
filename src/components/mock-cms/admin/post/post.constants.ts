import type { PostStatus } from '@/types/post.type';

export const POST_PAGE_SIZE = 10;

export const POST_STATUS_OPTIONS: Array<{ value: PostStatus | ''; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Bị từ chối' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'UNPUBLISHED', label: 'Ngừng xuất bản' },
  { value: 'DELETED', label: 'Đã xóa' },
];

export const POST_STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-600' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
  PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-700' },
  UNPUBLISHED: { label: 'Ngừng xuất bản', className: 'bg-orange-100 text-orange-700' },
  DELETED: { label: 'Đã xóa', className: 'bg-slate-800 text-white' },
};
