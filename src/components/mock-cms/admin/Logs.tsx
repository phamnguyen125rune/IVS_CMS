'use client';

import AdminWorkspace from './AdminWorkspace';

export default function Logs() {
  return (
    <AdminWorkspace
      moduleKey="logs"
      title="Nhật ký hệ thống"
      description="Theo dõi các thao tác quan trọng trong CMS để quản trị viên kiểm tra và truy vết."
      createLabel="Thêm nhật ký"
      tone="slate"
      primaryStatuses={['SUCCESS']}
      searchPlaceholder="Tìm theo hành động, module, người thực hiện..."
      readonly
    />
  );
}
