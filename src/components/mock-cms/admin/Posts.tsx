'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Posts() {
  return (
    <AdminWorkspace
      moduleKey="posts"
      title="Quản lý Bài viết"
      description="Quản lý vòng đời nội dung: bản nháp, chờ duyệt, xuất bản và gỡ bài."
      createLabel="Tạo bài viết"
      tone="blue"
      primaryStatuses={['PUBLISHED', 'PENDING', 'DRAFT']}
      searchPlaceholder="Tìm theo tiêu đề, slug, tác giả, loại bài..."
    />
  );
}
