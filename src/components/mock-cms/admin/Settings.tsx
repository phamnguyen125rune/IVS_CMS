'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Settings() {
  return (
    <AdminWorkspace
      moduleKey="settings"
      title="Cài đặt hệ thống"
      description="Quản lý các thông tin hiển thị chung như tên website, email, hotline, footer và cấu hình vận hành."
      createLabel="Thêm cài đặt"
      tone="slate"
      primaryStatuses={['ACTIVE']}
      searchPlaceholder="Tìm theo tên cài đặt, nhóm cấu hình, giá trị..."
    />
  );
}
