'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Roles() {
  return (
    <AdminWorkspace
      moduleKey="roles"
      title="Quản lý Phân quyền"
      description="Tạo nhóm quyền, cập nhật mô tả vai trò và quản lý trạng thái sử dụng trong hệ thống."
      createLabel="Thêm vai trò"
      tone="violet"
      primaryStatuses={['ACTIVE']}
      searchPlaceholder="Tìm theo tên vai trò, mô tả, người tạo..."
    />
  );
}
