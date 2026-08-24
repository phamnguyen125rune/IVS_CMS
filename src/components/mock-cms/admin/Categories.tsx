'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Categories() {
  return (
    <AdminWorkspace
      moduleKey="categories"
      title="Quản lý Danh mục"
      description="Tạo, sửa, tìm kiếm và bật tắt các danh mục nội dung dùng trên website khách hàng."
      createLabel="Thêm danh mục"
      tone="cyan"
      primaryStatuses={['ACTIVE']}
    />
  );
}
