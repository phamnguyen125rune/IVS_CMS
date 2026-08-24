'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Media() {
  return (
    <AdminWorkspace
      moduleKey="media"
      title="Quản lý Media"
      description="Quản lý thư viện ảnh/tệp dùng cho bài viết, dự án và các trang nội dung."
      createLabel="Thêm media"
      tone="violet"
      primaryStatuses={['READY']}
      searchPlaceholder="Tìm theo tên file, loại file, người tải..."
    />
  );
}
